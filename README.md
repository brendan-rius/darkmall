# Free Market (DarkMall)

Here is a non-comprehensive proof-of-concept of what a **decentralized market** running on the Ethereum blockchain
could look like. This is for educational purpose only and is purposedly incomplete.

## About the market

The market

 - Would not need (although it is recommended) to use a VPN/TOR as their IP address would only be visible by one or a few supposedly trustworthy Ethereum nodes when they make a trasaction
 - Users would not need to credit their account by depositing cryptocurrencies in the wallet first (so it cannot be seized by any third-party in case of an exit scam, or law enforcement seizure)
 - Users would not even need an account at all (just an Ether wallet)
 - There is no risk of the market being taken down as law enforcement would have to stop the whole Ethereum network
 - There is no risk of exit scam for the code source is openly available, auditable, and cannot be altered on stop without controlling most of the Ethereum nodes
 - There could be multiple different frontends developed by anybody (with some of them hiding certain things they do not want to be sold), making it hard to stop a particular frontends
 - Frontends do not need any backend other than the Ethereum contract, thus they can be hosted statically locally, or in a permanent fashion (such as with IPFS)
 - Could be easily accessible via the Mist Browser or via Metamask
 
### Implemented features

 - Anybody can create a **store** by paying a price to the **mall**. This could be free, but having to pay ensure people do not create a lot of scam stores easily.
 - The mall is owned by someone who then gets 10% of all the proceedings of each store
 - A store owner can create products freely in his store
 - Anybody can list all stores of the mall, and all products of a store
 - Anybody can buy anything from a store
 - When somebody bought an item, he can rate the item with a 0-10 rating and a comment
 - A vendor can rate a buyer with a 0-10 rating
 - When buying an item, a buyer can send an encrypted message with the public key of a store. This is useful to transmit a postal address to ship the good to for example.
 - Vendors can withdraw their money
 - Mall owner can withdraw his money
 
### Missing features

 - Buyer can edit a product (~5 lines of code to write)
 - Conversation between buyer/seller instead of a single message from the buyer to the seller
 - Seller can refuse an order and reimburse the buyer
 - Seller can mark an order as finalized
 - Create an escrow system. A good one is probably one is described a bit after.
 - Create categories and sub-categories with a voting system (vendors could vote to open categories and they would have more votes if they sold a lot of products)
    

### Possible escrow system

First, it is important to understand that seller have an incentive to behave in the best way possible to make money on the long term.
Buyers do not care as they often want to buy something and then forget about everything.

1) The buyer can open a complaint for example "I have not received my product"
2) If buyer and seller find a solution together, then everything is fine, and buyer closes his complaint
3) If no agreement is reached, seller gets ALL the money back, and buyer is f**ed but the seller will be marked as having had 1 complaint, which will be penalized in the frontend

The frontend should make it obvious to be wary of vendors with a lot a complaints.
 
## Run the code

Make sure you have Truffle installed.

Run a blockchain locally for testing:

```
testrpc
```

Deploy the contracts to your blockchain:

```
truffle deploy
```

Run the market frontend:

```
npm run start
```

Navigate to `localhost:3000` and use Metamask for transactions. You should import account with the private keys `testrpc` gave you.

The frontend is not ideal and does not implement a lot of features but I can't provide with a full implementation responsibly. Get to work and code a bit you lazy ass.
Another uglier version with more features is available at commit `c2dbcb8630810395dd2aabf5fee77e0d24ac0053`

## Contribute

Pull requests welcome.

## How to become very rich very fast

 - Deploy this market with a great frontend stored on IPFS.
 - Create an ICO that gives token holders right to get a portion of your 10% cut with the mall (iIf you are smart, you should be able to raise 30-150M (tell the investors you need to pay for public audit. but do it for real it's important)
Keep some tokens for yourself)
 - Get the money out, transform it to Monero for security, then sell it through your offshore company's GDAX account.
 - You become the new Pablo Escobar and improve public health without moving from your couch
 - You spend your life scrade of law enforcement and struggle getting your money out
 - You end up convicted with 2 life-terms in prison, or you hang yourself in a Thai jail cell
 
Seriously, don't do that.

If you do, I do not have anything to do with it obviously.
 
Here are two cool logos that could be used for such a project. These are free. Consider it a gift to the community.
All credit goes to the designer wants to stay anonymous.

I strongly discourage deploying this kind of market to the Ethereum blockchain without proper control over what you are doing.
I am not responsible for what you do.

![Example logos](Shroom2.svg?raw=true "Example logos")


