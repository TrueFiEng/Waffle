// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.24 <0.6.0;

import "openzeppelin-solidity/contracts/access/Roles.sol";
import "./parent.sol";
import "openzeppelin-solidity/contracts/access/roles/PauserRole.sol";
import "./directives.sol";

contract Child {
  mapping(address => uint256) balances;
}
