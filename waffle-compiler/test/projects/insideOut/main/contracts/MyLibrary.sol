pragma solidity ^0.5.1;


library MyLibrary {
  function sevenify(uint _number) public pure returns (uint) {
    return _number + 7;
  }
}
