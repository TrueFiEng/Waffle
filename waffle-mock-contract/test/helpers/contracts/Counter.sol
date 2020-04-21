pragma solidity ^0.6.3;

contract Counter {
    uint private value;

    function increment() public {
        value += 1;
    }

    function read() public view returns (uint) {
        return value;
    }

    function add(uint a) public view returns (uint) {
        return value + a;
    }

    function testArgumentTypes(uint a, bool b, string memory s, bytes memory bs) public pure returns (bytes memory ret) {
        ret = abi.encodePacked(a, b, s, bs);
    }
}
