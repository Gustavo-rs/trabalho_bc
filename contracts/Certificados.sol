// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CertiToken.sol";

contract Certificados {
    address public admin;
    CertiToken public token;

    struct Certificado {
        string nome;
        string curso;
        string data;
        string id;
        bool ativo;
    }

    mapping(address => Certificado[]) certificados;
    mapping(string => bool) emitido;
    mapping(string => address) donoDoCertificado;

    constructor(address _token) {
        admin = msg.sender;
        token = CertiToken(_token);
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Somente admin");
        _;
    }

    function emitir(address aluno, string memory nome, string memory curso, string memory data, string memory id) public onlyAdmin {
        require(!emitido[id], "ID ja usado");

        // DEBUG
        require(msg.sender == admin, "Voce nao e o admin");

        certificados[aluno].push(Certificado(nome, curso, data, id, true));
        emitido[id] = true;
        donoDoCertificado[id] = aluno;

        token.recompensar(aluno, 10);
    }

    function consultar(address aluno) public view returns (Certificado[] memory) {
        Certificado[] memory lista = certificados[aluno];
        return lista;
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
        require(emitido[id], "Inexistente");

        address a = donoDoCertificado[id];
        Certificado[] memory lista = certificados[a];

        for (uint i = 0; i < lista.length; i++) {
            if (keccak256(bytes(lista[i].id)) == keccak256(bytes(id))) {
                Certificado memory c = lista[i];
                return (c.nome, c.curso, c.data, a, c.ativo);
            }
        }

        return ("", "", "", address(0), false);
    }

    function totalCertificados(address aluno) public view returns (uint256) {
        return certificados[aluno].length;
    }
}
