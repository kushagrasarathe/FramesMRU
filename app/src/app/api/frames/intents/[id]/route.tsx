// ./app/frames/route.tsx
/* eslint-disable react/jsx-key */
import { IntentType, getIntentData } from "@/utils/rollup";
import { formatUnits, parseUnits } from "ethers";
import { getUserDataForFid } from "frames.js";
import { createFrames, Button } from "frames.js/next";
import { LogoSVG } from "../../image";
// import logo from "@/assets/logo.jpeg";
const frames = createFrames();

const UNISWAP_V3ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
const AAVE_LENDING_POOL_ADDRESS = "0x794a61358D6845594F94dc1DB02A252b5b4814aD";

const tokenAddresses: { [token: string]: string } = {
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": "ETH",
  "0xaf88d065e77c8cC2239327C5EDb3A432268e5831": "USDC",
  "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1": "WETH",
  "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9": "USDT",
};

const tokenDecimals: { [token: string]: number } = {
  matic: 18,
  usdc: 6,
  weth: 18,
  usdt: 6,
};
const getTokenName = (tokens: string[]) => {
  const addresses: string[] = [];
  for (const token of tokens) {
    addresses.push(tokenAddresses[token.trim()] || "Unknown address");
  }
  return addresses;
};

const parseTokenDecimals = (tokens: string[], values: string[]) => {
  const _values: string[] = [];

  for (let i = 0; i < values.length; i++) {
    _values.push(
      parseUnits(
        values[i],
        tokenDecimals[tokens[i].trim().toLowerCase()]
      ).toString()
    );
  }

  return _values;
};

const getProtocolName = (protocolAddress: string) => {
  if (protocolAddress == UNISWAP_V3ROUTER_ADDRESS) {
    return "UNISWAP";
  } else if (protocolAddress == AAVE_LENDING_POOL_ADDRESS) {
    return "AAVE";
  } else {
    throw new Error("Invalid Protocol");
  }
};

const handleIntentData = async (intentData: IntentType) => {
  // show the protocol name from the address
  const protocolName = getProtocolName(intentData.protocolAddress.toString());
  let tokenName: string[] = [];
  let value: string = "";

  // token Name from the token Address
  if (protocolName == "UNISWAP") {
    const params = intentData.params[0];
    tokenName = getTokenName([params.tokenIn, params.tokenOut]);
    value = formatUnits(
      params.amountIn,
      tokenDecimals[tokenName[0].trim().toLowerCase()]
    );
  } else if (protocolName == "AAVE") {
    const params = intentData.params[0];
    tokenName = getTokenName([params]);
    value = formatUnits(
      intentData.params[1],
      tokenDecimals[tokenName[0].trim().toLowerCase()]
    );
  }

  // extract the value
  console.log(protocolName);
  return {
    protocolName,
    tokenName,
    value,
  };
};

