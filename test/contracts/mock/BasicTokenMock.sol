pragma solidity ^0.4.24;

import "../BasicToken.sol";


// mock class using BasicToken
contract BasicTokenMock is BasicToken {

  constructor(address initialAccount, uint256 initialBalance) public {
    balances[initialAccount] = initialBalance;
    totalSupply_ = initialBalance;
  }

}