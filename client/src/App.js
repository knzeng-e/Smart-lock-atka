import "./App.css";
import useWeb3 from './hooks/useWeb3';
import 'semantic-ui-css/semantic.min.css';
import React, { useState, useEffect } from "react";
import { Container, Segment, Form, Button } from 'semantic-ui-react';

//Contract Address: 0xA1f26069BF156f03B0133bBFd3169ba545d1D8e2

const App = () => {
  let watch;
  const [amount, setAmount] = useState(0);
  const [blocks, setBlocks] = useState(0);
  const [isStakePoolEmpty, setPoolState] = useState(false);
  const [stakers, setStakers] = useState([])
  const [web3, accounts, contractInstance] = useWeb3();
  const [minimalStake, setMinimalStake] = useState(0);

  useEffect(() => {
    const getMinimalStake = async () => {
      if (contractInstance) {
        const minStake = await contractInstance.methods.minimalStake().call()
        setMinimalStake(minStake);
      }
    }
    getMinimalStake();
  }, [contractInstance])

  const checkRefund = async () => {
    let _stakers = stakers;
    let currentBlock = await web3.eth.getBlockNumber();
    console.log(`[bloc ${currentBlock}] Tableau de stakers: `, stakers)
    stakers.map(async (currentStaker) => {
      if (stakers.includes(currentStaker)) {
        let blockNumber = await contractInstance.methods.recordingBlocks(currentStaker).call();
        let nbBlocs = await contractInstance.methods.nbBlocks(currentStaker).call();

        if (blockNumber + nbBlocs >= currentBlock) {
          //Try to refund the current address
          const isSuccess = await contractInstance.methods.refundEther(currentStaker).send({ from: accounts[0] })
          console.log("Is refund ==> ", isSuccess);
          if (isSuccess.status === true) {
            console.log("Funds have been successfully unlocked ==> ", isSuccess);
            //Remove the address from the stakers
            // setStakers(stakers.filter(_staker => _staker !== currentStaker));
            _stakers = (stakers.filter(_staker => _staker !== currentStaker));
            if (_stakers.length === 0) {
              setPoolState(true);
            }
            setStakers(_stakers);
          }
        }
      }
    })
  }

  const stakeEther = () => {
    const _amount = web3.utils.toWei(amount);
    contractInstance.methods.stake(blocks).send({ from: accounts[0], value: _amount })
    if (!stakers.includes(accounts[0])) {
      //Add the current address to the stakers
      setStakers([...stakers, accounts[0]])
    }
  }

  const refundEther = async () => {
    const isSuccess = await contractInstance.methods.refundEther(accounts[0]).send({ from: accounts[0] });
    console.log("Refund ===> ", isSuccess)
  }


  const handleAmount = (e) => {
    e.preventDefault();
    setAmount(e.target.value)

  }

  const handleBlocks = (e) => {
    e.preventDefault();
    setBlocks(e.target.value)
  }

  // const runWatcher = () => {
  useEffect(() => {
    if (isStakePoolEmpty) {
      clearInterval(watch);
    }
  }, [isStakePoolEmpty]);

  useEffect(() => {
    if(web3){
      watch = setInterval(() => {
        checkRefund();
      }, 5000)
    }
    console.log('Stacking pool set !')
  }, [web3])


  if (!web3)
    return <div>Loading Web3, accounts, and contract...</div>;
  return (
    <div className="App">
      {/* {runWatcher()} */}
      <Segment color='blue' inverted><h1>Lock Ethers</h1></Segment>
      <Container>
        <div className="StakingForm">

          <Segment placeholder>
            <Form onSubmit={stakeEther}>
              <Form.Input
                required
                type="text"
                placeholder={`amount (min = ${minimalStake} ETH)`}
                onChange={handleAmount}
              />
              <Form.Input
                // label="Enter the number of blocks: "
                required
                type="text"
                placeholder={`number of blocks`}
                onChange={handleBlocks}
              />
              <div className="StackingButton">
                <div className="stake">
                  <Button color='blue' type='submit'> Stake </Button>
                </div>
                <div className="refund">
                  <Form.Button color='blue' onClick={refundEther}> Refund </Form.Button>
                </div>
              </div>
            </Form>
          </Segment>
        </div>

      </Container>


    </div>
  );
}

export default App;
