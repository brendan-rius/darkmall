pragma solidity ^0.4.13;


import "./Mall.sol";


contract Store {
    string public name;

    string public publicKey;

    struct Product {
    string name;
    bool available;
    uint price;

//    string[] comments;

    uint ratingsSum;
    uint nRatings;
    }

    Product[] public products;

    struct Order {
    address buyer;
    uint productIndex;
    uint priceAtBuyTime;
    string buyerMessage;
    bool hasBuyerRatedVendor;
    bool hasVendorRatedBuyer;
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
        _;
    }

    modifier validOrder(uint orderIndex) {
        require(orderIndex < orders.length);
        _;
    }

    function Store(string _name, address _owner, Mall _mall, string _publicKey) {
        name = _name;
        owner = _owner;
        mall = _mall;
        publicKey = _publicKey;
    }

    function addProduct(string name, bool available, uint price) onlyOwner {
        //string[] comments;
        products.push(Product({name: name, available: available, price: price, nRatings: 0, ratingsSum: 0}));
    }

    function getProductCount() public constant returns (uint) {
        return products.length;
    }

    function getOrderCount() public constant returns (uint) {
        return orders.length;
    }

    function buyProduct(uint productIndex, string message) validProduct(productIndex) payable atMinimumPrice(products[productIndex].price) {
        var product = products[productIndex];
        require(product.available == true);
        mall.deposit.value(product.price / 10)();
        orders.push(Order(msg.sender, productIndex, product.price, message, false, false));
        mall.notifyOrderFrom(msg.sender);
    }

    function withdraw(address to, uint amount) onlyOwner {
        to.transfer(amount);
    }

    function rateOrder(uint orderIndex, uint rating, string comment) validOrder(orderIndex) {
        var order = orders[orderIndex];
        require(order.buyer == msg.sender);
        require(order.hasBuyerRatedVendor == false);
        require(rating <= 10 && rating >= 0);
        order.hasBuyerRatedVendor = true;
        var product = products[order.productIndex];
        //product.comments.push(comment);
        product.ratingsSum += rating;
        product.nRatings += 1;
    }

    function rateBuyer(uint orderIndex, uint rating) onlyOwner {
        var order = orders[orderIndex];
        require(order.hasVendorRatedBuyer == false);
        require(rating <= 10 && rating >= 0);
        order.hasVendorRatedBuyer = true;
        mall.rateBuyer(order.buyer, rating);
    }
}
