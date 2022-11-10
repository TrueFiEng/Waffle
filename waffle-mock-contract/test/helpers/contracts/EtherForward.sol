pragma solidity ^0.6.3;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    fallback() external payable;
    receive() external payable;
}

contract EtherForward {
    IERC20 private tokenContract;

    constructor (IERC20 _tokenContract) public {
        tokenContract = _tokenContract;
    }

    function forwardByCall() public payable {
        (bool sent, bytes memory data) = payable(tokenContract).call{value: msg.value}("");
        if (!sent) {
            // https://ethereum.stackexchange.com/a/114140/24330
            // Bubble up the revert from the call.
            assembly {
                revert(add(data, 32), data)
            }
        }
    }

    function forwardBySend() public payable {
        require(payable(tokenContract).send(msg.value), "forwardBySend failed");
    }

    function forwardByTransfer() public payable {
        payable(tokenContract).transfer(msg.value);
    }
}
