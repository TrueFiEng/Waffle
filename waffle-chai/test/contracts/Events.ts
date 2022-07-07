export const EVENTS_SOURCE = `
pragma solidity ^0.8.0;

  contract Events {
      event One(uint value, string msg, bytes32 encoded);
      event Two(uint indexed value, string msg);
      event Index(string indexed msgHashed, string msg, bytes bmsg, bytes indexed bmsgHash, bytes32 indexed encoded);
      event Arrays(uint256[3] value, bytes32[2] encoded);
      event Struct(Task task);
      event NestedStruct(Nested nested);

      struct Task {
        bytes32 hash;
        uint value;
        bytes32[2] encoded;
      }

      struct Nested {
          bytes32 hash;
          uint value;
          Task task;
      }

      function emitOne() public {
          emit One(1, "One", 0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123);
      }

      function emitOneMultipleTimes() public {
          emit One(1, "One", 0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123);
          emit One(1, "One", 0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123);
          emit One(1, "DifferentKindOfOne", 0x0000000000000000000000000000000000000000000000000000000000000001);
      }

      function emitIndex() public {
        emit Index("Three",
              "Three",
              bytes("Three"),
              bytes("Three"),
              0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123);
      }

      function emitTwo() public {
        emit Two(2, "Two");
      }

      function emitBoth() public {
          emit One(1, "One", 0x0000000000000000000000000000000000000000000000000000000000000001);
          emit Two(2, "Two");
      }

      function _emitInternal() internal {
        emit One(1, "One", 0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123);
      }
      function emitNested() public {
        _emitInternal();
      }

      function emitArrays() public {
          emit Arrays(
              [
              uint256(1),
              uint256(2),
              uint256(3)
              ],
              [
              bytes32(0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123),
              bytes32(0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162124)
              ]
          );
      }

      function doNotEmit() pure public {
      }

      function emitStruct() public {
        emit Struct(Task(
          0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123,
          1,
          [
            bytes32(0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123),
            bytes32(0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162124)
          ]
        ));
      }

      function emitNestedStruct() public {
        emit NestedStruct(Nested(
          0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123,
          1,
          Task(
            0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123,
            1,
            [
              bytes32(0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162123),
              bytes32(0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD2a0162e2410cFBbaF7162124)
            ]
          )
        ));
      }

  }
`;

