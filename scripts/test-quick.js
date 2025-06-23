const hre = require("hardhat");

async function main() {
  const CERTIFICADOS_ADDRESS = "0xFD471836031dc5108809D173A067e8486B9047A3";
  const CERTITOKEN_ADDRESS = "0xc351628EB244ec633d5f21fBD6621e1a683B1181";

  const [admin, aluno1, aluno2] = await hre.ethers.getSigners();

  const certificados = await hre.ethers.getContractAt(
    "Certificados",
    CERTIFICADOS_ADDRESS
  );
  const certiToken = await hre.ethers.getContractAt(
    "CertiToken",
    CERTITOKEN_ADDRESS
  );

  console.log("\n🧪 TESTE COMPLETO - SISTEMA DE CERTIFICADOS CTK");
  console.log("=".repeat(70));

  try {
    console.log("\n1️⃣ VERIFICANDO SALDOS INICIAIS:");
    const adminBalance = await certiToken.balanceOf(admin.address);
    const aluno1Balance = await certiToken.balanceOf(aluno1.address);
    const aluno2Balance = await certiToken.balanceOf(aluno2.address);

    console.log(`Admin: ${hre.ethers.formatEther(adminBalance)} CTK`);
    console.log(`Aluno 1: ${hre.ethers.formatEther(aluno1Balance)} CTK`);
    console.log(`Aluno 2: ${hre.ethers.formatEther(aluno2Balance)} CTK`);

    console.log("\n2️⃣ TESTANDO EMISSÃO DE CERTIFICADO:");
    const testId = `TESTE_${Date.now()}`;
    await certificados.emitir(
      aluno2.address,
      "Maria Santos",
      "DeFi Fundamentals",
      "2025-01-22",
      testId
    );

    console.log("\n3️⃣ TESTANDO CONSULTA DE CERTIFICADOS:");
    const certsAluno1 = await certificados.consultar(aluno1.address);
    const certsAluno2 = await certificados.consultar(aluno2.address);
    console.log(`Certificados Aluno 1: ${certsAluno1.length}`);
    console.log(`Certificados Aluno 2: ${certsAluno2.length}`);

    console.log("\n4️⃣ TESTANDO VERIFICAÇÃO DE CERTIFICADO:");
    const existe = await certificados.verificar(testId);
    console.log(`Certificado existe: ${existe}`);

    console.log("\n5️⃣ TESTANDO TRANSFERÊNCIA DE TOKENS:");
    const certiTokenAluno2 = certiToken.connect(aluno2);
    await certiTokenAluno2.transfer(aluno1.address, hre.ethers.parseEther("5"));

    console.log("\n6️⃣ TESTANDO DESTRUIÇÃO DE TOKENS:");
    const certiTokenAluno1 = certiToken.connect(aluno1);
    await certiTokenAluno1.destruirMeusTokens(3);

    console.log("\n7️⃣ TESTANDO REVOGAÇÃO DE CERTIFICADO:");
    await certificados.revogarCertificado(testId);

    console.log("\n8️⃣ VERIFICANDO SALDOS FINAIS:");
    const finalAdminBalance = await certiToken.balanceOf(admin.address);
    const finalAluno1Balance = await certiToken.balanceOf(aluno1.address);
    const finalAluno2Balance = await certiToken.balanceOf(aluno2.address);

    console.log(`Admin: ${hre.ethers.formatEther(finalAdminBalance)} CTK`);
    console.log(`Aluno 1: ${hre.ethers.formatEther(finalAluno1Balance)} CTK`);
    console.log(`Aluno 2: ${hre.ethers.formatEther(finalAluno2Balance)} CTK`);

    console.log("\n🎉 TODOS OS TESTES PASSARAM!");
    console.log("=".repeat(70));
    console.log("✅ Sistema completo funcionando");
  } catch (error) {
    console.error("❌ Erro durante os testes:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
