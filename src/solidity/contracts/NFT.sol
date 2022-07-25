// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import '../interfaces/INFT.sol';

contract NFT is ERC721URIStorage {
    using Strings for uint256;
    uint public tokenCount;
    address contractOwner;

    // Token ID to collection owner
    mapping(uint256 => address) private _collectionOwners;

    // Collection Owner to Earn Percentage for sales
    mapping(address => uint) private _collectionOwnersEarnPercentage;

    // Token ID to owner address to pay royalties
    mapping(uint256 => address) private _royalties;

    // Token URIs
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("Gaming Kardz NFT", "GKRDZ") {
        contractOwner = msg.sender;
    }

    function mint(string memory _tokenURI, address _from, address _collectionOwner, uint _percentageEarnCollection) external returns (uint) {
        require(_from == contractOwner, 'You are not the owner.');
        tokenCount ++;
        _safeMint(_from, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        if (_collectionOwner != address(0)) {
            setCollectionOwner(tokenCount, _collectionOwner);
            if (_percentageEarnCollection > 0) {
                _collectionOwnersEarnPercentage[_collectionOwner] = _percentageEarnCollection;
            }
        }
        return tokenCount;
    }

    function getRoyaltiesBeneficiary (uint256 _tokenId) external virtual view returns (address) {
        return _royalties[_tokenId];
    }

    function setRoyaltiesBeneficiary (uint256 _tokenId, address to) external virtual {
        require(_royalties[_tokenId] == address(0), 'Token already has a royalties owner');
        _royalties[_tokenId] = to;
    }

    function setCollectionOwner(uint256 _tokenId, address _collectionOwner) internal virtual {
        require(_royalties[_tokenId] == address(0), 'Token already has a collection owner');
        _collectionOwners[_tokenId] = _collectionOwner;
    }

    function getCollectionOwner(uint256 _tokenId) external virtual view returns (address) {
        return _collectionOwners[_tokenId];
    }

    function getCollectionOwnersEarnPercentage(address _owner) external virtual view returns (uint) {
        return _collectionOwnersEarnPercentage[_owner];
    }
}