require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

/** @type {import("hardhat/config").HardhatUserConfig} */
module.exports = {
  solidity: "0.8.28",
  networks: {
    zksys: {
      type: "http",
      url: "https://rpc-pob.dev11.top",
      chainId: 57042,
      // acepta PRIVATE_KEY con o sin 0x
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY.startsWith("0x") ? process.env.PRIVATE_KEY : "0x" + process.env.PRIVATE_KEY]
        : [],
    },
  },
};
