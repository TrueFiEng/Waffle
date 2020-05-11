pragma solidity ^0.5.15;

contract RevertContract {
  function makeRevert() pure public {
    revert();
  }
}
