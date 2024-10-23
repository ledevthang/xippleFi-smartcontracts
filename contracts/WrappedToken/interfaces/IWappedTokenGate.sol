// SPDX-License-Identifier: MIT
interface IWappedTokenGate {

        
    function depositXRP(address onBehalfOf) external payable;

    function withdrawXRP(uint256 amount, address onBehalfOf) external;

    function repayXRP(
        uint256 amount,
        uint256 rateMode,
        address onBehalfOf
    ) external payable;

    function borrowXRP(
        uint256 amount,
        uint256 interestRateMode
    ) external;

    
}