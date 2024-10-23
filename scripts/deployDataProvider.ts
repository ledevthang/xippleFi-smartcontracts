import { ethers } from "hardhat"

const PoolAddressesProviderAddress = '0x18F6e95b15f8D3D5aE1e87752c22C2305736FE70'

const PoolDataProvider = "0x4Ff2264caC574C690225404b3fAD1cbB76A98Fdf"
const uiPoolDataProvider = "0xeca10Cb744Ff8A1D849902894a86082931559372"

const main = async () => {

    const [account] = await ethers.getSigners();

    const PoolDataProvider = await ethers.getContractFactory("PoolDataProvider")

    const poolDataProvider = await PoolDataProvider.connect(account).deploy('0x18F6e95b15f8D3D5aE1e87752c22C2305736FE70')
    await poolDataProvider.waitForDeployment()

    console.log("PoolDataProvider", await poolDataProvider.getAddress());

    const UiPoolDataProvider = await ethers.getContractFactory("UiPoolDataProvider")
    const uiPoolDataProvider = await UiPoolDataProvider.deploy()

    await uiPoolDataProvider.waitForDeployment()

    console.log("await uiPoolDataProvider", await uiPoolDataProvider.getAddress())

}

main()

// npx hardhat run scripts/deploy.ts  --network XRPL_EVM_Sidechain_Devnet
// npx hardhat verify 0xb88ce2e28b56bDC2F04223b56F7feE0bDe1fe0BC "0x18F6e95b15f8D3D5aE1e87752c22C2305736FE70" --network XRPL_EVM_Sidechain_Devnet

// npx hardhat verify 0x6Ea4C88561FAA025e6F48f5a520C3525FbEA647b --network XRPL_EVM_Sidechain_Devnet