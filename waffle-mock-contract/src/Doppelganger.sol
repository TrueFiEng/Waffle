/* solium-disable security/no-inline-assembly */
pragma solidity ^0.6.3;

contract Doppelganger {
    struct MockCall {
        bool initialized;
        bool reverts;
        bytes returnValue;
    }

    address constant LOG_ADDRESS = address(0);

    mapping(bytes32 => MockCall) mockConfig;

    fallback() external payable {
        bytes memory b = msg.data;
        LOG_ADDRESS.staticcall(b);

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
            // Mock method with specified arguments
            return mockCall;
        }
        mockCall = mockConfig[keccak256(abi.encodePacked(msg.sig))];
        if (mockCall.initialized == true) {
            // Mock method with any arguments
            return mockCall;
        }
        revert("Mock on the method is not initialized");
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
