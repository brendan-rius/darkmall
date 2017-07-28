pragma solidity ^0.4.13;


import "./Store.sol";


contract Mall {
    uint constant public SHOP_PRICE = 5 ether;

    address owner;

    Store[] public stores;

    mapping (address => bool) public existingStores;

    struct Buyer {
    uint nOrders;
    uint totalRatings;
    uint nRatings;
    // No comments to avoid angry vendors from publishing personal details
    }

    mapping (address => Buyer) public buyers;

    function getStoreCount() public constant returns (uint) {
        return stores.length;
    }

    modifier atExactPrice(uint amount) {
        require(msg.value >= amount);
        _;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    modifier onlyStore {
        require(existingStores[msg.sender] == true);
        _;
    }

    function Mall() {
        owner = msg.sender;
    }

    function openStore(string name, string publicKey) payable atExactPrice(SHOP_PRICE) returns (Store) {
        var store = new Store(name, msg.sender, this, publicKey);
        stores.push(store);
        existingStores[store] = true;
        return store;
    }

    function deposit() payable {

    }

    function withdraw(address to, uint amount) onlyOwner {
        to.transfer(amount);
    }

    function rateBuyer(address buyerAddress, uint rating) onlyStore {
        var buyer = buyers[buyerAddress];
        buyer.nRatings += 1;
        buyer.totalRatings += rating;
    }


    function notifyOrderFrom(address buyerAddress) onlyStore {
        var buyer = buyers[buyerAddress];
        buyer.nOrders += 1;
    }
}
