// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, network, run } from "hardhat";
import * as CHAINLINK_ADDRS from '../utils/chainlink-constants.json'

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  
  console.log("Deploying on network ", network.name)
  

  // Chainlink BS
  let linkToken, vrfCoordinator, keyHash, feeUnparsed;
  if (network.name !== "hardhat") {
    // not hardhat, get actual chainlink addrs
    const chainlinkInfo = network.name === "mainnet" ? CHAINLINK_ADDRS[1] : CHAINLINK_ADDRS[4]
    linkToken = chainlinkInfo.LinkToken;
    vrfCoordinator = chainlinkInfo.VRFCoordinator;
    keyHash = chainlinkInfo.KeyHash;
    feeUnparsed = chainlinkInfo.FeeUnparsed;
  } else {
    linkToken = ethers.constants.AddressZero;
    vrfCoordinator = ethers.constants.AddressZero;
    keyHash = ethers.constants.HashZero;
    feeUnparsed = ethers.constants.Zero;
  }
  console.log("Deploying with args: ", linkToken, vrfCoordinator, keyHash, feeUnparsed)
  //console.log('for this network', CHAINLINK_ADDRS[network.config.chainId!.toString()])
  // We get the contract to deploy
  const RaffleFactory = await ethers.getContractFactory("RaffleFactory");
  const raffleFactory = await RaffleFactory.deploy(
    vrfCoordinator, 
    keyHash, 
    linkToken, 
    ethers.utils.parseEther(feeUnparsed as string)
  );

  console.log("RaffleFactory deployed to address: ", raffleFactory.address);
  await raffleFactory.deployed();
  console.log("Deployed.");
  const logicAddr = await raffleFactory.raffleLogic();
  console.log("RaffleLogic deployed to address: ", logicAddr);

  if (network.name !== "hardhat") {
    await new Promise(r => setTimeout(r, 120000)); // sleep 2min bc etherscan sux
    await run("verify:verify", {
      address: raffleFactory.address,
      constructorArguments: [
        vrfCoordinator,
        keyHash,
        linkToken,
        ethers.utils.parseEther(feeUnparsed as string)
      ]
    });
    await run("verify:verify", {
      address: logicAddr,
      constructorArguments: [
        vrfCoordinator,
        keyHash,
        linkToken,
        ethers.utils.parseEther(feeUnparsed as string)
      ]
    })
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
