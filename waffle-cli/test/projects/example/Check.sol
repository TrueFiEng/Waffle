pragma solidity ^0.5.1;

contract Check {

    uint public x;

    constructor () public {
        x = 1;
    }

    function change() public {
        x += 1;
    }
}