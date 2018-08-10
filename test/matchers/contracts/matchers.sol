pragma solidity 0.4.24;


contract Matchers {

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
