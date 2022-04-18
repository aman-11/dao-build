import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import DaoContract from "../helpers/DaoContract";
import GetProviderOrSigner from "../helpers/GetProviderOrSigner";

function View() {
  const { isAuthenticated } = useMoralis();
  const [proposals, setProposals] = useState([]);
  const [numOfProposals, setNumOfProposals] = useState(0);

  const getTotalNumOFProposals = async () => {
    try {
      if (isAuthenticated) {
        const provider = await GetProviderOrSigner();

        const daoContract = DaoContract(provider);
        const _numOfProposals = await daoContract.numProposals();
        setNumOfProposals(parseInt(_numOfProposals.toString()));
      } else {
        console.warn("Authentication is still in progress");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const voteOnProposal = async (proposalId, _vote) => {
    try {
      if (isAuthenticated) {
        const signer = await GetProviderOrSigner(true);
        let vote = _vote === "YES" ? 0 : 1;

        const daoContract = DaoContract(signer);
        const txn = daoContract.voteOnProposal(proposalId, vote);
        await txn.wait();
        await fetchAllProposals();
      } else {
        console.warn("Authenticatin is still in progress");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProposalsById = async (index) => {
    try {
      if (isAuthenticated) {
        const provider = await GetProviderOrSigner();
        const daoContract = DaoContract(provider);

        const eachProposal = await daoContract.proposals(index);
        const transformedProposal = {
          proposalId: index,
          nftTokenId: eachProposal.nftTokenId.toString(),
          deadline: new Date(parseInt(eachProposal.deadline.toString()) * 1000),
          yesVotes: eachProposal.yesVotes.toString(),
          noVotes: eachProposal.noVotes.toString(),
          executed: eachProposal.executed,
        };

        return transformedProposal;
      } else {
        console.warn("Authenticating still in progress");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllProposals = async () => {
    try {
      const newProposals = [];
      for (let i = 0; i < numOfProposals; i++) {
        const _proposal = await fetchProposalsById(i);
        newProposals.push(_proposal);
      }
      setProposals([...newProposals]);
    } catch (error) {
      console.error(error);
    }
  };
  //   console.log("transformedProposal", proposals);

  const executeProposal = async (proposalIndex) => {
    try {
      if (isAuthenticated) {
        const signer = await GetProviderOrSigner(true);
        const daoContract = DaoContract(signer);

        const txn = await daoContract.executeProposal(proposalIndex);
        await txn.wait();
        await fetchAllProposals();
      } else {
        console.warn("Authenticating still in progress");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllProposals();
    getTotalNumOFProposals();
  }, [numOfProposals]);

  return (
    <div className="mt-4 border-t flex justify-around flex-wrap">
      {proposals &&
        proposals.map(
          ({
            proposalId,
            nftTokenId,
            deadline,
            yesVotes,
            noVotes,
            executed,
          }) => (
            <div
              key={proposalId}
              className="mt-4 border bg-gray-200 p-4 space-y-2"
            >
              <p>
                Fake NFT to Purchase: <b> {nftTokenId}</b>
              </p>
              <p>
                Deadline: <b> {deadline.toLocaleString()}</b>
              </p>
              <p>
                Yay Votes:<b> {yesVotes}</b>
              </p>
              <p>
                Nay Votes: <b> {noVotes}</b>
              </p>
              <p>
                Executed?:<b> {executed.toString()}</b>
              </p>

              {!executed && deadline.getTime() > Date.now() ? (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => voteOnProposal(proposalId, "YES")}
                    className="focus:outline-none mt-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  >
                    Yesss
                  </button>
                  <button
                    type="button"
                    onClick={() => voteOnProposal(proposalId, "NO")}
                    className="focus:outline-none mt-2 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  >
                    Nopee
                  </button>
                </div>
              ) : (
                <>
                  {!executed && deadline.getTime() < Date.now() ? (
                    <div className="flex justify-center">
                      {yesVotes > noVotes ? (
                        <button
                          type="button"
                          onClick={() => executeProposal(proposalId)}
                          class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                        >
                          Execute Proposal
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={true}
                          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                        >
                          Need atleast one yes vote to excecute but deadline
                          crossed.
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <button
                        type="button"
                        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                      >
                        Proposal Executed
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )
        )}
    </div>
  );
}

export default View;
