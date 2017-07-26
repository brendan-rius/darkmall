pragma solidity ^0.4.2;


contract Store {
    string public name;

    address owner;

    address mall;

    function Store(string _name, address _owner, address _mall) {
        name = _name;
        owner = _owner;
        mall = _mall;
    }
}
