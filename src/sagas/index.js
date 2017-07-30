import {all, takeEvery} from 'redux-saga/effects'
import {buyProduct, createProduct, createStore, onWindowLoad, rateOrder, startup} from "./RootSagas"
import {RootTypes} from '../redux/RootRedux'
import {eventChannel} from "redux-saga"

const windowEventChannel = eventChannel(emitter => {
	const onLoad = () => emitter('LOAD')

	window.addEventListener('load', onLoad)

	return () => window.removeEventListener('load', onLoad)
})

export default function * root() {
	yield all([
		takeEvery(RootTypes.STARTUP, startup),
		takeEvery(RootTypes.CREATE_STORE, createStore),
		takeEvery(RootTypes.CREATE_PRODUCT, createProduct),
		takeEvery(RootTypes.BUY_PRODUCT, buyProduct),
		takeEvery(RootTypes.RATE_ORDER, rateOrder),
		takeEvery(RootTypes.STARTUP, startup),
		takeEvery(windowEventChannel, onWindowLoad)
	])
}