// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Counter {
    uint public x;

    event plusNumLog(uint num);
    event minusNumLog(uint num);
    function get() public view returns (uint) {
        return x;
    }

    function increment(uint y) public {
        require(y > 0, "invalid number");
        x += y;
        emit plusNumLog(y);
    }
    function decrement(uint y) public {
        require(y > 0, "invalid number");
        x -= y;
        emit minusNumLog(y);
    }
}
