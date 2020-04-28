pragma solidity >=0.4.24 <0.6.0;

import "./parent.sol";
import "openzeppelin-solidity/contracts/access/roles/PauserRole.sol";

contract Child {
  mapping(address => uint256) balances;
}
