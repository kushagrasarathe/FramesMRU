// ./app/frames/route.tsx
/* eslint-disable react/jsx-key */
import { AAVE_LENDING_POOL_ABI, UNISWAP_ROUTER_ABI } from "@/constants";
import { getIntentData } from "@/utils/rollup";
import {
  TransactionTargetResponse,
  getFrameMessage,
  getUserDataForFid,
} from "frames.js";
import { createFrames, Button } from "frames.js/next";
import { NextRequest, NextResponse } from "next/server";
import { Abi, parseAbi } from "viem";

const UNISWAP_V3ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
const AAVE_LENDING_POOL_ADDRESS = "0xcC6114B983E4Ed2737E9BD3961c9924e6216c704";

const getProtocolName = (protocolAddress: string) => {
  if (protocolAddress == UNISWAP_V3ROUTER_ADDRESS) {
    return "UNISWAP";
  } else if (protocolAddress == AAVE_LENDING_POOL_ADDRESS) {
    return "AAVE";
  } else {
    throw new Error("Invalid Protocol");
  }
};

export const POST = async (
  req: NextRequest
): Promise<NextResponse<TransactionTargetResponse> | undefined> => {
  const json = await req.json();
  const url = req.url;
  const path = url.split("/");
  const intentReqId = path[path.length - 1];
  console.log(intentReqId);

  // get the Request status
  const intentData = await getIntentData(Number(intentReqId));

  const frameMessage = await getFrameMessage(json);

  if (!frameMessage) {
    throw new Error("No frame message");
  }

  if (intentData && intentData.functionName != "") {
    const protocolName = getProtocolName(intentData.protocolAddress.toString());
    const AAVE_ABI: Abi = parseAbi(AAVE_LENDING_POOL_ABI);

    let contractABI: Abi =
      protocolName == "UNISWAP" ? UNISWAP_ROUTER_ABI : AAVE_ABI;

    const txData = JSON.parse(intentData.solvedTxData);
    console.log(txData);

    return NextResponse.json({
      chainId: "eip155:10", // OP Mainnet 10
      method: "eth_sendTransaction",
      params: {
        abi: contractABI,
        to: txData.to,
        data: txData.data,
        value: txData.value,
      },
    });
  }
};
