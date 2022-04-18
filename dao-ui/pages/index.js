import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import coverImage from "../public/cover.svg";
import Metamask from "../components/Metamask";
import { useMoralis } from "react-moralis";
import ErrorMessage from "../components/ErrorMessage";
import { ethers, BigNumber } from "ethers";
import NftContract from "../helpers/NftContract";
import DaoContract from "../helpers/DaoContract";
import { DAO_CONTRACT_ADDRESS } from "../constants/daoVariable";

export default function Home() {
  const {
    authenticate,
    authError,
    isAuthenticated,
    user,
    logout,
    Moralis,
    enableWeb3,
    account,
  } = useMoralis();
  const [treasuryBalance, setTreasuryBalance] = useState("0");
  const [userNFTBalance, setUserNFtBalance] = useState(0);
  const [numOfProposals, setNumOfProposals] = useState(0);

  const getProviderAndSigner = async (needSigner = false) => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);

      if (needSigner) {
        const signer = provider.getSigner();
        return signer;
      }

      return provider;
    }
  };

  //TODO 1. get the treasury balance
  const getTreasuryBalance = async () => {
    try {
      if (isAuthenticated) {
        const provider = await getProviderAndSigner();

        const _treasuryBalance = await provider.getBalance(
          DAO_CONTRACT_ADDRESS
        );

        setTreasuryBalance(_treasuryBalance.toString());
      } else {
        console.warn("Authentication still in progress");
      }
    } catch (error) {
      console.error(error);
    }
  };

  //TODO 2. get the nft balance of the user logged in
  const getNFTBalance = async () => {
    try {
      if (isAuthenticated) {
        const signer = await getProviderAndSigner(true);

        const nftContract = NftContract(signer);
        const address = await signer.getAddress();
        const _numOfNFT = await nftContract.balanceOf(address);
        setUserNFtBalance(parseInt(_numOfNFT.toString()));
      } else {
        console.warn("Authentication is still in progress");
      }
    } catch (error) {
      console.error(error);
    }
  };

  //TODO 3. get the total no of prposals
  const getTotalNumOFProposals = async () => {
    try {
      if (isAuthenticated) {
        const provider = await getProviderAndSigner();

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

  const onPageLoadAction = async () => {
    await getTreasuryBalance();
    await getNFTBalance();
    await getTotalNumOFProposals();
  };

  useEffect(() => {
    onPageLoadAction();
    enableWeb3();

    Moralis.onAccountChanged(function (account) {
      logout();
      authenticate();
      onPageLoadAction();
    });
  }, [isAuthenticated]);

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta property="og:title" content="Whitelist" key="title" />
      </Head>

      {isAuthenticated && (
        <header className="flex border-b justify-end bg-gray-900">
          <div className="flex text-xs flex-col mt-2 mb-2 space-y-2 text-white">
            {account && (
              <p className="mr-16 text-xs font-normal">
                Hello, {account.slice(0, 4)}...
                {account.slice(account.length - 4)}
              </p>
            )}
            <div>
              <button
                onClick={logout}
                className="text-sm font-bold underline underline-offset-2"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
      )}

      <main className="min-h-[85vh] pl-24 pr-24 flex items-center justify-center">
        <div className="flex-1 space-y-3">
          <h2 className="font-mono  font-semibold text-5xl flex-grow">
            Welcome to Crypto Devs!
          </h2>
          <p className="descText">
            Welcome to the <b>DAO</b>!
          </p>
          <p className="descText">
            Treasury Balance:
            <span className="underline font-semibold">
              {ethers.utils.formatEther(treasuryBalance)} ETH
            </span>
          </p>
          <p className="descText">
            Your CryptoDevs NFT Balance:
            <span className="underline font-semibold">
              {userNFTBalance} NFT's
            </span>
          </p>
          <p className="descText">
            Total Number of Proposals:
            <span className="underline font-semibold">
              {numOfProposals} ETH
            </span>
          </p>
          {isAuthenticated ? (
            <div>
              <button
                type="button"
                className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                Create Proposal
              </button>
              <button
                type="button"
                className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                View Proposals
              </button>
              <br />
              <p
                onClick={authenticate}
                className="font-base mt-1 underline underline-offset-1 text-sm cursor-pointer hover:text-gray-700"
              >
                Connect with different account?
              </p>
            </div>
          ) : (
            <button
              onClick={authenticate}
              type="button"
              className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
            >
              <Metamask />
              Connect with MetaMask
            </button>
          )}

          {authError && <ErrorMessage message={authError.message} />}
        </div>

        <Image src={coverImage} objectFit="cover" alt="Dev" />
      </main>

      <footer className="flex justify-center mt-6 text-gray-500">
        Made with &#10084; by Aayush
      </footer>
    </div>
  );
}
