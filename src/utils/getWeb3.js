import Web3 from 'web3'

let getWeb3 = new Promise(function (resolve, reject) {
	// Wait for loading completion to avoid race conditions with web3 injection timing.
	window.addEventListener('load', function () {
		var results
		var web3 = window.web3

		// Checking if Web3 has been injected by the browser (Mist/MetaMask)
		if (typeof web3 !== 'undefined') {
			// Use Mist/MetaMask's provider.
			web3 = new Web3(web3.currentProvider)

			results = {
				web3: web3
			}

			console.log('Injected web3 detected.');

		} else {
			// Fallback to localhost if no web3 injection.
			var provider = new Web3.providers.HttpProvider('http://localhost:8545')

			web3 = new Web3(provider)

			results = {
				web3: web3
			}

			console.log('No web3 instance injected, using Local web3.');

		}

		results.web3.eth.getTransactionReceiptMined = (txHash, interval = 500) => {
			const transactionReceiptAsync = (txHash, resolve, reject) => {
				results.web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
					if (error) {
						reject(error);
					} else {
						if (receipt == null) {
							setTimeout(function () {
								transactionReceiptAsync(txHash, resolve, reject);
							}, interval);
						} else {
							resolve(receipt);
						}
					}
				});
			};

			if (Array.isArray(txHash)) {
				var promises = [];
				txHash.forEach(function (oneTxHash) {
					promises.push(results.web3.eth.getTransactionReceiptMined(oneTxHash, interval));
				});
				return Promise.all(promises);
			}
			else {
				return new Promise(function (resolve, reject) {
					transactionReceiptAsync(txHash, resolve, reject);
				});
			}
		};

		resolve(results)
	})
})

export default getWeb3
