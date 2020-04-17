pragma solidity ^0.6.3;

contract Counter {
    uint private value;

    function increment() public {
        value += 1;
    }

    function read() public view returns (uint) {
        return value;
    }
}
