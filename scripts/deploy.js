const hre = require("hardhat");

async function main() {
  const [admin] = await hre.ethers.getSigners();

  const Token = await hre.ethers.getContractFactory("CertiToken");
  const token = await Token.deploy();
  await token.deployed();
  console.log("CertiToken:", token.address);

  const Certificados = await hre.ethers.getContractFactory("Certificados");
  const cert = await Certificados.deploy(token.address);
  await cert.deployed();
  console.log("Certificados:", cert.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
