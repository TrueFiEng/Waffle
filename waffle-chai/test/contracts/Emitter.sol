pragma solidity ^0.8.3;

contract Emitter {
    event TestEvent(string message);

    function emitEvent(string memory message) public {
        emit TestEvent(message);
    }
}

contract DelegatedEmitter {
    Emitter public emitter;
    event TestEvent(string message);

    constructor(address _emitter) public {
        emitter = Emitter(_emitter);
    }

    function delegateEmit(string memory message) public {
        // emit log message using a delegatecall to the emitter contract
        (bool success, ) = address(emitter).delegatecall(
            abi.encodeWithSignature("emitEvent(string)", message)
        );
        require(success, "delegatecall failed");
    }
}