var LockContract = artifacts.require("./LockContract.sol");

module.exports = async (deployer) => {
  await deployer.deploy(LockContract, false, 5, 42);
};