const handleRequest = frames(async (ctx) => {
  const url = ctx.url;
  const path = url.pathname.split("/");
  const intentReqId = path[path.length - 1];
  console.log(intentReqId);

  // get the Request status
  const intentData = await getIntentData(Number(intentReqId));

  console.log(intentData);

  if (ctx.message?.transactionId) {
    return {
      image: (
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
          tw=" bg-[#e4e1f4] py-10 px-12"
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              backgroundImage:
                "linear-gradient(to bottom, #bf83fc66, #8a5cf666, #4e46e599)",
              textAlign: "center",
            }}
            tw="flex  rounded-xl bg-gradient-to-b from-purple-400/40 via-violet-500/40 to-indigo-600/40"
          >
            {/* <img
              tw=" h-full rounded-l-xl "
              src="https://devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2F6e69b8b92a344c8cbd6d9dd6f57f03bf%2Fprojects%2F24b75b1a558e4636a2d1166465435cb6%2F018d44bd-c12e-467d-9d3f-d625c7da8e7a.jpeg&w=1440&q=75"
              alt="logo"
            /> */}
            <LogoSVG />

            <div tw="flex flex-col items-start justify-center pl-5">
              <div
                tw="flex text-black max-w-md px-2"
                style={{ fontSize: "16px", fontWeight: "600" }}
              >
                Your Intent
              </div>

              <div
                tw="flex flex-col text-black bg-white text-center w-full max-w-xs justify-start p-3 rounded-md mx-2.5 mt-4 max-h-[100px] overflow-hidden"
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: 0.3,
                }}
              >
                <div tw="flex w-full items-center justify-normal">
                  I want to swap 10 USDC to WMATIC
                </div>
              </div>

              <div
                tw="flex text-black max-w-md px-2 mt-5"
                style={{ fontSize: "16px", fontWeight: "600" }}
              >
                Successful
              </div>
              <div
                tw="flex text-black bg-white w-full max-w-xs justify-normal items-start p-3 rounded-md mx-2.5 mt-4"
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  letterSpacing: 0.3,
                }}
              >
                Your intent was successfully executed, to see transaction
                details on explorer, visit the link below.
              </div>
            </div>
          </div>
        </div>
      ),
      buttons: [
        <Button
          action="link"
          target={`https://www.onceupon.gg/tx/${ctx.message.transactionId}`}
        >
          View on block explorer
        </Button>,
      ],
      // state: { count: (ctx.message?.state?.count ?? 0) + 1 },
    };
  }

  // render it
  // Might want to check the data and revert saying refresh Again
  if (intentData && intentData.functionName != "") {
    const parsedIntentData = await handleIntentData(intentData);
    return {
      // image: `${process.env.HOST}/api/images/frames/${userHandle}`,
      image: (
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
          tw=" bg-[#e4e1f4] py-10 px-12"
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              backgroundImage:
                "linear-gradient(to bottom, #bf83fc66, #8a5cf666, #4e46e599)",
              textAlign: "center",
            }}
            tw="flex  rounded-xl bg-gradient-to-b from-purple-400/40 via-violet-500/40 to-indigo-600/40"
          >
            {/* <img
              tw=" h-full rounded-l-xl "
              src="https://i.ibb.co/q0N0k9f/Whats-App-Image-Apr-01.jpg"
              alt="logo"
            /> */}
            <LogoSVG />

            <div tw="flex flex-col items-start justify-center pl-5">
              <div
                tw="flex text-black max-w-md px-2"
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                Your Intent:
              </div>

              <div
                tw="flex flex-col text-black bg-white text-center w-full max-w-xs justify-start p-3 rounded-md mx-2.5 mt-4 max-h-[100px] overflow-hidden"
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: 0.3,
                }}
              >
                <div tw="flex w-full items-center justify-normal">
                  {intentData.intent}
                </div>
              </div>

              <div
                tw="flex text-black max-w-md px-2 mt-5"
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                Transaction Details
              </div>
              <div
                tw="flex flex-col text-black bg-white text-center w-full max-w-xs justify-start p-3 rounded-md mx-2.5 mt-4 max-h-[100px] overflow-hidden"
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: 0.3,
                }}
              >
                <div tw="flex w-full items-center justify-normal">
                  <div tw="w-16">Prortocol:</div>
                  <div tw="flex ml-6">{parsedIntentData.protocolName}</div>
                </div>

                <div tw="flex w-full items-center justify-normal mt-3">
                  <div tw="w-16">Tokens:</div>
                  <div tw="flex ml-6">
                    {parsedIntentData.tokenName.map((token, idx) => (
                      <div key={idx} tw="ml-2">
                        {token}
                      </div>
                    ))}
                  </div>
                </div>

                <div tw="flex w-full items-center justify-normal mt-3">
                  <div tw="w-16">Value:</div>
                  <div tw="flex ml-6">{parsedIntentData.value}</div>
                </div>
              </div>

              <div
                tw="flex justify-start text-black max-w-xs px- mt-5"
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Confirm transaction details and execute your transaction.
              </div>
            </div>
          </div>
        </div>
      ),
      buttons: [
        <Button
          action="tx"
          target={`${process.env.HOST}/api/frames/intents/tx/${intentReqId}`}
          post_url={`${process.env.HOST}/api/frames/intents/${intentReqId}`}
        >
          Submit Tx
        </Button>,
        <Button
          action="link"
          target={`${process.env.HOST}/intents/tx/${intentReqId}`}
        >
          Complete Tx on Website
        </Button>,
      ],
      // state: { count: (ctx.message?.state?.count ?? 0) + 1 },
    };
  } else {
    return {
      image: (
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
          tw=" bg-[#e4e1f4] py-10 px-12"
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              backgroundImage:
                "linear-gradient(to bottom, #bf83fc66, #8a5cf666, #4e46e599)",
              textAlign: "center",
            }}
            tw="flex  rounded-xl bg-gradient-to-b from-purple-400/40 via-violet-500/40 to-indigo-600/40"
          >
            {/* <img
              tw=" h-full rounded-l-xl "
              src="https://i.ibb.co/q0N0k9f/Whats-App-Image-Apr-01.jpg"
              alt="logo"
            /> */}
            <LogoSVG />

            <div tw="flex flex-col items-start justify-center pl-5">
              <div
                tw="flex text-black max-w-md px-2"
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                Your Intent
              </div>
              <div
                tw="flex text-black bg-white text-center w-auto max-w-xs min-w-auto justify-start p-3 rounded-md mx-2.5 mt-4 max-h-[100px] overflow-hidden"
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: 0.3,
                }}
              >
                I want to swap 10 USDC to WMATIC
              </div>

              <div
                tw="flex text-black max-w-md px-4 mt-5"
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Processing your intent...
              </div>
            </div>
          </div>
        </div>
      ),
      buttons: [<Button action="post">Refresh</Button>],
      // state: { count: (ctx.message?.state?.count ?? 0) + 1 },
    };
  }
});

export const GET = handleRequest; // Direct Frame Link
export const POST = handleRequest; // For Last frame after fetching it
