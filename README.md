# Smart-lock-atka
A simple implementation of a simplified lock smart-contract and management interface.
This project runs on the rinkeby testnet. You can use a metamask plugin to connect to your wallet and interact with the smartcontract from the client.

#### Prerequesites: 
* npm (node v12+)
* Metamask

### get the repository
`git clone`
### Setting the project
* create a file named `.env`. In this file, put all sensible informations you need to keep secret 
* create an infura endpoint api (https://infura.io/) and save it into your .env file under the variable `INFURA_LINK`
> `INFURA_LINK=https://rinkeby.infura.io/v3/<infura_api>`
* Save your privateKey into you .env file under the variable `PRIV_KEY`

>`PRIV_KEY=<your private key>`

### client initialization
* cd client
* npm install 
* npm start
