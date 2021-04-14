//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;

contract LockContract {

    address contractAdmin;
    bool private multiStaking;
    uint256 public minimalStake;
    uint256 superStakerFreshold;

    //List of all users stakes
    mapping(address => uint256) stakes;
    //Number of blocks for each user's stake
    mapping(address => uint256) public nbBlocks;
    mapping(address => uint256) public recordingBlocks;
    mapping(address => uint256) public lockTimes;
    mapping(address => bool) public isSuperStaker;

    modifier onlyAdmin(){
        require(msg.sender == contractAdmin, "You are not Allowed to perform this action");
        _;
    }

    event StakingRelease(address indexed to, uint256 amount);
    event StakingLocked(address staker, uint amount, uint256 numBlocks);

    constructor(bool _setMultiStake, uint256 _minimalStake, uint256 _superStakerFreshold){
        if (_setMultiStake){
            multiStaking = true;
        }
        minimalStake = _minimalStake;
        contractAdmin = msg.sender;
        superStakerFreshold = _superStakerFreshold;
    }

    function stake(uint256 _nbBlocks) payable external {
        uint256 amount = msg.value;
        address currentStaker = msg.sender;
        require(amount >= minimalStake, "Stake too low");
        if (!multiStaking){
            require(stakes[currentStaker] == 0, "This address is already engaged");
        }
        stakes[currentStaker] += amount;
        nbBlocks[currentStaker] += _nbBlocks;
        if (lockTimes[currentStaker] == 0){
            //Only record the first (oldest) staking time
            lockTimes[currentStaker]  = block.timestamp;
        }
        if (recordingBlocks[currentStaker] == 0){
            //Only record the first (oldest) staking time
            recordingBlocks[currentStaker]  = block.number;
        }
        
        emit StakingLocked(currentStaker, amount, _nbBlocks);
    }

    function setMultiStaking(bool _multiStakeOption) onlyAdmin external {
        require( _multiStakeOption != multiStaking, "The staking option has already the desired value");
        multiStaking = _multiStakeOption;
    }

    function refundEther(address payable _staker) external returns(bool _isSuccess){
        uint256 withdrawAmount = stakes[_staker];
        require(block.number >= recordingBlocks[_staker] + nbBlocks[_staker], "Funds are still at stake");
        require(withdrawAmount != 0, "You have no (more) ether at Stake");
        if (canReceiveToken(_staker)){
            isSuperStaker[_staker] = true;
        }
        stakes[_staker] = 0;
        _staker.transfer(withdrawAmount);
        emit StakingRelease(_staker, withdrawAmount);
        _isSuccess = true;
    }

    function canReceiveToken(address _claimer) internal view returns(bool){
        if (superStakerFreshold <= stakes[_claimer] * (block.timestamp - lockTimes[_claimer])){
            return true;
        }
        return false;
    }

    // function receiveReward(address payable _stakerAddress) external {
    //     require(isSuperStaker[_stakerAddress], "Only superStaker can receive the Reward");
    //     token.safetransfer(_stakerAddress, 1);
    // }
}