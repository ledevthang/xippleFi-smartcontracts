// SPDX-License-Identifier: MIT 
pragma solidity 0.8.27;

import {DataTypes} from "../types/DataTypes.sol";

contract SupplyLogic {



    function executeSupply(
        mapping(address => DataTypes.ReserveData) storage reservesData,
        mapping(uint256 => address) storage reservesList,
        DataTypes.UserConfigurationMap storage userConfig,
        DataTypes.ExecuteSupplyParams memory params) external {
            DataTypes.ReserveData storage reserve = reservesData[params.asset];
            DataTypes.ReserveCache memory reserveCache = reserve.cache();
        }

}

