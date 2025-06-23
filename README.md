# 🎓 CertificaDApp - Sistema de Certificados Digitais

Um DApp (Aplicativo Descentralizado) para emissão e verificação de certificados digitais usando contratos inteligentes em Solidity, com sistema de tokens de recompensa.

## 📋 Sobre o Projeto

Este sistema permite que:
- **Professores/Administradores** emitam certificados digitais para alunos
- **Alunos** recebam **10 CTK (CertiToken)** como recompensa por cada certificado
- **Qualquer pessoa** possa verificar a autenticidade dos certificados
- **Alunos** transfiram tokens entre si

## 🏗️ Arquitetura

### Contratos Inteligentes

1. **`Certificados.sol`** - Gerencia os certificados digitais
2. **`CertiToken.sol`** - Token ERC20 para recompensas (CTK)

### Funcionalidades

✅ **Emissão de Certificados**
- Somente admin pode emitir
- Dados: nome, curso, data, ID único
- Recompensa automática de 10 CTK

✅ **Verificação Pública**
- Qualquer pessoa pode verificar por ID
- Retorna dados completos do certificado

✅ **Gestão de Tokens**
- Alunos visualizam saldo CTK
- Transferência entre carteiras
- Admin pode destruir tokens

## 🚀 Como Usar

### 1. Instalação
```bash
npm install
```

### 2. Deploy dos Contratos
```bash
npx hardhat run scripts/deploy.js
```

### 3. Configurar Interface Web
1. Copie os endereços dos contratos do deploy
2. Cole em `public/index.html` substituindo:
   - `CERTIFICADOS_ADDRESS`
   - `CERTITOKEN_ADDRESS`

### 4. Abrir o DApp
Abra `public/index.html` no navegador com MetaMask instalado

## 📱 Interface do Usuário

### Para Professores (Admin):
- 👨‍🏫 **Área do Professor**: Emitir certificados
- 🎯 **Recompensa Automática**: 10 CTK para cada certificado

### Para Alunos:
- 📜 **Meus Certificados**: Visualizar certificados recebidos
- 💰 **Saldo CTK**: Ver tokens de recompensa
- 💸 **Transferir CTK**: Enviar tokens para outros

### Para Todos:
- 🔍 **Verificar Certificado**: Consulta pública por ID

## 🧪 Testando o Sistema

O script de deploy já testa automaticamente:
```bash
npx hardhat run scripts/deploy.js
```

**Testes inclusos:**
1. Deploy dos dois contratos
2. Emissão de certificados de exemplo
3. Verificação de autenticidade
4. Consulta de saldos CTK
5. Transferência de tokens

## 📁 Estrutura do Projeto

```
Projeto Blockchain/
├── contracts/
│   ├── Certificados.sol    # Contrato principal
│   └── CertiToken.sol      # Token ERC20
├── scripts/
│   └── deploy.js           # Script de deploy + testes
├── public/
│   └── index.html          # Interface web do DApp
├── package.json
└── hardhat.config.js
```

## 🔧 Tecnologias Utilizadas

- **Solidity** - Linguagem dos contratos
- **Hardhat** - Framework de desenvolvimento
- **OpenZeppelin** - Padrões de segurança (ERC20, Ownable)
- **Ethers.js** - Interação com blockchain
- **HTML/CSS/JS** - Interface web
- **MetaMask** - Carteira Web3

## 🎯 Requisitos Atendidos

✅ Contrato de certificados com admin  
✅ Armazenamento de dados do certificado  
✅ Verificação pública de autenticidade  
✅ Token ERC20 "CertiToken" (CTK)  
✅ Recompensas automáticas para alunos  
✅ Transferência de tokens  
✅ Destruição de tokens pelo admin  
✅ Interface web funcional  

## 📖 Como Explicar o Projeto

### Para a apresentação, foque em:

1. **Problema**: Certificados falsificáveis
2. **Solução**: Blockchain = imutável + verificável
3. **Diferencial**: Tokens de recompensa motivam alunos
4. **Demonstração**: 
   - Emitir certificado
   - Verificar autenticidade
   - Mostrar tokens recebidos
   - Transferir tokens

### Pontos fortes para destacar:
- 🔒 **Segurança**: Impossível falsificar
- 🌐 **Descentralizado**: Não depende de servidor
- 🎁 **Gamificação**: Tokens motivam participação
- 💡 **Inovador**: Blockchain aplicado à educação

## ⚠️ Observações Importantes

- Substitua os endereços dos contratos após o deploy
- Use rede de teste (não mainnet) para demonstrações
- MetaMask necessário para usar a interface
- Guarde os endereços dos contratos para referência

## 👥 Desenvolvido para

**Trabalho de Blockchain - Sistema de Certificados Digitais**
- Emissão descentralizada de certificados
- Tokens de recompensa (CertiToken - CTK)
- Verificação pública de autenticidade
- Interface web intuitiva
