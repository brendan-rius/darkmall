const Mall = artifacts.require("./Mall.sol");

contract('Mall', accounts => {
	it("should create a store", () => {
		let mall;

		return Mall.deployed().then(instance => {
			mall = instance;
			return mall.getStoreCount()
		}).then(storesCounts => {
			assert.equal(0, storesCounts)
			return mall.openStore('Test store', {from: accounts[0], value: web3.toWei(5, "ether")});
		}).then(() => {
			return mall.getStoreCount()
		}).then(storesCounts => {
			assert.equal(1, storesCounts)
		})
	});
});
