import Reactotron from 'reactotron-react-js'
import {reactotronRedux} from 'reactotron-redux'
import sagaPlugin from 'reactotron-redux-saga'


Reactotron
	.configure({name: 'Dark Mall'})
	.use(reactotronRedux())
	.use(sagaPlugin())
	.connect()

// Let's clear Reactotron on every time we load the app
Reactotron.clear()