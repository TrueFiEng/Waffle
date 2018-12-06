pragma solidity 0.5.1;


contract Events {

    event One(uint value, string msg, bytes32 encoded);
    event Two(uint indexed value, string msg);

    function emitOne() public {
        emit One(1, "One", 0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123);
    }

    function emitTwo() public {
        emit Two(2, "Two");
    }

    function emitBoth() public {
        emit One(1, "One", 0x0000000000000000000000000000000000000000000000000000000000000001);
        emit Two(2, "Two");
    }

    function doNotEmit() pure public {

    }
}
