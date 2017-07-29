import MallContractJSON from '../../build/contracts/Mall.json'
import StoreContractJSON from '../../build/contracts/Store.json'
import contract from 'truffle-contract'
import {cps, put, call, select, all} from "redux-saga/effects"
import RootActions from '../redux/RootRedux'
import Web3 from 'web3'

let web3Instance

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

	const storeContract = yield select(store => store.root.storeContract)

	const instance = yield call(storeContract.at, address)
	const name = yield call(instance.name.call)
	const owner = yield call(instance.owner.call)
	const publicKey = yield call(instance.publicKey.call)
	const products = yield call(readProducts, instance)
	const orders = yield call(readOrders, instance, products)

	return {
		instance,
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
	const mall = yield select(state => state.root.mallContract)
	const mallInstance = yield call(mall.deployed)
	const balance = yield cps(web3Instance.eth.getBalance, mallInstance.address)
	yield put(RootActions.setBalance(web3Instance.fromWei(balance)))
	yield call(updateStores, mallInstance)
}

export function * startup() {
	yield put(RootActions.setWeb3Loading(true))
}

export function * updateProvider(provider) {
	const mallContract = contract(MallContractJSON)
	mallContract.setProvider(provider)
	yield put(RootActions.setMallContract(mallContract))

	const storeContract = contract(StoreContractJSON)
	storeContract.setProvider(provider)
	yield put(RootActions.setStoreContract(storeContract))

	const [address,] = yield cps(web3Instance.eth.getAccounts)
	yield put(RootActions.setAddress(address))

}

export function * onWindowLoad() {
	// Checking if Web3 has been injected by the browser (Mist/MetaMask)
	if (typeof window.web3 !== 'undefined') {
		web3Instance = new Web3(window.web3.currentProvider)
		yield put(RootActions.setWeb3Loading(false))
		yield call(updateProvider, web3Instance.currentProvider)
		yield call(loadMall)
	}
}