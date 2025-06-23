const hre = require("hardhat");

async function main() {
  console.log("🔍 Verificando status dos contratos...\n");

  const [admin, aluno1, aluno2] = await hre.ethers.getSigners();

  console.log("👤 Contas disponíveis:");
  console.log("Admin:", admin.address);
  console.log("Aluno 1:", aluno1.address);
  console.log("Aluno 2:", aluno2.address);
  console.log();

  // Tentar detectar contratos existentes
  const possibleAddresses = [
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    "0xDc64a140Aa3E981100a9becA4E685f962fC51B3f",
  ];

  let certiTokenAddress = null;
  let certificadosAddress = null;

  // Procurar CertiToken
  for (const address of possibleAddresses) {
    try {
      const contract = new hre.ethers.Contract(
        address,
        ["function name() view returns (string)"],
        admin
      );
      const name = await contract.name();
      if (name === "CertiToken") {
        certiTokenAddress = address;
        console.log("✅ CertiToken encontrado em:", address);
        break;
      }
    } catch (e) {
      // Continua procurando
    }
  }

  // Procurar Certificados
  for (const address of possibleAddresses) {
    try {
      const contract = new hre.ethers.Contract(
        address,
        ["function admin() view returns (address)"],
        admin
      );
      const adminAddr = await contract.admin();
      if (adminAddr === admin.address) {
        certificadosAddress = address;
        console.log("✅ Certificados encontrado em:", address);
        break;
      }
    } catch (e) {
      // Continua procurando
    }
  }

  if (!certiTokenAddress || !certificadosAddress) {
    console.log("❌ Contratos não encontrados. Fazendo deploy...\n");

    // Deploy do CertiToken
    console.log("📝 Fazendo deploy do CertiToken...");
    const CertiToken = await hre.ethers.getContractFactory("CertiToken");
    const certiToken = await CertiToken.deploy();
    await certiToken.waitForDeployment();
    certiTokenAddress = await certiToken.getAddress();
    console.log("✅ CertiToken deployado em:", certiTokenAddress);

    // Deploy do Certificados
    console.log("📜 Fazendo deploy do contrato Certificados...");
    const Certificados = await hre.ethers.getContractFactory("Certificados");
    const certificados = await Certificados.deploy(certiTokenAddress);
    await certificados.waitForDeployment();
    certificadosAddress = await certificados.getAddress();
    console.log("✅ Certificados deployado em:", certificadosAddress);

    // Transferir ownership
    console.log("🔐 Transferindo controle do CertiToken...");
    await certiToken.transferOwnership(certificadosAddress);
    console.log("✅ Ownership transferido!");
  }

  // Testar funcionalidades
  console.log("\n🧪 Testando funcionalidades...");

  const certiToken = new hre.ethers.Contract(
    certiTokenAddress,
    [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function balanceOf(address) view returns (uint256)",
      "function totalSupply() view returns (uint256)",
    ],
    admin
  );

  const certificados = new hre.ethers.Contract(
    certificadosAddress,
    [
      "function admin() view returns (address)",
      "function consultar(address) view returns (tuple(string nome, string curso, string data, string id, bool ativo)[])",
      "function verificar(string) view returns (bool)",
      "function emitir(address, string, string, string, string)",
    ],
    admin
  );

  try {
    // Testar CertiToken
    const tokenName = await certiToken.name();
    const tokenSymbol = await certiToken.symbol();
    const totalSupply = await certiToken.totalSupply();
    const adminBalance = await certiToken.balanceOf(admin.address);

    console.log("💰 CertiToken:");
    console.log("   Nome:", tokenName);
    console.log("   Símbolo:", tokenSymbol);
    console.log("   Supply Total:", hre.ethers.formatEther(totalSupply), "CTK");
    console.log("   Saldo Admin:", hre.ethers.formatEther(adminBalance), "CTK");

    // Testar Certificados
    const contractAdmin = await certificados.admin();
    const certsAluno1 = await certificados.consultar(aluno1.address);

    console.log("\n📜 Certificados:");
    console.log("   Admin:", contractAdmin);
    console.log("   Certificados do Aluno 1:", certsAluno1.length);

    // Emitir certificado de teste se não existir
    if (certsAluno1.length === 0) {
      console.log("\n📋 Emitindo certificado de teste...");
      await certificados.emitir(
        aluno1.address,
        "João da Silva",
        "Blockchain Básico",
        "2025-01-15",
        "TEST001"
      );
      console.log("✅ Certificado TEST001 emitido!");
    }

    // Verificar certificado
    const certExiste = await certificados.verificar("TEST001");
    console.log("🔍 Certificado TEST001 existe:", certExiste);

    console.log("\n🎉 SISTEMA FUNCIONANDO!");
    console.log("===============================");
    console.log("📝 CertiToken (CTK):", certiTokenAddress);
    console.log("📜 Certificados:", certificadosAddress);
    console.log("===============================");
    console.log("\n💡 Para usar no frontend, atualize os endereços:");
    console.log(`CERTITOKEN_ADDRESS = "${certiTokenAddress}";`);
    console.log(`CERTIFICADOS_ADDRESS = "${certificadosAddress}";`);
  } catch (error) {
    console.error("❌ Erro nos testes:", error);
  }
}

main().catch((error) => {
  console.error("❌ Erro:", error);
  process.exitCode = 1;
});
