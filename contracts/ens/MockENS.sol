pragma solidity ^0.4.24;

import "./ENS.sol";
import "./ResolverInterface.sol";

/**
 * The ENS registry contract.
 */
contract MockENS is ENS, ResolverInterface {

    mapping(bytes32 => address) addresses;

    function setAddr(bytes32 node, address addr) public {
        addresses[node] = addr;
    }

    function addr(bytes32 node) public view returns (address) {
        return addresses[node];
    }

    function resolver(bytes32 node) public view returns (address) {
        if (addresses[node] != address(0x0)) {
            return this;
        }
        return 0x0;
    }

    function setOwner(bytes32, address) public {
        revert("Not implemented");
    }

    function setSubnodeOwner(bytes32, bytes32, address) public {
        revert("Not implemented");
    }

    function setResolver(bytes32, address) public {
        revert("Not implemented");
    }

    function setTTL(bytes32, uint64) public {
        revert("Not implemented");
    }

    function owner(bytes32) public view returns (address) {
        revert("Not implemented");
    }

    function ttl(bytes32) public view returns (uint64) {
        revert("Not implemented");
    }

    function setHash(bytes32, bytes32) public {
        revert("Not implemented");
    }

    function hash(bytes32) public view returns (bytes32) {
        revert("Not implemented");
    }

    function supportsInterface(bytes4) public pure returns (bool) {
        revert("Not implemented");
    }
}
