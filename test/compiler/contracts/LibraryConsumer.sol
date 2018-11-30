pragma solidity ^0.4.24;
import "./MyLibrary.sol";


contract LibraryConsumer {
  using MyLibrary for uint;

  function useLibrary(uint _number) public pure returns (uint) {
    return _number.sevenify();
  }
}
