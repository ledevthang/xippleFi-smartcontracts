// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {DataTypes} from "../types/DataTypes.sol";
import {ReserveLogic} from "../logic/ReserveLogic.sol";
import {UserConfiguration} from "../configuration/UserConfiguration.sol";
import {ReserveConfiguration} from "../configuration/ReserveConfiguration.sol";
import {IVariableDebtToken} from "../../interfaces/IVariableDebtToken.sol";
import {IStableDebtToken} from "../../interfaces/IStableDebtToken.sol";
import {SafeCast} from "@openzeppelin/contracts/utils/math/SafeCast.sol";
import {IAToken} from "../../interfaces/IAToken.sol";



library BorrowLogic {

    using ReserveLogic for DataTypes.ReserveCache;
    using ReserveLogic for DataTypes.ReserveData; 
    using UserConfiguration for DataTypes.UserConfigurationMap;
    using ReserveConfiguration for DataTypes.ReserveConfigurationMap;
    using SafeCast for uint256;

    event Borrow(
        address indexed reserve,
        address user,
        address indexed onBehalfOf,
        uint256 amount,
        DataTypes.InterestRateMode interestRateMode,
        uint256 borrowRate,
        uint16 indexed referralCode
    );

    event IsolationModeTotalDebtUpdated(address indexed asset, uint256 totalDebt);

    function executeBorrow(
        mapping(address => DataTypes.ReserveData) storage reservesData,
        mapping(uint256 => address) storage reservesList,
        mapping(uint8 => DataTypes.EModeCategory) storage eModeCategories,
        DataTypes.UserConfigurationMap storage userConfig,
        DataTypes.ExecuteBorrowParams memory params
    ) public {
        DataTypes.ReserveData storage reserve = reservesData[params.asset];
        DataTypes.ReserveCache memory reserveCache = reserve.cache();

        reserve.updateState(reserveCache);

        (
            bool isolationModeActive,
            address isolationModeCollateralAddress,
            uint256 isolationModeDebtCeiling
        ) = userConfig.getIsolationModeState(reservesData, reservesList);

        uint256 currentStableRate = 0;
        bool isFirstBorrowing = false;

            if (params.interestRateMode == DataTypes.InterestRateMode.STABLE) {
            currentStableRate = reserve.currentStableBorrowRate;

            (
                isFirstBorrowing,
                reserveCache.nextTotalStableDebt,
                reserveCache.nextAvgStableBorrowRate
            ) = IStableDebtToken(reserveCache.stableDebtTokenAddress).mint(
                params.user,
                params.onBehalfOf,
                params.amount,
                currentStableRate
            );
        } else {
            (isFirstBorrowing, reserveCache.nextScaledVariableDebt) = IVariableDebtToken(
                reserveCache.variableDebtTokenAddress
            ).mint(params.user, params.onBehalfOf, params.amount, reserveCache.nextVariableBorrowIndex);
        }

        if(isFirstBorrowing){
            userConfig.setBorrowing(reserve.id, true);
        }

        if (isolationModeActive) {
            uint256 nextIsolationModeTotalDebt = reservesData[isolationModeCollateralAddress]
            .isolationModeTotalDebt += (params.amount / 10 **(reserveCache.reserveConfiguration.getDecimals() - ReserveConfiguration.DEBT_CEILING_DECIMALS)).toUint128();
            emit IsolationModeTotalDebtUpdated(
            isolationModeCollateralAddress,
            nextIsolationModeTotalDebt
            );
        }
        

        reserve.updateInterestRates(
            reserveCache,
            params.asset,
            0,
            params.releaseUnderlying ? params.amount : 0
        );

        if (params.releaseUnderlying) {
            IAToken(reserveCache.aTokenAddress).transferUnderlyingTo(params.user, params.amount);
        }

        emit Borrow(
            params.asset,
            params.user,
            params.onBehalfOf,
            params.amount,
            params.interestRateMode,
            params.interestRateMode == DataTypes.InterestRateMode.STABLE
                ? currentStableRate
                : reserve.currentVariableBorrowRate,
            params.referralCode
        );
    }

}