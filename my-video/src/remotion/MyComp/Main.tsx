import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { CompositionProps } from "../../../types/constants";
import { NextLogo } from "./NextLogo";
import { Rings } from "./Rings";
import { TextFade } from "./TextFade";

loadFont({
  family: "Inter",
  url: staticFile("fonts/Inter-Regular.woff2"),
  weight: "100 900",
  style: "normal",
  display: "block",
});

const fontFamily = "Inter";
export const Main = ({ title }: z.infer<typeof CompositionProps>) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const transitionStart = 2 * fps;
  const transitionDuration = 1 * fps;

  const logoOut = spring({
    fps,
    frame,
    config: {
      damping: 200,
    },
    durationInFrames: transitionDuration,
    delay: transitionStart,
  });

  return (
    <AbsoluteFill className="bg-white">
      <Sequence durationInFrames={transitionStart + transitionDuration}>
        <Rings outProgress={logoOut}></Rings>
        <AbsoluteFill className="justify-center items-center">
          <NextLogo outProgress={logoOut}></NextLogo>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={transitionStart + transitionDuration / 2}>
        <TextFade>
          <h1
            className="text-[70px] font-bold"
            style={{
              fontFamily,
            }}
          >
            {title}
          </h1>
        </TextFade>
      </Sequence>
    </AbsoluteFill>
  );
};
