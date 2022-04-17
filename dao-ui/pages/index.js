import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import coverImage from "../public/cover.svg";
import Metamask from "../components/Metamask";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta property="og:title" content="Whitelist" key="title" />
      </Head>

      <header className="flex border-b justify-end bg-gray-500">
        <div className="flex text-xs flex-col mb-2 mt-2 space-y-1 text-white">
          <p className=" mr-16 text-xs font-normal">
            Hello, 0x024nj23beds233e3dsda
          </p>
          <div>
            <button className="text-sm font-bold underline underline-offset-2">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="min-h-[85vh] pl-24 pr-24 flex items-center justify-center">
        <div className="flex-1 space-y-3">
          <h2 className="font-mono  font-semibold text-5xl flex-grow">
            Welcome to Crypto Devs!
          </h2>
          <p className="descText">
            Welcome to the <b>DAO</b>!
          </p>
          <p className="descText">
            Your CryptoDevs NFT Balance:
            <span className="underline font-semibold">2 Tokens</span>
          </p>
          <p className="descText">
            Treasury Balance:
            <span className="underline font-semibold">4 ETH</span>
          </p>
          <p className="descText">
            Total Number of Proposals:{" "}
            <span className="underline font-semibold">1 ETH</span>
          </p>

          <button
            type="button"
            class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            Create Proposal
          </button>
          <button
            type="button"
            class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            View Proposals
          </button>

          <button
            type="button"
            class="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
          >
            <Metamask />
            Connect with MetaMask
          </button>
        </div>

        <Image src={coverImage} objectFit="cover" alt="Dev" />
      </main>

      <footer className="flex justify-center mt-6 text-gray-500">
        Made with &#10084; by Aayush
      </footer>
    </div>
  );
}
