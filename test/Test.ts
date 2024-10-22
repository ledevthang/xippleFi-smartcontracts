
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import hre, { ethers } from "hardhat";

describe("AVVE", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployOneYearLockFixture () {


        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const XipplePriceFeed = await ethers.getContractFactory("XipplePriceFeed")
        const xipplePriceFeed = await XipplePriceFeed.deploy(18, "USDT/USD Price Feed");
        await xipplePriceFeed.waitForDeployment();

        const PriceOracleGetter = await ethers.getContractFactory("PriceOracleGetter")
        const priceOracleGetter = await PriceOracleGetter.deploy()

        await xipplePriceFeed.transmit("0x000000000000000000000000000000000000000000000000000000671229b806",
            "0x00000000000000000000000000000000000000000000000000000000671229b80000000000000000000000000000000000000000000000000ddef73afa294000"
        )

        const BorrowLogic = await ethers.getContractFactory('BorrowLogic')
        const borrowLogic = await BorrowLogic.deploy();
        const PoolLogic = await ethers.getContractFactory('PoolLogic');
        const poolLogic = await PoolLogic.deploy();
        const SupplyLogic = await ethers.getContractFactory('SupplyLogic');
        const supplyLogic = await SupplyLogic.deploy();

        const borrowLogicAddress = await borrowLogic.getAddress()
        const supplyLogicAddress = await supplyLogic.getAddress()
        const poolLogicAddress = await poolLogic.getAddress()

        const MockUsdt = await hre.ethers.getContractFactory('MockUsdt')
        const mockUsdc = await MockUsdt.deploy(hre.ethers.parseUnits('1000', 6), "USDT", "USDT", 6);

        priceOracleGetter.setAssetToPriceFeed(await mockUsdc.getAddress(), await xipplePriceFeed.getAddress())

        const PoolAddressesProvider = await hre.ethers.getContractFactory("PoolAddressesProvider");
        const poolAddressesProvider = await PoolAddressesProvider.deploy("Xipple", owner.address);

        const poolAddressesProviderAddress = await poolAddressesProvider.getAddress();

        const Pool = await hre.ethers.getContractFactory("Pool", {
            libraries: {
                BorrowLogic: borrowLogicAddress,
                SupplyLogic: supplyLogicAddress,
                PoolLogic: poolLogicAddress
            }
        });
        const pool = await Pool.deploy(poolAddressesProviderAddress);

        poolAddressesProvider.setPoolImpl(await pool.getAddress());
        poolAddressesProvider.setPriceOracle(await priceOracleGetter.getAddress())

        const PoolConfigurator = await ethers.getContractFactory("PoolConfigurator")
        const poolConfigurator = await PoolConfigurator.deploy(poolAddressesProvider)



        return { poolConfigurator, owner, poolAddressesProvider, otherAccount, mockUsdc, pool, };
    }

    describe("Supply", function () {
        it("Test supply", async () => {
            const { pool, poolAddressesProvider, owner, mockUsdc, poolConfigurator } = await loadFixture(deployOneYearLockFixture)

            const Treasury = await ethers.getContractFactory("Treasury")
            const treasury = await Treasury.deploy(owner.address)


            const AToken = await ethers.getContractFactory("AToken")
            const aToken = await AToken.deploy(await poolAddressesProvider.getPool(), await treasury.getAddress(), await mockUsdc.getAddress(), "0x0000000000000000000000000000000000000000", 6, "ATokenUsdc", "ATokenUsdc");

            const StableDebtToken = await ethers.getContractFactory("StableDebtToken")
            const stableDebtToken = await StableDebtToken.deploy(await pool.getAddress(), await mockUsdc.getAddress(), "0x0000000000000000000000000000000000000000", 6, "StableDebtTokenUSDC", "SDTUSDC")

            const VariableDebtToken = await ethers.getContractFactory("VariableDebtToken")
            const variableDebtToken = await VariableDebtToken.deploy(await pool.getAddress(), await mockUsdc.getAddress(), "0x0000000000000000000000000000000000000000", 6, "VariableDebtTokenUSDC", "VDTUSDC")

            const ReserveInterestRateStrategy = await ethers.getContractFactory("ReserveInterestRateStrategy")
            const reserveInterestRateStrategy = await ReserveInterestRateStrategy.deploy(await pool.getAddress(), "800000000000000000000000000", "20000000000000000000000000", "40000000000000000000000000", "750000000000000000000000000", "20000000000000000000000000", "600000000000000000000000000", "10000000000000000000000000", "20000000000000000000000000", "200000000000000000000000000");

            await pool.initReserve(await mockUsdc.getAddress(), await aToken.getAddress(), await stableDebtToken.getAddress(), await variableDebtToken.getAddress(), await reserveInterestRateStrategy.getAddress())

            await poolAddressesProvider.connect(owner).setPoolImpl(await pool.getAddress());
            await poolAddressesProvider.setPoolConfiguratorImpl(await poolConfigurator.getAddress())

            await poolConfigurator.setReserveActive(await mockUsdc.getAddress(), true);
            await poolConfigurator.configureReserveAsCollateral(await mockUsdc.getAddress(), 7000, 8000, 10500)
            await poolConfigurator.setReserveBorrowing(await mockUsdc.getAddress(), true);

            console.log(await pool.getConfiguration(await mockUsdc.getAddress()))
            console.log(await pool.getReservesList())

            await mockUsdc.approve(await pool.getAddress(), ethers.parseUnits('100', 6))

            await pool.supply(await mockUsdc.getAddress(), ethers.parseUnits('100', 6), owner.address)

            console.log(await aToken.balanceOf(owner.address))

            await pool.widthdraw(await mockUsdc.getAddress(), ethers.parseUnits('50', 6), owner.address)

            console.log(await aToken.balanceOf(owner.address))

            console.log(await pool.getUserConfiguration(owner.address))

            await pool.borrow(await mockUsdc.getAddress(), ethers.parseUnits('1', 6), 2, 0, owner.address)


            // console.log(await pool.getUserAccountData(owner.address))
        })
    });


});
