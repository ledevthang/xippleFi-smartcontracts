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

    console.log({ borrowLogicAddress, supplyLogicAddress, poolLogicAddress })

    const Pool = await hre.ethers.getContractFactory("Pool", {
        libraries: {
            BorrowLogic: borrowLogicAddress,
            SupplyLogic: supplyLogicAddress,
            PoolLogic: poolLogicAddress
        }
    })
    const pool = await Pool.deploy("0xCb6fA80CA791A039314fbAf88752EdbE4d86F54F")

    await pool.waitForDeployment()

    console.log(await pool.getAddress())
}

main()

//0x34665b1a5954AaDF7BD64e9a3E8B320F803b0DcE
//0x8dE15744Ea253A748F11A509d9450BFBEd1b14Ee

// npx hardhat run scripts/deploy.ts  --network XRPL_EVM_Sidechain_Devnet
// npx hardhat verify 0x280cdFEC15679eFf1Cd5c9aAD8b3c3B7a757d278 "0xCb6fA80CA791A039314fbAf88752EdbE4d86F54F" --network XRPL_EVM_Sidechain_Devnet