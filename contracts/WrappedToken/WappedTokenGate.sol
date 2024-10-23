// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import {IWappedTokenGate} from "./interfaces/IWappedTokenGate.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IWXRP} from "./interfaces/IWXRP.sol";
import {IPool} from "../interfaces/IPool.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {DataTypes} from "../libraries/types/DataTypes.sol";
import {ReserveConfiguration} from "../libraries/configuration/ReserveConfiguration.sol";
import {UserConfiguration} from "../libraries/configuration/UserConfiguration.sol";
import {IAToken} from "../interfaces/IAToken.sol";

contract WappedTokenGate is IWappedTokenGate, Ownable {
    using ReserveConfiguration for DataTypes.ReserveConfigurationMap;
    using UserConfiguration for DataTypes.UserConfigurationMap;
    using SafeERC20 for IERC20;

    IWXRP internal immutable WXRP;
    IPool internal immutable POOL;

    constructor(address wxrp, address pool) Ownable() {
        WXRP = IWXRP(wxrp);
        POOL = IPool(pool);
        IWXRP(wxrp).approve(pool, type(uint256).max);
    }

    function depositXRP(
        address onBehalfOf
    ) external payable override {
        WXRP.deposit{value: msg.value}();
        POOL.supply(address(WXRP), msg.value, onBehalfOf);
    }

    function withdrawXRP(
        uint256 amount,
        address onBehalfOf
    ) external override {
        IAToken aWXRP = IAToken(POOL.getReserveData(address(WXRP)).aTokenAddress);
        uint256 userBalance = aWXRP.balanceOf(msg.sender);
        uint256 amountToWithdraw = amount;
        if(amount == type(uint256).max) {
            amountToWithdraw = userBalance;
        }

        aWXRP.transferFrom(msg.sender, address(this), amountToWithdraw);
        POOL.withdraw(address(WXRP), amountToWithdraw, address(this));
        WXRP.withdraw(amountToWithdraw);
        _safeTransferXRP(onBehalfOf, amountToWithdraw);

    }

    function repayXRP(
        uint256 amount,
        uint256 rateMode,
        address onBehalfOf
    ) external payable override {  
        (uint256 stableDebt, uint256 variableDebt) =_getUserCurrentDebt(onBehalfOf, POOL.getReserveData(address(WXRP)));

        uint256 paybackAmount = DataTypes.InterestRateMode(rateMode) == DataTypes.InterestRateMode.STABLE ? stableDebt : variableDebt;

        if(amount < paybackAmount){
            paybackAmount = amount;
        }

        require(msg.value >= paybackAmount, "msg.value is less than payback amount");
    
        WXRP.deposit{value:  paybackAmount}();
        POOL.repay(address(WXRP), paybackAmount, rateMode, onBehalfOf);

        if (msg.value > paybackAmount) _safeTransferXRP(msg.sender, msg.value - paybackAmount);
    }

    function borrowXRP(
        uint256 amount,
        uint256 interestRateMode
    ) external override {
        POOL.borrow(address(WXRP), amount, interestRateMode, 0, msg.sender);
        WXRP.withdraw(amount);
        _safeTransferXRP(msg.sender, amount);
    }

    function _safeTransferXRP(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}(new bytes(0));
        require(success, "XRP_TRANSFER_FAILED");
    }

    function _getUserCurrentDebt(
        address user,
        DataTypes.ReserveData memory reserve
    ) internal view returns (uint256, uint256) {
        return (
        IERC20(reserve.stableDebtTokenAddress).balanceOf(user),
        IERC20(reserve.variableDebtTokenAddress).balanceOf(user)
        );
  }

    function emergencyTokenTransfer(
        address token,
        address to,
        uint256 amount
    ) external onlyOwner {
        IERC20(token).safeTransfer(to, amount);
    }

    function emergencyRippleTransfer(
        address to,
        uint256 amount
    ) external onlyOwner {
        _safeTransferXRP(to, amount);
    }

    function getWXRPAddress() external view returns (address) {
        return address(WXRP);
    }

    receive() external payable {
        require(msg.sender == address(WXRP), "Receive not allowed");
    }

    fallback() external payable {
        revert("Fallback not allowed");
    }

}