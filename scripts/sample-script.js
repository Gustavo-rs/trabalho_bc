const hre = require("hardhat");

async function main() {
  const [admin] = await hre.ethers.getSigners();

  // 1. Deploy do token
  const Token = await hre.ethers.getContractFactory("CertiToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ CertiToken implantado em:", tokenAddress);

  // 2. Deploy do Certificados
  const Certificados = await hre.ethers.getContractFactory("Certificados");
  const certificados = await Certificados.deploy(tokenAddress);
  await certificados.waitForDeployment();
  const certificadosAddress = await certificados.getAddress();
  console.log("✅ Certificados implantado em:", certificadosAddress);
}

main().catch((error) => {
  console.error("❌ Erro:", error);
  process.exitCode = 1;
});
