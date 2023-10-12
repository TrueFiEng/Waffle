export const EVENTSPROXY_SOURCE = `
pragma solidity ^0.8.3;

import {Events} from "./Events.sol";

contract EventsProxy {
    Events public events;

    constructor(Events _events) {
        events = _events;
    }

    function emitTwoDelegate() public {
        // emit Two with a delegatecall to the events contract
        (bool success, ) = address(events).delegatecall(
            abi.encodeWithSignature("emitTwo()")
        );
        require(success, "delegatecall failed");
    }

    function emitOne() public {
        events.emitOne();
    }
}`;

export const EVENTSPROXY_ABI = [
  {
    inputs: [
      {
        internalType: 'contract Events',
        name: '_events',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [],
    name: 'emitOne',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'emitTwoDelegate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'events',
    outputs: [
      {
        internalType: 'contract Events',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];

// eslint-disable-next-line max-len
export const EVENTSPROXY_BYTECODE = '608060405234801561001057600080fd5b506040516105413803806105418339818101604052810190610032919061008d565b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050610111565b600081519050610087816100fa565b92915050565b60006020828403121561009f57600080fd5b60006100ad84828501610078565b91505092915050565b60006100c1826100da565b9050919050565b60006100d3826100b6565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b610103816100c8565b811461010e57600080fd5b50565b610421806101206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063272b33af146100465780633f0e64ba14610050578063b5f8558c1461005a575b600080fd5b61004e610078565b005b6100586101c9565b005b61006261024b565b60405161006f91906102e9565b60405180910390f35b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166040516024016040516020818303038152906040527f34c10115000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff838183161783525050505060405161014291906102d2565b600060405180830381855af49150503d806000811461017d576040519150601f19603f3d011682016040523d82523d6000602084013e610182565b606091505b50509050806101c6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101bd90610304565b60405180910390fd5b50565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633f0e64ba6040518163ffffffff1660e01b8152600401600060405180830381600087803b15801561023157600080fd5b505af1158015610245573d6000803e3d6000fd5b50505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600061027a82610324565b610284818561032f565b935061029481856020860161038f565b80840191505092915050565b6102a98161036b565b82525050565b60006102bc60138361033a565b91506102c7826103c2565b602082019050919050565b60006102de828461026f565b915081905092915050565b60006020820190506102fe60008301846102a0565b92915050565b6000602082019050818103600083015261031d816102af565b9050919050565b600081519050919050565b600081905092915050565b600082825260208201905092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006103768261037d565b9050919050565b60006103888261034b565b9050919050565b60005b838110156103ad578082015181840152602081019050610392565b838111156103bc576000848401525b50505050565b7f64656c656761746563616c6c206661696c65640000000000000000000000000060008201525056fea26469706673582212200ce5c4d7353a3aed66c47b692095e41e9a8c9f4b6412620eabf464a32caff56a64736f6c63430008030033';