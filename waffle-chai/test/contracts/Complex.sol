// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.3;

import {ERC20} from './MockToken.sol';

contract Complex {
    ERC20 public token;

    event TransferredEther(uint value);
    event TransferredTokens(uint value);
    event UnusedEvent(uint value);

    constructor(ERC20 _token) public {
        token = _token;
    }

    function doEverything(address payable receiver, uint tokens) public payable {
        receiver.transfer(msg.value);
        token.transferFrom(msg.sender, receiver, tokens);
        emit TransferredEther(msg.value);
        emit TransferredTokens(tokens);
    }
}