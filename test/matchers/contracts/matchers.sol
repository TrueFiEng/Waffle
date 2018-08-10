pragma solidity 0.4.24;


contract Matchers {

    uint counter;

    function doThrowAndModify() public {
        counter += 1;
        throw;
    }
    
    function doRevertAndModify() public {
        counter += 1;
        revert("Revert cause");
    }    

    function doNothing() public pure {
        
    }

    function doThrow() public pure {
        throw;
    }
    
    function doRevert() public {
        revert("Revert cause");
    }    

    function doAssertFail() public {
        assert(false);
    }    

    function doAssertSuccess() public {
        assert(true);
    }    

    function doRequireFail() public {
        require(false, "Require cause");
    }    

    function doRequireSuccess() public {
        require(true, "Never to be seen");
    }    
    
}
