import React from 'react'
import PropTypes from 'prop-types'
import {Link} from "react-router-dom"
import {Button, Card, CardBlock, CardHeader, CardText, Col, Container, Row} from "reactstrap"
import {connect} from "react-redux"

class Home extends React.PureComponent {
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

	_renderMyStores() {
		const renderStores = (stores) => <ul>{stores.map((store, i) => <li key={i}>{store.name}</li>)}</ul>
		return (
			<Card>
				<CardHeader>My stores</CardHeader>
				<CardBlock>
					{
						this.props.stores.length === 0
							? <CardText>You do not own a store</CardText>
							: renderStores(this.props.stores)
					}
					<Button tag={Link} to="/s/create">Open a store</Button>
				</CardBlock>
			</Card>
		)
	}

	render() {
		return (
			<Container>
				<Row>
					<Col>
						<Card>
							<CardHeader>My orders</CardHeader>
							<CardBlock>
								<CardText>You have not placed any order yet</CardText>
								<Button tag={Link} to="/s">Browse stores</Button>
							</CardBlock>
						</Card>
					</Col>
					<Col>
						{this._renderMyStores()}
					</Col>
				</Row>
			</Container>
		)
	}
}

const mapStateToProps = state => ({
	stores     : state.root.stores,
	mallBalance: state.root.mallBalance,
})

const mapDispatchToProps = dispatch => ({
	createStore: () => null
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)