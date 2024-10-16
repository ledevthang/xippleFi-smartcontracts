// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "./PoolStorage.sol";
import {Errors} from "../libraries/helpers/Errors.sol";
import {PoolLogic} from "../libraries/logic/PoolLogic.sol";
import {SupplyLogic} from "../libraries/logic/SupplyLogic.sol";
import {ReserveConfiguration} from "../libraries/configuration/ReserveConfiguration.sol";


contract Pool is PoolStorage {

    address PoolConfigurator;

    modifier onlyPoolConfigurator() {
        _onlyPoolConfigurator();
        _;
    }

    function _onlyPoolConfigurator() internal view virtual {
        require(
        PoolConfigurator == msg.sender,
        Errors.CALLER_NOT_POOL_CONFIGURATOR
        );
    }

    function supply(address asset, uint256 amount, address onBehalfOf) public {
        SupplyLogic.executeSupply(
            _reserves,
            _reservesList,
            _usersConfig[onBehalfOf],
            DataTypes.ExecuteSupplyParams({
                asset: asset,
                amount: amount,
                onBehalfOf: onBehalfOf
            })
        );
    }

    function widthdraw(address asset, uint256 amount, address to) public returns(uint256){

    }

    function borrow(
        address asset,
        uint256 amount,
        uint256 interestRateMode,
        uint16 referralCode,
        address onBehalfOf
    ) public {

    }

    function repay(address asset, uint256 amount) public {

    }

    function initReserve (
        address asset,
        address aTokenAddress,
        address stableDebtAddress,
        address variableDebtAddress,
        address interestRateStrategyAddress
    ) external onlyPoolConfigurator {
        if(PoolLogic.executeInitReserve(
            _reserves, 
            _reservesList, 
            DataTypes.InitReserveParams({
                asset: asset,
                aTokenAddress: aTokenAddress,
                stableDebtAddress:stableDebtAddress,
                variableDebtAddress: variableDebtAddress,
                interestRateStrategyAddress: interestRateStrategyAddress,
                reservesCount:_reservesCount,
                maxNumberReserves: MAX_NUMBER_RESERVES()
            })
        )){
            _reservesCount++;
        }
    }

    function MAX_NUMBER_RESERVES() public pure returns (uint16) {
        return ReserveConfiguration.MAX_RESERVES_COUNT;
    }

}