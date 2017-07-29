import {createReducer, createActions} from 'reduxsauce'
import Immutable from 'seamless-immutable'

const {Types, Creators} = createActions({
	// User & system actions
	startup: null,

	// Reducer actions
	setWeb3Loading  : ['loading'],
	setMallContract : ['contract'],
	setStoreContract: ['contract'],
	setAddress      : ['address'],
	setBalance      : ['balance'],
	setStores       : ['stores'],
})

export const RootTypes = Types
export default Creators

export const INITIAL_STATE = Immutable({
	web3Loading  : false,
	mallContract : null,
	storeContract: null,
	address      : null,
	stores       : [],
	balance      : 0,
})

export const setWeb3Loading = (state, {loading}) => state.merge({web3Loading: loading})
export const setMallContract = (state, {contract}) => state.merge({mallContract: contract})
export const setStoreContract = (state, {contract}) => state.merge({storeContract: contract})
export const setAddress = (state, {address}) => state.merge({address})
export const setBalance = (state, {balance}) => state.merge({balance})
export const setStores = (state, {stores}) => state.merge({stores})

export const reducer = createReducer(INITIAL_STATE, {
	[Types.SET_WEB3_LOADING]  : setWeb3Loading,
	[Types.SET_MALL_CONTRACT] : setMallContract,
	[Types.SET_STORE_CONTRACT]: setStoreContract,
	[Types.SET_ADDRESS]       : setAddress,
	[Types.SET_BALANCE]       : setBalance,
	[Types.SET_STORES]        : setStores,
})