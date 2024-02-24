// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.18;

import {CasinoFiToken} from "../src/CasinoFiToken.sol";
import {CasinoFiBet} from "../src/CasinoFiBet.sol";
import {Script} from "forge-std/Script.sol";
import {DevOpsTools} from "foundry-devops/src/DevOpsTools.sol";



contract DeployCasinoFiToken is Script {

     address public initOwner = vm.addr(vm.envUint("OP_PRIVATE_KEY"));

    CasinoFiToken public casinoFiToken;

    function run() public  {
        vm.startBroadcast(initOwner);
        casinoFiToken = new CasinoFiToken(initOwner);
        vm.stopBroadcast();
    }
}

contract DeployCasinoFiBet is Script {
    address public initOwner = vm.addr(vm.envUint("OP_PRIVATE_KEY"));
    

    CasinoFiBet public casinoFiBet; 
    
    function run() public {
        address casinoFiTokenAddress = DevOpsTools.get_most_recent_deployment(
            "CasinoFiToken",
            block.chainid
        );
        vm.startBroadcast(initOwner);
        casinoFiBet = new CasinoFiBet(0x6687B7aA487B103637C943447220DaA5Fc614fB7);
        vm.stopBroadcast();
    }
}