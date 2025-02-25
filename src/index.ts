import {
    Wormhole,
    TransactionId,
    amount,
    signSendWait,
} from "@wormhole-foundation/sdk";

import evm from "@wormhole-foundation/sdk/platforms/evm";
import solana from "@wormhole-foundation/sdk/platforms/solana";

import "@wormhole-foundation/sdk-evm-ntt";
import "@wormhole-foundation/sdk-solana-ntt";

import { getSigner } from "./utils/helpers";
import { getUserConfig } from "./utils/config";
import { NTT_TOKENS } from "./utils/const";

(async function () {
    try {
        // Initialize Wormhole instance
        const wh = new Wormhole("testnet", [solana.Platform, evm.Platform]);

        // Load user preferences
        const userConfig = await getUserConfig();
        const primaryChain = userConfig.primaryChain;
        const primaryAddress = userConfig.primaryAddress;
        const preferredToken = userConfig.preferredToken;

        // Source chain setup (Ethereum)
        const src = wh.getChain("Ethereum");
        const srcSigner = await getSigner(src);

        // Destination chain setup (User's primary chain)
        const dst = wh.getChain(primaryChain);
        const dstSigner = await getSigner(dst);

        // Get protocol instances for source and destination tokens
        const srcNtt = await src.getProtocol("Ntt", {
            ntt: NTT_TOKENS[src.chain],
        });
        const dstNtt = await dst.getProtocol("Ntt", {
            ntt: NTT_TOKENS[dst.chain],
        });

        // Function to handle incoming transactions
        async function handleIncomingTransaction(txid: string) {
            try {
                console.log(`Processing transaction: ${txid}`);

                // Fetch transaction details
                const tx = await src.getTransaction(txid);
                let transferAmount = tx.amount;
                const token = tx.token;
                const from = tx.from;

                console.log(`Received ${transferAmount} ${token} from ${from}`);

                // Check if the token is the preferred token
                if (token !== preferredToken) {
                    console.log(`Converting ${token} to ${preferredToken}...`);
                    transferAmount = await srcNtt.convertTo(dstNtt, transferAmount);
                }

                // Initiate the bridge transfer
                const xfer = () =>
                    srcNtt.transfer(
                        srcSigner.address.address,
                        transferAmount,
                        primaryAddress,
                        {
                            queue: false,
                            automatic: false,
                            gasDropoff: 0n,
                        }
                    );

                // Execute transfer
                const txids: TransactionId[] = await signSendWait(
                    src,
                    xfer(),
                    srcSigner.signer
                );
                console.log("Transfer initiated: ", txids);

                // Fetch the VAA (Verified Action Approval)
                console.log("Fetching VAA...");
                const vaa = await wh.getVaa(
                    txids[txids.length - 1]!.txid,
                    "Ntt:WormholeTransfer",
                    25 * 60 * 1000
                );
                console.log("VAA received:", vaa);

                // Redeem tokens on the destination chain
                const dstTxids = await signSendWait(
                    dst,
                    dstNtt.redeem([vaa!], dstSigner.address.address),
                    dstSigner.signer
                );
                console.log("Tokens redeemed on destination chain: ", dstTxids);

            } catch (error) {
                console.error("Error handling transaction:", error);
            }
        }

    } catch (error) {
        console.error("Error initializing Wormhole bridge:", error);
    }
})();
