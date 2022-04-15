export const PANIC_SOURCE = `
  pragma solidity ^0.8.10;

  contract Panic {
    uint[] private arr;

    function panic() public {
        uint a = arr[0];
    }
  }
`;

export const PANIC_ABI = [
  'function panic() public'
];

// eslint-disable-next-line max-len
export const PANIC_BYTECODE = '6080604052348015600f57600080fd5b5060bd8061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80634700d30514602d575b600080fd5b60336035565b005b60008060008154811060485760476058565b5b9060005260206000200154905050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fdfea2646970667358221220b1f64ff9f717ee270f4269f4af210729f5f4fa1cb3810120d0d261cd9625d61c64736f6c634300080d0033';
