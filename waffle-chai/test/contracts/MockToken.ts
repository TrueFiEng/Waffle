export const MOCK_TOKEN_SOURCE = `
  // SPDX-License-Identifier: GPL-3.0-or-later
  pragma solidity =0.7.0;
  library SafeMath {
    function add(uint256 x, uint256 y) internal pure returns (uint256 z) {
      require((z = x + y) >= x, 'SafeMath: ADD_OVERFLOW');
    }
    function sub(uint256 x, uint256 y) internal pure returns (uint256 z) {
      require((z = x - y) <= x, 'SafeMath: SUB_UNDERFLOW');
    }
    function mul(uint256 x, uint256 y) internal pure returns (uint256 z) {
      require(y == 0 || (z = x * y) / y == x, 'SafeMath: MUL_OVERFLOW');
    }
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
      require(b > 0, 'SafeMath: DIV_BY_ZERO');
      uint256 c = a / b;
      return c;
    }
  }
  contract ERC20 {
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Transfer(address indexed from, address indexed to, uint256 value);
    using SafeMath for uint256;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    bytes32 public DOMAIN_SEPARATOR;
    // keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
    bytes32
      public constant
      PERMIT_TYPEHASH = 0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9;
    mapping(address => uint256) public nonces;
    string public name;
    string public symbol;
    uint8 public decimals;
    constructor(
      string memory _name,
      string memory _symbol,
      uint8 _decimals,
      uint256 _totalSupply
    ) {
      name = _name;
      symbol = _symbol;
      decimals = _decimals;
      _init(name);
      _mint(msg.sender, _totalSupply);
    }
    function _init(string memory _name) internal {
      uint256 chainId;
      assembly {
        chainId := chainid()
      }
      DOMAIN_SEPARATOR = keccak256(
        abi.encode(
          keccak256('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'),
          keccak256(bytes(_name)),
          keccak256(bytes('1')),
          chainId,
          address(this)
        )
      );
    }
    function _mint(address to, uint256 value) internal {
      totalSupply = totalSupply.add(value);
      balanceOf[to] = balanceOf[to].add(value);
      emit Transfer(address(0), to, value);
    }
    function _burn(address from, uint256 value) internal {
      balanceOf[from] = balanceOf[from].sub(value);
      totalSupply = totalSupply.sub(value);
      emit Transfer(from, address(0), value);
    }
    function _approve(
      address owner,
      address spender,
      uint256 value
    ) internal {
      allowance[owner][spender] = value;
      emit Approval(owner, spender, value);
    }
    function _transfer(
      address from,
      address to,
      uint256 value
    ) internal {
      balanceOf[from] = balanceOf[from].sub(value);
      balanceOf[to] = balanceOf[to].add(value);
      emit Transfer(from, to, value);
    }
    function approve(address spender, uint256 value) external returns (bool) {
      _approve(msg.sender, spender, value);
      return true;
    }
    function transfer(address to, uint256 value) external returns (bool) {
      _transfer(msg.sender, to, value);
      return true;
    }
    function transferFrom(
      address from,
      address to,
      uint256 value
    ) external returns (bool) {
      if (allowance[from][msg.sender] != uint256(-1)) {
        allowance[from][msg.sender] = allowance[from][msg.sender].sub(value);
      }
      _transfer(from, to, value);
      return true;
    }
    function permit(
      address owner,
      address spender,
      uint256 value,
      uint256 deadline,
      uint8 v,
      bytes32 r,
      bytes32 s
    ) external {
      require(deadline >= block.timestamp, 'Manifold: EXPIRED');
      bytes32 digest = keccak256(
        abi.encodePacked(
          '\x19\x01',
          DOMAIN_SEPARATOR,
          keccak256(abi.encode(PERMIT_TYPEHASH, owner, spender, value, nonces[owner]++, deadline))
        )
      );
      address recoveredAddress = ecrecover(digest, v, r, s);
      require(recoveredAddress != address(0) && recoveredAddress == owner, 'Manifold: INVALID_SIGNATURE');
      _approve(owner, spender, value);
    }
  }
`;

export const MOCK_TOKEN_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256'
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8'
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32'
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32'
      }
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_symbol',
        type: 'string'
      },
      {
        internalType: 'uint8',
        name: '_decimals',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: '_totalSupply',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'nonces',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'PERMIT_TYPEHASH',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];

