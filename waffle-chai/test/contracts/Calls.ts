export const CALLS_SOURCE = `
  pragma solidity ^0.6.0;

  contract Calls {
      function callWithoutParameter() pure public {}

      function callWithParameter(uint param) public {}

      function callWithParameters(uint param1, uint param2) public {}
  }
`;

export const CALLS_ABI = [
  'function callWithoutParameter() public',
  'function callWithParameter(uint param) public',
  'function callWithParameters(uint param1, uint param2) public'
];

// eslint-disable-next-line max-len
export const CALLS_BYTECODE = '608060405234801561001057600080fd5b5060e88061001f6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c8063270f7979146041578063586a7e23146049578063c3e86c6614607e575b600080fd5b604760a9565b005b607c60048036036040811015605d57600080fd5b81019080803590602001909291908035906020019092919050505060ab565b005b60a760048036036020811015609257600080fd5b810190808035906020019092919050505060af565b005b565b5050565b5056fea2646970667358221220042e49619d2f4371b311b491637d1c6a9c9ad3c55696a6a77435579e3f1baf6b64736f6c63430006000033';
