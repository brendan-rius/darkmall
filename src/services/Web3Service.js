import contract from 'truffle-contract'
import MallContractJSON from '../../build/contracts/Mall.json'
import StoreContractJSON from '../../build/contracts/Store.json'
import Web3 from 'web3'

class Web3Service {
	constructor() {
		this.web3 = null
		this.accounts = []

		this.mallContract = contract(MallContractJSON)
		this.storeContract = contract(StoreContractJSON)

		this.mallInstance = null
	}

	setProvider(provider) {
		this.web3 = new Web3(provider)
		this.mallContract.setProvider(provider)
		this.storeContract.setProvider(provider)

		const getAccounts = () => new Promise((resolve, reject) => {
			this.web3.eth.getAccounts((error, accounts) => {
				if (error) reject(error)
				resolve(accounts)
			})
		})

		return getAccounts().then(accounts => {
			this.accounts = accounts
			return this.mallContract.deployed()
		}).then(mallInstance => this.mallInstance = mallInstance)
	}
}

export default new Web3Service()
