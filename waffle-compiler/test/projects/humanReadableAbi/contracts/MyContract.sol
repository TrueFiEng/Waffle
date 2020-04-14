pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

contract MyContract {
  struct Baz {
    string a;
    InnerBaz b;
    bool[] nested;
  }

  struct InnerBaz {
    uint b;
  }

  event FooEvent ();
  event Bar (bool argOne, uint indexed argTwo);

  uint200 boo;
  constructor (uint argOne) public {
    boo = uint200(argOne);
  }

  fallback () external {
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

  function complicated (Baz[] memory items) public returns (Baz memory) {
    bar();
    return items[0];
  }
}
