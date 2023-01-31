pragma solidity ^0.8.3;

contract Events {
    event One(uint value, string msg, bytes32 encoded);
    event Two(uint indexed value, string msg);
    event Index(string indexed msgHashed, string msg, bytes bmsg, bytes indexed bmsgHash, bytes32 indexed encoded);
    event Arrays(uint256[3] value, bytes32[2] encoded);
    event Struct(Task task);
    event NestedStruct(Nested nested);

    struct Task {
    bytes32 hash;
    uint value;
    bytes32[2] encoded;
    }

    struct Nested {
        bytes32 hash;
        uint value;
        Task task;
    }

    function emitOne() public {
        emit One(1, "One", 0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123);
    }

    function emitOneMultipleTimes() public {
        emit One(1, "One", 0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123);
        emit One(1, "One", 0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123);
        emit One(1, "DifferentKindOfOne", 0x0000000000000000000000000000000000000000000000000000000000000001);
    }

    function emitIndex() public {
    emit Index("Three",
            "Three",
            bytes("Three"),
            bytes("Three"),
            0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123);
    }

    function emitTwo() public {
    emit Two(2, "Two");
    }

    function emitBoth() public {
        emit One(1, "One", 0x0000000000000000000000000000000000000000000000000000000000000001);
        emit Two(2, "Two");
    }

    function _emitInternal() internal {
    emit One(1, "One", 0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123);
    }
    function emitNested() public {
    _emitInternal();
    }

    function emitArrays() public {
        emit Arrays(
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

    function doNotEmit() pure public {
    }

    function emitStruct() public {
    emit Struct(Task(
        0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123,
        1,
        [
        bytes32(0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123),
        bytes32(0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162124)
        ]
    ));
    }

    function emitNestedStruct() public {
    emit NestedStruct(Nested(
        0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123,
        1,
        Task(
        0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123,
        1,
        [
            bytes32(0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123),
            bytes32(0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162124)
        ]
        )
    ));
    }

}