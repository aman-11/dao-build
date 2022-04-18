import { DAO_CONTRACT_ADDRESS, DAOabi } from "../constants/daoVariable";
import { ethers } from "ethers";

const DaoContract = (providerOrSigner) => {
  return new ethers.Contract(DAO_CONTRACT_ADDRESS, DAOabi, providerOrSigner);
};

export default DaoContract;