export const EVENTS_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256[3]',
        name: 'value',
        type: 'uint256[3]'
      },
      {
        indexed: false,
        internalType: 'bytes32[2]',
        name: 'encoded',
        type: 'bytes32[2]'
      }
    ],
    name: 'Arrays',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'string',
        name: 'msgHashed',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'msg',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'bmsg',
        type: 'bytes'
      },
      {
        indexed: true,
        internalType: 'bytes',
        name: 'bmsgHash',
        type: 'bytes'
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'encoded',
        type: 'bytes32'
      }
    ],
    name: 'Index',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'hash',
            type: 'bytes32'
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256'
          },
          {
            components: [
              {
                internalType: 'bytes32',
                name: 'hash',
                type: 'bytes32'
              },
              {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256'
              },
              {
                internalType: 'bytes32[2]',
                name: 'encoded',
                type: 'bytes32[2]'
              }
            ],
            internalType: 'struct Events.Task',
            name: 'task',
            type: 'tuple'
          }
        ],
        indexed: false,
        internalType: 'struct Events.Nested',
        name: 'nested',
        type: 'tuple'
      }
    ],
    name: 'NestedStruct',
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
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'msg',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'encoded',
        type: 'bytes32'
      }
    ],
    name: 'One',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'hash',
            type: 'bytes32'
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256'
          },
          {
            internalType: 'bytes32[2]',
            name: 'encoded',
            type: 'bytes32[2]'
          }
        ],
        indexed: false,
        internalType: 'struct Events.Task',
        name: 'task',
        type: 'tuple'
      }
    ],
    name: 'Struct',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'msg',
        type: 'string'
      }
    ],
    name: 'Two',
    type: 'event'
  },
  {
    inputs: [],
    name: 'doNotEmit',
    outputs: [],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [],
    name: 'emitArrays',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'emitBoth',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'emitIndex',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'emitNested',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'emitNestedStruct',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
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
    name: 'emitOneMultipleTimes',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'emitStruct',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'emitTwo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

// eslint-disable-next-line max-len
export const EVENTS_BYTECODE = '608060405234801561001057600080fd5b50610e1f806100206000396000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c8063b2f9983811610066578063b2f99838146100d5578063baa4c5ef146100df578063d5eacee0146100e9578063db6cdf68146100f3578063ec168af5146100fd5761009e565b806334c10115146100a35780633f0e64ba146100ad57806377f3094b146100b75780639c75eefb146100c1578063a35a3a0d146100cb575b600080fd5b6100ab610107565b005b6100b5610140565b005b6100bf61019b565b005b6100c961028b565b005b6100d3610359565b005b6100dd610409565b005b6100e76104f7565b005b6100f1610501565b005b6100fb610574565b005b610105610576565b005b60027f726d8d77432fef0b8999b8e1f5ed6d11c42c0a861c61228b03e767ad3c43d0df60405161013690610c0a565b60405180910390a2565b7f824e7918d5bcff68837d677d05258e17ec7b1bd7b488aa5e3bd2d5cbefa9e04c60017ecfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123604051610191929190610b5d565b60405180910390a1565b7ecfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf716212360001b6040518060400160405280600581526020017f54687265650000000000000000000000000000000000000000000000000000008152506040516102019190610acc565b604051809103902060405161021590610ae3565b60405180910390207f2c0160d31a12563decf7b38f40fd0fab153ae9c20f87643b7fb747e3f0e4c93f6040518060400160405280600581526020017f54687265650000000000000000000000000000000000000000000000000000008152506040516102819190610bd5565b60405180910390a4565b7f88af697807fb5575334776b551b779d8a0b7114db2b5077d73bb6f608caa313c60405180606001604052807ecfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf716212360001b81526020016001815260200160405180604001604052807ecfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf716212360001b81526020017ecfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf716212460001b81525081525060405161034f9190610c45565b60405180910390a1565b7f35cf379c46b4950eedc35bc96d30e9fe7480e2422431c50ea5c4b211ee6b1b8d60405180606001604052806001815260200160028152602001600381525060405180604001604052807ecfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf716212360001b81526020017ecfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf716212460001b8152506040516103ff929190610af8565b60405180910390a1565b7f824e7918d5bcff68837d677d05258e17ec7b1bd7b488aa5e3bd2d5cbefa9e04c60017ecfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf716212360405161045a929190610b5d565b60405180910390a17f824e7918d5bcff68837d677d05258e17ec7b1bd7b488aa5e3bd2d5cbefa9e04c60017ecfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf71621236040516104b3929190610b5d565b60405180910390a17f824e7918d5bcff68837d677d05258e17ec7b1bd7b488aa5e3bd2d5cbefa9e04c6001806040516104ed929190610b99565b60405180910390a1565b6104ff610681565b565b7f824e7918d5bcff68837d677d05258e17ec7b1bd7b488aa5e3bd2d5cbefa9e04c600180604051610533929190610b21565b60405180910390a160027f726d8d77432fef0b8999b8e1f5ed6d11c42c0a861c61228b03e767ad3c43d0df60405161056a90610c0a565b60405180910390a2565b565b7f24ddd153a6146efa8103ad88564854b506eca37f3c52bdb18fdf3416dfa19d1360405180606001604052807ecfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf716212360001b81526020016001815260200160405180606001604052807ecfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf716212360001b81526020016001815260200160405180604001604052807ecfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf716212360001b81526020017ecfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf716212460001b8152508152508152506040516106779190610c2a565b60405180910390a1565b7f824e7918d5bcff68837d677d05258e17ec7b1bd7b488aa5e3bd2d5cbefa9e04c60017ecfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf71621236040516106d2929190610b5d565b60405180910390a1565b60006106e88383610811565b60208301905092915050565b60006107008383610abd565b60208301905092915050565b61071581610c89565b61071f8184610cdc565b925061072a82610c6a565b8060005b8381101561075b57815161074287826106dc565b965061074d83610cb7565b92505060018101905061072e565b505050505050565b61076c81610c7e565b6107768184610cd1565b925061078182610c60565b8060005b838110156107b257815161079987826106dc565b96506107a483610caa565b925050600181019050610785565b505050505050565b6107c381610c94565b6107cd8184610ce7565b92506107d882610c74565b8060005b838110156108095781516107f087826106f4565b96506107fb83610cc4565b9250506001810190506107dc565b505050505050565b61081a81610d2a565b82525050565b600061082b82610c9f565b6108358185610cf2565b9350610845818560208601610d98565b61084e81610dcb565b840191505092915050565b600061086482610c9f565b61086e8185610d03565b935061087e818560208601610d98565b80840191505092915050565b61089381610d52565b82525050565b6108a281610d6c565b82525050565b6108b181610d7e565b82525050565b60006108c4600583610d0e565b91507f54687265650000000000000000000000000000000000000000000000000000006000830152602082019050919050565b6000610904600583610d1f565b91507f54687265650000000000000000000000000000000000000000000000000000006000830152600582019050919050565b6000610944600383610d0e565b91507f4f6e6500000000000000000000000000000000000000000000000000000000006000830152602082019050919050565b6000610984600383610d0e565b91507f54776f00000000000000000000000000000000000000000000000000000000006000830152602082019050919050565b60006109c4601283610d0e565b91507f446966666572656e744b696e644f664f6e6500000000000000000000000000006000830152602082019050919050565b60c082016000820151610a0d6000850182610811565b506020820151610a206020850182610abd565b506040820151610a336040850182610a39565b50505050565b608082016000820151610a4f6000850182610811565b506020820151610a626020850182610abd565b506040820151610a756040850182610763565b50505050565b608082016000820151610a916000850182610811565b506020820151610aa46020850182610abd565b506040820151610ab76040850182610763565b50505050565b610ac681610d48565b82525050565b6000610ad88284610859565b915081905092915050565b6000610aee826108f7565b9150819050919050565b600060a082019050610b0d60008301856107ba565b610b1a606083018461070c565b9392505050565b6000606082019050610b366000830185610899565b8181036020830152610b4781610937565b9050610b56604083018461088a565b9392505050565b6000606082019050610b726000830185610899565b8181036020830152610b8381610937565b9050610b9260408301846108a8565b9392505050565b6000606082019050610bae6000830185610899565b8181036020830152610bbf816109b7565b9050610bce604083018461088a565b9392505050565b60006040820190508181036000830152610bee816108b7565b90508181036020830152610c028184610820565b905092915050565b60006020820190508181036000830152610c2381610977565b9050919050565b600060c082019050610c3f60008301846109f7565b92915050565b6000608082019050610c5a6000830184610a7b565b92915050565b6000819050919050565b6000819050919050565b6000819050919050565b600060029050919050565b600060029050919050565b600060039050919050565b600081519050919050565b6000602082019050919050565b6000602082019050919050565b6000602082019050919050565b600081905092915050565b600081905092915050565b600081905092915050565b600082825260208201905092915050565b600081905092915050565b600082825260208201905092915050565b600081905092915050565b6000819050919050565b6000819050919050565b6000819050919050565b6000819050919050565b6000610d65610d6083610d34565b610ddc565b9050919050565b6000610d7782610d48565b9050919050565b6000610d91610d8c83610d3e565b610ddc565b9050919050565b60005b83811015610db6578082015181840152602081019050610d9b565b83811115610dc5576000848401525b50505050565b6000601f19601f8301169050919050565b60008160001b905091905056fea26469706673582212200fb2f3b7ed72e59a39c56b15db97051f5f58c6fdc2fd9241d6d2baece1bb027964736f6c63430006000033';
