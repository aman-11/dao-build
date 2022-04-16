// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NFTMarkrtPlace {
    //cost of nft in this amrket place
    uint256 public nftPrice = 0.1 ether;

    //keep a track for the nft and theri owner from this  market
    mapping(uint256 => address) public tokens;

    //TODO create market for  NFT to purchase whn majority hits the voting
    //TODO have purchase()
    function purchase(uint256 _tokenId) external payable {
        require(msg.value == nftPrice, "Send the proper amount");
        tokens[_tokenId] = msg.sender;
    }

    function getPrice() external view returns (uint256) {
        return nftPrice;
    }

    // available() checks whether the given tokenId has already been sold or not
    function available(uint256 _tokenId) external view returns (bool) {
        //address(0) is 0x0000....0000 means unintialized address
        if (tokens[_tokenId] == address(0)) {
            return true;
        }
        return false;
    }
}
