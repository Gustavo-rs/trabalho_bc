const hre = require("hardhat");

async function main() {
  // Pega as 3 contas que vou usar: professor e 2 alunos
  const [admin, aluno1, aluno2] = await hre.ethers.getSigners();

  // Deploy do token CTK primeiro
  const CertiToken = await hre.ethers.getContractFactory("CertiToken");
  const certiToken = await CertiToken.deploy();
  await certiToken.waitForDeployment();

  // Deploy do sistema de certificados - precisa do endereço do token
  const Certificados = await hre.ethers.getContractFactory("Certificados");
  const certificados = await Certificados.deploy(await certiToken.getAddress());
  await certificados.waitForDeployment();

  // IMPORTANTE: transfere a propriedade do token para o contrato de certificados
  // Assim quando emite certificado, automaticamente dá tokens
  await certiToken.transferOwnership(await certificados.getAddress());

  // Cria alguns certificados de exemplo para testar
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

  // Mostra os endereços - preciso deles no frontend
  console.log("\nENDEREÇOS DOS CONTRATOS:");
  console.log(`CertiToken: ${await certiToken.getAddress()}`);
  console.log(`Certificados: ${await certificados.getAddress()}`);

  console.log("\nSISTEMA PRONTO!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
