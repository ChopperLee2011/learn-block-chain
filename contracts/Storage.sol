// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Storage {
    uint public x;
    string public ans;

    constructor(uint _x, string memory _ans) {
        x = _x;
        ans = _ans;
    }

    function getX() external view returns (uint) {
        return x;
    }

    function setX(uint _x) external {
        x = _x;
    }

    function getAns() external view returns (string memory) {
        return ans;
    }

    function setAns(string calldata _ans) external {
        ans = _ans;
    }
}
