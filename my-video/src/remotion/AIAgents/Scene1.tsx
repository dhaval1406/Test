import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background, COLORS, SAFE, SceneLabel, fontFamily, useFadeIn, useSpringIn } from "./shared";

const ChatBubble: React.FC<{ delay: number }> = ({ delay }) => {
  const s = useSpringIn(delay);
  return (
    <div
      style={{
        transform: `scale(${s}) translateY(${(1 - s) * 30}px)`,
        background: COLORS.grayDark,
        border: `2px solid ${COLORS.grayMid}`,
        borderRadius: 24,
        padding: "32px 44px",
        display: "flex",
        alignItems: "center",
        gap: 24,
        maxWidth: 700,
      }}
    >
      {/* User avatar */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: COLORS.indigoDim,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" fill={COLORS.indigoLight} />
          <path
            d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
            stroke={COLORS.indigoLight}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div>
        <div
          style={{
            fontFamily,
            fontSize: 32,
            fontWeight: 400,
            color: COLORS.white,
            marginBottom: 6,
          }}
        >
          "What's the capital of France?"
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 28,
            color: COLORS.gray,
          }}
        >
          → "Paris." &nbsp;Done.
        </div>
      </div>
    </div>
  );
};

const XMark: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 200 },
    durationInFrames: 25,
  });
  const opacity = interpolate(frame, [delay, delay + 10], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const size = 120 * progress;
  return (
    <div style={{ opacity, display: "flex", justifyContent: "center", marginTop: -20 }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="none" stroke="#ef4444" strokeWidth="5" />
        <line
          x1="28"
          y1="28"
          x2="72"
          y2="72"
          stroke="#ef4444"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1="72"
          y1="28"
          x2="28"
          y2="72"
          stroke="#ef4444"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

const PassiveLabel: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const charCount = Math.floor(
    interpolate(frame, [delay, delay + 30], [0, 7], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    })
  );
  const word = "PASSIVE";
  const opacity = useFadeIn(delay, delay + 6);

  return (
    <div
      style={{
        fontFamily,
        fontSize: 80,
        fontWeight: 800,
        color: "#ef4444",
        letterSpacing: "0.12em",
        opacity,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {word.slice(0, charCount)}
      <span style={{ opacity: 0.3 }}>{word.slice(charCount)}</span>
    </div>
  );
};

const ConstraintRow: React.FC<{ text: string; delay: number }> = ({
  text,
  delay,
}) => {
  const s = useSpringIn(delay, 180);
  const opacity = useFadeIn(delay, delay + 12);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        opacity,
        transform: `translateX(${(1 - s) * -40}px)`,
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#ef4444",
          flexShrink: 0,
        }}
      />
      <div
        style={{
          fontFamily,
          fontSize: 36,
          fontWeight: 400,
          color: COLORS.gray,
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const Scene1: React.FC = () => {
  const titleOpacity = useFadeIn(0, 20);
  const subtitleS = useSpringIn(15, 180);
  const subtitleOpacity = useFadeIn(15, 30);

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Background />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: SAFE.top + 40,
          paddingLeft: SAFE.side,
          paddingRight: SAFE.side,
          paddingBottom: SAFE.bottom,
          gap: 48,
        }}
      >
        <SceneLabel text="The Old Way" delay={0} />

        {/* Headline */}
        <div
          style={{
            fontFamily,
            fontSize: 72,
            fontWeight: 800,
            color: COLORS.white,
            textAlign: "center",
            lineHeight: 1.1,
            opacity: titleOpacity,
          }}
        >
          AI Used to Just…{" "}
          <span style={{ color: COLORS.gray }}>Answer</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily,
            fontSize: 38,
            fontWeight: 400,
            color: COLORS.gray,
            textAlign: "center",
            lineHeight: 1.5,
            opacity: subtitleOpacity,
            transform: `translateY(${(1 - subtitleS) * 20}px)`,
            maxWidth: 820,
          }}
        >
          One question. One answer. No planning, no memory, no action.
        </div>

        {/* Chat bubble */}
        <ChatBubble delay={25} />

        {/* X mark */}
        <XMark delay={55} />

        {/* PASSIVE */}
        <PassiveLabel delay={70} />

        {/* Constraints */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            alignSelf: "flex-start",
            marginTop: 8,
          }}
        >
          <ConstraintRow text="No memory across sessions" delay={90} />
          <ConstraintRow text="Can't take real-world actions" delay={102} />
          <ConstraintRow text="No planning or multi-step tasks" delay={114} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
