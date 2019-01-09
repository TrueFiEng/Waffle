pragma solidity ^0.4.24;

import "./One.sol";
import "../MyLibrary.sol";


contract Two {
  using MyLibrary for uint;

  function dummy() public pure {

  }

  function useLibrary(uint _number) public pure returns (uint) {
    return _number.sevenify();
  }
}
