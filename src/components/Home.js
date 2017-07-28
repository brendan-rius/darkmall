import React from 'react'
import PropTypes from 'prop-types'
import {Link} from "react-router-dom";

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
						<Link to={`/s/${store.address}`}
						      className="pure-menu-heading pure-menu-link">{store.name}</Link>
					</li>
				)
			}
		</ul>
	}
}

export default class Home extends React.PureComponent {
	static propTypes = {
		mallBalance: PropTypes.number,
		createStore: PropTypes.func,
		stores     : PropTypes.arrayOf(PropTypes.shape({
			name   : PropTypes.string,
			address: PropTypes.string,
		}))
	}

	constructor(props) {
		super(props)
		this.state = {
			storeName: '',
		}
	}

	render() {
		return (
			<div className="pure-g">
				<div className="pure-u-1-1">
					<p>Mall balance is : {this.props.mallBalance}</p>
					<h1>Create a store</h1>
					<input placeholder="Store name"
					       onChange={e => this.setState({storeName: e.target.value})}
					       value={this.state.storeName}/>
					<button onClick={() => this.props.createStore(this.state.storeName)}
					        disabled={!this.state.storeName || this.state.storeName.length === 0}>
						Create!
					</button>
					<h1>Available stores</h1>
					<StoreList stores={this.props.stores}/>
				</div>
			</div>
		);
	}
}
