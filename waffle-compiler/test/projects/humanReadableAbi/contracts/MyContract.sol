pragma solidity ^0.5.1;



contract MyContract {
  event FooEvent ();
  event Bar (bool argOne, uint indexed argTwo);

  uint200 boo;
  constructor (uint argOne) public {
    boo = uint200(argOne);
  }

  function () external {
  }

  function noArgs() public view returns (uint200) {
    return boo;
  }

  function oneArg(bool argOne) public {
    boo = argOne ? 1 : 0;
  }

  function twoReturns(bool argOne) public view returns (bool, uint) {
    return (argOne, boo);
  }

  function threeArgs(string memory argOne, bool argTwo, uint[] memory argThree) public view returns (bool, uint) {
    argOne;
    argTwo;
    return (boo > 1, argThree[1]);
  }

  function bar() private returns (uint200) {
    return boo++;
  }
}
