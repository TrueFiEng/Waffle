pragma solidity 0.4.24;


contract Events {

    event One(uint value, string msg);
    event Two(uint indexed value, string msg);
    
    function emitOne() public {
        emit One(1, "One");
    }    

    function emitTwo() public {
        emit Two(2, "Two");
    }    

    function emitBoth() public {
        emit One(1, "One");
        emit Two(2, "Two");        
    }    

    function doNotEmit() public {

    }
}
