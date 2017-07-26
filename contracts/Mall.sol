pragma solidity ^0.4.2;


import "./Store.sol";


contract Mall {
    uint constant public SHOP_PRICE = 5 ether;

    address owner;

    Store[] public stores;

    function getStoreCount() public constant returns (uint) {
        return stores.length;
    }

    modifier atExactSum(uint amount) {
        require(msg.value >= amount);
        _;
        if (msg.value > amount) {
            msg.sender.transfer(msg.value - amount);
        }
    }

    function Mall() {
        owner = msg.sender;
    }

    function openStore(string name) payable atExactSum(SHOP_PRICE) returns (Store) {
        var store = new Store(name, msg.sender, this);
        stores.push(store);
        return store;
    }
}
