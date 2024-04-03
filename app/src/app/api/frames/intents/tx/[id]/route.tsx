// ./app/frames/route.tsx
/* eslint-disable react/jsx-key */
import { getUserDataForFid } from "frames.js";
import { createFrames, Button } from "frames.js/next";

const frames = createFrames();

const handleRequest = frames(async (ctx) => {
  // meant to handle the tx request somehow and then return the tx Screen
  const url = ctx.url;
  const path = url.pathname.split("/");
  const intentReqId = path[path.length - 1];
  console.log(intentReqId);

  // get the Request status
  const res = await fetch(`${process.env.ROLLUP_HOST}/score/${intentReqId}`);

  //   const json = await res.json();
  //   const userScoreData: UserReputation | undefined | null = json.userScore;

  //   const userFData = await getUserDataForFid({ fid: Number(userFid) });

  const userScoreData = {};

  // render it
  // Might want to check the data and revert saying refresh Again
  if (userScoreData) {
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
            <img
              tw=" h-full rounded-l-xl "
              src="https://devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2F6e69b8b92a344c8cbd6d9dd6f57f03bf%2Fprojects%2F24b75b1a558e4636a2d1166465435cb6%2F018d44bd-c12e-467d-9d3f-d625c7da8e7a.jpeg&w=1440&q=75"
              alt="logo"
            />

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
                  I want to swap 10 USDC to WMATIC
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
                  <div tw="flex ml-6">Aave</div>
                </div>

                <div tw="flex w-full items-center justify-normal mt-3">
                  <div tw="w-16">Tokens:</div>
                  <div tw="flex ml-6">USDC, WMATIC</div>
                </div>

                <div tw="flex w-full items-center justify-normal mt-3">
                  <div tw="w-16">Value:</div>
                  <div tw="flex ml-6">2000</div>
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
          action="link"
          target={`${process.env.HOST}/api/frame/intent/tx/${intentReqId}`}
        >
          Complete Tx
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
            <img
              tw=" h-full rounded-l-xl "
              src="https://devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2F6e69b8b92a344c8cbd6d9dd6f57f03bf%2Fprojects%2F24b75b1a558e4636a2d1166465435cb6%2F018d44bd-c12e-467d-9d3f-d625c7da8e7a.jpeg&w=1440&q=75"
              alt="logo"
            />

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
