import {combineReducers} from 'redux'
import rootSaga from '../sagas/index'
import {reducer as RootReducer} from './RootRedux'

import {createStore, applyMiddleware} from 'redux'
import createSagaMiddleware from 'redux-saga'
import Reactotron from 'reactotron-react-js'

function configureStore(rootReducer, rootSaga) {
	const sagaMonitor = Reactotron.createSagaMonitor()
	//const sagaMiddleware = createSagaMiddleware({sagaMonitor})
	const sagaMiddleware = createSagaMiddleware({})


	const createAppropriateStore = () => {
		if (true) return Reactotron.createStore(rootReducer, applyMiddleware(sagaMiddleware))
		else return createStore(rootReducer, applyMiddleware(sagaMiddleware))
	}

	const store = createAppropriateStore()

	sagaMiddleware.run(rootSaga)

	return store
}

export default () => {
	const rootReducer = combineReducers({
		root: RootReducer,
	})

	return configureStore(rootReducer, rootSaga)
}