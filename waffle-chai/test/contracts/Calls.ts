export const CALLS_SOURCE = `
  pragma solidity ^0.8.0;

  contract Calls {
      function callWithoutParameter() pure public {}

      function callWithParameter(uint param) public {}

      function callWithParameters(uint param1, uint param2) public {}

      function forwardCallWithoutParameter(address addr) pure public {
        Calls other = Calls(addr);
        other.callWithoutParameter();
      }

      function forwardCallWithParameter(address addr, uint param) public {
        Calls other = Calls(addr);
        other.callWithParameter(param);
      }

      function forwardCallWithParameters(address addr, uint param1, uint param2) public {
        Calls other = Calls(addr);
        other.callWithParameters(param1, param2);
      }
  }
`;

export const CALLS_ABI = [
  'function callWithoutParameter() public',
  'function callWithParameter(uint param) public',
  'function callWithParameters(uint param1, uint param2) public',
  'function forwardCallWithoutParameter(address addr) public',
  'function forwardCallWithParameter(address addr, uint param) public',
  'function forwardCallWithParameters(address addr, uint param1, uint param2) public'
];

// eslint-disable-next-line max-len
export const CALLS_BYTECODE = '608060405234801561001057600080fd5b506104a9806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063270f7979146100675780632934744d14610071578063586a7e231461008d578063ac5a5f08146100a9578063b920040e146100c5578063c3e86c66146100e1575b600080fd5b61006f6100fd565b005b61008b600480360381019061008691906102f3565b6100ff565b005b6100a760048036038101906100a29190610346565b610177565b005b6100c360048036038101906100be9190610386565b61017b565b005b6100df60048036038101906100da91906103b3565b6101e2565b005b6100fb60048036038101906100f691906103f3565b610257565b005b565b60008390508073ffffffffffffffffffffffffffffffffffffffff1663586a7e2384846040518363ffffffff1660e01b815260040161013f92919061042f565b600060405180830381600087803b15801561015957600080fd5b505af115801561016d573d6000803e3d6000fd5b5050505050505050565b5050565b60008190508073ffffffffffffffffffffffffffffffffffffffff1663270f79796040518163ffffffff1660e01b815260040160006040518083038186803b1580156101c657600080fd5b505afa1580156101da573d6000803e3d6000fd5b505050505050565b60008290508073ffffffffffffffffffffffffffffffffffffffff1663c3e86c66836040518263ffffffff1660e01b81526004016102209190610458565b600060405180830381600087803b15801561023a57600080fd5b505af115801561024e573d6000803e3d6000fd5b50505050505050565b50565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061028a8261025f565b9050919050565b61029a8161027f565b81146102a557600080fd5b50565b6000813590506102b781610291565b92915050565b6000819050919050565b6102d0816102bd565b81146102db57600080fd5b50565b6000813590506102ed816102c7565b92915050565b60008060006060848603121561030c5761030b61025a565b5b600061031a868287016102a8565b935050602061032b868287016102de565b925050604061033c868287016102de565b9150509250925092565b6000806040838503121561035d5761035c61025a565b5b600061036b858286016102de565b925050602061037c858286016102de565b9150509250929050565b60006020828403121561039c5761039b61025a565b5b60006103aa848285016102a8565b91505092915050565b600080604083850312156103ca576103c961025a565b5b60006103d8858286016102a8565b92505060206103e9858286016102de565b9150509250929050565b6000602082840312156104095761040861025a565b5b6000610417848285016102de565b91505092915050565b610429816102bd565b82525050565b60006040820190506104446000830185610420565b6104516020830184610420565b9392505050565b600060208201905061046d6000830184610420565b9291505056fea2646970667358221220cbb99a2aa41a58fe79554ea90b3044fae17e2139eac9d7a96525ddc7a9b17cea64736f6c634300080f0033';