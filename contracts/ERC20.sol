// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {IERC20} from "./IERC20.sol";

contract ERC20 is IERC20 {
    string public name;
    string public symbol;
    address public owner;
    mapping(address account => mapping(address spender => uint))
        private _allowances;
    mapping(address account => uint) private _balances;
    uint private _totalSupply;

    constructor(string memory name_, string memory symbol_) {
        name = name_;
        symbol = symbol_;
        owner = msg.sender;
    }

    function decimals() public pure returns (uint8) {
        return 18;
    }
    function allowance(
        address _owner,
        address spender
    ) external view returns (uint) {
        return _allowances[_owner][spender];
    }

    function balanceOf(address account) public view returns (uint) {
        return _balances[account];
    }

    function totalSupply() public view returns (uint) {
        return _totalSupply;
    }

    function transfer(address _to, uint _value) public returns (bool success) {
        address from = msg.sender;
        require(balanceOf(from) >= _value, "no enough balance.");
        _balances[from] -= _value;
        _balances[_to] += _value;
        emit Transfer(_to, from, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint _value
    ) public returns (bool success) {
        require(balanceOf(_from) >= _value, "no enough balance.");
        _balances[_from] -= _value;
        _balances[_to] += _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(
        address _spender,
        uint _value
    ) public returns (bool success) {
        address _owner = msg.sender;
        _allowances[_owner][_spender] += _value;
        emit Approval(_owner, _spender, _value);
        return true;
    }

    function _mint(address to, uint value) internal {
        require(to != address(0), "cannot mint to address 0");
        _totalSupply += value;
        _balances[to] += value;
    }

    function mint(uint value) public {
        require(msg.sender == owner, "Only owner can call this.");
        return _mint(owner, value);
    }
}
