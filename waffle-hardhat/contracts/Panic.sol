// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Panic {
  uint[] private arr;
  function panic() public {
      uint a = arr[0];
  }
}
