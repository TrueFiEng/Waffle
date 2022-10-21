/* solium-disable security/no-inline-assembly */
pragma solidity ^0.6.3;

contract Doppelganger {
    struct MockCall {
        bool initialized;
        bool reverts;
        string revertReason;
        bytes returnValue;
    }

    mapping(bytes32 => MockCall) mockConfig;
    bool receiveReverts;
    string receiveRevertReason;

    fallback() external payable {
        MockCall storage mockCall = __internal__getMockCall();
        if (mockCall.reverts == true) {
            __internal__mockRevert(mockCall.revertReason);
            return;
        }
        __internal__mockReturn(mockCall.returnValue);
    }

    receive() payable external {
        require(receiveReverts == false, receiveRevertReason);
    }

    function __waffle__mockReverts(bytes memory data, string memory reason) public {
        mockConfig[keccak256(data)] = MockCall({
            initialized: true,
            reverts: true,
            revertReason: reason,
            returnValue: ""
        });
    }

    function __waffle__mockReturns(bytes memory data, bytes memory value) public {
        mockConfig[keccak256(data)] = MockCall({
            initialized: true,
            reverts: false,
            revertReason: "",
            returnValue: value
        });
    }

    function __waffle__receiveReverts(string memory reason) public {
        receiveReverts = true;
        receiveRevertReason = reason;
    }

    function __waffle__call(address target, bytes calldata data) external returns (bytes memory) {
      (bool succeeded, bytes memory returnValue) = target.call(data);
      require(succeeded, string(returnValue));
      return returnValue;
    }

    function __waffle__staticcall(address target, bytes calldata data) external view returns (bytes memory) {
      (bool succeeded, bytes memory returnValue) = target.staticcall(data);
      require(succeeded, string(returnValue));
      return returnValue;
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

    function __internal__mockRevert(string memory reason) pure private {
        revert(reason);
    }
}
