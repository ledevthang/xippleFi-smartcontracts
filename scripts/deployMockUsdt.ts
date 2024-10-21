import { parseUnits } from 'ethers';
import hre from 'hardhat';

async function main () {

    const [account] = await hre.ethers.getSigners();

    const initSupply = parseUnits("1000000000000", 6)

    const MockUsdt = await hre.ethers.getContractFactory("MockUsdt")
    const mockUsdt = await MockUsdt.deploy(initSupply, "Mock Tether USDT", "USDT", 6)

    await mockUsdt.waitForDeployment()

    console.log(await mockUsdt.getAddress())
}
// "1000000000000000000" "Mock Tether USDT" "USDT" "6"

main()

// npx hardhat verify 0xE8C59EA28408AC784140C8CE34A0D5ca8A701c6E "1000000000000000000" "Mock Tether USDT" "USDT" "6" --network XRPL_EVM_Sidechain_Devnet

//0x34665b1a5954AaDF7BD64e9a3E8B320F803b0DcE
//0x8dE15744Ea253A748F11A509d9450BFBEd1b14Ee