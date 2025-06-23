// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CertiToken is ERC20 {
    address public admin;

    constructor() ERC20("CertiToken", "CTK") {
        admin = msg.sender;
        _mint(admin, 10000 * (10 ** decimals())); // cria 10 mil tokens para o admin
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Somente admin");
        _;
    }

    function recompensar(address aluno, uint256 valor) external onlyAdmin {
        _transfer(admin, aluno, valor * (10 ** decimals()));
    }

    function destruir(address aluno, uint256 valor) external onlyAdmin {
        _burn(aluno, valor * (10 ** decimals()));
    }
}
