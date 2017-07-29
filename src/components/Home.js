import React from 'react'
import PropTypes from 'prop-types'
import {Link} from "react-router-dom";
import {Button, Card, CardBlock, CardHeader, CardText, Col, Container, Row} from "reactstrap";

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
						<Card>
							<CardHeader>My stores</CardHeader>
							<CardBlock>
								<CardText>You do not own a store</CardText>
								<Button  tag={Link} to="/s/create">Open a store</Button>
							</CardBlock>
						</Card>
					</Col>
				</Row>
			</Container>
		);
	}
}
