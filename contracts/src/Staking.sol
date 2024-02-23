// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingContract is Ownable {
    IERC20 public stakingToken;
    uint256 public rewardRate; // Reward rate per second
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    // mapping(address => uint256) public userRewardPerTokenPaid;
    // mapping(address => uint256) public rewards;
    // mapping(address => uint256) public stakedAmounts;
    // mapping(address => uint256) public lastStakeTimes;

    // event Staked(address indexed user, uint256 amount);
    // event Unstaked(address indexed user, uint256 amount);
    // event RewardPaid(address indexed user, uint256 reward);
    // event RewardAdded(uint256 reward);

    constructor(IERC20 _stakingToken, uint256 _rewardRate) Ownable(msg.sender) {
        stakingToken = _stakingToken;
        rewardRate = _rewardRate;
        lastUpdateTime = block.timestamp;
    }

    // function stake(uint256 amount) public {
    //     require(amount >   0, "StakingContract: Cannot stake  0");
    //     stakingToken.transferFrom(msg.sender, address(this), amount);
    //     stakedAmounts[msg.sender] = stakedAmounts[msg.sender].add(amount);
    //     lastStakeTimes[msg.sender] = block.timestamp;
    //     _updateReward(msg.sender);
    //     emit Staked(msg.sender, amount);
    // }

    // function unstake(uint256 amount) public {
    //     require(amount >   0, "StakingContract: Cannot unstake  0");
    //     require(stakedAmounts[msg.sender] >= amount, "StakingContract: Insufficient staked amount");
    //     stakedAmounts[msg.sender] = stakedAmounts[msg.sender].sub(amount);
    //     stakingToken.transfer(msg.sender, amount);
    //     _updateReward(msg.sender);
    //     emit Unstaked(msg.sender, amount);
    // }

    // function _updateReward(address account) internal {
    //     if (stakedAmounts[account] ==   0) {
    //         return;
    //     }
    //     uint256 reward = earned(account);
    //     rewards[account] = rewards[account].add(reward);
    //     rewardPerTokenStored = rewardPerTokenStored.add(reward.mul(1e18).div(stakedAmounts[account]));
    // }

    // function earned(address account) public view returns (uint256) {
    //     return stakedAmounts[account].mul(rewardPerTokenStored.sub(userRewardPerTokenPaid[account])).div(1e18).add(rewards[account]);
    // }

    // function getReward() public {
    //     _updateReward(msg.sender);
    //     uint256 reward = rewards[msg.sender];
    //     if (reward >   0) {
    //         rewards[msg.sender] =   0;
    //         stakingToken.transfer(msg.sender, reward);
    //         emit RewardPaid(msg.sender, reward);
    //     }
    // }

    // function exit() external {
    //     // unstake(stakedAmounts[msg.sender]);
    //     getReward();
    // }

    // function notifyRewardAmount(uint256 reward) external onlyOwner {
    //     require(block.timestamp >= lastUpdateTime, "StakingContract: Previous reward period must be complete before updating the reward");
    //     if (block.timestamp >= lastUpdateTime) {
    //         lastUpdateTime = block.timestamp;
    //     }
    //     rewardPerTokenStored = rewardPerTokenStored.add(reward.mul(1e18).div(stakedAmounts[msg.sender]));
    //     lastStakeTimes[msg.sender] = block.timestamp;
    //     emit RewardAdded(reward);
    // }
}
