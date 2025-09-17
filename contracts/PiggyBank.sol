// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract PiggyBank {
    address private _owner;
    event EventReceived(address indexed sender, uint amount);
    event EventWithdraw(address indexed sender, uint amount);

    constructor() {
        _owner = msg.sender;
    }

    receive() external payable {
        require(msg.value > 0, "Must be some Ether.");
        emit EventReceived(msg.sender, msg.value);
    }

    fallback() external payable {}

    function withdraw(address payable _to, uint amount) external {
        require(amount > 0, "Must be some Ether.");
        require(_owner == msg.sender, "Only owner can withdraw.");
        require(address(this).balance >= amount, "Insufficient balance.");
        (bool success, ) = _to.call{value: amount}("");
        require(success, "ETH withdraw failed");
        emit EventWithdraw(_to, amount);
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }

    function getOwner() external view returns (address) {
        return _owner;
    }
}
