pragma solidity ^0.5.0;

import { Ownable } from "@openzeppelin/contracts/ownership/Ownable.sol";

contract TestContract is Ownable {
  function method(uint param) external {
    reverts(param);
  }

  function reverts(uint param) internal {
    if(param == 1) {
      revert("foo");
    } else {
      revert("bar");
    }
  }

  uint foo;

  function other() external onlyOwner {
    foo = 2;
  }
}
