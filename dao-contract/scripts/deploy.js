const { USELESS_NFT_CONTRACT_ADDRESS } = require("../constants/variable");

async function main() {
  const NFTMarketContract = await hre.ethers.getContractFactory(
    "NFTMarkrtPlace"
  );
  const NFTMarketContarctDeployed = await NFTMarketContract.deploy();

  await NFTMarketContarctDeployed.deployed();

  console.log("NFT Market deployed to:", NFTMarketContarctDeployed.address);

  //deploying the DAO
  const CryptoDevDAOContract = await hre.ethers.getContractFactory(
    "CryptoDevsDAO"
  );

  const CryptoDevDAOContractDeployed = await CryptoDevDAOContract.deploy(
    NFTMarketContarctDeployed.address,
    USELESS_NFT_CONTRACT_ADDRESS
  );
  await CryptoDevDAOContractDeployed.deployed();

  console.log("DAO deployed to:", CryptoDevDAOContractDeployed.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
