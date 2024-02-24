// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CasinoFiBet {
    event CasinoFiBet__SetBet(address indexed player, uint256 indexed betChip);
    IERC20 public casinoFiToken;
    mapping (string tableId => mapping(address player => uint256 totalChips)) public tableBetChips;

    constructor(address _casinoFiToken) {
        casinoFiToken = IERC20(_casinoFiToken);
    }

    function setBet(string memory tableId, uint256 betChip) public {
        uint256 playerBalance = casinoFiToken.balanceOf(msg.sender);
        require(playerBalance > betChip,"CasinoFiBet: Insufficient amount");
        tableBetChips[tableId][msg.sender] = tableBetChips[tableId][msg.sender] + betChip;
        casinoFiToken.transferFrom(msg.sender, address(this), betChip);

        emit CasinoFiBet__SetBet(msg.sender, betChip);
    }

    function getTotalBetChips(string memory tableId) public view returns(uint256) {
        return tableBetChips[tableId][msg.sender];
    }

    function removeBet(string memory tableId, uint256 betChip) public {
        tableBetChips[tableId][msg.sender] = tableBetChips[tableId][msg.sender] - betChip;
        
    }
}