// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import './ERC721URIStorageReplace.sol';
import '../interfaces/INFT.sol';

contract NFT is ERC721URIStorageReplace, INFT {
    uint public tokenCount;
    address contractOwner;

    constructor() ERC721("DApp NFT", "DAPP") {
        contractOwner = msg.sender;
    }

    function mint(string memory _tokenURI, address from, address minter) external override returns (uint) {
        require(minter == contractOwner, 'You are not the owner.');
        tokenCount ++;
        _safeMint(from, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return tokenCount;
    }
}

