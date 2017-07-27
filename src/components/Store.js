import React from 'react'
import PropTypes from 'prop-types'

export default class Store extends React.PureComponent {
	static propTypes = {
		store        : PropTypes.shape({
			name    : PropTypes.string,
			address : PropTypes.string,
			products: PropTypes.arrayOf(PropTypes.shape({
				id   : PropTypes.number,
				name : PropTypes.string,
				price: PropTypes.number,
			})),
			orders  : PropTypes.arrayOf(PropTypes.shape({
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
	}

	constructor(props) {
		super(props)
		this.state = {
			productName : '',
			productPrice: undefined,
		}
	}

	_buyProduct(product) {
		const message = prompt("Message for the vendor");
		this.props.buyProduct(product, message);
	}

	render() {
		if (!this.props.store) return <span>Loading...</span>
		return (
			<div>
				<h1>{this.props.store.name}</h1>
				<h2>Add product</h2>
				<input placeholder="Product name"
				       onChange={e => this.setState({productName: e.target.value})}
				       value={this.state.productName}/>
				<input type="number"
				       placeholder="Product price"
				       onChange={e => this.setState({productPrice: e.target.value})}
				       value={this.state.productPrice}/>
				<button onClick={() => this.props.createProduct(this.state.productName, this.state.productPrice, true)}
				        disabled={this.state.productName.length === 0 || this.state.productPrice === undefined}>
					Create!
				</button>
				<h2>Products</h2>
				<ul>
					{
						this.props.store.products.map(product =>
							<li key={product.id}>{`${product.name} -- $${product.price}`}
								<button onClick={() => this._buyProduct(product)}>Buy</button>
							</li>)
					}
				</ul>
				<h2>Order book</h2>
				<ul>
					{
						this.props.store.orders.map(order =>
							<li key={order.id}>
								{`${order.buyer} bought ${order.product.name} for $${order.product.price}. Message is `}
								<pre>{order.message}</pre>
							</li>)
					}
				</ul>
			</div>
		)
	}
}
