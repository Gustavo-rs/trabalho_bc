// Endereços dos contratos deployados
const CERTITOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CERTIFICADOS_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const ACCOUNTS = {
  admin: {
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    name: "👨‍🏫 Professor/Admin",
    privateKey:
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  },
  aluno1: {
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    name: "👨‍🎓 Aluno 1",
    privateKey:
      "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
  },
  aluno2: {
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    name: "👩‍🎓 Aluno 2",
    privateKey:
      "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
  },
};

// ABI traduz js pra solidt
const CERTIFICADOS_ABI = [
  "function admin() view returns (address)",
  "function certiToken() view returns (address)",
  "function emitir(address aluno, string nome, string curso, string data, string id)",
  "function consultar(address aluno) view returns (tuple(string nome, string curso, string data, string id, bool ativo)[])",
  "function verificar(string id) view returns (bool)",
  "function detalhes(string id) view returns (string nome, string curso, string data, address aluno, bool ativo)",
  "function saldoTokens(address aluno) view returns (uint256)",
  "function totalCertificados(address aluno) view returns (uint256)",
  "function revogarCertificado(string id)",
  "function transferirAdmin(address novoAdmin)",
  "function obterTodosTokensAluno(address aluno) view returns (uint256)",
  "event CertificadoEmitido(address indexed aluno, string nome, string curso, string id)",
  "event TokenRecompensa(address indexed aluno, uint256 quantidade)",
  "event CertificadoRevogado(string id, address aluno)",
];

const CERTITOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function recompensar(address aluno, uint256 quantidade)",
  "function enviarTokensParaAluno(address aluno, uint256 quantidade)",
  "function consultarSaldo(address conta) view returns (uint256)",
  "function totalEmCirculacao() view returns (uint256)",
  "function owner() view returns (address)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
];

let provider,
  currentUser,
  currentWallet,
  certificadosContract,
  certiTokenContract;

async function initProvider() {
  try {
    provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
    const network = await provider.getNetwork();
    return true;
  } catch (error) {
    showStatus(
      "❌ Erro ao conectar à blockchain local. Verifique se o Hardhat está rodando.",
      "error"
    );
    return false;
  }
}

function clearUserInterface() {
  document.getElementById("certificadosResult").innerHTML = "";
  document.getElementById("verificacaoResult").innerHTML = "";
  document.getElementById("tokenBalance").textContent = "Carregando...";
  document.getElementById("selectAluno").value = "";
  document.getElementById("alunoNome").value = "";
  document.getElementById("cursoNome").value = "";
  document.getElementById("cursoData").value = "";
  document.getElementById("certificadoId").value = "";
  document.getElementById("transferPara").value = "";
  document.getElementById("quantidadeTransfer").value = "";
  document.getElementById("verificarId").value = "";
  document.getElementById("revogarId").value = "";
  document.getElementById("statusMessages").innerHTML = "";
}

async function selectUser(userType, clickedButton) {
  const connected = await initProvider();
  if (!connected) return;

  clearUserInterface();

  currentUser = ACCOUNTS[userType];
  currentWallet = new ethers.Wallet(currentUser.privateKey, provider);

  try {
    certificadosContract = new ethers.Contract(
      CERTIFICADOS_ADDRESS,
      CERTIFICADOS_ABI,
      currentWallet
    );
    certiTokenContract = new ethers.Contract(
      CERTITOKEN_ADDRESS,
      CERTITOKEN_ABI,
      currentWallet
    );

    await certificadosContract.admin();
    await certiTokenContract.name();
  } catch (error) {
    showStatus(
      "❌ Erro ao conectar aos contratos. Verifique se foram deployados corretamente.",
      "error"
    );
    return;
  }

  document.getElementById("userName").textContent = currentUser.name;
  document.getElementById("userAddress").textContent = currentUser.address;

  document.getElementById("userInfo").classList.remove("hidden");
  document.getElementById("appContent").classList.remove("hidden");
  document.getElementById("quickActions").classList.remove("hidden");

  document
    .getElementById("adminPanel")
    .classList.toggle("hidden", userType !== "admin");
  document
    .getElementById("studentPanel")
    .classList.toggle("hidden", userType === "admin");

  document
    .querySelectorAll(".user-btn")
    .forEach((btn) => btn.classList.remove("active"));
  if (clickedButton) {
    clickedButton.classList.add("active");
  }

  const hoje = new Date().toISOString().split("T")[0];
  document.getElementById("cursoData").value = hoje;

  await updateBalance();

  showStatus(`✅ Conectado como ${currentUser.name}`, "success");
}

