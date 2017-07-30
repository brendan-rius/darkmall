import {cps, put, call, all, select} from "redux-saga/effects"
import RootActions from '../redux/RootRedux'
import Web3Service from '../services/Web3Service'

export function * readOrderAtIndex(index, storeInstance, products) {
	const [buyer, productIndex, price, message] = yield call(storeInstance.orders.call, index)

	return {
		id     : index,
		buyer,
		product: products[productIndex],
		price  : price.toNumber(),
		message,
	}
}

export function * readOrders(storeInstance, products) {
	const orderCount = yield call(storeInstance.getOrderCount.call)
	const promises = []
	for (let i = 0; i < orderCount; i++)
		promises.push(call(readOrderAtIndex, i, storeInstance, products))
	return yield all(promises)
}

export function * readProductAtIndex(storeInstance, index) {
	const [name, available, price, ratingsSum, nRatings] = yield call(storeInstance.products.call, index)

	return {
		id      : index,
		name,
		available,
		price   : price.toNumber(),
		rating  : ratingsSum.dividedBy(nRatings).toNumber(),
		nRatings: nRatings.toNumber(),
	}
}

export function * readProducts(storeInstance) {
	const productCount = yield call(storeInstance.getProductCount.call)
	const promises = []
	for (let i = 0; i < productCount; i++)
		promises.push(call(readProductAtIndex, storeInstance, i))
	return yield all(promises)
}


export function * readStoreAtIndex(mallInstance, index) {
	const address = yield call(mallInstance.stores.call, index)

	const instance = yield call(Web3Service.storeContract.at, address)
	const name = yield call(instance.name.call)
	const owner = yield call(instance.owner.call)
	const publicKey = yield call(instance.publicKey.call)
	const products = yield call(readProducts, instance)
	const orders = yield call(readOrders, instance, products)

	return {
		name,
		address,
		products,
		owner,
		publicKey,
		orders
	}
}

export function * updateStores(mallInstance) {
	const storeCount = yield call(mallInstance.getStoreCount.call)
	const promises = []
	for (let i = 0; i < storeCount; i++)
		promises.push(call(readStoreAtIndex, mallInstance, i))
	const stores = yield all(promises)
	yield put(RootActions.setStores(stores))
}

export function * loadMall() {
	const balance = yield cps(Web3Service.web3.eth.getBalance, Web3Service.mallInstance.address)
	yield put(RootActions.setBalance(Web3Service.web3.fromWei(balance)))
	yield call(updateStores, Web3Service.mallInstance)
}

export function * startup() {
	yield put(RootActions.setWeb3Loading(true))
}

export function * createProduct({store, name, price, available}) {
	//TODO change
	store.instance.addProduct.sendTransaction(name, available, price, {
		from: this.state.accounts[0],
	})
}

export function * createStore({name, publicKey}) {
	const address = yield select(state => state.root.address)

	const txOptions = {
		from : address,
		value: Web3Service.web3.toWei(5, "ether")
	}

	yield call(Web3Service.mallInstance.openStore.sendTransaction, name, publicKey, txOptions)
}

export function * buyProduct({store, product, message}) {
	// TODO change
	store.instance.buyProduct.sendTransaction(product.id, message, {
		from : this.state.accounts[0],
		value: product.price,
	})
}

export function * rateOrder({store, order, rating, comment}) {
	//TODO change
	console.log(store, order, rating, comment)
	store.instance.rateOrder.sendTransaction(order.id, rating, comment, {
		from: this.state.accounts[0],
	})
}

export function * onWindowLoad() {
	// Checking if Web3 has been injected by the browser (Mist/MetaMask)
	if (typeof window.web3 !== 'undefined') {
		yield call([Web3Service, Web3Service.setProvider], window.web3.currentProvider)
		yield put(RootActions.setAddress(Web3Service.accounts[0]))
		yield call(loadMall)
		yield put(RootActions.setWeb3Loading(false))
	}
}