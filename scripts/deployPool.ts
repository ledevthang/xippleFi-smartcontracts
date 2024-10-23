import hre from 'hardhat';

async function main () {

    const [account] = await hre.ethers.getSigners();

    const BorrowLogic = await hre.ethers.getContractFactory("BorrowLogic")
    const borrowLogic = await BorrowLogic.deploy();
    await borrowLogic.waitForDeployment();
    const SupplyLogic = await hre.ethers.getContractFactory("SupplyLogic")
    const supplyLogic = await SupplyLogic.deploy();
    await supplyLogic.waitForDeployment();
    const PoolLogic = await hre.ethers.getContractFactory("PoolLogic")
    const poolLogic = await PoolLogic.deploy();
    await poolLogic.waitForDeployment();

    const borrowLogicAddress = await borrowLogic.getAddress()
    const supplyLogicAddress = await supplyLogic.getAddress()
    const poolLogicAddress = await poolLogic.getAddress()

    const poolAddressesProvider = await hre.ethers.getContractAt("PoolAddressesProvider", "0x18F6e95b15f8D3D5aE1e87752c22C2305736FE70")

    const Pool = await hre.ethers.getContractFactory("Pool", {
        libraries: {
            BorrowLogic: borrowLogicAddress,
            SupplyLogic: supplyLogicAddress,
            PoolLogic: poolLogicAddress
        }
    })
    const pool = await Pool.deploy("0x18F6e95b15f8D3D5aE1e87752c22C2305736FE70")

    await pool.waitForDeployment()

    const PoolAddress = await pool.getAddress();

    console.log('Pool', PoolAddress)

    const txSetPool = await poolAddressesProvider.setPoolImpl(PoolAddress)
    await txSetPool.wait()

    const PoolConfigurator = await hre.ethers.getContractFactory("PoolConfigurator");
    const poolConfigurator = await PoolConfigurator.deploy("0x18F6e95b15f8D3D5aE1e87752c22C2305736FE70")
    await poolConfigurator.waitForDeployment()

    const poolConfiguratorAddress = await poolConfigurator.getAddress();

    console.log('PoolConfigurator', poolConfiguratorAddress)
    const tx = await poolAddressesProvider.setPoolConfiguratorImpl(poolConfiguratorAddress)
    await tx.wait()

}

main()

// Pool 0xF33d5ce7B4F6BeBc8edDb07192F279A21F0697b1
// PoolConfigurator 0x7c2feE768b0A3dA58F518c84b8ac06E2B9cB058C

// npx hardhat run scripts/deploy.ts  --network XRPL_EVM_Sidechain_Devnet
// npx hardhat verify 0x7c2feE768b0A3dA58F518c84b8ac06E2B9cB058C "0x18F6e95b15f8D3D5aE1e87752c22C2305736FE70" --network XRPL_EVM_Sidechain_Devnet