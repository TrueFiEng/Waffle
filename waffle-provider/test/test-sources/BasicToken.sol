pragma solidity ^0.5.0;

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
