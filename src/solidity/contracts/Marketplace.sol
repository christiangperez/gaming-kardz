// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '../interfaces/IERC721Extend.sol';
import '../interfaces/INFT.sol';

contract Marketplace is ReentrancyGuard {

    address contractOwner;
    
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent; // the fee percentage on sales
    uint public immutable feeCollectionPercent; // the fee collection percentage on sales
    uint public immutable feeRoyaltiesPercent; // the fee royalties percentage on sales
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

    constructor(uint _feePercent, uint _feeCollectionPercent, uint _feeRoyaltiesPercent) {
        contractOwner = msg.sender;

        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
        feeCollectionPercent = _feeCollectionPercent;
        feeRoyaltiesPercent = _feeRoyaltiesPercent;
    }

    function mintAndMakeCollection(string[] memory _tokenURIs, address payable _collectionOwner, INFT _nft, IERC721Extend _erc721, uint[] memory _prices) external nonReentrant onlyOwner {
        for(uint i=0; i<_prices.length; i++){
            require(_prices[i] > 0, 'Price must be greater than zero');    
        }
        require(_prices.length > 0, 'Prices needed');

        uint256 tokenCount = 0;
        for(uint i=0; i<_tokenURIs.length; i++){
            tokenCount = _nft.mint(_tokenURIs[i], address(this), contractOwner);
        }

        if (_collectionOwner != address(0)) {
            for(uint i=0; i<_tokenURIs.length; i++){
                _erc721.setCollectionOwner(tokenCount - _tokenURIs.length + i + 1, _collectionOwner);
            }
        }

        for(uint i=0; i<_prices.length; i++){
            itemCount ++;
            
            _erc721.transferFrom(address(this), msg.sender, tokenCount - _prices.length + i + 1);

            items[itemCount] = Item(
                itemCount,
                _erc721,
                _prices[i],
                0,
                payable(msg.sender),
                true
            );

            emit Offered(
                itemCount,
                address(_nft),
                _prices[i],
                msg.sender
            );
        }
    }

    function purchaseItem(uint _tokenId) external payable nonReentrant {
        require(_tokenId > 0 && _tokenId <= itemCount, "item doesn't exists");
        uint _totalPrice = getTotalPrice(_tokenId);
        Item storage item = items[_tokenId];
        require(msg.value >= _totalPrice, 'not enogh ether to cover item price and market fees');
        // pay seller and feeAccount
        item.seller.transfer(item.price);

        feeAccount.transfer(getTotalFeeAccount(_tokenId));
        
        items[_tokenId].latestPrice = getTotalPrice(_tokenId);

        uint256 totalFeeCollection = getTotalFeeCollection(_tokenId);
        address collectionOwner =  items[_tokenId].nft.getCollectionOwner(item.tokenId);
        if (totalFeeCollection > 0 && collectionOwner != address(0)) {
            payable(collectionOwner).transfer(getTotalFeeCollection(_tokenId));
        }
        

        address royaltyBeneficiary = item.nft.getRoyaltiesBeneficiary(item.tokenId);
        uint256 totalFeeRoyalties = getTotalFeeRoyalties(_tokenId);
        // if beneficiary is empty, set sender to royalties beneficiary
        if (royaltyBeneficiary == address(0)) {
            items[_tokenId].nft.setRoyaltiesBeneficiary(item.tokenId, msg.sender);
        } else if (totalFeeRoyalties > 0) {
            // pay royalties to royalty beneficiary
            payable(royaltyBeneficiary).transfer(totalFeeRoyalties);
        }

        // transfer nft to buyer
        item.nft.transferFrom(item.seller, msg.sender, item.tokenId);


        emit Bought (
            _tokenId,
            address(item.nft),
            item.price,
            getTotalPrice(_tokenId),
            item.seller,
            msg.sender
        );

        items[_tokenId].seller = payable(msg.sender);
        items[_tokenId].onSale = false;

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

        uint256 feeMarketPlace = (items[_tokenId].price * (100 + feePercent) / 100) - items[_tokenId].price;

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

    function getTotalFeeAccount(uint _tokenId) public view returns (uint) {
        uint256 feeAccountAmount = 0;
        if (feeAccount != address(0)) {
            feeAccountAmount = (items[_tokenId].price * (100 + feePercent) / 100) - items[_tokenId].price;
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
}