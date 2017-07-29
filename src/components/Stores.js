import React from 'react'
import PropTypes from 'prop-types'
import {Link, Route} from "react-router-dom";
import Store from "./Store";
import {Container} from "reactstrap";

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

class CreateStore extends React.PureComponent {
	render() {
		return (
			<Container>
				<h1>Create a store</h1>
			</Container>
		)
	}
}

export default class Stores extends React.PureComponent {
	render() {
		return (
			<div>
				<Route path="/" component={StoreList}/>
				<Route path="/create" component={CreateStore}/>
				<Route path="/:address"
				       render={props => {
					       const store = this.state.stores.find(store => store.address === props.match.params.address)
					       return <Store
						       store={store}
						       web3={this.state.web3}
						       userAddress={this.state.userAddress}
						       createProduct={(name, price, available) => this._createProduct(store, name, price, available)}
						       buyProduct={(product, message) => this._buyProduct(store, product, message)}
						       rateOrder={(order, rating, comment) => this._rateOrder(store, order, rating, comment)}/>
				       }}
				/>
			</div>
		)
	}
}