async function updateBalance() {
  if (!certiTokenContract) {
    document.getElementById("tokenBalance").textContent =
      "Contrato não carregado";
    return;
  }

  if (!currentUser) {
    document.getElementById("tokenBalance").textContent =
      "Usuário não selecionado";
    return;
  }

  try {
    const balance = await certiTokenContract.balanceOf(currentUser.address);
    const formattedBalance = ethers.utils.formatEther(balance);
    const displayBalance = parseFloat(formattedBalance).toFixed(2);
    document.getElementById(
      "tokenBalance"
    ).textContent = `${displayBalance} CTK`;
  } catch (error) {
    document.getElementById("tokenBalance").textContent = "Erro ao carregar";
  }
}

async function emitirCertificado() {
  const alunoAddress = document.getElementById("selectAluno").value;
  const nome = document.getElementById("alunoNome").value;
  const curso = document.getElementById("cursoNome").value;
  const data = document.getElementById("cursoData").value;
  const id = document.getElementById("certificadoId").value;

  if (!alunoAddress || !nome || !curso || !data || !id) {
    showStatus("❌ Preencha todos os campos!", "error");
    return;
  }

  try {
    showStatus("⏳ Emitindo certificado...", "info");

    const contractAdmin = await certificadosContract.admin();

    if (currentUser.address.toLowerCase() !== contractAdmin.toLowerCase()) {
      throw new Error(
        `Você não é o admin. Admin do contrato: ${contractAdmin}, Seu endereço: ${currentUser.address}`
      );
    }

    const gasEstimate = await certificadosContract.estimateGas.emitir(
      alunoAddress,
      nome,
      curso,
      data,
      id
    );

    const tx = await certificadosContract.emitir(
      alunoAddress,
      nome,
      curso,
      data,
      id,
      {
        gasLimit: gasEstimate.mul(120).div(100),
      }
    );

    showStatus("⏳ Aguardando confirmação...", "info");

    const receipt = await tx.wait();

    showStatus(
      `✅ Certificado ${id} emitido para ${nome}! Aluno recebeu 10 CTK.`,
      "success"
    );

    document.getElementById("selectAluno").value = "";
    document.getElementById("alunoNome").value = "";
    document.getElementById("cursoNome").value = "";
    document.getElementById("cursoData").value = "";
    document.getElementById("certificadoId").value = "";

    await updateBalance();
  } catch (error) {
    let errorMessage = "Erro desconhecido";

    if (error.message.includes("Apenas admin pode executar")) {
      errorMessage = "Apenas o admin pode emitir certificados";
    } else if (error.message.includes("Certificado ja foi emitido")) {
      errorMessage = "Este ID de certificado já foi usado";
    } else if (error.message.includes("UNPREDICTABLE_GAS_LIMIT")) {
      errorMessage =
        "Erro ao estimar gas. Verifique se todos os parâmetros estão corretos";
    } else if (error.message.includes("insufficient funds")) {
      errorMessage = "Fundos insuficientes para a transação";
    } else if (error.reason) {
      errorMessage = error.reason;
    } else if (error.message) {
      errorMessage = error.message;
    }

    showStatus(`❌ Erro: ${errorMessage}`, "error");
  }
}

async function consultarCertificados() {
  try {
    const certificados = await certificadosContract.consultar(
      currentUser.address
    );
    const resultDiv = document.getElementById("certificadosResult");

    if (certificados.length === 0) {
      resultDiv.innerHTML = "<p>📭 Você ainda não possui certificados.</p>";
      return;
    }

    let html = "<h3>📜 Seus Certificados:</h3>";
    certificados.forEach((cert, index) => {
      html += `
        <div class="certificate-card">
          <h4>🎓 Certificado #${index + 1}</h4>
          <div class="info-item"><strong>Nome:</strong> ${cert.nome}</div>
          <div class="info-item"><strong>Curso:</strong> ${cert.curso}</div>
          <div class="info-item"><strong>Data:</strong> ${cert.data}</div>
          <div class="info-item"><strong>ID:</strong> ${cert.id}</div>
          <div class="info-item"><strong>Status:</strong> ${
            cert.ativo ? "✅ Ativo" : "❌ Inativo"
          }</div>
        </div>
      `;
    });

    resultDiv.innerHTML = html;
  } catch (error) {
    showStatus("❌ Erro ao consultar certificados: " + error.message, "error");
  }
}

