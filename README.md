# CertificaDApp - Sistema de Certificados Digitais

Sistema blockchain para emissão e verificação de certificados digitais com tokens de recompensa CTK.

## 📁 Estrutura do Projeto

```
Projeto Blockchain/
├── contracts/
│   ├── CertiToken.sol          # Contrato do token CTK
│   └── Certificados.sol        # Contrato principal de certificados
├── scripts/
│   ├── deploy.js               # Script de deploy dos contratos
│   └── test-quick.js           # Script de testes automatizados
├── public/
│   ├── index.html              # Interface principal
│   ├── styles.css              # Estilos CSS separados
│   └── app.js                  # Lógica JavaScript separada
├── hardhat.config.js           # Configuração do Hardhat
├── package.json                # Dependências do projeto
└── README.md                   # Este arquivo
```

## 🚀 Como Usar

1. **Iniciar a blockchain local:**
   ```bash
   npx hardhat node
   ```

2. **Deploy dos contratos:**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Abrir a interface:**
   Abra `public/index.html` no navegador

## ✨ Estrutura Organizada

- **CSS separado**: Estilos em `public/styles.css`
- **JavaScript separado**: Lógica em `public/app.js`
- **HTML limpo**: Interface em `public/index.html`
- **Interface simplificada**: Removidas funções de debug/exemplo
- **Código enxuto**: Mantém apenas funcionalidades essenciais

## 🎯 Funcionalidades

### 👨‍🏫 Admin (Professor)
- Emissão de certificados digitais
- Gerenciamento de tokens CTK
- Revogação de certificados
- Consulta de total de tokens em circulação

### 👨‍🎓 Aluno
- Visualização de certificados próprios
- Transferência de tokens CTK
- Destruição de tokens próprios

### 🌐 Público
- Verificação de certificados por ID
- Sistema totalmente descentralizado 