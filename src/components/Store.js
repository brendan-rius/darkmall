import React from 'react'
import PropTypes from 'prop-types'
import OpenPGP, {key} from 'openpgp'
import web3 from 'web3'
import {Container} from "reactstrap"

export default class Store extends React.PureComponent {
	static propTypes = {
		store        : PropTypes.shape({
			owner    : PropTypes.string,
			name     : PropTypes.string,
			address  : PropTypes.string,
			publicKey: PropTypes.string,
			products : PropTypes.arrayOf(PropTypes.shape({
				id   : PropTypes.number,
				name : PropTypes.string,
				price: PropTypes.number,
			})),
			orders   : PropTypes.arrayOf(PropTypes.shape({
				id     : PropTypes.number,
				buyer  : PropTypes.string,
				product: PropTypes.shape({
					id   : PropTypes.number,
					name : PropTypes.string,
					price: PropTypes.number,
				}),
				price  : PropTypes.number,
				message: PropTypes.string,
			}))
		}),
		createProduct: PropTypes.func.isRequired,
		buyProduct   : PropTypes.func.isRequired,
		rateOrder    : PropTypes.func.isRequired,
		userAddress  : PropTypes.string,
	}

	constructor(props) {
		super(props)
		this.state = {
			productName : '',
			productPrice: undefined,
			rating      : 10,
		}
	}

	_buyProduct(product) {
		const message = prompt("Message for the vendor")

		const options = {
			data      : message,
			publicKeys: key.readArmored(this.props.store.publicKey).keys,
		}

		OpenPGP.encrypt(options).then(ciphertext => this.props.buyProduct(product, ciphertext.data))
	}

	_renderAddProduct() {
		if (this.props.userAddress !== this.props.store.owner) return
		return (
			<div>
				<h2>Add product</h2>
				<input placeholder="Product name"
				       onChange={e => this.setState({productName: e.target.value})}
				       value={this.state.productName}/>
				<input type="number"
				       placeholder="Product price (ETH)"
				       onChange={e => this.setState({productPrice: e.target.value})}
				       value={this.state.productPrice}/>
				<button
					onClick={() => this.props.createProduct(this.state.productName, web3.toWei(this.state.productPrice, "ether"), true)}
					disabled={this.state.productName.length === 0 || this.state.productPrice === undefined}>
					Create!
				</button>
			</div>
		)
	}

	_rate(order) {
		const comment = prompt('Comment')
		this.props.rateOrder(order, this.state.rating, comment)
		this.setState({rating: 10})
	}

	_renderOrderBook() {
		if (this.props.userAddress !== this.props.store.owner) return

		return (
			<div>
				<h2>Order book</h2>
				<ul>
					{
						this.props.store.orders.map(order =>
							<li key={order.id}>
								{`${order.buyer} bought ${order.product.name} for ${web3.fromWei(order.product.price)} ETH. Message is `}
								<pre>{order.message}</pre>
								<input type="number" min="0" max="10" step="1"
								       onChange={e => this.setState({rating: e.target.value})}
								       value={this.state.rating}/>
								<button onClick={() => this._rate(order)}>Rate</button>
							</li>)
					}
				</ul>
			</div>
		)
	}

	render() {
		if (!this.props.store) return <span>Loading...</span>
		return (
			<Container>
				<h1>{this.props.store.name}</h1>
				{this._renderAddProduct()}
				<h2>Products</h2>
				<ul>
					{
						this.props.store.products.map(product =>
							<li key={product.id}>{`${product.name} - ${web3.fromWei(product.price)} ETH - Rating: ${product.rating} (${product.nRatings})`}
								<button onClick={() => this._buyProduct(product)}>Buy</button>
							</li>)
					}
				</ul>
				{this._renderOrderBook()}
			</Container>
		)
	}
}
