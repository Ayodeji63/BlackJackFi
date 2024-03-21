// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.18;

import {CasinoFiToken} from "../src/CasinoFiToken.sol";
import {CasinoFiBet} from "../src/CasinoFiBet.sol";
import {Script} from "forge-std/Script.sol";
import {DevOpsTools} from "foundry-devops/src/DevOpsTools.sol";
import {Staking} from "../src/Staking.sol";


contract DeployStaking is Script {
    address public initOwner = vm.addr(vm.envUint("OP_PRIVATE_KEY"));
    

    Staking public staking;
    
    function run() public {
        address casinoFiTokenAddress = DevOpsTools.get_most_recent_deployment(
            "CasinoFiToken",
            block.chainid
        );
        vm.startBroadcast(initOwner);
       staking = new Staking(casinoFiTokenAddress);
        vm.stopBroadcast();
    }
}