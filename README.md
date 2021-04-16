# Smart-lock-atka
A simple implementation of a simplified lock smart-contract and management interface.
This project runs on the rinkeby testnet. You can use a metamask plugin to connect to your wallet and interact with the smartcontract from the client.

#### STEP 0: Prerequesites: 
* npm (node v12+)
* Metamask
* Truffle (only if you want to deploy the smart contract. Install it by running this command on your terminal --> `npm install -g truffle`)

### STEP 1: get the repository
`git clone https://github.com/knzeng-e/Smart-lock-atka.git`
### STEP 2: Setting the project (Only if you need to redeploy the smartcontract to have admin rights on it. Otherwise jump to step 5)
* create a file named `.env`. In this file, put all sensible informations you need to keep secret 
* create an infura endpoint api (https://infura.io/) and save it into your .env file under the variable `INFURA_LINK`
> `INFURA_LINK=https://rinkeby.infura.io/v3/<infura_api>`
* Save your privateKey into you .env file under the variable `PRIV_KEY`

>`PRIV_KEY=<your private key>`
>
### STEP 3: install dependencies at the root of the project
* npm install

### STEP 4: compile and deploy the smartcontract  
> `truffle deploy --network rinkeby --skip-dry-run --reset`

### STEP 5: client initialization
* cd client
* npm install 
* npm start
