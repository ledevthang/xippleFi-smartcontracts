// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

library Errors {
    string public constant NOT_CONTRACT ="9";
    string public constant CALLER_NOT_POOL_CONFIGURATOR = '10';
    string public constant RESERVE_ALREADY_ADDED = "14";
    string public constant NO_MORE_RESERVES_ALLOWED = "15";
    string public constant RESERVE_ALREADY_INITIALIZED = "61";
    string public constant INVALID_LTV = "63";
    string public constant INVALID_LIQ_THRESHOLD = "64";
    string public constant INVALID_LIQ_BONUS = "65";
    string public constant INVALID_DECIMALS = "66";
    string public constant INVALID_RESERVE_FACTOR = "67"; 
    string public constant INVALID_BORROW_CAP = "68";
    string public constant INVALID_SUPPLY_CAP = "69"; 
    string public constant INVALID_LIQUIDATION_PROTOCOL_FEE = "70";
    string public constant INVALID_EMODE_CATEGORY = "71";
    string public constant INVALID_UNBACKED_MINT_CAP = "72";
    string public constant INVALID_DEBT_CEILING = "73";
    string public constant INVALID_RESERVE_INDEX = "74";

}