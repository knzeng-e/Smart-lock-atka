import getWeb3 from "../getWeb3";
import React, { useState, useEffect} from 'react';
import LockContract from "../contracts/LockContract.json";


const useWeb3 = () => {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        const web3Connexion = async () => {
            try {
                // Get network provider and web3 instance.
                const _web3 = await getWeb3();
          
                // Use web3 to get the user's accounts.
                const _accounts = await _web3.eth.getAccounts();
          
                // Get the contract instance.
                const networkId = await _web3.eth.net.getId();
                const deployedNetwork = LockContract.networks[networkId];
                const instance = new _web3.eth.Contract(
                    LockContract.abi,
                  deployedNetwork && deployedNetwork.address,
                );
          
                // Set web3, accounts, and contract to the state, and then proceed with an
                setWeb3(_web3);
                setContract(instance);
                setAccounts(_accounts);
              } catch (error) {
                // Catch any errors for any of the above operations.
                alert(
                  `Failed to load web3, accounts, or contract. Check console for details.`,
                );
                console.error(error);
              }
        }
        web3Connexion();
    }, [])
    return [web3, accounts, contract];
}

export default useWeb3
