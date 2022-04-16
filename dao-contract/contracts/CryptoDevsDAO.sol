// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// have the interface for the markletPlace and the NFT contract deployed

//1. market place interface
interface NFTMarkrtPlace {
    function purchase(uint256 _tokenId) external payable;

    function getPrice() external view returns (uint256);

    function available(uint256 _tokenId) external view returns (bool);
}

//2. NFT contract to know which address making a vote is having nft or not
interface CryptoDevNFT {
    //ERC20 internal function

    //know the nft holded by any address
    function balanceOf(address owner) external view returns (uint256);

    //get the tokenId in order to operate in NFT market
    function tokenOfOwnerByIndex(address owner, uint256 index)
        external
        view
        returns (uint256);
}

contract CryptoDevsDAO {
    //FEATURES
    /**
     * 1. Create proposal and store in state of contarct
     * 2. Allow user to vote with certain conditions
     * 3. after deadline allow automatic purchase of NFT
     */

    /**
    struct Proposal will have
        1. tokenID of that nFT that will be automatically purchased after the deadline of proposal + if proposal gets majority votes
        2. deadline time
        3. yesVotes : no of yes votes
        4. noVotes : no of no votes
        5. identifying the peoposal getting exec or not after deadline 
        6. mapping of the voters
     */
    struct Proposal {
        uint256 nftTokenId;
        uint256 deadline;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
        mapping(address => bool) voters;
    }
    //mapping of the proposal ID to PRoposal
    mapping(uint256 => Proposal) public proposals;
    //[numProposals]|| [1] => ['tokenId', '5thjan',...];

    //having the track of the proposal getting created
    uint256 public numProposals;

    //instance of the other contract need to be interacted during DAO
    NFTMarkrtPlace nftMarketPlace;
    CryptoDevNFT uselessNft;

    //making payable in order to fill ETH in the DAO treasury
    constructor(address _nftMarketPlace, address _uselessNft) payable {
        nftMarketPlace = NFTMarkrtPlace(_nftMarketPlace);
        uselessNft = CryptoDevNFT(_uselessNft);
    }

    modifier nftHolderOnly() {
        require(
            uselessNft.balanceOf(msg.sender) > 0,
            "Sorry, you cant be the part of decison making as you dont have any NFT"
        );
        _;
    }

    //function to create proposals
    //it will accept  @params tokenId for the proposal which will be automatically purchased after some conditions are satisfied.
    // Returns the proposal index for the newly created proposal
    function createProposal(uint256 tokenId)
        public
        nftHolderOnly
        returns (uint256)
    {
        //check if nft tokenId passed is availabe or not
        require(
            nftMarketPlace.available(tokenId),
            "NFT is not available in market"
        );

        // Proposal storage proposal = proposals[numProposals];
        proposals[numProposals].nftTokenId = tokenId;
        proposals[numProposals].deadline = block.timestamp + 5 minutes;

        numProposals++;
        return numProposals - 1;
    }
}
