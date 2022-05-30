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
        uint itemId;
        IERC721Extend nft;
        uint tokenId;
        uint price;
        uint latestPrice;
        address payable seller;
        bool onSale;
    }

    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );

    event Bought (
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
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
                tokenCount - _prices.length + i + 1,
                _prices[i],
                0,
                payable(msg.sender),
                true
            );

            emit Offered(
                itemCount,
                address(_nft),
                tokenCount - _prices.length + i + 1,
                _prices[i],
                msg.sender
            );
        }
    }

    function purchaseItem(uint _itemId) external payable nonReentrant {
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exists");
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(msg.value >= _totalPrice, 'not enogh ether to cover item price and market fees');
        // pay seller and feeAccount
        item.seller.transfer(item.price);

        feeAccount.transfer(getTotalFeeAccount(_itemId));
        
        items[_itemId].latestPrice = getTotalPrice(_itemId);

        uint256 totalFeeCollection = getTotalFeeCollection(_itemId);
        address collectionOwner =  items[_itemId].nft.getCollectionOwner(item.tokenId);
        if (totalFeeCollection > 0 && collectionOwner != address(0)) {
            payable(collectionOwner).transfer(getTotalFeeCollection(_itemId));
        }
        

        address royaltyBeneficiary = item.nft.getRoyaltiesBeneficiary(item.tokenId);
        uint256 totalFeeRoyalties = getTotalFeeRoyalties(_itemId);
        // if beneficiary is empty, set sender to royalties beneficiary
        if (royaltyBeneficiary == address(0)) {
            items[_itemId].nft.setRoyaltiesBeneficiary(item.tokenId, msg.sender);
        } else if (totalFeeRoyalties > 0) {
            // pay royalties to royalty beneficiary
            payable(royaltyBeneficiary).transfer(totalFeeRoyalties);
        }

        // transfer nft to buyer
        item.nft.transferFrom(item.seller, msg.sender, item.tokenId);


        emit Bought (
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );

        items[_itemId].seller = payable(msg.sender);
        items[_itemId].onSale = false;

    }

    function setItemOnSale(uint _itemId, uint _price) external nonReentrant {
        require(items[_itemId].seller == msg.sender, "you can't set on sale items of another owners");
        require(_price > 0, 'Price must be greater than zero');  
        items[_itemId].price = _price;
        items[_itemId].onSale = true;

        emit ItemOnSale (
            _itemId,
            items[_itemId].tokenId,
            items[_itemId].price,
            msg.sender
        );
    }

    function getTotalPrice(uint _itemId) public view returns (uint) {
        Item memory item = items[_itemId];
        uint256 tokenId = items[_itemId].tokenId;

        uint256 feeMarketPlace = (items[_itemId].price * (100 + feePercent) / 100) - items[_itemId].price;

        uint256 feeCollection = 0;
        address collectionOwner = item.nft.getCollectionOwner(tokenId);
        if (collectionOwner != address(0)) {
            feeCollection = (items[_itemId].price * (100 + feeCollectionPercent) / 100) - items[_itemId].price;
        }

        uint256 feeRoyalties = 0;
        address royaltiesBeneficiary = item.nft.getRoyaltiesBeneficiary(tokenId);
        if (royaltiesBeneficiary != address(0)) {
            feeRoyalties = (items[_itemId].price * (100 + feeRoyaltiesPercent) / 100) - items[_itemId].price;
        }

        return items[_itemId].price + feeMarketPlace + feeCollection + feeRoyalties;
    }

    function getTotalFeeCollection(uint _itemId) public view returns (uint) {
        Item memory item = items[_itemId];
        uint256 tokenId = items[_itemId].tokenId;

        uint256 feeCollection = 0;
        address collectionOwner = item.nft.getCollectionOwner(tokenId);
        if (collectionOwner != address(0)) {
            feeCollection = (items[_itemId].price * (100 + feeCollectionPercent) / 100) - items[_itemId].price;
        }

        return feeCollection;
    }

    function getTotalFeeRoyalties(uint _itemId) public view returns (uint) {
        Item memory item = items[_itemId];
        uint256 tokenId = items[_itemId].tokenId;

        uint256 feeRoyalties = 0;
        address royaltiesBeneficiary = item.nft.getRoyaltiesBeneficiary(tokenId);
        if (royaltiesBeneficiary != address(0)) {
            feeRoyalties = (items[_itemId].price * (100 + feeRoyaltiesPercent) / 100) - items[_itemId].price;
        }

        return feeRoyalties;
    }

    function getTotalFeeAccount(uint _itemId) public view returns (uint) {
        uint256 feeAccountAmount = 0;
        if (feeAccount != address(0)) {
            feeAccountAmount = (items[_itemId].price * (100 + feePercent) / 100) - items[_itemId].price;
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