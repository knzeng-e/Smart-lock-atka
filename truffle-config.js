const path = require('path');
require('dotenv').config()

const privKeyRinkeby = process.env.PRIV_KEY
const infuraLink = process.env.INFURA_LINK
const privatekeyProvider = require('truffle-privatekey-provider')

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      port: 8545,
      host: "127.0.0.1",
      network_id: "1337",
    },
    rinkeby: {
      provider: () => {
        return new privatekeyProvider(privKeyRinkeby, infuraLink);
      },
      network_id: 4
    }
  },

  compilers: {
    solc: {
      version: "0.8.1"
    }
  }
};
