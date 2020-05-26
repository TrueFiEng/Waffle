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


// Dependency file: test/flattener/testSource/cycle1.sol

// pragma solidity ^0.5.2;

// import "test/flattener/testSource/cycle2.sol";

contract Cycle1 {
  mapping(address => uint256) balances;
}


// Dependency file: test/flattener/testSource/cycle2.sol

// pragma solidity ^0.5.2;

// import "test/flattener/testSource/cycle1.sol";

contract Cycle2 {
  mapping(address => uint256) balances;
}


// Dependency file: test/flattener/testSource/parent.sol

// pragma solidity ^0.5.2;
pragma experimental ABIEncoderV2;

// import "openzeppelin-solidity/contracts/access/Roles.sol";
// import "test/flattener/testSource/cycle2.sol";

contract Parent {
  uint public x;

  constructor () public {
    x = 1;
  }

  function change() public {
    x += 1;
  }
}


// Dependency file: openzeppelin-solidity/contracts/access/roles/PauserRole.sol

// pragma solidity ^0.5.0;

// import "openzeppelin-solidity/contracts/access/Roles.sol";

contract PauserRole {
    using Roles for Roles.Role;

    event PauserAdded(address indexed account);
    event PauserRemoved(address indexed account);

    Roles.Role private _pausers;

    constructor () internal {
        _addPauser(msg.sender);
    }

    modifier onlyPauser() {
        require(isPauser(msg.sender), "PauserRole: caller does not have the Pauser role");
        _;
    }

    function isPauser(address account) public view returns (bool) {
        return _pausers.has(account);
    }

    function addPauser(address account) public onlyPauser {
        _addPauser(account);
    }

    function renouncePauser() public {
        _removePauser(msg.sender);
    }

    function _addPauser(address account) internal {
        _pausers.add(account);
        emit PauserAdded(account);
    }

    function _removePauser(address account) internal {
        _pausers.remove(account);
        emit PauserRemoved(account);
    }
}


// Root file: test/flattener/testSource/child.sol

pragma solidity >=0.4.24 <0.6.0;

// import "openzeppelin-solidity/contracts/access/Roles.sol";
// import "test/flattener/testSource/parent.sol";
// import "openzeppelin-solidity/contracts/access/roles/PauserRole.sol";

contract Child {
  mapping(address => uint256) balances;
}
