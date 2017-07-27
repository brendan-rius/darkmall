pragma solidity ^0.4.2;


contract Store {
    string public name;

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

    address mall;

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    modifier atExactPrice(uint amount) {
        require(msg.value >= amount);
        _;
        if (msg.value > amount) {
            msg.sender.transfer(msg.value - amount);
        }
    }

    modifier validProduct(uint productIndex) {
        require(productIndex < products.length);
        require(products[productIndex].available == true);
        _;
    }

    function Store(string _name, address _owner, address _mall) {
        name = _name;
        owner = _owner;
        mall = _mall;
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

    function buyProduct(uint productIndex, string message) validProduct(productIndex) payable atExactPrice(products[productIndex].price) {
        var product = products[productIndex];
        orders.push(Order(msg.sender, productIndex, product.price, message));
    }
}
