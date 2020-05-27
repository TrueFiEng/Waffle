pragma solidity ^0.5.2;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/access/Roles.sol";
import "./cycle2.sol";

contract Parent {
  uint public x;

  constructor () public {
    x = 1;
  }

  function change() public {
    x += 1;
  }
}
