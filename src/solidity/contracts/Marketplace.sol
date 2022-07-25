// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '../interfaces/IERC721Extend.sol';
import '../interfaces/INFT.sol';

contract Marketplace is ReentrancyGuard {

    address contractOwner;
    
    address payable public immutable feeMarketplaceAccount; // the account that receives fees
    uint public feeMarketplacePercent; // the fee percentage on sales
    uint public immutable feeCollectionPercent; // the fee collection percentage on sales
    uint public feeRoyaltiesPercent; // the fee royalties percentage on sales
    uint public itemCount;

    modifier onlyOwner() {
        require(msg.sender == contractOwner, 'You are not the owner');
        _;
    }

    struct Item {
        uint tokenId;
        IERC721Extend nft;
        uint price;
        uint latestPrice;
        address payable seller;
        bool onSale;
    }

    event Offered(
        uint tokenId,
        address indexed nft,
        uint price,
        address indexed seller
    );

    event Bought (
        uint indexed tokenId,
        address nft,
        uint price,
        uint totalPrice,
        address indexed seller,
        address indexed buyer
    );

    event ItemOnSale (
        uint itemId,
        uint tokenId,
        uint price,
        address indexed seller
    );

    mapping(uint => Item) public items;
    mapping(address => uint) private accountsBalance;

    constructor(uint _feeMarketplacePercent, uint _feeCollectionPercent, uint _feeRoyaltiesPercent) {
        contractOwner = msg.sender;

        feeMarketplaceAccount = payable(msg.sender);
        feeMarketplacePercent = _feeMarketplacePercent;
        feeCollectionPercent = _feeCollectionPercent;
        feeRoyaltiesPercent = _feeRoyaltiesPercent;
    }

    function mintCollection(string[] memory _tokenURIs, address payable _collectionOwner, uint _percentageEarnCollection, INFT _nft, IERC721Extend _erc721, uint[] memory _prices) external nonReentrant onlyOwner {
        require(_prices.length > 0, 'Prices needed');
        require(_tokenURIs.length > 0, 'Token URIs needed');
        require(_prices.length == _tokenURIs.length, 'prices and token URIs must be match');
        require(_percentageEarnCollection >= 0 && _percentageEarnCollection <= 100, 'Percentage Earn Collection must be 0 to 100');

        uint256 tokenCount = 0;
        for(uint i=0; i<_tokenURIs.length; i++){
            require(_prices[i] > 0, 'Prices must be greater than zero');
            require(bytes(_tokenURIs[i]).length > 0, 'Token URI must not be empty');
            tokenCount = _nft.mint(_tokenURIs[i], msg.sender, _collectionOwner, _percentageEarnCollection);

            itemCount ++;

            _erc721.transferFrom(msg.sender, address(this), tokenCount);
            
            items[itemCount] = Item(
                itemCount,
                _erc721,
                _prices[i],
                0,
                payable(address(this)),
                true
            );

            emit Offered(
                itemCount,
                address(_nft),
                _prices[i],
                contractOwner
            );
        }
    }

    function purchaseItem(uint _tokenId) external payable nonReentrant {
        require(_tokenId > 0 && _tokenId <= itemCount, "item doesn't exists");
        require(msg.value >= getTotalPrice(_tokenId), 'not enogh ether to cover item price and market fees');
        require(items[_tokenId].onSale, 'Token is not on sale');
        Item memory item = items[_tokenId];

        uint pricePurchased = getTotalPrice(_tokenId);

        accountsBalance[feeMarketplaceAccount] += getTotalFeeMarketplace(_tokenId);
        
        items[_tokenId].latestPrice = getTotalPrice(_tokenId);

        uint256 totalFeeCollection = getTotalFeeCollection(_tokenId);
        address collectionOwner =  items[_tokenId].nft.getCollectionOwner(item.tokenId);
        if (totalFeeCollection > 0 && collectionOwner != address(0)) {
            accountsBalance[collectionOwner] += getTotalFeeCollection(_tokenId);
        }
        
        address royaltyBeneficiary = item.nft.getRoyaltiesBeneficiary(item.tokenId);
        uint256 totalFeeRoyalties = getTotalFeeRoyalties(_tokenId);
        // if beneficiary is empty, set sender to royalties beneficiary
        if (royaltyBeneficiary == address(0)) {
            items[_tokenId].nft.setRoyaltiesBeneficiary(item.tokenId, msg.sender);
        } else if (totalFeeRoyalties > 0) {
            // pay royalties to royalty beneficiary
            accountsBalance[royaltyBeneficiary] += totalFeeRoyalties;
        }   

        items[_tokenId].seller = payable(msg.sender);
        items[_tokenId].onSale = false;

        uint marketplaceAmount = item.price;
        if (item.seller == address(this)) {
            uint collectionOwnerEarnPercentage = items[_tokenId].nft.getCollectionOwnersEarnPercentage(collectionOwner);
            if (collectionOwnerEarnPercentage > 0) {
                // pay to collection owner
                uint collectionOwnerAmount = (item.price * (100 + collectionOwnerEarnPercentage) / 100) - item.price;
                accountsBalance[collectionOwner] += collectionOwnerAmount;

                marketplaceAmount -= collectionOwnerAmount;
            }
        }
        // pay to seller
        accountsBalance[item.seller] += marketplaceAmount;

        // transfer nft to buyer
        item.nft.transferFrom(item.seller, msg.sender, item.tokenId);

        emit Bought (
            _tokenId,
            address(item.nft),
            item.price,
            pricePurchased,
            item.seller,
            msg.sender
        );
    }

    function claimEarns() public {
        uint256 amount = accountsBalance[msg.sender];
        require(amount > 0, 'You do not have founds');

        accountsBalance[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    function setItemOnSale(uint _tokenId, uint _price) external nonReentrant {
        require(items[_tokenId].seller == msg.sender, "you can't set on sale items of another owners");
        require(_price > 0, 'Price must be greater than zero');  
        items[_tokenId].price = _price;
        items[_tokenId].onSale = true;

        emit ItemOnSale (
            _tokenId,
            items[_tokenId].tokenId,
            items[_tokenId].price,
            msg.sender
        );
    }

    function getTotalPrice(uint _tokenId) public view returns (uint) {
        Item memory item = items[_tokenId];
        uint256 tokenId = items[_tokenId].tokenId;

        uint256 feeMarketPlace = (items[_tokenId].price * (100 + feeMarketplacePercent) / 100) - items[_tokenId].price;

        uint256 feeCollection = 0;
        address collectionOwner = item.nft.getCollectionOwner(tokenId);
        if (collectionOwner != address(0)) {
            feeCollection = (items[_tokenId].price * (100 + feeCollectionPercent) / 100) - items[_tokenId].price;
        }

        uint256 feeRoyalties = 0;
        address royaltiesBeneficiary = item.nft.getRoyaltiesBeneficiary(tokenId);
        if (royaltiesBeneficiary != address(0)) {
            feeRoyalties = (items[_tokenId].price * (100 + feeRoyaltiesPercent) / 100) - items[_tokenId].price;
        }

        return items[_tokenId].price + feeMarketPlace + feeCollection + feeRoyalties;
    }

    function getTotalFeeCollection(uint _tokenId) public view returns (uint) {
        Item memory item = items[_tokenId];
        uint256 tokenId = items[_tokenId].tokenId;

        uint256 feeCollection = 0;
        address collectionOwner = item.nft.getCollectionOwner(tokenId);
        if (collectionOwner != address(0)) {
            feeCollection = (items[_tokenId].price * (100 + feeCollectionPercent) / 100) - items[_tokenId].price;
        }

        return feeCollection;
    }

    function getTotalFeeRoyalties(uint _tokenId) public view returns (uint) {
        Item memory item = items[_tokenId];
        uint256 tokenId = items[_tokenId].tokenId;

        uint256 feeRoyalties = 0;
        address royaltiesBeneficiary = item.nft.getRoyaltiesBeneficiary(tokenId);
        if (royaltiesBeneficiary != address(0)) {
            feeRoyalties = (items[_tokenId].price * (100 + feeRoyaltiesPercent) / 100) - items[_tokenId].price;
        }

        return feeRoyalties;
    }

    function getTotalFeeMarketplace(uint _tokenId) public view returns (uint) {
        uint256 feeAccountAmount = 0;
        if (feeMarketplaceAccount != address(0)) {
            feeAccountAmount = (items[_tokenId].price * (100 + feeMarketplacePercent) / 100) - items[_tokenId].price;
        }

        return feeAccountAmount;
    }

    function getContractOwner() public view returns (address) {
        if (msg.sender == contractOwner) {
            return contractOwner;
        } else {
            return address(0);
        }
    }

    function getAccountsBalance(address _address) public view returns (uint) {
        return accountsBalance[_address];
    }

    function changeFeePercent(uint _feePercent) public onlyOwner {
        require(_feePercent > 0, 'Fee percent must be greater than 0');
        feeMarketplacePercent = _feePercent;
    }

    function changeFeeRoyaltiesPercent(uint _feeRoyaltiesPercent) public onlyOwner {
        require(_feeRoyaltiesPercent > 0, 'Fee Royaltie percent must be greater than 0');
        feeRoyaltiesPercent = _feeRoyaltiesPercent;
    }
}