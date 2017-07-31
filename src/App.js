import React from 'react'

import './App.css'
import PropTypes from 'prop-types'

import {connect} from "react-redux"
import {Link, Route, BrowserRouter as Router} from "react-router-dom"
import Home from "./containers/Home"
import {Nav, Navbar, NavbarBrand, NavItem, NavLink} from "reactstrap"
import Stores from "./containers/Stores"
import RootActions from "./redux/RootRedux"

import createBrowserHistory from 'history/createBrowserHistory'

const customHistory = createBrowserHistory()

class App extends React.PureComponent {
	static propTypes = {
		isLoading: PropTypes.bool,
		startup  : PropTypes.func,
	}

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


	_renderRoutesOrLoading() {
		if (this.props.isLoading) return <h1>Loading...</h1>
		else return (
			<main>
				<Route path="/" component={Home} exact/>
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
								<NavLink tag={Link} to="/s/">Browse all stores</NavLink>
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