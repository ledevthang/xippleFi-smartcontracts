import { parseUnits } from 'ethers';
import hre from 'hardhat';

// aTokenAddress: aTokenAddress,
// stableDebtAddress:stableDebtAddress,
// variableDebtAddress: variableDebtAddress,
// interestRateStrategyAddress: interestRateStrategyAddress,

const AXippleToken = {
    pool: "0x280cdFEC15679eFf1Cd5c9aAD8b3c3B7a757d278",
    treasury: "",
    underlyingAsset: "0xE8C59EA28408AC784140C8CE34A0D5ca8A701c6E",
    incentivesController: "",
    aTokenDecimals: 6,
    aTokenName: "Xipple Ripple USDT",
    aTokenSymbol: "aXippleUSDT"
}

async function main () {

    const [account] = await hre.ethers.getSigners();

    const AToken = await hre.ethers.getContractFactory("AToken")
    const aToken = await AToken.deploy(AXippleToken.pool, AXippleToken.treasury, AXippleToken.underlyingAsset, AXippleToken.incentivesController, AXippleToken.aTokenDecimals, AXippleToken.aTokenName, AXippleToken.aTokenSymbol)

    await aToken.waitForDeployment()

    // console.log(await mockUsdt.getAddress())
}

main()