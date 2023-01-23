/* solium-disable security/no-inline-assembly */
pragma solidity ^0.6.3;

contract Doppelganger {

    // ============================== Linked list queues data structure explainer ==============================
    // mockConfig contains multiple linked lists, one for each unique call
    // mockConfig[<callData hash>] => root node of the linked list for this call
    // mockConfig[<callData hash>].next => 'address' of the next node. It's always defined, even if it's the last node.
    // When defining a new node .next is set to the hash of the 'address' of the last node
    // mockConfig[mockConfig[<callData hash>].next] => next node (possibly undefined)
    // tails[<callData hash>] => 'address' of the node 'one after' the last node (<last node>.next)
    // in the linked list with root node at <callData hash>

    struct MockCall {
        bytes32 next;
        bool reverts;
        string revertReason;
        bytes returnValue;
    }
    mapping(bytes32 => MockCall) mockConfig;
    mapping(bytes32 => bytes32) tails;    
    bool receiveReverts;
    string receiveRevertReason;

    fallback() external payable {
        MockCall memory mockCall = __internal__getMockCall();
        if (mockCall.reverts == true) {
            __internal__mockRevert(mockCall.revertReason);
            return;
        }
        __internal__mockReturn(mockCall.returnValue);
    }
    
    receive() payable external {
        require(receiveReverts == false, receiveRevertReason);
    }
    
    function __clearQueue(bytes32 at) private {
        tails[at] = at;
        while(mockConfig[at].next != "") {
            bytes32 next = mockConfig[at].next;
            delete mockConfig[at];
            at = next;
        }
    }

    function __waffle__queueRevert(bytes memory data, string memory reason) public {
        // get the root node of the linked list for this call
        bytes32 root = keccak256(data);

        // get the 'address' of the node 'one after' the last node
        // this is where the new node will be inserted
        bytes32 tail = tails[root];
        if(tail == "") tail = keccak256(data);

        // new tail is set to the hash of the current tail
        tails[root] = keccak256(abi.encodePacked(tail));

        // initialize the new node
        mockConfig[tail] = MockCall({
            next: tails[root], 
            reverts: true,
            revertReason: reason,
            returnValue: ""
        });
    }

    function __waffle__mockReverts(bytes memory data, string memory reason) public {
        __clearQueue(keccak256(data));
        __waffle__queueRevert(data, reason);
    }

    function __waffle__queueReturn(bytes memory data, bytes memory value) public {
        // get the root node of the linked list for this call
        bytes32 root = keccak256(data);

        // get the 'address' of the node 'one after' the last node
        // this is where the new node will be inserted
        bytes32 tail = tails[root];
        if(tail == "") tail = keccak256(data);

        // new tail is set to the hash of the current tail
        tails[root] = keccak256(abi.encodePacked(tail));
        
        // initialize the new node
        mockConfig[tail] = MockCall({
            next: tails[root], 
            reverts: false,
            revertReason: "",
            returnValue: value
        });
    }

    function __waffle__mockReturns(bytes memory data, bytes memory value) public {
        __clearQueue(keccak256(data));
        __waffle__queueReturn(data, value);
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

    function __internal__getMockCall() private returns (MockCall memory mockCall) {
        // get the root node of the queue for this call
        bytes32 root = keccak256(msg.data);
        mockCall = mockConfig[root];
        if (mockCall.next != "") {
            // Mock method with specified arguments

            // If there is a next mock call, set it as the current mock call
            // We check if the next mock call is defined by checking if it has a 'next' variable defined
            // (next value is always defined, even if it's the last mock call)
            if(mockConfig[mockCall.next].next != ""){ // basically if it's not the last mock call
                mockConfig[root] = mockConfig[mockCall.next];
                delete mockConfig[mockCall.next];
            }
            return mockCall;
        }
        root = keccak256(abi.encodePacked(msg.sig));
        mockCall = mockConfig[root];
        if (mockCall.next != "") {
            // Mock method with any arguments
            if(mockConfig[mockCall.next].next != ""){ // same as above
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
