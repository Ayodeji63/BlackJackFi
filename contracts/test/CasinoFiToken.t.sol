// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Test} from "forge-std/Test.sol";
import {CasinoFiToken} from "../src/CasinoFiToken.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CasinoFiTokenTest is Test {

    CasinoFiToken public casinoFiToken;
    address public OWNER = makeAddr("owner");
    address public PLAYER1 = makeAddr("player1");
    uint256 public EARLY_ACCESS_REWARD = 100e18;


    function setUp () public {
        casinoFiToken = new CasinoFiToken(OWNER);
    }

    function test_owner_balance_is_greater_than_zero() public view {
      uint256 ownerBalance =  IERC20(address(casinoFiToken)).balanceOf(OWNER);
      uint256 totalTokenOwnerHolding = casinoFiToken.DEVELOPER_REWARDS_SUPPLY() + casinoFiToken.EARLY_ACCESS_SUPPLY();
      assert(ownerBalance == totalTokenOwnerHolding);
    }

    function test_tokens_contract_holding_is_correct() public  {
        uint256 contractBalance = IERC20(address(casinoFiToken)).balanceOf(address(casinoFiToken));
        uint256 expectTotalToken = casinoFiToken.STAKING_REWARDS_SUPPLY() + casinoFiToken.BUYBACK_AND_BURN_SUPPLY() + casinoFiToken.TREASURY_SUPPLY();
        assertEq(contractBalance, expectTotalToken);
    }

    function test_can_mint_early_access_token() public  {
        vm.deal(PLAYER1, 1 ether);
        vm.prank(PLAYER1);
        casinoFiToken.mintForEarlyUsers();
        uint256 playertokenBalance = IERC20(address(casinoFiToken)).balanceOf(PLAYER1);
        assert(playertokenBalance == EARLY_ACCESS_REWARD);
    }

 
 

  

}