pragma solidity ^0.6.3;

import "./Counter.sol";

contract Cap {
    Counter private counter;

    constructor (Counter _counter) public {
        counter = _counter;
    }

    function cap(uint a) public pure returns (uint) {
        if (a > 10) {
            return 10;
        }
        return a;
    }

    function readCapped() public view returns (uint) {
        return cap(counter.read());
    }

    function addCapped(uint a) public view returns (uint) {
        return cap(counter.add(a));
    }
}
