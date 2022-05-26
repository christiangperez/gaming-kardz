// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import './ERC721URIStorageReplace.sol';
import '../interfaces/INFT.sol';

contract NFT is ERC721URIStorageReplace, INFT {
    uint public tokenCount;

    constructor() ERC721("DApp NFT", "DAPP") {}

    function mint(string memory _tokenURI, address from) external override returns (uint) {
        tokenCount ++;
        _safeMint(from, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return tokenCount;
    }
}

