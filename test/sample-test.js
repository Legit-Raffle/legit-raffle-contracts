const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");
require('dotenv').config();

describe("RaffleFactory", function () {
  it("Deploy", async function () {
    const owner = await ethers.getSigners();
    let linkToken, vrfCoordinator, keyHash, feeUnparsed;
    linkToken = hre.ethers.constants.AddressZero;
    vrfCoordinator = hre.ethers.constants.AddressZero;
    keyHash = hre.ethers.constants.HashZero;
    feeUnparsed = "0";

    //deploy contract
    const RaffleFactory = await ethers.getContractFactory("RaffleFactory");
    const raffleFactory = await RaffleFactory.deploy(
      vrfCoordinator, 
      keyHash, 
      linkToken, 
      hre.ethers.utils.parseEther(feeUnparsed)
    );
    await raffleFactory.deployed();

    //Create Raffle
    console.log(raffleFactory.raffles());
  });
});
