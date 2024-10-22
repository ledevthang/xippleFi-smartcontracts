import { ethers } from "hardhat"

export const PoolAddressesProviderAddress = "0x18F6e95b15f8D3D5aE1e87752c22C2305736FE70";

const addresses = {
    pool: '0x511fD3e949aD66dca45A4Dbdc1fCbdEDFD50A637',
    oracle: "0xea79abe982464518663E1203547e4d302DcC07EF",
    poolDataProvider: "0x4Ff2264caC574C690225404b3fAD1cbB76A98Fdf",
    poolConfigurator: "0x95E0e5f14Edd1a28ada89b0F686eAaF81Da91c37"
}

const main = async () => {
    const [account] = await ethers.getSigners()

    const PoolAddressesProvider = await ethers.getContractAt("PoolAddressesProvider", PoolAddressesProviderAddress);

    const txPool = await PoolAddressesProvider.setPoolImpl(addresses.pool);
    await txPool.wait();

    const txOracle = await PoolAddressesProvider.setPriceOracle(addresses.oracle);
    await txOracle.wait();

    const txDataProvider = await PoolAddressesProvider.setPoolDataProvider(addresses.poolDataProvider);
    await txDataProvider.wait();

    const txPoolConfigurator = await PoolAddressesProvider.setPoolConfiguratorImpl(addresses.poolConfigurator);
    await txPoolConfigurator.wait();

}

main()