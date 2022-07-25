// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INFT {
    function mint(string memory _tokenURI, address _from, address _collectionOwner, uint _percentageEarnCollection) external returns (uint);
}