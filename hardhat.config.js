require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks:{
    arbSepolia: {
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: [""]
    }
  }
};
