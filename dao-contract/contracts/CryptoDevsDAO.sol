// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// have the interface for the markletPlace and the NFT contract deployed

//1. market place interface
interface NFTMarkrtPlace {
    function purchase(uint256 _tokenId) external payable;

    function getPrice() external view returns (uint256);

    function available(uint256 _tokenId) external view returns (bool);
}

contract CryptoDevsDAO {
    // We will write contract code here
}
