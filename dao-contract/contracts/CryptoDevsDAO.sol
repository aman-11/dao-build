// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// have the interface for the markletPlace and the NFT contract deployed

//1. market place interface
interface INFTMarkrtPlace {
    function purchase(uint256 _tokenId) external payable;

    function getPrice() external view returns (uint256);

    function available(uint256 _tokenId) external view returns (bool);
}

//2. NFT contract to know which address making a vote is having nft or not
interface ICryptoDevNFT {
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
        6. oters - a mapping of (uselessNFT)tokenIDs => booleans 'indicating whether that NFT has already been used to cast a vote or not'
     */
    address payable public manager;

    struct Proposal {
        uint256 nftTokenId;
        uint256 deadline;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
        mapping(uint256 => bool) voters;
    }
    //mapping of the proposal ID to PRoposal
    mapping(uint256 => Proposal) public proposals;
    //[numProposals]|| [1] => ['tokenId', '5thjan',...];

    // enum to store yesVotes, noVotes
    enum Vote {
        YES,
        NO
    }

    //having the track of the proposal getting created
    uint256 public numProposals;

    //instance of the other contract need to be interacted during DAO
    INFTMarkrtPlace nftMarketPlace;
    ICryptoDevNFT uselessNft;

    //making payable in order to fill ETH in the DAO treasury
    constructor(address _nftMarketPlace, address _uselessNft) payable {
        manager = payable(msg.sender);
        nftMarketPlace = INFTMarkrtPlace(_nftMarketPlace);
        uselessNft = ICryptoDevNFT(_uselessNft);
    }

    //allow voting rights to nftholders only, check nft count of each voter
    modifier nftHolderOnly() {
        require(
            uselessNft.balanceOf(msg.sender) > 0,
            "Sorry, you cant be the part of decison making as you dont have any NFT"
        );
        _;
    }

    //check if the proposal is active or not
    modifier activeProposalOnly(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline > block.timestamp,
            "Proposal time ended"
        );
        _;
    }

    //modifier to be called by the function to check if the proposal has been executed or not and it should be ended by time
    modifier proposalEnded(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline <= block.timestamp,
            "Proposal ahs been ended"
        );
        require(
            !proposals[proposalIndex].executed,
            "Proposal already been executed"
        );
        _;
    }

    //create the modifier for teh owner check
    modifier ownerOnly() {
        require(manager == msg.sender, "only manager can access this function");
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

    //fucntion to voteOnProposal
    function voteOnProposal(uint256 proposalIndex, Vote vote)
        public
        nftHolderOnly
        activeProposalOnly(proposalIndex)
    {
        uint256 voterNftBalance = uselessNft.balanceOf(msg.sender);
        uint256 numVotes = 0;

        // Calculate how many NFTs are owned by the voter -> that haven't already been used for voting on this proposal
        for (uint256 i = 0; i < voterNftBalance; i++) {
            uint256 tokenId = uselessNft.tokenOfOwnerByIndex(msg.sender, i);
            if (proposals[proposalIndex].voters[tokenId] == false) {
                numVotes += 1;
                proposals[proposalIndex].voters[tokenId] = true;
            }
        }

        require(numVotes > 0, "Already used all NFT's for the voting");

        if (vote == Vote.YES) {
            proposals[proposalIndex].yesVotes += numVotes;
        } else {
            proposals[proposalIndex].noVotes += numVotes;
        }
    }

    // executeProposal allows any CryptoDevsNFT holder to execute a proposal after it's deadline has been exceeded
    function executeProposal(uint256 proposalIndex)
        public
        nftHolderOnly
        proposalEnded(proposalIndex)
        returns (bool success)
    {
        if (
            proposals[proposalIndex].yesVotes > proposals[proposalIndex].noVotes
        ) {
            uint256 nftPrice = nftMarketPlace.getPrice();
            require(
                address(this).balance >= nftPrice,
                "Not enough treasury funds"
            );
            nftMarketPlace.purchase{value: nftPrice}(
                proposals[proposalIndex].nftTokenId
            );

            return true;
        }
    }

    //create teh method to withdraw ethe
    function withdrawEther() public ownerOnly {
        manager.transfer(address(this).balance);
    }

    //allow anyone to transfer ether to contarct DAO treasury withough calling the pay function
    receive() external payable {}

    fallback() external payable {}
}
