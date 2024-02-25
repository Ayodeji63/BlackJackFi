// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;
import {CasinoFiToken} from "./CasinoFiToken.sol";

contract CasinoFiBet  {
    error CasinoFiBet__InvalidAmount();
    error CasinoFiBet__InvalidPlayer();

    enum PlayerStatus {
        Win,
        Loose
    }

    event CasinoFiBet__SetBet(address indexed player, uint256 indexed betChip);
    event CasinoFiBet__RemoveBet(address indexed to, uint256 indexed value);

    CasinoFiToken public casinoFiToken;
    mapping (string tableId => mapping(address player => uint256 totalChips)) public tableBetChips;

    uint256 public constant TABLE_FEE = 5; // 5% tax on win
    address public immutable i_dealer;

    constructor(address _casinoFiToken, address dealer) {
        casinoFiToken = CasinoFiToken(_casinoFiToken);
        i_dealer = dealer;
    }

    function setBet(string memory tableId, uint256 betChip) public {
        uint256 playerBalance = casinoFiToken.balanceOf(msg.sender);
        if (playerBalance < betChip) {
            revert CasinoFiBet__InvalidAmount();
        }
        tableBetChips[tableId][msg.sender] += betChip;
        casinoFiToken.transferFrom(msg.sender, address(this), betChip);

        emit CasinoFiBet__SetBet(msg.sender, betChip);
    }

    function removeBet(string memory tableId, uint256 betChip) public {
        uint256 playerChip = tableBetChips[tableId][msg.sender];
        if (playerChip < betChip) {
            revert CasinoFiBet__InvalidAmount();
        }
        tableBetChips[tableId][msg.sender] -= betChip;
        emit CasinoFiBet__RemoveBet(msg.sender, betChip);
        casinoFiToken.transfer(msg.sender, betChip);
    }

    function handleWinAndLoose(PlayerStatus status, string memory tableId, address player) public {
        uint256 playerChips = tableBetChips[tableId][player];
        if (playerChips < 0) {
            revert CasinoFiBet__InvalidPlayer();
        }

        if (status == PlayerStatus.Win) {
            uint256 valueBeforeTFee = playerChips * 2;
            uint256 feeAmount = (valueBeforeTFee * TABLE_FEE) / 100;
            uint256 valueAfterFee = valueBeforeTFee - feeAmount;

            tableBetChips[tableId][player] -= playerChips;
            casinoFiToken.burnToken(address(this), playerChips);
            casinoFiToken.transfer(i_dealer, feeAmount); // Send tax to owner
            casinoFiToken.transfer(player, valueAfterFee); // Send remaining to the player
            casinoFiToken.burnToken(address(this), playerChips);
        }

        if (status == PlayerStatus.Loose) {
            return;
        }
    }

    function getTotalBetChips(string memory tableId, address player) public view returns(uint256) {
        return tableBetChips[tableId][player];
    }

    // Add functions for split, double, and insurance here
    // ...
}
