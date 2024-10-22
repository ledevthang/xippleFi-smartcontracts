import { ethers } from "hardhat"

const main = async () => {

    const PoolConfigurator = await ethers.getContractAt("PoolConfigurator", "0x95E0e5f14Edd1a28ada89b0F686eAaF81Da91c37");

    const tx = await PoolConfigurator.configureReserveAsCollateral("0xcD84fcd2964612D1585F1494B8Ed4F1Ae29D32AC", 7000, 8000, 10500)

    await tx.wait()
    console.log(tx.hash)


}

main()