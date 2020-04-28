pragma solidity ^0.5.0;

import { TestContract } from "TestContract.sol";

contract HelloContract {
  event LogHello(uint param);

  function doRevert(TestContract customContract) external {
    customContract.method(0);
  }

  function method(uint param) external {
    emit LogHello(param);
  }
}
