// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
// contracts/lib/openzeppelin-contracts/contracts/utils/math/Math.sol
import "./CasinoFiToken.sol";
contract Staking {
    CasinoFiToken casinoToken;

    mapping (address => uint) staked;
    mapping (address => uint) stakedFromTs;
   constructor (address tokenAddress) {
    casinoToken = CasinoFiToken(tokenAddress);
   }

   function stake(uint amount) external {
    require(amount > 0, "amount is <= 0");
    require(casinoToken.balanceOf(msg.sender) >= amount, "balance is <= amount");
    casinoToken.transfer(address(this), amount);
    if (staked[msg.sender] > 0) {
        claim();
    }

    stakedFromTs[msg.sender] = block.timestamp;
    staked[msg.sender] += amount;
   }

   function unstake(uint256 amount) external {
    require(amount > 0, "amount is <=0");
    require(staked[msg.sender] >= amount, "amount is > staked");
    claim();
    staked[msg.sender] -= amount;
    casinoToken.transfer(msg.sender, amount);
   }

   function claim () public {
    require(staked[msg.sender] > 0, "staked is <= 0");
    uint256 secondStaked = block.timestamp - stakedFromTs[msg.sender];
    uint256 rewards = staked[msg.sender] * secondStaked / 3.154e7;
    casinoToken.transfer(msg.sender, rewards);
    stakedFromTs[msg.sender] = block.timestamp;
   }
}
