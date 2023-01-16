/* solium-disable security/no-inline-assembly */
pragma solidity ^0.6.3;

contract Doppelganger {
    struct MockCall {
        bytes32 next;
        bool reverts;
        string revertReason;
        bytes returnValue;
    }

    mapping(bytes32 => MockCall) mockConfig;
    mapping(bytes32 => bytes32) heads;

    fallback() external payable {
        MockCall memory mockCall = __internal__getMockCall();
        if (mockCall.reverts == true) {
            __internal__mockRevert(mockCall.revertReason);
            return;
        }
        __internal__mockReturn(mockCall.returnValue);
    }

    function __clearQueue(bytes32 at) private {
        heads[at] = at;
        while(mockConfig[at].next != "") {
            bytes32 next = mockConfig[at].next;
            delete mockConfig[at];
            at = next;
        }
    }

    function __waffle__queueRevert(bytes memory data, string memory reason) public {
        bytes32 head = heads[keccak256(data)];
        if(head == "") head = keccak256(data);
        bytes32 newHead = keccak256(abi.encodePacked(head));
        mockConfig[head] = MockCall({
            next: newHead,
            reverts: true,
            revertReason: reason,
            returnValue: ""
        });
        heads[keccak256(data)] = newHead;
    }

    function __waffle__mockReverts(bytes memory data, string memory reason) public {
        __clearQueue(keccak256(data));
        __waffle__queueRevert(data, reason);
    }

    function __waffle__queueReturn(bytes memory data, bytes memory value) public {
        bytes32 head = heads[keccak256(data)];
        if(head == "") head = keccak256(data);
        bytes32 newHead = keccak256(abi.encodePacked(head));
        mockConfig[head] = MockCall({
            next: newHead,
            reverts: false,
            revertReason: "",
            returnValue: value
        });
        heads[keccak256(data)] = newHead;
    }

    function __waffle__mockReturns(bytes memory data, bytes memory value) public {
        __clearQueue(keccak256(data));
        __waffle__queueReturn(data, value);
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

    function __internal__getMockCall() private returns (MockCall memory mockCall) {
        bytes32 root = keccak256(msg.data);
        mockCall = mockConfig[root];
        if (mockCall.next != "") {
            // Mock method with specified arguments
            if(mockConfig[mockCall.next].next != ""){
                mockConfig[root] = mockConfig[mockCall.next];
                delete mockConfig[mockCall.next];
            }
            return mockCall;
        }
        root = keccak256(abi.encodePacked(msg.sig));
        mockCall = mockConfig[root];
        if (mockCall.next != "") {
            // Mock method with any arguments
            if(mockConfig[mockCall.next].next != ""){
                mockConfig[root] = mockConfig[mockCall.next];
                delete mockConfig[mockCall.next];
            }
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
