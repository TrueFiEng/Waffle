pragma solidity ^0.8.3;

contract Matchers {
    uint counter;

    function doNothing() public pure {

    }

    function doModify() public {
      counter += 1;
    }

    function doThrow() public pure {
      assert(false);
    }

    function doRevert() public pure {
      revert("Revert cause");
    }

    function doPanic() public pure {
      uint d = 0;
      uint x = 1 / d;
    }

    function doRevertWithComplexReason() public pure {
      revert("Revert cause (with complex reason)");
    }

    function doRequireFail() public pure {
      require(false, "Require cause");
    }

    function doRequireSuccess() public pure {
      require(true, "Never to be seen");
    }

    function doThrowAndModify() public {
      counter += 1;
      assert(false);
    }

    function doRevertAndModify() public {
      counter += 1;
      revert("Revert cause");
    }

    function doRequireFailAndModify() public {
      counter += 1;
      require(false, "Require cause");
    }

    function getTuple() external view returns (address, uint96) {
      return (0xb319771f2dB6113a745bCDEEa63ec939Bf726207, 9771);
    }

    function requireFalseWithSingleQuote() external view {
      require(false, "asset doesn't have feed");
    }

    function requireFalseWithDoubleQuote() external view {
      require(false, "asset \"something\" doesn't have feed");
    }
}