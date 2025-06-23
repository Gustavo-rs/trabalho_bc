# 🎓 CertificaDApp - Guia de Uso

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Navegador web moderno

## 🚀 Como Usar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar a Blockchain Local
```bash
npx hardhat node
```
**Mantenha este terminal aberto!** A blockchain local deve estar rodando para o DApp funcionar.

### 3. Deploy dos Contratos (se necessário)
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 4. Abrir o DApp
Abra o arquivo `public/dapp-local.html` no seu navegador.

## 👥 Usuários Disponíveis

O sistema possui 3 usuários pré-configurados:

- **👨‍🏫 Professor/Admin** (`0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`)
  - Pode emitir certificados
  - Recebe 1000 CTK inicialmente
  - Controla o sistema

- **👨‍🎓 Aluno 1** (`0x70997970C51812dc3A010C7d01b50e0d17dc79C8`)
  - Pode receber certificados
  - Pode transferir tokens
  - Pode consultar seus certificados

- **👩‍🎓 Aluno 2** (`0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`)
  - Pode receber certificados
  - Pode transferir tokens
  - Pode consultar seus certificados

## 🎯 Funcionalidades

### Para o Professor/Admin:
1. **Emitir Certificados**: Selecione um aluno, preencha os dados e emita o certificado
2. **Recompensa Automática**: Cada certificado emitido dá 10 CTK ao aluno

### Para os Alunos:
1. **Consultar Certificados**: Veja todos os seus certificados emitidos
2. **Transferir Tokens**: Envie CTK para outros usuários
3. **Verificar Certificados**: Confirme a autenticidade de qualquer certificado

### Para Todos:
1. **Verificar Certificados**: Digite um ID de certificado para verificar se é válido

## 🔧 Solução de Problemas

### Erro "CALL_EXCEPTION"
Se você receber erros de CALL_EXCEPTION:

1. **Verifique se o Hardhat está rodando**:
   ```bash
   npx hardhat node
   ```

2. **Redeploy os contratos**:
   ```bash
   npx hardhat run scripts/check-contracts.js --network localhost
   ```

3. **Verifique os endereços dos contratos** no arquivo `public/dapp-local.html`:
   ```javascript
   CERTITOKEN_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
   CERTIFICADOS_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
   ```

### Erro de Conexão
Se o DApp não conseguir conectar:

1. Verifique se a URL `http://127.0.0.1:8545` está acessível
2. Confirme que o Hardhat node está rodando
3. Recarregue a página do navegador

## 📊 Estrutura do Projeto

```
Projeto Blockchain/
├── contracts/           # Contratos Solidity
│   ├── Certificados.sol # Contrato principal
│   └── CertiToken.sol   # Token ERC20
├── scripts/             # Scripts de deploy
│   ├── deploy.js        # Deploy principal
│   └── check-contracts.js # Verificação de contratos
├── public/              # Frontend
│   └── dapp-local.html  # Interface do DApp
└── hardhat.config.js    # Configuração do Hardhat
```

## 🎮 Exemplo de Uso

1. **Inicie como Professor/Admin**
2. **Emita um certificado** para o Aluno 1:
   - Nome: "João da Silva"
   - Curso: "Blockchain Básico"
   - Data: "2025-01-15"
   - ID: "CERT001"

3. **Mude para Aluno 1** e veja:
   - O certificado recebido
   - Os 10 CTK ganhos

4. **Teste a transferência** de 5 CTK para o Aluno 2

5. **Verifique o certificado** usando o ID "CERT001"

## 🔍 Verificação de Status

Para verificar se tudo está funcionando:

```bash
npx hardhat run scripts/check-contracts.js --network localhost
```

Este comando irá:
- Verificar se os contratos estão deployados
- Testar as funcionalidades básicas
- Mostrar os endereços corretos dos contratos

## 💡 Dicas

- **Sempre mantenha o Hardhat node rodando** enquanto usar o DApp
- **Use o botão "Exemplo Completo"** para testar rapidamente
- **Verifique o console do navegador** para logs detalhados
- **Os endereços dos contratos podem mudar** após um novo deploy

## 🆘 Suporte

Se encontrar problemas:

1. Verifique se todas as dependências estão instaladas
2. Confirme que o Hardhat node está rodando
3. Execute o script de verificação de contratos
4. Verifique os logs no console do navegador
5. Recarregue a página se necessário

---

**🎉 Agora você está pronto para usar o CertificaDApp!** 