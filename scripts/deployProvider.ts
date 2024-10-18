import hre from 'hardhat';

async function main () {

    const [account] = await hre.ethers.getSigners();
    console.log(account)

    const PoolAddressesProvider = await hre.ethers.getContractFactory("PoolAddressesProvider")
    const poolAddressesProvider = await PoolAddressesProvider.deploy("Xipple", account.address)

    const d = await poolAddressesProvider.waitForDeployment()

    console.log(d.deploymentTransaction)
}

//0xCb6fA80CA791A039314fbAf88752EdbE4d86F54F

main()