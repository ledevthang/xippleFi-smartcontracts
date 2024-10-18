// SPDX-License-Identifier: MIT
pragma solidity  0.8.10;

import {DataTypes} from "../types/DataTypes.sol";
import {Errors} from "../helpers/Errors.sol";
import {ReserveLogic} from "./ReserveLogic.sol";
import {GenericLogic} from "./GenericLogic.sol";

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


    function executeGetUserAccountData(
        mapping(address => DataTypes.ReserveData) storage reservesData,
        mapping(uint256 => address) storage reservesList,
        mapping(uint8 => DataTypes.EModeCategory) storage eModeCategories,
        DataTypes.CalculateUserAccountDataParams memory params
    )
    external
    view
    returns (
        uint256 totalCollateralBase,
        uint256 totalDebtBase,
        uint256 availableBorrowsBase,
        uint256 currentLiquidationThreshold,
        uint256 ltv,
        uint256 healthFactor
    )
    {
    (
        totalCollateralBase,
        totalDebtBase,
        ltv,
        currentLiquidationThreshold,
        healthFactor,

    ) = GenericLogic.calculateUserAccountData(reservesData, reservesList, eModeCategories, params);

    availableBorrowsBase = GenericLogic.calculateAvailableBorrows(
        totalCollateralBase,
        totalDebtBase,
        ltv
        );
    }

    function isContract (address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

}



