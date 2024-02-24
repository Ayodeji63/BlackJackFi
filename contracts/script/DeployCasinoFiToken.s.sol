// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.18;

import {CasinoFiToken} from "../src/CasinoFiToken.sol";
import {Script} from "forge-std/Script.sol";


contract DeployCasinoFiToken is Script {

     address public initOwner = vm.addr(vm.envUint("OP_PRIVATE_KEY"));

    CasinoFiToken public casinoFiToken;

    function run() public  {
        vm.startBroadcast(initOwner);
        casinoFiToken = new CasinoFiToken(initOwner);
        vm.stopBroadcast();
    }
}