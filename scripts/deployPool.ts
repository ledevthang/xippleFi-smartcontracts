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


    // console.log(await pool.getAddress())
}

main()

//0x34665b1a5954AaDF7BD64e9a3E8B320F803b0DcE
//0x8dE15744Ea253A748F11A509d9450BFBEd1b14Ee

// npx hardhat run scripts/deploy.ts  --network XRPL_EVM_Sidechain_Devnet
// npx hardhat verify 0x8dBD487418b28cE39CFd9532f951465845f2be23 "0x18F6e95b15f8D3D5aE1e87752c22C2305736FE70" --network XRPL_EVM_Sidechain_Devnet