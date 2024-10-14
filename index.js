const { ethers } = require("ethers");

function hexToBytes(hex) {
    // Ensure the hex string starts with "0x"
    hex = hex.startsWith('0x') ? hex.slice(2) : hex;
    
    // Initialize an empty array
    const bytes = [];
    
    // Convert each pair of hex characters to a byte
    for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    
    return bytes;
}
function getLatestEpochAndRoundAsBytes32(epoch, round) {
    // Ensure the epoch and round are valid numbers
    if (epoch < 0 || epoch > 0xFFFFFFFF) {
        throw new Error("Epoch must be a uint32 (0 to 4294967295).");
    }
    if (round < 0 || round > 0xFF) {
        throw new Error("Round must be a uint8 (0 to 255).");
    }

    // Combine epoch and round into a single uint40 value
    const uint40Value = (epoch << 8) | round; // Shift epoch left by 8 bits and OR with round

    const hexString = uint40Value.toString(16);

    // Pad the hexadecimal string to ensure it is 64 characters long
    const paddedHexString = hexString.padStart(64, '0');

    // Convert to bytes32 representation with '0x' prefix
    const bytes32Value = ethers.hexlify('0x' + paddedHexString);

    return bytes32Value;
}

function hashData(uint32Value, int192Value) {
    // ABI definition for encoding (uint32, int192)
    const abi = ["uint32", "int192"];
    
    // Create an ABI coder from ethers.js
    const abiCoder = new ethers.AbiCoder();
    
    // Encode the values into ABI format (packed data as bytes)
    const encodedData = abiCoder.encode(abi, [uint32Value, int192Value]);

    
    return {encodedData, uint32Value}
    
}

const epoch = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds
const round = 2;

console.log(getLatestEpochAndRoundAsBytes32(1728646439, 1))

console.log(hashData(epoch, 6000000000000000))