pragma solidity ^0.8.3;

contract Calls {
    function callWithoutParameter() pure public {}

    function callWithParameter(uint param) public {}

    function callWithParameters(uint param1, uint param2) public {}

    function forwardCallWithoutParameter(address addr) pure public {
    Calls other = Calls(addr);
    other.callWithoutParameter();
    }

    function forwardCallWithParameter(address addr, uint param) public {
    Calls other = Calls(addr);
    other.callWithParameter(param);
    }

    function forwardCallWithParameters(address addr, uint param1, uint param2) public {
    Calls other = Calls(addr);
    other.callWithParameters(param1, param2);
    }
}