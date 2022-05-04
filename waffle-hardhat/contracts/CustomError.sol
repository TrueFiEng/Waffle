pragma solidity ^0.8.0;

error CustomError(uint value);

contract Matchers {
  function doRevertWithCustomError() public pure {
    revert CustomError(0);
  }
}
