/* eslint-disable max-len, no-useless-escape */

export const MATCHERS_SOURCE = `
  pragma solidity ^0.8.0;

  contract Matchers {
    uint counter;

    function doNothing() public pure {

    }

    function doModify() public {
      counter += 1;
    }

    function doThrow() public pure {
      assert(false);
    }

    function doRevert() public pure {
      revert("Revert cause");
    }

    function doPanic() public pure {
      uint d = 0;
      uint x = 1 / d;
    }

    function doRevertWithComplexReason() public pure {
      revert("Revert cause (with complex reason)");
    }

    function doRequireFail() public pure {
      require(false, "Require cause");
    }

    function doRequireSuccess() public pure {
      require(true, "Never to be seen");
    }

    function doThrowAndModify() public {
      counter += 1;
      assert(false);
    }

    function doRevertAndModify() public {
      counter += 1;
      revert("Revert cause");
    }

    function doRequireFailAndModify() public {
      counter += 1;
      require(false, "Require cause");
    }

    function getTuple() external view returns (address, uint96) {
      return (0xb319771f2dB6113a745bCDEEa63ec939Bf726207, 9771);
    }

    function requireFalseWithSingleQuote() external view {
      require(false, "asset doesn't have feed");
    }

    function requireFalseWithDoubleQuote() external view {
      require(false, "asset \"something\" doesn't have feed");
    }
  }
`;

export const MATCHERS_ABI = [
  {
    inputs: [],
    name: 'doModify',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'doNothing',
    outputs: [],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [],
    name: 'doPanic',
    outputs: [],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [],
    name: 'doRequireFail',
    outputs: [],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [],
    name: 'doRequireFailAndModify',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'doRequireSuccess',
    outputs: [],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [],
    name: 'doRevert',
    outputs: [],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [],
    name: 'doRevertAndModify',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'doRevertWithComplexReason',
    outputs: [],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [],
    name: 'doThrow',
    outputs: [],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [],
    name: 'doThrowAndModify',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getTuple',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'uint96',
        name: '',
        type: 'uint96'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'requireFalseWithDoubleQuote',
    outputs: [],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'requireFalseWithSingleQuote',
    outputs: [],
    stateMutability: 'view',
    type: 'function'
  }
];

export const MATCHERS_BYTECODE = '608060405234801561001057600080fd5b5061091d806100206000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c8063b217ca111161008c578063d51033db11610066578063d51033db14610153578063d64ee45314610172578063eacf8a571461017c578063fff78f9c14610186576100ea565b8063b217ca1114610135578063b45453bc1461013f578063be3e2e6014610149576100ea565b80639817185d116100c85780639817185d1461010d578063a6f34dcb14610117578063af9b573914610121578063afc874d21461012b576100ea565b806301236db4146100ef5780632f576f20146100f9578063841caf3814610103575b600080fd5b6100f7610190565b005b6101016101e4565b005b61010b6101e6565b005b610115610210565b005b61011f610226565b005b610129610282565b005b6101336102bd565b005b61013d6102f8565b005b610147610313565b005b610151610356565b005b61015b610399565b604051610169929190610543565b60405180910390f35b61017a6103bc565b005b6101846103ff565b005b61018e610442565b005b60016000808282546101a2919061063d565b925050819055506040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101db9061056c565b60405180910390fd5b565b60016000808282546101f8919061063d565b92505081905550600061020e5761020d610718565b5b565b6000808160016102209190610693565b90505050565b6001600080828254610238919061063d565b925050819055506000610280576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102779061058c565b60405180910390fd5b565b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102b4906105ec565b60405180910390fd5b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102ef9061056c565b60405180910390fd5b600160008082825461030a919061063d565b92505081905550565b6000610354576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161034b906105cc565b60405180910390fd5b565b6001610397576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161038e9061060c565b60405180910390fd5b565b60008073b319771f2db6113a745bcdeea63ec939bf72620761262b915091509091565b60006103fd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103f4906105ac565b60405180910390fd5b565b6000610440576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104379061058c565b60405180910390fd5b565b600061045157610450610718565b5b565b61045c816106c4565b82525050565b600061046f600c8361062c565b915061047a826107a5565b602082019050919050565b6000610492600d8361062c565b915061049d826107ce565b602082019050919050565b60006104b560178361062c565b91506104c0826107f7565b602082019050919050565b60006104d860238361062c565b91506104e382610820565b604082019050919050565b60006104fb60228361062c565b91506105068261086f565b604082019050919050565b600061051e60108361062c565b9150610529826108be565b602082019050919050565b61053d81610700565b82525050565b60006040820190506105586000830185610453565b6105656020830184610534565b9392505050565b6000602082019050818103600083015261058581610462565b9050919050565b600060208201905081810360008301526105a581610485565b9050919050565b600060208201905081810360008301526105c5816104a8565b9050919050565b600060208201905081810360008301526105e5816104cb565b9050919050565b60006020820190508181036000830152610605816104ee565b9050919050565b6000602082019050818103600083015261062581610511565b9050919050565b600082825260208201905092915050565b6000610648826106f6565b9150610653836106f6565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0382111561068857610687610747565b5b828201905092915050565b600061069e826106f6565b91506106a9836106f6565b9250826106b9576106b8610776565b5b828204905092915050565b60006106cf826106d6565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60006bffffffffffffffffffffffff82169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f5265766572742063617573650000000000000000000000000000000000000000600082015250565b7f5265717569726520636175736500000000000000000000000000000000000000600082015250565b7f617373657420646f65736e277420686176652066656564000000000000000000600082015250565b7f61737365742022736f6d657468696e672220646f65736e27742068617665206660008201527f6565640000000000000000000000000000000000000000000000000000000000602082015250565b7f52657665727420636175736520287769746820636f6d706c657820726561736f60008201527f6e29000000000000000000000000000000000000000000000000000000000000602082015250565b7f4e6576657220746f206265207365656e0000000000000000000000000000000060008201525056fea26469706673582212206cecacac45c934a83b2529a447a6537ca44856329c3d9fbe23d3c05a8147918f64736f6c63430008070033';
