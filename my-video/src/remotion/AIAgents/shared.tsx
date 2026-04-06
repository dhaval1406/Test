import { loadFont } from "@remotion/google-fonts/Inter";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "800"],
  subsets: ["latin"],
});

// Color palette
export const COLORS = {
  bg: "#0a0a0a",
  white: "#ffffff",
  indigo: "#6366f1",
  indigoLight: "#818cf8",
  indigoDim: "#3730a3",
  green: "#22c55e",
  greenDim: "#166534",
  gray: "#71717a",
  grayDark: "#27272a",
  grayMid: "#3f3f46",
};

// Safe zone constants
export const SAFE = {
  top: 150,
  bottom: 170,
  side: 60,
};

// Reusable spring entrance
export const useSpringIn = (delay = 0, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping, stiffness: 100, mass: 0.5 },
    durationInFrames: 40,
  });
};

// Fade in with interpolate
export const useFadeIn = (startFrame: number, endFrame: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
};

// Count-up value
export const useCountUp = (
  startFrame: number,
  endFrame: number,
  from: number,
  to: number
) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [startFrame, endFrame], [from, to], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
};

// Background with grid
export const Background: React.FC<{ opacity?: number }> = ({
  opacity = 0.15,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: COLORS.bg,
      overflow: "hidden",
    }}
  >
    <svg
      width="1080"
      height="1920"
      style={{ position: "absolute", inset: 0, opacity }}
    >
      <defs>
        <pattern
          id="grid"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 60 0 L 0 0 0 60"
            fill="none"
            stroke={COLORS.indigo}
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="1080" height="1920" fill="url(#grid)" />
    </svg>
  </div>
);

// Animated scene label
export const SceneLabel: React.FC<{ text: string; delay?: number }> = ({
  text,
  delay = 0,
}) => {
  const opacity = useFadeIn(delay, delay + 15);
  return (
    <div
      style={{
        fontFamily,
        fontSize: 28,
        fontWeight: 600,
        color: COLORS.indigo,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        opacity,
      }}
    >
      {text}
    </div>
  );
};
