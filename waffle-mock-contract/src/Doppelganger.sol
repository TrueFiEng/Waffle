/* solium-disable security/no-inline-assembly */
pragma solidity ^0.6.3;

contract Doppelganger {
    struct MockCall {
        bool initialized;
        bool reverts;
        bytes returnValue;
    }

    mapping(bytes32 => MockCall) mockConfig;

    fallback() external payable {
        MockCall storage mockCall = __internal__getMockCall();
        if (mockCall.reverts == true) {
            __internal__mockRevert();
            return;
        }
        __internal__mockReturn(mockCall.returnValue);
    }

    function __waffle__mockReverts(bytes memory data) public {
        mockConfig[keccak256(data)] = MockCall({
            initialized: true,
            reverts: true,
            returnValue: ""
        });
    }

    function __waffle__mockReturns(bytes memory data, bytes memory value) public {
        mockConfig[keccak256(data)] = MockCall({
            initialized: true,
            reverts: false,
            returnValue: value
        });
    }

    function __internal__getMockCall() view private returns (MockCall storage mockCall) {
        mockCall = mockConfig[keccak256(msg.data)];
        if (mockCall.initialized == true) {
            return mockCall;
        }
        mockCall = mockConfig[keccak256(abi.encodePacked(msg.sig))];
        if (mockCall.initialized == true) {
            return mockCall;
        }
        revert("Method not initialized");
    }

    function __internal__mockReturn(bytes memory ret) pure private {
        assembly {
            return (add(ret, 0x20), mload(ret))
        }
    }

    function __internal__mockRevert() pure private {
        revert("Mock revert");
    }
}
