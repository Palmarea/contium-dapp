import { network } from "hardhat";
import fs from "node:fs";

const EXPLORER = "https://explorer-pob.dev11.top";

async function main() {
  const { ethers } = await network.connect();

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const net = await ethers.provider.getNetwork();
  console.log("ChainId:", net.chainId.toString());

  // 1) Deploy DocumentRegistry
  const registry = await ethers.deployContract("DocumentRegistry");
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("✅ DocumentRegistry:", registryAddress);
  console.log("Explorer:", `${EXPLORER}/address/${registryAddress}`);

  // 2) Deploy ContiumBadge
  const badge = await ethers.deployContract("ContiumBadge", [registryAddress]);
  await badge.waitForDeployment();
  const badgeAddress = await badge.getAddress();
  console.log("✅ ContiumBadge:", badgeAddress);
  console.log("Explorer:", `${EXPLORER}/address/${badgeAddress}`);

  // 3) Guardar deployments.json
  const out = {
    network: "zksys",
    chainId: Number(net.chainId),
    rpc: "https://rpc-pob.dev11.top",
    explorerBase: EXPLORER,
    token: "TSYS",
    deployer: deployer.address,
    DocumentRegistry: registryAddress,
    ContiumBadge: badgeAddress,
  };

  fs.writeFileSync("deployments.json", JSON.stringify(out, null, 2), "utf-8");
  console.log("✅ deployments.json actualizado");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});