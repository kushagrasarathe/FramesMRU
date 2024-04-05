// ./app/frames/route.tsx
/* eslint-disable react/jsx-key */
import { requestIntent } from "@/utils/rollup";
import { getAddressForFid, getUserDataForFid } from "frames.js";
import { createFrames, Button } from "frames.js/next";
import { LogoSVG } from "../image";

const frames = createFrames();

const handleRequest = frames(async (ctx) => {
  console.log(ctx.message);
  if (ctx.message && ctx.message.inputText) {
    // Get the users fid
    const userFid: number = ctx?.message.requesterFid;
    const _input = ctx.message.inputText;

    const userAddress = await getAddressForFid({ fid: userFid });

    console.log(_input);

    // Otherwise
    // request the User data for score calculate
    // don't wait for that
    const data = await requestIntent({
      userAddress: userAddress as string,
      intent: _input as string,
    });

    // Send a refresh Frame first
    // send a POST request for generating the intent
    // handleIntent
    const reqId = data?.requestId ? data.requestId : 0;
    // const reqId = 0;

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
              src="https://i.ibb.co/kSDwzFV/Apr-01-Whats-App-Image.jpg"
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
                {_input}
              </div>

              <div
                tw="flex text-black max-w-md px-4 mt-5"
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Processing your intent... with {reqId}
              </div>
            </div>
          </div>
        </div>
      ),
      buttons: [
        <Button
          action="post"
          target={`${process.env.HOST}/api/frames/intents/${reqId}`}
        >
          Refresh
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
              src="https://i.ibb.co/kSDwzFV/Apr-01-Whats-App-Image.jpg"
              alt="logo"
            /> */}
            <LogoSVG />
            <div tw="flex flex-col items-start justify-center pl-5">
              <div
                tw="flex text-black max-w-md px-2"
                style={{
                  fontSize: "30px",
                  fontWeight: "600",
                }}
              >
                Something Went Wrong !!
              </div>
            </div>
          </div>
        </div>
      ),
      buttons: [<Button action="post">Try again</Button>],
    };
  }
});

export const POST = handleRequest;
