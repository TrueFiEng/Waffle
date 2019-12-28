pragma solidity ^0.5.1;


contract Constantinople {
  function constantinople() public pure returns (uint8) {
    uint8 a = 0;
    /* solium-disable-next-line */
    assembly {
      a := shl(1, 2) // SHL is only available in constantinople
    }
    return a;
  }
}
