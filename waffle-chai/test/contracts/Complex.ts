/* eslint-disable max-len */
export const COMPLEX_SOURCE = `
  // SPDX-License-Identifier: GPL-3.0-or-later

  pragma solidity =0.7.0;

  import {ERC20} from './MockToken.sol';

  contract Complex {
      ERC20 public token;

      event TransferredEther(uint value);
      event TransferredTokens(uint value);

      constructor(ERC20 _token) {
          token = _token;
      }

      function doEverything(address payable receiver, uint tokens) public payable {
          receiver.transfer(msg.value);
          token.transferFrom(msg.sender, receiver, tokens);
          emit TransferredEther(msg.value);
          emit TransferredTokens(tokens);
      }
  }
`;

export const COMPLEX_ABI = [
  {
    inputs: [
      {
        internalType: 'contract ERC20',
        name: '_token',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'TransferredEther',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'TransferredTokens',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'receiver',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'tokens',
        type: 'uint256'
      }
    ],
    name: 'doEverything',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'token',
    outputs: [
      {
        internalType: 'contract ERC20',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];

export const COMPLEX_BYTECODE = '608060405234801561001057600080fd5b5060405161034f38038061034f8339818101604052602081101561003357600080fd5b8101908080519060200190929190505050806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550506102bb806100946000396000f3fe6080604052600436106100295760003560e01c806320c111991461002e578063fc0c546a1461007c575b600080fd5b61007a6004803603604081101561004457600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506100bd565b005b34801561008857600080fd5b50610091610261565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b8173ffffffffffffffffffffffffffffffffffffffff166108fc349081150290604051600060405180830381858888f19350505050158015610103573d6000803e3d6000fd5b5060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd3384846040518463ffffffff1660e01b8152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b1580156101b357600080fd5b505af11580156101c7573d6000803e3d6000fd5b505050506040513d60208110156101dd57600080fd5b8101908080519060200190929190505050507f0236f81eab444b36009ff6ba3d30740fc6bff318c418412263fbfbada8c57c09346040518082815260200191505060405180910390a17f1e4f6f9cdba2cbf50c993296a58398e79fdb4e5dd0ca4a6a8c93e0d1b389735f816040518082815260200191505060405180910390a15050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156fea2646970667358221220b0c4a94bfb49cd8b78d7d5833e38b77386d3138a668f9e1c562be33640b756c264736f6c63430007000033';
