import { ethers } from "hardhat"



const assetSources = [
    {
        symbol: 'BTC',
        asset: '0x06d7354F56209fa461B27A173316013EcC4a4c99',
        source: '0x8B84bdC3Ac0db29003625dc2FdF9902b80e2484F',
        privateKey: '0x2b5e714ff903b8737c794f5ff0eca455740f91c108d01f17ce49be21f0495a64'
    },
    {
        symbol: 'ETH',
        asset: '0x78AE63017E18520cf63CbA0a5CF190d7f04Cb3f6',
        source: '0xC6a1f4925676E0f81f871C53d2C5A7Cff7B773c6',
        privateKey: '0x84300c9c31b59e51966f8160511a83250b6c9afe58e0df72d357d44ec61785b9'
    },
    {
        symbol: 'XRP',
        asset: '0x21fa8610CBD3a1a45bCB1DbE933052EBF9e3dd52',
        source: '0x50E67748dBdb608bE5b85d97b0Da72313f7Faf4f',
        privateKey: '0x625e9eee51bd851f4f819b38fd0819a6b0ba2adb9195c69b04dd918ff926e0cf'
    },
    {
        symbol: 'TRON',
        asset: '0x880e0C475DeD4214De466891c5FBD61747b67083',
        source: '0x7D2e4B489a9058E728Bd9B63b23251A29f0Ed246',
        privateKey: '0x28d28bb2478c8281ab5b255c2be97410fad8a481813613482bb18376367c0272'
    },
    {
        symbol: 'BNB',
        asset: '0xe2C179BB9e31Cd6f16142D1C8d2dDB7458b371Ca',
        source: '0x02f6C887a1C0857bF7106c02FAeF05d46Ba6aBEf',
        privateKey: '0x687f60f76064cf379c1e9c5b650587e863c3fe943d2e3eb37eaa4f0b6d2afa40'
    },
    {
        symbol: 'USDT',
        asset: '0xcD84fcd2964612D1585F1494B8Ed4F1Ae29D32AC',
        source: '0x4f3110350D0F6510F3bA7792d9E1be68D5937c9A',
        privateKey: '0x702973292cd1d65148d7ca37e76f7e738841d361d72dc3290ffdf41bdf4d84a7'
    }
]

const main = async () => {

    const [account] = await ethers.getSigners()

    const OracleGetter = await ethers.getContractFactory("PriceOracleGetter");
    const oracleGetter = await OracleGetter.deploy()
    await oracleGetter.waitForDeployment()


    for (let i = 0; i < assetSources.length; i++) {
        const { asset, source } = assetSources[i]
        const tx = await oracleGetter.setAssetToPriceFeed(asset, source)
        await tx.wait()
        console.log(`Set asset ${asset} to source ${source}`)
    }

    console.log(await oracleGetter.getAddress());
    //0xea79abe982464518663E1203547e4d302DcC07EF

}

// main()

const transferOwner = async () => {

    for (let i = 0; i < assetSources.length; i++) {

        const assetSource = assetSources[i]
        const [account1, account2] = await ethers.getSigners()

        const wallet = new ethers.Wallet(assetSource.privateKey);

        const sendXRP = await account1.sendTransaction({
            to: wallet.address,
            value: ethers.parseEther('50')
        })

        await sendXRP.wait()
        console.log("sendXRP", i, sendXRP.hash)

        const XipplePriceFeed = await ethers.getContractAt('XipplePriceFeed', assetSource.source);

        const transferOwnershipTx = await XipplePriceFeed.connect(account2).transferOwnership(wallet.address);
        await transferOwnershipTx.wait()

        console.log("transferOwnershipTx", i, transferOwnershipTx.hash)

    }

    console.log(assetSources)
}
transferOwner()