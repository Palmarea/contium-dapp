import hre from "hardhat";
import fs from "node:fs";

const EXPLORER = "https://explorer-pob.dev11.top";

function explorerTx(hash) {
  return `${EXPLORER}/tx/${hash}`;
}
function explorerAddr(addr) {
  return `${EXPLORER}/address/${addr}`;
}

async function main() {
  if (!hre.ethers) {
    throw new Error(
      "Hardhat ethers plugin no está cargado. Revisa hardhat.config.js y que @nomicfoundation/hardhat-ethers esté instalado en contium-dapp/contracts."
    );
  }

  const ethers = hre.ethers;

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const net = await ethers.provider.getNetwork();
  console.log("ChainId:", net.chainId.toString());

  const DocumentRegistry = await ethers.getContractFactory("DocumentRegistry");
  const registry = await DocumentRegistry.deploy();
  await registry.waitForDeployment();

  const registryAddress = await registry.getAddress();
  const regTx = registry.deploymentTransaction();

  console.log("✅ DocumentRegistry:", registryAddress);
  if (regTx) console.log("TX:", regTx.hash, explorerTx(regTx.hash));
  console.log("Explorer:", explorerAddr(registryAddress));

  const ContiumBadge = await ethers.getContractFactory("ContiumBadge");
  const badge = await ContiumBadge.deploy(registryAddress);
  await badge.waitForDeployment();

  const badgeAddress = await badge.getAddress();
  const badgeTx = badge.deploymentTransaction();

  console.log("✅ ContiumBadge:", badgeAddress);
  if (badgeTx) console.log("TX:", badgeTx.hash, explorerTx(badgeTx.hash));
  console.log("Explorer:", explorerAddr(badgeAddress));

  const out = {
    network: "zksys",
    chainId: Number(net.chainId),
    rpc: process.env.ZKSYS_RPC_URL || "https://rpc-pob.dev11.top",
    explorerBase: EXPLORER,
    token: "TSYS",
    deployer: deployer.address,
    DocumentRegistry: registryAddress,
    ContiumBadge: badgeAddress,
  };

  fs.writeFileSync("deployments.json", JSON.stringify(out, null, 2), "utf-8");
  console.log("✅ deployments.json actualizado en:", process.cwd());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
