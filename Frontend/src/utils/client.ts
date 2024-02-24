import { createLightAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { LocalAccountSigner, type Hex, UserOperationOverrides, SendUserOperationResult } from "@alchemy/aa-core";
import { createPublicClient, http } from "viem";
import { sepolia, arbitrumSepolia, polygonMumbai } from "viem/chains";

export const publicClient = createPublicClient({
  chain: polygonMumbai,
  transport: http(),
});

