export type getUserConfig {
    primaryChain: string;

    primaryAddress: string;

    preferredToken: string;
}

// Example token configurations for different chains
export const NTT_TOKENS: Record<string, string> = {
    Ethereum: "0xExampleEthereumTokenAddress",
    Solana: "ExampleSolanaTokenMintAddress",
    BaseSepolia: "0xExampleBaseSepoliaTokenAddress",
};

export async function getUserConfig(): Promise<UserConfig> {

    // Mock implementation, replace with actual logic to fetch user config
    return {

        primaryChain: "Solana",

        primaryAddress: "YPrimaryAddress",

        preferredToken: "PreferredToken",

    };

}

// Function to get network environment (Mainnet/Testnet)
export function getNetworkEnvironment(): "Mainnet" | "Testnet" {
    return process.env.NETWORK_ENV === "mainnet" ? "Mainnet" : "Testnet";
}
