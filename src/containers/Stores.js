import React from 'react'
import PropTypes from 'prop-types'
import {Link, Route} from "react-router-dom"
import Store from "../components/Store"
import {Container} from "reactstrap"
import {connect} from "react-redux"
import web3 from 'web3'
import CreateStore from "../components/CreateStore"
import RootActions from '../redux/RootRedux'

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
		return (
			<Container>
				<h1>Stores</h1>
				<ul>
					{
						this.props.stores.map((store, i) =>
							<li key={store.address}>
								<Link to={`/s/${store.address}`}>{store.name}</Link>
							</li>
						)
					}
				</ul>
			</Container>
		)
	}
}

class Stores extends React.PureComponent {
	render() {
		return (
			<div>
				<Route path="/s" render={props => <StoreList stores={this.props.stores}/> }/>
				<Route path="/s/create" render={props => <CreateStore createStore={this.props.createStore}/>}/>
				<Route path="/s/:address"
				       render={props => {
					       const store = this.props.stores.find(store => store.address === props.match.params.address)
					       return <Store
						       store={store}
						       web3={web3}
						       userAddress={this.props.userAddress}
						       createProduct={(name, price, available) => this.props.createProduct(store, name, price, available)}
						       buyProduct={(product, message) => this.props.buyProduct(store, product, message)}
						       rateOrder={(order, rating, comment) => this.props.rateOrder(store, order, rating, comment)}/>
				       }}
				/>
			</div>
		)
	}
}


const mapStateToProps = state => ({
	stores     : state.root.stores,
	mallBalance: state.root.mallBalance,
	userAddress: state.root.userAddress,
})

const mapDispatchToProps = dispatch => ({
	createProduct: () => null,
	createStore  : (name, publicKey) => dispatch(RootActions.createStore(name, publicKey)),
	buyProduct   : () => null,
	rateOrder    : () => null,
})

export default connect(mapStateToProps, mapDispatchToProps)(Stores)