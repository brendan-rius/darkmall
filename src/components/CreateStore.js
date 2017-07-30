import React from 'react'
import {Button, Container, Input} from "reactstrap"
import PropTypes from 'prop-types'

export default class CreateStore extends React.PureComponent {
	static propTypes = {
		createStore: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)
		this.state = {
			name     : '',
			publicKey: '',
		}
	}

	_createStore() {
		this.props.createStore(this.state.name, this.state.publicKey)
		this.setState({name: '', publicKey: ''})
	}

	render() {
		return (
			<Container>
				<h1>Create a store</h1>
				<Input value={this.state.name} onChange={e => this.setState({name: e.target.value})}/>
				<Input type="textarea" value={this.state.publicKey}
				       onChange={e => this.setState({publicKey: e.target.value})}/>
				<Button onClick={() => this._createStore()}>Create</Button>
			</Container>
		)
	}
}