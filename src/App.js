import React from 'react'
import MallContract from '../build/contracts/Mall.json'
import StoreContract from '../build/contracts/Store.json'
import getWeb3 from './utils/getWeb3'
import contract from 'truffle-contract'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

import {Link, Route, BrowserRouter as Router} from "react-router-dom";
import Home from "./components/Home";
import StorePage from "./components/Store";

export default class App extends React.PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			mallInstance: null,
			accounts    : [],
			stores      : [],
			web3        : null,
			storeName   : '',
		}
	}

	componentWillMount() {
		// Get network provider and web3 instance.
		// See utils/getWeb3 for more info.

		getWeb3
			.then(results => {
				this.setState({
					web3: results.web3
				}, () => {
					// Instantiate contract once web3 provided.
					this.instantiateContract()
				})

			})
			.catch(() => {
				console.log('Error finding web3.')
			})
	}

	instantiateContract() {
		/*
		 * SMART CONTRACT EXAMPLE
		 *
		 * Normally these functions would be called in the context of a
		 * state management library, but for convenience I've placed them here.
		 */

		const mall = contract(MallContract)
		mall.setProvider(this.state.web3.currentProvider)

		// Get accounts.
		this.state.web3.eth.getAccounts((error, accounts) => {
			mall.deployed().then(instance => {
				return new Promise(resolve => {
					this.setState({mallInstance: instance, accounts}, () => resolve())
				})
			}).then(() => {
				this._updateStores()
			})
		})

		setTimeout(() => this._updateStores(), 1000)
	}

	_readStoreOrders(storeInstance, products) {
		return storeInstance.getOrderCount.call().then(orderCount => {
			const promises = []
			for (let i = 0; i < orderCount; i++)
				promises.push(storeInstance.orders.call(i).then(([buyer, productIndex, price, message]) => ({
					id     : i,
					buyer,
					product: products[productIndex],
					price  : price.toNumber(),
					message,
				})))
			return Promise.all(promises)
		})
	}

	_readStoreProducts(storeInstance) {
		return storeInstance.getProductCount.call().then(productCount => {
			const promises = []
			for (let i = 0; i < productCount; i++)
				promises.push(storeInstance.products.call(i).then(([name, available, price]) => ({
					id   : i,
					name,
					available,
					price: price.toNumber(),
				})))
			return Promise.all(promises)
		})
	}

	_readStoreAt(address) {
		const storeContract = contract(StoreContract)
		storeContract.setProvider(this.state.web3.currentProvider)

		let storeInstance;
		let storeName;
		let storeProducts;

		return storeContract.at(address).then(store => {
			storeInstance = store
			return storeInstance.name.call()
		}).then(name => {
			storeName = name;
			return this._readStoreProducts(storeInstance)
		}).then(products => {
			storeProducts = products
			return this._readStoreOrders(storeInstance, storeProducts)
		}).then(orders => {
			return {instance: storeInstance, name: storeName, address, products: storeProducts, orders}
		})
	}

	_updateStores() {
		return this.state.mallInstance.getStoreCount.call().then(storeCount => {
			const promises = []
			for (let i = 0; i < storeCount; i++)
				promises.push(this.state.mallInstance.stores.call(i).then(address => this._readStoreAt(address)))
			return Promise.all(promises)
		}).then(stores => {
			this.setState({stores})
		})
	}

	_createStore(name) {
		this.state.mallInstance.openStore.sendTransaction(name, {
			from : this.state.accounts[0],
			value: this.state.web3.toWei(5, "ether")
		}).then(() => {
			return this._updateStores()
		})
	}

	_createProduct(store, name, price, available) {
		store.instance.addProduct.sendTransaction(name, available, price, {from: this.state.accounts[0]}).then(() => alert('ok'))
	}

	_buyProduct(store, product, message) {
		store.instance.buyProduct.sendTransaction(product.id, message, {
			from : this.state.accounts[0],
			value: product.price
		})
	}

	render() {
		return (
			<Router>
				<div className="App">
					<nav className="navbar pure-menu pure-menu-horizontal">
						<Link to="/" className="pure-menu-heading pure-menu-link">Market</Link>
					</nav>

					<main className="container">
						<Route exact path="/"
						       render={props => <Home stores={this.state.stores}
						                              createStore={name => this._createStore(name)}/>}
						/>
						<Route path="/s/:address"
						       render={props => {
							       const store = this.state.stores.find(store => store.address === props.match.params.address)
							       return <StorePage
								       store={store}
								       createProduct={(name, price, available) => this._createProduct(store, name, price, available)}
								       buyProduct={(product, message) => this._buyProduct(store, product, message)}/>
						       }}
						/>
					</main>
				</div>
			</Router>
		)
	}
}