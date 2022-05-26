// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

abstract contract ERC721Extend is ERC721 {

    // Mapping from token ID to collection owner
    mapping(uint256 => address) private _collectionOwners;

    // Mapping from token ID to owner address to pay royalties
    mapping(uint256 => address) private _royalties;

    function _safeMint(
        address to,
        uint256 tokenId,
        bytes memory _data
    ) internal override virtual {
        _mint(to, tokenId);
        // require(
        //     _checkOnERC721Received(address(0), to, tokenId, _data),
        //     "ERC721: transfer to non ERC721Receiver implementer"
        // );
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        //solhint-disable-next-line max-line-length
        // require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");

        _transfer(from, to, tokenId);
    }

    function getRoyaltiesBeneficiary (uint256 _tokenId) external virtual view returns (address) {
        return _royalties[_tokenId];
    }

    function setRoyaltiesBeneficiary (uint256 _tokenId, address to) external virtual {
        require(_royalties[_tokenId] == address(0), 'Token already has a royalties owner');
        _royalties[_tokenId] = to;
    }

    function setCollectionOwner(uint256 _tokenId, address _collectionOwner) external virtual {
        require(_royalties[_tokenId] == address(0), 'Token already has a collection owner');
        _collectionOwners[_tokenId] = _collectionOwner;
    }

    function getCollectionOwner(uint256 _tokenId) external virtual view returns (address) {
        return _collectionOwners[_tokenId];
    }

}