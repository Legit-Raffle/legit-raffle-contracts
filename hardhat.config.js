require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan")
// require("hardhat-gas-reporter")

// import "@typechain/hardhat";
// import "hardhat-gas-reporter";
// import "solidity-coverage";


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat:{
      chainId: 1337
    },
    rinkeby: {
      url: process.env.NODE_API_URL || "",
      accounts:
        process.env.RINKEBY_PRIVATE_KEY !== undefined ? [process.env.RINKEBY_PRIVATE_KEY] : [],
    },
  },
  // gasReporter: {
  //   enabled: process.env.REPORT_GAS !== undefined,
  //   currency: "USD",
  // },
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY,
  // }
};