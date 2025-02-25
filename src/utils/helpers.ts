import { Chain, Signer, ChainContext } from "@wormhole-foundation/sdk";
import { getUserConfig } from "./config";

interface UserConfig {
    primaryChain: string;
    primaryAddress: string;
    preferredToken: string;
}

/**
 * Fetch the user's signer for a given blockchain chain.
 * @param chain - The blockchain chain instance (Ethereum, Solana, etc.)
 * @returns {Promise<Signer>} - The signer object for executing transactions.
 */
export async function getSigner(chain: ChainContext<"Testnet", Signer, "Evm" | "Solana">): Promise<Signer> {
    try {
        if (!chain) throw new Error("Invalid chain instance");

        console.log(`Fetching signer for chain: ${chain.chain}`);
        const signer = await chain.signer();
        return signer;
    } catch (error) {
        console.error(`Error fetching signer for ${chain.chain}:`, error);
        throw error;
    }
}

/**
        const config: UserConfig = {
 * @returns {Promise<UserConfig>} - User's blockchain preferences.
 */
export async function fetchUserConfig(): Promise<getUserConfig> {
    try {
        // Load user config from storage, API, or a local file
        const config: UserConfig = {
            primaryChain: "Solana", 
            primaryAddress: "USER_PRIMARY_ADDRESS",
            preferredToken: "WETH",
        };
        return config;
    } catch (error) {
        console.error("Error loading user configuration:", error);
        throw error;
    }
}

/**
 * Utility function to format large numbers for logging.
 * @param value - The numeric value to format.
 * @returns {string} - Formatted string with appropriate units.
 */
export function formatAmount(value: bigint): string {
    if (value >= 1_000_000_000_000n) return `${value / 1_000_000_000_000n}T`;
    if (value >= 1_000_000_000n) return `${value / 1_000_000_000n}B`;
    if (value >= 1_000_000n) return `${value / 1_000_000n}M`;
    if (value >= 1_000n) return `${value / 1_000n}K`;
    return value.toString();
}
