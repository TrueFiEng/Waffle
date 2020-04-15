// Dependency file: test/flattener/testSource/cycle1.sol

// pragma solidity ^0.5.2;

// import "./cycle2.sol";

contract Cycle1 {
  mapping(address => uint256) balances;
}

// Dependency file: test/flattener/testSource/cycle2.sol

// pragma solidity ^0.5.2;

// import "./cycle1.sol";

contract Cycle2 {
  mapping(address => uint256) balances;
}

// Dependency file: openzeppelin-solidity/contracts/access/Roles.sol

// pragma solidity ^0.5.0;

/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role.
 */
library Roles {
    struct Role {
        mapping (address => bool) bearer;
    }

    /**
     * @dev Give an account access to this role.
     */
    function add(Role storage role, address account) internal {
        require(!has(role, account), "Roles: account already has role");
        role.bearer[account] = true;
    }

    /**
     * @dev Remove an account's access to this role.
     */
    function remove(Role storage role, address account) internal {
        require(has(role, account), "Roles: account does not have role");
        role.bearer[account] = false;
    }

    /**
     * @dev Check if an account has this role.
     * @return bool
     */
    function has(Role storage role, address account) internal view returns (bool) {
        require(account != address(0), "Roles: account is the zero address");
        return role.bearer[account];
    }
}

pragma solidity ^0.5.2;

// import "openzeppelin-solidity/contracts/access/Roles.sol";
// import "./cycle2.sol";

contract Parent {
  uint public x;

  constructor () public {
    x = 1;
  }

  function change() public {
    x += 1;
  }
}
