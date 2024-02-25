// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;
import {Script} from "forge-std/Script.sol";
import {CasinoFiBet} from "../src/CasinoFiBet.sol";
import {CasinoFiToken} from "../src/CasinoFiToken.sol";
import {DevOpsTools} from "foundry-devops/src/DevOpsTools.sol";

contract MintCasinoFiBetPool is Script {

  address public initOwner = vm.addr(vm.envUint("OP_PRIVATE_KEY"));
    

    CasinoFiBet public casinoFiBet; 
    
    function run() public {
        address casinoFiTokenAddress = DevOpsTools.get_most_recent_deployment(
            "CasinoFiToken",
            block.chainid
        );
         address casinoFiBetAddress = DevOpsTools.get_most_recent_deployment(
            "CasinoFiBet",
            block.chainid
        );
        vm.startBroadcast(initOwner);
        CasinoFiToken(casinoFiTokenAddress).mintCasinoFiBetPool(casinoFiBetAddress);
        vm.stopBroadcast();
    }
}