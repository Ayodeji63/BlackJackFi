import { createLightAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { LocalAccountSigner, type Hex, UserOperationOverrides, SendUserOperationResult } from "@alchemy/aa-core";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia, arbitrumSepolia, polygonMumbai, baseSepolia, base } from "viem/chains";

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: http(), 
});

export const account = privateKeyToAccount(process.env.REACT_APP_PRIVATE_KEY as `0x${string}`);