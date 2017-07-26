import React from 'react'
import PropTypes from 'prop-types'
import MallContract from '../build/contracts/Mall.json'
import StoreContract from '../build/contracts/Store.json'
import getWeb3 from './utils/getWeb3'
import contract from 'truffle-contract'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

import {Link, Route, BrowserRouter as Router} from "react-router-dom";


class Store extends React.PureComponent {
	static propTypes = {
		name     : PropTypes.string.isRequired,
		address  : PropTypes.string.isRequired,
		goToStore: PropTypes.func,
	}

	static defaultProps = {
		goToStore: () => null,
	}

	render() {
		return <a onClick={this.props.goToStore()}>{this.props.name}</a>
	}
}

class StoreList extends React.PureComponent {
	static propTypes = {
		stores: PropTypes.arrayOf(PropTypes.shape({
			name   : PropTypes.string,
			address: PropTypes.string,
		}))
	}

	static defaultProps = {
		stores: [],
	}

	render() {
		return <ul>
			{
				this.props.stores.map((store, i) =>
					<li key={store.address}>
						<Store name={store.name} address={store.address}/>
					</li>
				)
			}
		</ul>
	}
}

class Home extends React.PureComponent {
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

	_readStoreAt(address) {
		const storeContract = contract(StoreContract)
		storeContract.setProvider(this.state.web3.currentProvider)
		return storeContract.at(address).then(store => store.name.call().then(name => ({name, address})))
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

	_createStore() {
		this.state.mallInstance.openStore(this.state.storeName, {
			from : this.state.accounts[0],
			value: this.state.web3.toWei(5, "ether")
		}).then(txHash => {
			return this.state.web3.eth.getTransactionReceiptMined(txHash.tx);
		}).then(x => {
			return this._updateStores()
		})
	}

	render() {
		return (
			<div className="pure-g">
				<div className="pure-u-1-1">
					<h1>Create a store</h1>
					<input placeholder="Store name"
					       onChange={e => this.setState({storeName: e.target.value})}
					       value={this.state.storeName}/>
					<button onClick={() => this._createStore()}
					        disabled={!this.state.storeName || this.state.storeName.length === 0}>
						Create!
					</button>
					<h1>Available stores</h1>
					<StoreList stores={this.state.stores}/>
				</div>
			</div>
		);
	}
}

export default class App extends React.PureComponent {
	render() {
		return (
			<Router>
				<div className="App">
					<nav className="navbar pure-menu pure-menu-horizontal">
						<Link to="/" className="pure-menu-heading pure-menu-link">Market</Link>
					</nav>

					<main className="container">
						<Route exact path="/" component={Home}/>
					</main>
				</div>
			</Router>
		)
	}
}