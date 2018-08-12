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
    
    function doRevert() pure public {
        revert("Revert cause");
    }    

    function doAssertFail() pure public {
        assert(false);
    }    

    function doAssertSuccess() pure public {
        assert(true);
    }    

    function doRequireFail() pure public {
        require(false, "Require cause");
    }    

    function doRequireSuccess() pure public {
        require(true, "Never to be seen");
    }    
    
}
