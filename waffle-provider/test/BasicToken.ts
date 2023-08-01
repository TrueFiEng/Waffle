import {Contract, ContractFactory, Signer} from 'ethers';

let start: Date | undefined = undefined;
const printDelta = () => {
  const end = new Date();
  if (start) {
    console.log(`Time elapsed: ${end.getTime() - start.getTime()}ms`);
  }
  start = end;
};

export async function deployToken(signer: Signer, totalSupply: number) {
  const factory = new ContractFactory(TOKEN_ABI, TOKEN_BYTECODE, signer);
  const contract = await factory.deploy(totalSupply);
  await (contract.deploymentTransaction())?.wait();
  return contract as any as Contract;
}

export const TOKEN_SOURCE = `
  pragma solidity ^0.6.0;

  library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
      c = a + b;
      assert(c >= a);
      return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
      assert(b <= a);
      return a - b;
    }
  }

  contract BasicToken {
    using SafeMath for uint256;

    event Transfer(address indexed from, address indexed to, uint256 value);

    mapping(address => uint256) public balanceOf;
    uint256 public totalSupply;

    constructor (uint256 supply) public {
      totalSupply = supply;
      balanceOf[msg.sender] = supply;
    }

    function transfer(address recipient, uint256 value) public returns (bool) {
      require(recipient != address(0), "Invalid address");
      require(value <= balanceOf[msg.sender], "Not enough funds");

      balanceOf[msg.sender] = balanceOf[msg.sender].sub(value);
      balanceOf[recipient] = balanceOf[recipient].add(value);
      emit Transfer(msg.sender, recipient, value);
      return true;
    }
  }
`;

export const TOKEN_ABI = [
  'constructor(uint256 supply)',
  'function totalSupply() public view returns (uint256)',
  'function balanceOf(address who) public view returns (uint256)',
  'function transfer(address to, uint256 value) public returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)'
];

// eslint-disable-next-line max-len
export const TOKEN_BYTECODE = '608060405234801561001057600080fd5b506040516105323803806105328339818101604052602081101561003357600080fd5b810190808051906020019092919050505080600181905550806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550506104948061009e6000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806318160ddd1461004657806370a0823114610064578063a9059cbb146100bc575b600080fd5b61004e610122565b6040518082815260200191505060405180910390f35b6100a66004803603602081101561007a57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610128565b6040518082815260200191505060405180910390f35b610108600480360360408110156100d257600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610140565b604051808215151515815260200191505060405180910390f35b60015481565b60006020528060005260406000206000915090505481565b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156101e4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600f8152602001807f496e76616c69642061646472657373000000000000000000000000000000000081525060200191505060405180910390fd5b6000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054821115610298576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260108152602001807f4e6f7420656e6f7567682066756e64730000000000000000000000000000000081525060200191505060405180910390fd5b6102e9826000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461042d90919063ffffffff16565b6000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061037c826000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461044490919063ffffffff16565b6000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905092915050565b60008282111561043957fe5b818303905092915050565b600081830190508281101561045557fe5b8090509291505056fea264697066735822122083d913c1ae1de2671f075bbf56004b31480c51d2cffc3c0a0025fd46932928d464736f6c63430006000033';
