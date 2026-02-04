const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Este debe existir si el plugin está cargado correctamente
  if (!hre.ethers) {
    throw new Error(
      "hre.ethers es undefined. Verifica que instalaste @nomicfoundation/hardhat-ethers en /contracts y que hardhat.config.js lo requiere."
    );
  }

  const { ethers } = hre;

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const net = await ethers.provider.getNetwork();
  console.log("Network chainId:", net.chainId.toString());

  // 1) Deploy DocumentRegistry
  const DocumentRegistry = await ethers.getContractFactory("DocumentRegistry");
  const registry = await DocumentRegistry.deploy();
  await registry.waitForDeployment();

  const registryAddress = await registry.getAddress();
  console.log("✅ DocumentRegistry:", registryAddress);
  console.log("Explorer:", `https://explorer-pob.dev11.top/address/${registryAddress}`);

  // 2) Deploy ContiumBadge con address del registry
  const ContiumBadge = await ethers.getContractFactory("ContiumBadge");
  const badge = await ContiumBadge.deploy(registryAddress);
  await badge.waitForDeployment();

  const badgeAddress = await badge.getAddress();
  console.log("✅ ContiumBadge:", badgeAddress);
  console.log("Explorer:", `https://explorer-pob.dev11.top/address/${badgeAddress}`);

  // 3) Guardar deployments.json en /contracts
  const out = {
    network: "zksys",
    chainId: Number(net.chainId),
    DocumentRegistry: registryAddress,
    ContiumBadge: badgeAddress,
    explorerBase: "https://explorer-pob.dev11.top",
    token: "TSYS",
    deployer: deployer.address,
  };

  const outPath = path.resolve(process.cwd(), "deployments.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf-8");
  console.log("✅ deployments.json actualizado:", outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
