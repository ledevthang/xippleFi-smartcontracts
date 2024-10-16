// SPDX-License-Identifier: MIT
pragma solidity  0.8.27;

import {DataTypes} from "../types/DataTypes.sol";
import {Errors} from "../helpers/Errors.sol";
import {ReserveLogic} from "./ReserveLogic.sol";

library PoolLogic {

    using ReserveLogic for DataTypes.ReserveData;

    
    function executeInitReserve (
        mapping(address => DataTypes.ReserveData) storage reservesData,
        mapping(uint256 => address) storage reservesList,
        DataTypes.InitReserveParams memory params
    ) external returns (bool) {

        require(isContract(params.asset), Errors.NOT_CONTRACT);
        reservesData[params.asset].init(
            params.aTokenAddress,
            params.stableDebtAddress,
            params.variableDebtAddress,
            params.interestRateStrategyAddress
        );

        bool reserveAlreadyAdded =  reservesData[params.asset].id != 0 || reservesList[0] == params.asset;
        require(!reserveAlreadyAdded, Errors.RESERVE_ALREADY_ADDED);

        for(uint16 i = 0; i < params.reservesCount; i++){
            if(reservesList[i] == address(0)){
                reservesData[params.asset].id = i;
                reservesList[i] = params.asset;
                return false;
            }
        }

        require(params.reservesCount < params.maxNumberReserves, Errors.NO_MORE_RESERVES_ALLOWED);
        reservesData[params.asset].id = params.reservesCount;
        reservesList[params.reservesCount] = params.asset;
        return true;

    }

    function isContract (address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

}