// eslint-disable-next-line max-len
export const MOCK_TOKEN_BYTECODE = '60806040523480156200001157600080fd5b5060405162000e0638038062000e06833981810160405260808110156200003757600080fd5b81019080805160405193929190846401000000008211156200005857600080fd5b9083019060208201858111156200006e57600080fd5b82516401000000008111828201881017156200008957600080fd5b82525081516020918201929091019080838360005b83811015620000b85781810151838201526020016200009e565b50505050905090810190601f168015620000e65780820380516001836020036101000a031916815260200191505b50604052602001805160405193929190846401000000008211156200010a57600080fd5b9083019060208201858111156200012057600080fd5b82516401000000008111828201881017156200013b57600080fd5b82525081516020918201929091019080838360005b838110156200016a57818101518382015260200162000150565b50505050905090810190601f168015620001985780820380516001836020036101000a031916815260200191505b506040908152602082810151929091015186519294509250620001c1916005918701906200043f565b508251620001d79060069060208601906200043f565b506007805460ff191660ff84161790556005805460408051602060026101006001861615026000190190941693909304601f810184900484028201840190925281815262000285939092909190830182828015620002795780601f106200024d5761010080835404028352916020019162000279565b820191906000526020600020905b8154815290600101906020018083116200025b57829003601f168201915b50506200029b92505050565b62000291338262000338565b50505050620004db565b805160209182012060408051808201825260018152603160f81b9084015280517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81850152808201929092527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc660608301524660808301523060a0808401919091528151808403909101815260c090920190528051910120600355565b6200035481600054620003e060201b6200072c1790919060201c565b60009081556001600160a01b038316815260016020908152604090912054620003889183906200072c620003e0821b17901c565b6001600160a01b03831660008181526001602090815260408083209490945583518581529351929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a35050565b8082018281101562000439576040805162461bcd60e51b815260206004820152601660248201527f536166654d6174683a204144445f4f564552464c4f5700000000000000000000604482015290519081900360640190fd5b92915050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200048257805160ff1916838001178555620004b2565b82800160010185558215620004b2579182015b82811115620004b257825182559160200191906001019062000495565b50620004c0929150620004c4565b5090565b5b80821115620004c05760008155600101620004c5565b61091b80620004eb6000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c80633644e5151161008c57806395d89b411161006657806395d89b411461025b578063a9059cbb14610263578063d505accf1461028f578063dd62ed3e146102e2576100cf565b80633644e5151461020757806370a082311461020f5780637ecebe0014610235576100cf565b806306fdde03146100d4578063095ea7b31461015157806318160ddd1461019157806323b872dd146101ab57806330adf81f146101e1578063313ce567146101e9575b600080fd5b6100dc610310565b6040805160208082528351818301528351919283929083019185019080838360005b838110156101165781810151838201526020016100fe565b50505050905090810190601f1680156101435780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61017d6004803603604081101561016757600080fd5b506001600160a01b03813516906020013561039e565b604080519115158252519081900360200190f35b6101996103b5565b60408051918252519081900360200190f35b61017d600480360360608110156101c157600080fd5b506001600160a01b038135811691602081013590911690604001356103bb565b61019961044f565b6101f1610473565b6040805160ff9092168252519081900360200190f35b61019961047c565b6101996004803603602081101561022557600080fd5b50356001600160a01b0316610482565b6101996004803603602081101561024b57600080fd5b50356001600160a01b0316610494565b6100dc6104a6565b61017d6004803603604081101561027957600080fd5b506001600160a01b038135169060200135610501565b6102e0600480360360e08110156102a557600080fd5b506001600160a01b03813581169160208101359091169060408101359060608101359060ff6080820135169060a08101359060c0013561050e565b005b610199600480360360408110156102f857600080fd5b506001600160a01b038135811691602001351661070f565b6005805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156103965780601f1061036b57610100808354040283529160200191610396565b820191906000526020600020905b81548152906001019060200180831161037957829003601f168201915b505050505081565b60006103ab33848461077d565b5060015b92915050565b60005481565b6001600160a01b03831660009081526002602090815260408083203384529091528120546000191461043a576001600160a01b038416600090815260026020908152604080832033845290915290205461041590836107df565b6001600160a01b03851660009081526002602090815260408083203384529091529020555b610445848484610837565b5060019392505050565b7f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c981565b60075460ff1681565b60035481565b60016020526000908152604090205481565b60046020526000908152604090205481565b6006805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156103965780601f1061036b57610100808354040283529160200191610396565b60006103ab338484610837565b42841015610557576040805162461bcd60e51b815260206004820152601160248201527013585b9a599bdb190e8811561412549151607a1b604482015290519081900360640190fd5b6003546001600160a01b0380891660008181526004602090815260408083208054600180820190925582517f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98186015280840196909652958d166060860152608085018c905260a085019590955260c08085018b90528151808603909101815260e08501825280519083012061190160f01b6101008601526101028501969096526101228085019690965280518085039096018652610142840180825286519683019690962095839052610162840180825286905260ff89166101828501526101a284018890526101c28401879052519193926101e280820193601f1981019281900390910190855afa158015610672573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116158015906106a85750886001600160a01b0316816001600160a01b0316145b6106f9576040805162461bcd60e51b815260206004820152601b60248201527f4d616e69666f6c643a20494e56414c49445f5349474e41545552450000000000604482015290519081900360640190fd5b61070489898961077d565b505050505050505050565b600260209081526000928352604080842090915290825290205481565b808201828110156103af576040805162461bcd60e51b8152602060048201526016602482015275536166654d6174683a204144445f4f564552464c4f5760501b604482015290519081900360640190fd5b6001600160a01b03808416600081815260026020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b808203828111156103af576040805162461bcd60e51b815260206004820152601760248201527f536166654d6174683a205355425f554e444552464c4f57000000000000000000604482015290519081900360640190fd5b6001600160a01b03831660009081526001602052604090205461085a90826107df565b6001600160a01b038085166000908152600160205260408082209390935590841681522054610889908261072c565b6001600160a01b0380841660008181526001602090815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a350505056fea2646970667358221220ee4008f11a81528f86aa6a38e315bbade1961d608e8328d715c0748f7f0e778e64736f6c63430007000033';
