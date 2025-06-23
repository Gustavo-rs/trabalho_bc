const hre = require("hardhat");

async function main() {
  const [admin, aluno1, aluno2] = await hre.ethers.getSigners();

  const CertiToken = await hre.ethers.getContractFactory("CertiToken");
  const certiToken = await CertiToken.deploy();
  await certiToken.waitForDeployment();

  const Certificados = await hre.ethers.getContractFactory("Certificados");
  const certificados = await Certificados.deploy(await certiToken.getAddress());
  await certificados.waitForDeployment();

  const certiTokenAddress = await certiToken.getAddress();
  const certificadosAddress = await certificados.getAddress();

  await certiToken.transferOwnership(certificadosAddress);

  const adminBalance = await certiToken.balanceOf(admin.address);
  const aluno1Balance = await certiToken.balanceOf(aluno1.address);

  await certificados.emitir(
    aluno1.address,
    "João Silva",
    "Blockchain Básico",
    "2025-01-15",
    "CERT001"
  );

  await certificados.emitir(
    aluno1.address,
    "João Silva",
    "Smart Contracts",
    "2025-01-20",
    "CERT002"
  );

  const finalAdminBalance = await certiToken.balanceOf(admin.address);
  const finalAluno1Balance = await certiToken.balanceOf(aluno1.address);
  const finalAluno2Balance = await certiToken.balanceOf(aluno2.address);

  const totalSupply = await certiToken.totalSupply();
  const totalCerts = await certificados.totalCertificados(aluno1.address);

  console.log("\n🎯 DEPLOY COMPLETO - SISTEMA DE CERTIFICADOS CTK");
  console.log("=".repeat(60));

  console.log("\n📄 ENDEREÇOS DOS CONTRATOS:");
  console.log(`CertiToken: ${certiTokenAddress}`);
  console.log(`Certificados: ${certificadosAddress}`);

  console.log("\n👥 CONTAS DE TESTE:");
  console.log(`Admin/Professor: ${admin.address}`);
  console.log(`Aluno 1: ${aluno1.address}`);
  console.log(`Aluno 2: ${aluno2.address}`);

  console.log("\n💰 SALDOS CTK:");
  console.log(`Admin: ${hre.ethers.formatEther(finalAdminBalance)} CTK`);
  console.log(`Aluno 1: ${hre.ethers.formatEther(finalAluno1Balance)} CTK`);
  console.log(`Aluno 2: ${hre.ethers.formatEther(finalAluno2Balance)} CTK`);

  try {
    await certificados.revogarCertificado("CERT001");
  } catch (error) {
    // Certificado pode já estar revogado
  }

  console.log("\n🚀 SISTEMA PRONTO PARA USO!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