async function verificarCertificado() {
  const id = document.getElementById("verificarId").value;
  if (!id) {
    showStatus("❌ Digite o ID do certificado!", "error");
    return;
  }

  try {
    const existe = await certificadosContract.verificar(id);
    const resultDiv = document.getElementById("verificacaoResult");

    if (existe) {
      const detalhes = await certificadosContract.detalhes(id);
      const isAtivo = detalhes[4];

      if (isAtivo) {
        resultDiv.innerHTML = `
          <div class="status success">
            <strong>✅ Certificado Válido!</strong><br>
            <strong>Nome:</strong> ${detalhes[0]}<br>
            <strong>Curso:</strong> ${detalhes[1]}<br>
            <strong>Data:</strong> ${detalhes[2]}<br>
            <strong>Aluno:</strong> ${detalhes[3]}<br>
            <strong>Status:</strong> Ativo
          </div>
        `;
      } else {
        resultDiv.innerHTML = `
          <div class="status error">
            <strong>❌ Certificado Revogado!</strong><br>
            <strong>Nome:</strong> ${detalhes[0]}<br>
            <strong>Curso:</strong> ${detalhes[1]}<br>
            <strong>Data:</strong> ${detalhes[2]}<br>
            <strong>Aluno:</strong> ${detalhes[3]}<br>
            <strong>Status:</strong> Revogado (Inválido)
          </div>
        `;
      }
    } else {
      resultDiv.innerHTML = `
        <div class="status error">
          <strong>❌ Certificado não encontrado!</strong><br>
          Este ID não corresponde a nenhum certificado válido.
        </div>
      `;
    }
  } catch (error) {
    showStatus("❌ Erro ao verificar: " + error.message, "error");
  }
}

async function transferirTokens() {
  const para = document.getElementById("transferPara").value;
  const quantidade = document.getElementById("quantidadeTransfer").value;

  if (!para || !quantidade) {
    showStatus("❌ Preencha todos os campos!", "error");
    return;
  }

  try {
    showStatus("⏳ Transferindo tokens...", "info");
    const amount = ethers.utils.parseEther(quantidade);
    const tx = await certiTokenContract.transfer(para, amount);
    await tx.wait();

    showStatus(`✅ ${quantidade} CTK transferidos com sucesso!`, "success");
    await updateBalance();

    document.getElementById("transferPara").value = "";
    document.getElementById("quantidadeTransfer").value = "";
  } catch (error) {
    showStatus("❌ Erro na transferência: " + error.message, "error");
  }
}

async function revogarCertificado() {
  const id = document.getElementById("revogarId").value;

  if (!id) {
    showStatus("❌ Digite o ID do certificado para revogar!", "error");
    return;
  }

  try {
    showStatus("⏳ Revogando certificado...", "info");
    const tx = await certificadosContract.revogarCertificado(id);
    await tx.wait();

    showStatus(`✅ Certificado ${id} revogado com sucesso!`, "success");

    document.getElementById("revogarId").value = "";
  } catch (error) {
    showStatus("❌ Erro ao revogar certificado: " + error.message, "error");
  }
}

async function consultarTotalTokens() {
  try {
    const total = await certiTokenContract.totalEmCirculacao();
    const formattedTotal = ethers.utils.formatEther(total);

    showStatus(
      `📊 Total de CTK em circulação: ${parseFloat(formattedTotal).toFixed(
        2
      )} CTK`,
      "info"
    );
  } catch (error) {
    showStatus("❌ Erro ao consultar total: " + error.message, "error");
  }
}

function showStatus(message, type) {
  const statusDiv = document.getElementById("statusMessages");
  const statusEl = document.createElement("div");
  statusEl.className = `status ${type}`;
  statusEl.innerHTML = message;

  statusDiv.appendChild(statusEl);

  setTimeout(() => {
    statusEl.remove();
  }, 5000);
}

document.addEventListener("DOMContentLoaded", function () {
  const hoje = new Date().toISOString().split("T")[0];
  if (document.getElementById("cursoData")) {
    document.getElementById("cursoData").value = hoje;
  }
});
