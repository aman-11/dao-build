import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import DaoContract from "../helpers/DaoContract";
import GetProviderOrSigner from "../helpers/GetProviderOrSigner";
import moment from "moment";

function View({ numOfProposals }) {
  const { isAuthenticated } = useMoralis();
  const [proposals, setProposals] = useState([]);

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

        // console.log("transformedProposal", transformedProposal);
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
      const proposals = [];
      for (let i = 0; i < numOfProposals; i++) {
        const _proposal = await fetchProposalsById(i);
        proposals.push(_proposal);

        setProposals(proposals);
      }
    } catch (error) {
      console.error(error);
    }
  };
  console.log("transformedProposal", proposals);

  useEffect(() => {
    fetchAllProposals();
  }, [numOfProposals]);

  return (
    <div className="mt-4 border-t flex justify-between">
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

              {!executed && deadline.getTime() > Date.now() && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    class="focus:outline-none mt-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  >
                    Yesss
                  </button>
                  <button
                    type="button"
                    class="focus:outline-none mt-2 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  >
                    Nopee
                  </button>
                </div>
              )}

              {!executed && deadline.getTime() < Date.now() ? (
                <div className="flex justify-center">
                  {yesVotes > noVotes ? (
                    <button class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                      <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Execute Proposal
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={true}
                      class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
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
                    class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  >
                    Proposal Executed
                  </button>
                </div>
              )}
            </div>
          )
        )}
    </div>
  );
}

export default View;
