import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill } from "remotion";
import { Scene1 } from "./Scene1";
import { Scene2 } from "./Scene2";
import { Scene3 } from "./Scene3";
import { Scene4 } from "./Scene4";
import { Scene5 } from "./Scene5";

// Scene durations (frames @ 30fps)
// Total = sum - (transitions * overlap)
// 180 + 210 + 180 + 180 + 195 - 4*12 = 897 ≈ 29.9s
export const SCENE_DURATIONS = {
  s1: 180,
  s2: 210,
  s3: 180,
  s4: 180,
  s5: 195,
};

export const TRANSITION_FRAMES = 12;

export const AI_AGENTS_TOTAL_FRAMES =
  SCENE_DURATIONS.s1 +
  SCENE_DURATIONS.s2 +
  SCENE_DURATIONS.s3 +
  SCENE_DURATIONS.s4 +
  SCENE_DURATIONS.s5 -
  4 * TRANSITION_FRAMES; // 849 frames ≈ 29.9s

const transition = (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
  />
);

export const AIAgentsVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.s1}>
          <Scene1 />
        </TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.s2}>
          <Scene2 />
        </TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.s3}>
          <Scene3 />
        </TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.s4}>
          <Scene4 />
        </TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.s5}>
          <Scene5 />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
