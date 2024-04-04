// ./app/frames/route.tsx
/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";

const frames = createFrames();

const handleRequest = frames(async (ctx) => {
  return {
    image: `${process.env.HOST}/introductory.png`,
    buttons: [
      <Button action="post" target={`${process.env.HOST}/api/frames/intents`}>
        Submit
      </Button>,
    ],
    textInput: "Enter your Intent",
    accepts: [
      {
        id: "farcaster",
        version: "vNext",
      },
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
