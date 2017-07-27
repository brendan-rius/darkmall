pragma solidity ^0.4.2;


contract Store {
    string public name;

    struct Product {
    string name;
    bool available;
    uint price;
    }

    Product[] public products;

    address public owner;

    address mall;

    modifier onlyOwner {
        require(msg.sender == owner);
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
}
