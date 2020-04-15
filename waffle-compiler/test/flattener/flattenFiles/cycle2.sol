// Dependency file: test/flattener/testSource/cycle1.sol

// pragma solidity ^0.5.2;

// import "./cycle2.sol";

contract Cycle1 {
  mapping(address => uint256) balances;
}

pragma solidity ^0.5.2;

// import "./cycle1.sol";

contract Cycle2 {
  mapping(address => uint256) balances;
}
