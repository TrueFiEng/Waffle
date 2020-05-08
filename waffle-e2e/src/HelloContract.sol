pragma solidity ^0.5.15;

contract HelloContract {
  event LogHello();

  function sayHello() external {
    emit LogHello();
  }
}
