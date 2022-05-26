// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IERC721Extend is IERC721 {
    function getRoyaltiesBeneficiary (uint256 _tokenId) external view returns (address);

    function setRoyaltiesBeneficiary (uint256 _tokenId, address to) external;

    function setCollectionOwner(uint256 _tokenId, address _collectionOwner) external;

    function getCollectionOwner(uint256 _tokenId) external view returns (address);
}