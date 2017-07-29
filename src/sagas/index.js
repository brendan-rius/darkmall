import {all, takeEvery} from 'redux-saga/effects'
import {onWindowLoad, startup} from "./RootSagas"
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
		takeEvery(windowEventChannel, onWindowLoad)
	])
}