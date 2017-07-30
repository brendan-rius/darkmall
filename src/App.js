import React from 'react'

import './App.css'


import {connect} from "react-redux"
import {Link, Route, BrowserRouter as Router} from "react-router-dom"
import Home from "./containers/Home"
import {Nav, Navbar, NavbarBrand, NavItem, NavLink} from "reactstrap"
import Stores from "./containers/Stores"
import RootActions from "./redux/RootRedux"

import createBrowserHistory from 'history/createBrowserHistory'

const customHistory = createBrowserHistory()

// create our store
const key = `
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: BCPG C# v1.6.1.0

mQENBFl542ABCADTwo3I5aXfcvSLbqZgCjqhau/ZvGyzBfwKUy17kEAXqY9nEZG9
QbYtxLqN2zuJdKMrs2RnAHTTIMPfw7sy1dw4pI0j77kPvsKxmFfkreDLW9n7GulT
WubpGAvGBjwBjHbh9NHXj7FXAUAR9m7IgfkEx02uDIUSEbF6Wrg12o0B7sHHcYs1
Ay1XniAsc0pSSfBL7Y/AHvOTVRW8GugvTA0PWYmu8FmnmfRdWCOgO1a2kuBJguSv
eA7YWqn5FJdUIx796o0MftxTHJnmUTecxBcoujWhZLlHcYTrXzHc/eFjngECQ1Zy
DGalP6fgivwRoiHyzhENBk5+ZNbEqe4xay/5ABEBAAG0AIkBHAQQAQIABgUCWXnj
YAAKCRCATtn/hx+VDIk7B/9Y5ARnbxaFzMUsV3QpK19td4QlFDfVo4bDqw8TVhfg
4twFZ8gbo1K8n83I5sTgFWmPyzn7+DcfoypoNZy03eSRNs56X0VONT7rURXriDfu
IHVvlcCpaRctGgJhV+WdglaXIuV4fx9t994wmq1g0fiF4vlazTCuODPwgbA938xc
g1zcMf0O8KbHPXE7pMJaktgSZgFDwaJyBL/cUJwuKcxKj1b5Z/adhJY83N/DCnf1
nEn5kn1mdfqBafbUSeoepVOFFgv6NuQNDdiwS1NJPVRvq5iG+a2dNwfmQN722mdC
8sX3WzKkdLc4kAlJb0KCuseyLpayQIthV+P6FmHk5Wm8
=4t4J
-----END PGP PUBLIC KEY BLOCK-----
`

class App extends React.PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			mallInstance: null,
			mallBalance : 0,
			accounts    : [],
			stores      : [],
			web3        : null,
			storeName   : '',
			userAddress : null,
		}
	}

	componentWillMount() {
		this.props.startup()
	}

	_createStore(name) {

	}

	_createProduct(store, name, price, available) {
		store.instance.addProduct.sendTransaction(name, available, price, {
			from: this.state.accounts[0],
		})
	}

	_buyProduct(store, product, message) {
		store.instance.buyProduct.sendTransaction(product.id, message, {
			from : this.state.accounts[0],
			value: product.price,
		})
	}

	_rateOrder(store, order, rating, comment) {
		console.log(store, order, rating, comment)
		store.instance.rateOrder.sendTransaction(order.id, rating, comment, {
			from: this.state.accounts[0],
		})
	}

	_renderRoutesOrLoading() {
		if (this.props.isLoading) return <h1>Loading...</h1>
		else return (
			<main>
				<Route exact path="/" component={Home}/>
				<Route path="/s" component={Stores}/>
			</main>
		)
	}

	render() {
		return (
			<Router history={customHistory}>
				<div>
					<Navbar toggleable>
						<NavbarBrand tag={Link} to="/">DarkMall</NavbarBrand>

						<Nav className="ml-auto" navbar>
							<NavItem>
								<NavLink tag={Link} to="/s/">Browse shops</NavLink>
							</NavItem>
						</Nav>
					</Navbar>

					{this._renderRoutesOrLoading()}
				</div>
			</Router>
		)
	}
}

const mapStateToProps = state => ({
	isLoading: state.root.web3Loading,
})


const mapDispatchToProps = dispatch => ({
	startup: () => dispatch(RootActions.startup())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)