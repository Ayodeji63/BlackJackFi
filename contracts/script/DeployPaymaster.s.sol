// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;
import {Script} from "forge-std/Script.sol";
import {Paymaster} from "../src/Paymaster.sol";
contract DeployPaymaster is Script {

    Paymaster public paymaster;

    function run() public {
        vm.startBroadcast();
        paymaster = new Paymaster();
        vm.stopBroadcast();
    }
}