import { useState } from "react";
import { useMoralis } from "react-moralis";
import DaoContract from "../helpers/DaoContract";
import GetProviderOrSigner from "../helpers/GetProviderOrSigner";
import ErrorMessage from "./ErrorMessage";

function Create({ getupdatedProposalCount, userNFTBalance }) {
  const { isAuthenticated } = useMoralis();
  const [fakeNftTokenId, setFakeNftTokenId] = useState("");

  const createProposal = async () => {
    try {
      if (isAuthenticated) {
        const signer = await GetProviderOrSigner(true);

        const daoContract = DaoContract(signer);
        const txn = daoContract.createProposal(fakeNftTokenId);
        await txn.wait();

        //call the totalnoof proposals
        await getupdatedProposalCount();
      } else {
        console.warn("Authentication is still in progess");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {userNFTBalance > 0 ? (
        <>
          <div className="w-1/2">
            <label
              for="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-500"
            >
              Fake NFT Token ID to Purchase:
            </label>
            <input
              type="number"
              placeholder="0"
              onChange={(e) => setFakeNftTokenId(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            onClick={createProposal}
            className="text-white self-end h-10 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create
          </button>
        </>
      ) : (
        <ErrorMessage message="You need atleast 1 NFT to create proposal" />
      )}
    </div>
  );
}

export default Create;
