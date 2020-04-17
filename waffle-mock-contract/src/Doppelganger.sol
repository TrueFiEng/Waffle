/* solium-disable security/no-inline-assembly */
pragma solidity ^0.6.3;

contract Doppelganger {
    mapping (bytes4 => bytes) mockConfig;

    fallback() external {
        bytes memory ret = mockConfig[msg.sig];
        assembly {
            return(add(ret, 0x20), mload(ret))
        }
    }

    function mockReturns(bytes4 key, bytes memory value) public {
        mockConfig[key] = value;
    }
}
