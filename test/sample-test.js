const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");
require('dotenv').config();

describe("RaffleFactory", function () {

  it("Should return all raffles associated with address", async function () {
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

    await raffleFactory.createRaffle(0xE0E4986D4547D3c99363e2F21623831036B5202d, 7, "boa7");
    await raffleFactory.createRaffle(0xE0E4986D4547D3c99363e2F21623831036B5202d, 5, "boa5");

    await raffleFactory.setRaffle();

    await raffleFactory.myRaffles();
    console.log(raffleFactory.myRaffles());
   
  });
});
