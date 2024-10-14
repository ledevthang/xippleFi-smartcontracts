// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const XipplePriceFeedModule = buildModule("XipplePriceFeedModule", (m) => {

  const xipplePriceFeed = m.contract("XipplePriceFeed", [BigInt(18), "XRP/USD"]);

  return { xipplePriceFeed };
});

export default XipplePriceFeedModule;
