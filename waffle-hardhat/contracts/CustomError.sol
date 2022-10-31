pragma solidity ^0.8.0;

error One(uint value, string msg, bytes32 encoded);
error Two(uint256[3] value, bytes32[2] encoded);
error $__DecoratedCustomErrorName(uint value, string msg, bytes32 encoded);

contract Matchers {
  function doRevertWithOne() public pure {
    revert One(0, 'message', 0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123);
  }

  function doRevertWithTwo() public pure {
    revert Two(
      [
        uint256(1),
        uint256(2),
        uint256(3)
      ],
      [
        bytes32(0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123),
        bytes32(0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162124)
      ]
    );
  }

  function doRevertWithDecoratedCustomErrorName() public pure {
    revert $__DecoratedCustomErrorName(0, 'message', 0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123);
  }
}
