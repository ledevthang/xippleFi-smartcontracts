import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {

  solidity: {
    version: '0.8.10',
    settings: {
      optimizer: {
        enabled: true,
        runs: 100000,
      },
      evmVersion: 'london',
    },
  },
  networks: {
    XRPL_EVM_Sidechain_Devnet: {
      url: "https://rpc-evm-sidechain.xrpl.org",
      accounts: [process.env.DEV_PRIVATE_KEY || '', "566c216566df97647d0aac264ca40825f5b5578dc810076b4d9d9432ec561e4d"],
    },
  },
  etherscan: {
    apiKey: {
      'XRPL_EVM_Sidechain_Devnet': "void"
    },
    customChains: [
      {
        network: "XRPL_EVM_Sidechain_Devnet",
        chainId: 1440002,
        urls: {
          apiURL: "https://explorer.xrplevm.org/api",
          browserURL: "https://explorer.xrplevm.org/",
        }
      }
    ]
  }
};

export default config;
