// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;
import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {CasinoFiBet} from "../src/CasinoFiBet.sol";
import {CasinoFiToken} from "../src/CasinoFiToken.sol";

contract CasinoFiBetTest is Test {

    CasinoFiBet public casinofiBet;
    CasinoFiToken public casinoFiToken;
    address public OWNER = makeAddr("owner");
    address public PLAYER = makeAddr("player");
    string public tableID = "959ac166-a0d7-45af-92a7-e61f0b4b46b0";
    uint256 public BET_CHIP = 20e18;
    uint256 public constant TABLE_FEE = 5; // 5% tax on win
    uint256 public EARLY_ACCESS_AMOUNT = 100e18;


    function setUp() public {
        casinoFiToken = new CasinoFiToken(OWNER);
        casinofiBet = new CasinoFiBet(address(casinoFiToken), OWNER);
         vm.startPrank(OWNER);
        casinoFiToken.mintCasinoFiBetPool(address(casinofiBet));
        vm.stopPrank();
        
    }

    modifier _setBet {
        vm.startPrank(PLAYER);
        casinoFiToken.mintForEarlyUsers();
        casinoFiToken.approve(address(casinofiBet), BET_CHIP);
        casinofiBet.setBet(tableID, BET_CHIP);
        vm.stopPrank();
        _;
    }

    function test_can_set_betting_chips() public _setBet {
        vm.startPrank(PLAYER);
        uint256 expectedBetChip = casinofiBet.getTotalBetChips(tableID, PLAYER);
        assert(expectedBetChip == BET_CHIP);
        vm.stopPrank();
    }

    function test_casinoFiBet_contract_balance_is_increased() public _setBet {
        vm.startPrank(PLAYER);
        uint256 expectedCasinofiBalance = casinoFiToken.balanceOf(address(casinofiBet));
        assert(expectedCasinofiBalance == BET_CHIP);
        vm.stopPrank();
    }

    function test_player_balance_should_reduce() public _setBet {
        vm.startPrank(PLAYER);
        uint256 playerBalance = casinoFiToken.balanceOf(PLAYER);
        uint256 expectedPlayerBalance = 80e18;
        assert(playerBalance == expectedPlayerBalance);
        vm.stopPrank();
    }

    function test_can_remove_bet() public _setBet {
        vm.startPrank(PLAYER);
        casinofiBet.removeBet(tableID, BET_CHIP);
        uint256 balance = casinoFiToken.balanceOf(PLAYER);
        assertEq(balance, EARLY_ACCESS_AMOUNT);
        vm.stopPrank();
    }

    function test_player_chip_should_be_zero() public _setBet {
        vm.startPrank(PLAYER);
        casinofiBet.removeBet(tableID, BET_CHIP);
        uint256 totalChips = casinofiBet.getTotalBetChips(tableID, PLAYER);
        assertEq(totalChips, 0);
        vm.stopPrank();
    }

    function test_handle_player_win() public _setBet {
        vm.startPrank(OWNER);
        casinofiBet.handleWinAndLoose(CasinoFiBet.PlayerStatus.Win, tableID, PLAYER);
        uint256 playerBalance = casinoFiToken.balanceOf(PLAYER);
        uint256 betPoolBalance = casinoFiToken.balanceOf(address(casinofiBet));
        console.log("Bet Pool Balance is %d", betPoolBalance);
        console.log("Bet Pool Balance is %d", betPoolBalance);
        uint256 expectedPlayerBalance = ((BET_CHIP * 2) * TABLE_FEE) / 100;
        assert(playerBalance > expectedPlayerBalance);
        vm.stopPrank();
    }
    function test_casinofi_betPool_balance_should_be_greater_than_zero() public {
        vm.startPrank(OWNER);
        uint256 betPoolBalance = casinoFiToken.balanceOf(address(casinofiBet));
        uint256 expectedPoolAmount = casinoFiToken.CASINOFI_POOL();
        assertEq(betPoolBalance, expectedPoolAmount);
        vm.stopPrank();
        
    }

       function test_dealer_balance_should_increase() public _setBet  {
         vm.startPrank(OWNER);
         uint256 valueBeforeTFee = BET_CHIP * 2;
        uint256 expectedDealerBalance = (valueBeforeTFee * TABLE_FEE) / 100;
        casinofiBet.handleWinAndLoose(CasinoFiBet.PlayerStatus.Win, tableID, PLAYER);
        uint256 dealerBalance = casinoFiToken.balanceOf(address(OWNER));
        assert(dealerBalance == expectedDealerBalance);
        vm.stopPrank();
    }
}