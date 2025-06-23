// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CertiToken is ERC20, Ownable {
    
    constructor() ERC20("CertiToken", "CTK") Ownable(msg.sender) {
        _mint(msg.sender, 1000 * 10**decimals());
    }
    
    function recompensar(address aluno, uint256 quantidade) public onlyOwner {
        _mint(aluno, quantidade * 10**decimals());
    }
    
    function enviarTokensParaAluno(address aluno, uint256 quantidade) public onlyOwner {
        require(balanceOf(msg.sender) >= quantidade * 10**decimals(), "Saldo insuficiente");
        _transfer(msg.sender, aluno, quantidade * 10**decimals());
    }
    
    function consultarSaldo(address conta) public view returns (uint256) {
        return balanceOf(conta);
    }
    
    function totalEmCirculacao() public view returns (uint256) {
        return totalSupply();
    }
}
