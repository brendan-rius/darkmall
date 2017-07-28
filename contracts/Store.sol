pragma solidity ^0.4.13;


import "./Mall.sol";


contract Store {
    string public name;

    string public publicKey;

    struct Product {
    string name;
    bool available;
    uint price;
    }

    Product[] public products;

    struct Order {
    address buyer;
    uint productIndex;
    uint priceAtBuyTime;
    string buyerMessage;
    }

    Order[] public orders;

    address public owner;

    Mall mall;

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    modifier atMinimumPrice(uint amount) {
        require(msg.value >= amount);
        _;
    }

    modifier validProduct(uint productIndex) {
        require(productIndex < products.length);
        require(products[productIndex].available == true);
        _;
    }

    function Store(string _name, address _owner, Mall _mall, string _publicKey) {
        name = _name;
        owner = _owner;
        mall = _mall;
        publicKey = _publicKey;
    }

    function addProduct(string name, bool available, uint price) onlyOwner {
        products.push(Product(name, available, price));
    }

    function getProductCount() public constant returns (uint) {
        return products.length;
    }

    function getOrderCount() public constant returns (uint) {
        return orders.length;
    }

    function buyProduct(uint productIndex, string message) validProduct(productIndex) payable atMinimumPrice(products[productIndex].price) {
        var product = products[productIndex];
        mall.deposit.value(product.price / 10)();
        orders.push(Order(msg.sender, productIndex, product.price, message));
    }

    function Withdraw(address to, uint amount) onlyOwner {
        to.transfer(amount);
    }
}
