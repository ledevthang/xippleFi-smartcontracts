// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import {IPoolAddressesProvider} from "../interfaces/IPoolAddressesProvider.sol";

interface  IPool {
    
    function ADDRESSES_PROVIDER() external view returns (IPoolAddressesProvider);

    function finalizeTransfer(
        address asset,
        address from,
        address to,
        uint256 amount,
        uint256 balanceFromBefore,
        uint256 balanceToBefore
    ) external;

    function getReserveNormalizedIncome(address asset) external view returns (uint256);

    function getReserveNormalizedVariableDebt(address asset) external view returns (uint256);

}