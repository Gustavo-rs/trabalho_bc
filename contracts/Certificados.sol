// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CertiToken.sol";

contract Certificados {
    address public admin;
    CertiToken public certiToken;

    struct Certificado {
        string nome;
        string curso;
        string data;
        string id;
        bool ativo;
    }

    mapping(address => Certificado[]) certificados;
    mapping(string => bool) emitido;
    mapping(string => address) certificadoParaAluno;

    event CertificadoEmitido(address indexed aluno, string nome, string curso, string id);
    event TokenRecompensa(address indexed aluno, uint256 quantidade);
    event CertificadoRevogado(string id, address aluno);

    constructor(address _certiTokenAddress) {
        admin = msg.sender;
        certiToken = CertiToken(_certiTokenAddress);
    }

    modifier somenteAdmin() {
        require(msg.sender == admin, "Apenas admin pode executar");
        _;
    }

    function emitir(
        address aluno, 
        string memory nome, 
        string memory curso, 
        string memory data, 
        string memory id
    ) public somenteAdmin {
        require(!emitido[id], "Certificado ja foi emitido");
        require(aluno != address(0), "Endereco invalido");
        
        certificados[aluno].push(Certificado(nome, curso, data, id, true));
        emitido[id] = true;
        certificadoParaAluno[id] = aluno;
        
        certiToken.recompensar(aluno, 10);
        
        emit CertificadoEmitido(aluno, nome, curso, id);
        emit TokenRecompensa(aluno, 10);
    }

    function consultar(address aluno) public view returns (Certificado[] memory) {
        return certificados[aluno];
    }

    function verificar(string memory id) public view returns (bool) {
        return emitido[id];
    }

    function detalhes(string memory id) public view returns (
        string memory nome,
        string memory curso, 
        string memory data,
        address aluno,
        bool ativo
    ) {
        require(emitido[id], "Certificado nao existe");
        address alunoEnd = certificadoParaAluno[id];
        
        Certificado[] memory certs = certificados[alunoEnd];
        for(uint i = 0; i < certs.length; i++) {
            if(keccak256(bytes(certs[i].id)) == keccak256(bytes(id))) {
                return (certs[i].nome, certs[i].curso, certs[i].data, alunoEnd, certs[i].ativo);
            }
        }
        
        return ("", "", "", address(0), false);
    }

    function saldoTokens(address aluno) public view returns (uint256) {
        return certiToken.balanceOf(aluno);
    }

    function totalCertificados(address aluno) public view returns (uint256) {
        return certificados[aluno].length;
    }
    
    function revogarCertificado(string memory id) public somenteAdmin {
        require(emitido[id], "Certificado nao existe");
        address alunoEnd = certificadoParaAluno[id];
        
        Certificado[] storage certs = certificados[alunoEnd];
        for(uint i = 0; i < certs.length; i++) {
            if(keccak256(bytes(certs[i].id)) == keccak256(bytes(id))) {
                certs[i].ativo = false;
                emit CertificadoRevogado(id, alunoEnd);
                break;
            }
        }
    }
    
    function transferirAdmin(address novoAdmin) public somenteAdmin {
        require(novoAdmin != address(0), "Endereco invalido");
        admin = novoAdmin;
    }
    
    function obterTodosTokensAluno(address aluno) public view returns (uint256) {
        return certiToken.consultarSaldo(aluno);
    }
}
