import { ethers } from "ethers";

const GetProviderOrSigner = async (needSigner = false) => {
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

export default GetProviderOrSigner;
