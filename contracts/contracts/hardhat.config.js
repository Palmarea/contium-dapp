import "dotenv/config";
import "@nomicfoundation/hardhat-ethers";
import { defineConfig } from "hardhat/config";

function normalizePk(pk) {
  if (!pk) return "";
  return pk.startsWith("0x") ? pk : `0x${pk}`;
}

export default defineConfig({
  solidity: "0.8.28", // ✅ debe coincidir con el pragma de tus .sol
  networks: {
    zksys: {
      type: "http",
      url: process.env.ZKSYS_RPC_URL || "https://rpc-pob.dev11.top",
      chainId: 57042,
      accounts: [normalizePk(process.env.PRIVATE_KEY)],
    },
  },
});
