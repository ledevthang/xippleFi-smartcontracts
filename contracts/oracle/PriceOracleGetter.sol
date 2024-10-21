// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import {IPriceOracleGetter} from "../interfaces/IPriceOracleGetter.sol";
import {IXipplePriceFeed} from "./Interface/IXipplePriceFeed.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Errors} from "../libraries/helpers/Errors.sol";


contract PriceOracleGetter is IPriceOracleGetter, Ownable {
    
    mapping(address => address) assetToPriceFeed;

    constructor() Ownable() {}

    function BASE_CURRENCY() external view override returns (address) {
        
    }

    function BASE_CURRENCY_UNIT() external view override returns (uint256) {}

    function getAssetPrice(
        address asset
    ) external view override returns (uint256) {
        address priceFeed = assetToPriceFeed[asset];
        (,int256 answer,,,) = IXipplePriceFeed(priceFeed).latestRoundData();
        return uint256(answer);
    }

    function setAssetToPriceFeed(address asset, address priceFeedAddress) external onlyOwner {
        require(asset != address(0), "Invalid Asset Address" );
        require(priceFeedAddress != address(0), "Invalid Price Feed Address" );
        assetToPriceFeed[asset] = priceFeedAddress;
    }

}