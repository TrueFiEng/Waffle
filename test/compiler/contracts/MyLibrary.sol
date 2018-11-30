pragma solidity ^0.4.24;


library MyLibrary {
  function sevenify(uint _number) public pure returns (uint) {
    return _number + 7;
  }
}
