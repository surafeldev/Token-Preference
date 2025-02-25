// NTT Token Addresses on Different Chains

export const NTT_TOKENS: NttContracts = {
  Solana: {
    token: "5trJHKSB7M6w1sC74YkxZb5D7GxA9bL6WzP4ht8FDs5V",
    manager: "NTueGPu3ckEwiQXprSjAfHC7YybrJNAG39X2AKEG9So",
    transceiver: {
      wormhole: "NTueGPu3ckEwiQXprSjAfHC7YybrJNAG39X2AKEG9So",
    },
    quoter: "Nqd6XqA8LbsCuG8MLWWuP865NV6jR1MbXeKxD4HLKDJ"
  },
  BaseSepolia: {
    token: "0xaBc1234567890fDb48D63F11dFdc364201C9DE67",
    manager: "0xD456789a1230Cc48fDb48D63F11dFdc364201C9DE",
    transceiver: { wormhole: "0x9876aBcDeF01234567890Fdb48D63F11dFdc3642" },
  },
};

// Default Gas Dropoff for Transfers
export const DEFAULT_GAS_DROPOFF = 0n;

// VAA Fetch Timeout in Milliseconds
export const VAA_FETCH_TIMEOUT = 25 * 60 * 1000; // 25 minutes

// Default Network Environment
export const DEFAULT_NETWORK = "Mainnet"; // Change to "Testnet" if needed

