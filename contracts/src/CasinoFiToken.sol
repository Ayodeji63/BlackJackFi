// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract CasinoFiToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 3e8 * 10**18; // 21 million tokens
    uint256 public constant EARLY_ACCESS_SUPPLY = (5 * MAX_SUPPLY) / 100; // 5% for early users
    uint256 public constant TREASURY_SUPPLY = (55 * MAX_SUPPLY) / 100; // 55% for treasury
    uint256 public constant DEVELOPER_REWARDS_SUPPLY = (4 * MAX_SUPPLY) / 100; // 4% for developers
    uint256 public constant STAKING_REWARDS_SUPPLY = (1 * MAX_SUPPLY) / 100; // 1% for staking rewards
    uint256 public constant BUYBACK_AND_BURN_SUPPLY = (1 * MAX_SUPPLY) / 100; // 1% for buyback and burn
    uint256 public constant EARLY_ACCESS_AMOUNT = 100e18;
    address public immutable i_owner;


    bool public earlyAccessEnabled = true;

    constructor(address owner) ERC20("CasinoFiToken", "CFI") Ownable(owner) {
        i_owner = owner;
          // Mint initial supplies
        _mint(owner, EARLY_ACCESS_SUPPLY);
        _mint(address(this), TREASURY_SUPPLY);
        _mint(owner, DEVELOPER_REWARDS_SUPPLY);

        // Mint additional supplies
        _mint(address(this), STAKING_REWARDS_SUPPLY);
        _mint(address(this), BUYBACK_AND_BURN_SUPPLY);
    }

    function mintForEarlyUsers() external {
        require(earlyAccessEnabled, "Early access has ended");

        uint256 remainingSupply =  balanceOf(owner()) - DEVELOPER_REWARDS_SUPPLY;
        require(EARLY_ACCESS_AMOUNT <= remainingSupply, "Exceeds available allocation");

        _mint(msg.sender, EARLY_ACCESS_AMOUNT);
    }

    function endEarlyAccess() external onlyOwner {
        earlyAccessEnabled = false;
    }

    // Other functions...

    // In case you want to transfer tokens allocated for developers
    function transferDevelopersAllocation(address to, uint256 amount) external onlyOwner {
        require(amount <= DEVELOPER_REWARDS_SUPPLY, "Exceeds developers allocation");
        _transfer(owner(), to, amount);
    }
}