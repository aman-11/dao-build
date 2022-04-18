import { NFTContarctAddress, NFTabi } from "../constants/nftVariable";
import { ethers } from "ethers";

const NftContract = (providerOrSigner) => {
  return new ethers.Contract(NFTContarctAddress, NFTabi, providerOrSigner);
};

export default NftContract;
