import { error } from 'console';
import { parseUnits } from 'ethers';
import hre from 'hardhat';

// aTokenAddress: aTokenAddress,
// stableDebtAddress:stableDebtAddress,
// variableDebtAddress: variableDebtAddress,
// interestRateStrategyAddress: interestRateStrategyAddress,

const tokens = {
    btc: "0x06d7354F56209fa461B27A173316013EcC4a4c99",
    eth: "0x78AE63017E18520cf63CbA0a5CF190d7f04Cb3f6",
    xrp: "0x50E67748dBdb608bE5b85d97b0Da72313f7Faf4f",
    tron: "0x880e0C475DeD4214De466891c5FBD61747b67083",
    bnb: "0xe2C179BB9e31Cd6f16142D1C8d2dDB7458b371Ca",
    usdt: "0xcD84fcd2964612D1585F1494B8Ed4F1Ae29D32AC"
}

const AXippleToken = {
    pool: "0xF33d5ce7B4F6BeBc8edDb07192F279A21F0697b1",
    addressProvider: "0x18F6e95b15f8D3D5aE1e87752c22C2305736FE70",
    treasury: "",
    underlyingAsset: tokens.bnb,
    incentivesController: "0x0000000000000000000000000000000000000000",
    aTokenDecimals: 18,
    aTokenName: "Xipple Ripple BNB",
    aTokenSymbol: "aXippleBNB",
    TOKEN_SYMBOL: "BNB"
}

async function main () {

    const [account] = await hre.ethers.getSigners();

    const Treasury = await hre.ethers.getContractFactory("Treasury")
    const treasury = await Treasury.deploy(account.address);
    await treasury.waitForDeployment()
    const treasuryAddress = await treasury.getAddress()
    AXippleToken.treasury = treasuryAddress
    console.log(treasuryAddress)

    const StableDebt = await hre.ethers.getContractFactory("StableDebtToken")
    const stableDebt = await StableDebt.deploy(AXippleToken.pool, AXippleToken.underlyingAsset, AXippleToken.incentivesController, AXippleToken.aTokenDecimals, `Xipple Ripple ${AXippleToken.TOKEN_SYMBOL} Stable Debt`, `aXipple${AXippleToken.TOKEN_SYMBOL}SDT`)
    await stableDebt.waitForDeployment()
    const stableDebtAddress = await stableDebt.getAddress();

    const VariableDebt = await hre.ethers.getContractFactory("VariableDebtToken")
    const variableDebt = await VariableDebt.deploy(AXippleToken.pool, AXippleToken.underlyingAsset, AXippleToken.incentivesController, AXippleToken.aTokenDecimals, `Xipple Ripple ${AXippleToken.TOKEN_SYMBOL} Variable Debt`, `aXipple${AXippleToken.TOKEN_SYMBOL}VDT`)
    await variableDebt.waitForDeployment()
    const variableDebtAddress = await variableDebt.getAddress();


    const optimalUsageRatio = hre.ethers.parseUnits("0.8", 27)
    const baseVariableBorrowRate = hre.ethers.parseUnits("0.02", 27)
    const variableRateSlope1 = hre.ethers.parseUnits("0.04", 27)
    const variableRateSlope2 = hre.ethers.parseUnits("0.75", 27)
    const stableRateSlope1 = hre.ethers.parseUnits("0.02", 27)
    const stableRateSlope2 = hre.ethers.parseUnits("0.6", 27)
    const baseStableRateOffset = hre.ethers.parseUnits("0.01", 27)
    const stableRateExcessOffset = hre.ethers.parseUnits("0.02", 27)
    const optimalStableToTotalDebtRatio = hre.ethers.parseUnits("0.2", 27)

    const InterestRateStrategy = await hre.ethers.getContractFactory("ReserveInterestRateStrategy")
    const interestRateStrategy = await InterestRateStrategy.deploy(AXippleToken.addressProvider,
        optimalUsageRatio,
        baseVariableBorrowRate,
        variableRateSlope1,
        variableRateSlope2,
        stableRateSlope1,
        stableRateSlope2,
        baseStableRateOffset,
        stableRateExcessOffset,
        optimalStableToTotalDebtRatio
    )

    await interestRateStrategy.waitForDeployment()

    const interestRateStrategyAddress = await interestRateStrategy.getAddress()


    const AToken = await hre.ethers.getContractFactory("AToken")
    const aToken = await AToken.deploy(AXippleToken.pool, AXippleToken.treasury, AXippleToken.underlyingAsset, AXippleToken.incentivesController, AXippleToken.aTokenDecimals, AXippleToken.aTokenName, AXippleToken.aTokenSymbol)
    await aToken.waitForDeployment()
    const atokenAddress = await aToken.getAddress()

    const Pool = await hre.ethers.getContractAt("Pool", AXippleToken.pool)
    const PoolConfigurator = await hre.ethers.getContractAt("PoolConfigurator", "0x7c2feE768b0A3dA58F518c84b8ac06E2B9cB058C")

    const txPool = await Pool.connect(account).initReserve(
        AXippleToken.underlyingAsset,
        atokenAddress,
        stableDebtAddress,
        variableDebtAddress,
        interestRateStrategyAddress
    )
    await txPool.wait()


    const txReserveActive = await PoolConfigurator.setReserveActive(AXippleToken.underlyingAsset, true)
    await txReserveActive.wait()

    const txReserveBorrowing = await PoolConfigurator.setReserveBorrowing(AXippleToken.underlyingAsset, true)
    await txReserveBorrowing.wait()

    const txConfig = await PoolConfigurator.configureReserveAsCollateral(AXippleToken.underlyingAsset, 7000, 8000, 10500)
    await txConfig.wait()

}

const a = () => {

    const optimalUsageRatio = hre.ethers.parseUnits("0.8", 27)
    const baseVariableBorrowRate = hre.ethers.parseUnits("0.02", 27)
    const variableRateSlope1 = hre.ethers.parseUnits("0.04", 27)
    const variableRateSlope2 = hre.ethers.parseUnits("0.75", 27)
    const stableRateSlope1 = hre.ethers.parseUnits("0.02", 27)
    const stableRateSlope2 = hre.ethers.parseUnits("0.6", 27)
    const baseStableRateOffset = hre.ethers.parseUnits("0.01", 27)
    const stableRateExcessOffset = hre.ethers.parseUnits("0.02", 27)
    const optimalStableToTotalDebtRatio = hre.ethers.parseUnits("0.2", 27)

    console.log({ optimalUsageRatio, baseVariableBorrowRate, variableRateSlope1, variableRateSlope2, stableRateSlope1, stableRateSlope2, baseStableRateOffset, stableRateExcessOffset, optimalStableToTotalDebtRatio })
}

// a()

// npx hardhat verify 0xf6163a6d677032bc93ddf75773d0702627186446 "0x18F6e95b15f8D3D5aE1e87752c22C2305736FE70" "800000000000000000000000000" "20000000000000000000000000" "40000000000000000000000000" "750000000000000000000000000" "20000000000000000000000000" "600000000000000000000000000" "10000000000000000000000000" "20000000000000000000000000" "200000000000000000000000000" --network XRPL_EVM_Sidechain_Devnet




main()

async function supply () {

    const [account] = await hre.ethers.getSigners();

    try {
        const Pool = await hre.ethers.getContractAt("Pool", AXippleToken.pool)

        const tx = await Pool.connect(account).supply("0xcD84fcd2964612D1585F1494B8Ed4F1Ae29D32AC", hre.ethers.parseUnits('1', 18), account.address)

        await tx.wait()
        console.log(tx)
    } catch (error) {
        console.log(error)
    }


}

// supply()