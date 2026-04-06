import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Background,
  COLORS,
  SAFE,
  SceneLabel,
  fontFamily,
  useFadeIn,
  useSpringIn,
} from "./shared";

const NODES = [
  { label: "PERCEIVE", icon: "👁", angle: -90, color: COLORS.indigo },
  { label: "REASON", icon: "🧠", angle: 0, color: COLORS.indigoLight },
  { label: "ACT", icon: "⚡", angle: 90, color: COLORS.green },
  { label: "OBSERVE", icon: "📊", angle: 180, color: "#f59e0b" },
];

const R = 240; // ring radius
const CX = 540; // center x
const CY = 480; // center y
const NODE_R = 82; // node radius

function polarToXY(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  };
}

const LoopRing: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 40, mass: 1 },
    durationInFrames: 60,
  });

  const circumference = 2 * Math.PI * R;
  const dashoffset = circumference * (1 - progress);

  // Rotating glow dot
  const dotAngle = interpolate(frame, [delay, delay + 120], [-90, 270], {
    extrapolateRight: "clamp",
  });
  const dotPos = polarToXY(dotAngle, R);

  return (
    <g>
      {/* Track ring */}
      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke={COLORS.grayMid}
        strokeWidth="3"
        strokeDasharray="8 8"
      />
      {/* Animated arc */}
      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke={COLORS.indigo}
        strokeWidth="5"
        strokeDasharray={circumference}
        strokeDashoffset={dashoffset}
        strokeLinecap="round"
        style={{ transform: `rotate(-90deg)`, transformOrigin: `${CX}px ${CY}px` }}
      />
      {/* Moving dot */}
      {progress > 0.05 && (
        <circle
          cx={dotPos.x}
          cy={dotPos.y}
          r={12}
          fill={COLORS.green}
          style={{ filter: `drop-shadow(0 0 8px ${COLORS.green})` }}
        />
      )}
    </g>
  );
};

const NodeCircle: React.FC<{
  node: (typeof NODES)[number];
  delay: number;
  index: number;
}> = ({ node, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pos = polarToXY(node.angle, R);

  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 120, mass: 0.6 },
    durationInFrames: 35,
  });

  const opacity = interpolate(frame, [delay, delay + 10], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const labelOpacity = interpolate(frame, [delay + 10, delay + 25], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Label position — push outward from center
  const labelAngle = node.angle;
  const labelR = R + NODE_R + 28;
  const labelPos = polarToXY(labelAngle, labelR);
  const isLeft = Math.cos((node.angle * Math.PI) / 180) < -0.1;

  return (
    <g opacity={opacity} style={{ transform: `scale(${s})`, transformOrigin: `${pos.x}px ${pos.y}px` }}>
      {/* Glow */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={NODE_R + 16}
        fill={node.color}
        opacity={0.12}
      />
      {/* Main circle */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={NODE_R}
        fill={COLORS.grayDark}
        stroke={node.color}
        strokeWidth="3"
      />
      {/* Icon */}
      <text
        x={pos.x}
        y={pos.y + 4}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="42"
      >
        {node.icon}
      </text>
      {/* Label */}
      <text
        x={labelPos.x}
        y={labelPos.y}
        textAnchor={isLeft ? "end" : node.angle === 0 ? "start" : "middle"}
        dominantBaseline="middle"
        fill={node.color}
        fontFamily={fontFamily}
        fontSize="32"
        fontWeight="700"
        letterSpacing="2"
        opacity={labelOpacity}
      >
        {node.label}
      </text>
    </g>
  );
};

const CenterPulse: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(
    Math.sin(((frame - delay) / 30) * Math.PI * 2),
    [-1, 1],
    [0.85, 1.0]
  );
  const opacity = useFadeIn(delay, delay + 20);

  return (
    <g opacity={opacity}>
      <circle
        cx={CX}
        cy={CY}
        r={58 * pulse}
        fill={COLORS.indigo}
        opacity={0.15}
      />
      <circle cx={CX} cy={CY} r={44} fill={COLORS.grayDark} stroke={COLORS.indigo} strokeWidth="2.5" />
      <text x={CX} y={CY - 2} textAnchor="middle" dominantBaseline="middle" fontSize="28" fill={COLORS.white} fontFamily={fontFamily} fontWeight="800">
        AI
      </text>
      <text x={CX} y={CY + 18} textAnchor="middle" dominantBaseline="middle" fontSize="14" fill={COLORS.indigo} fontFamily={fontFamily} fontWeight="600" letterSpacing="2">
        AGENT
      </text>
    </g>
  );
};

export const Scene2: React.FC = () => {
  const titleOpacity = useFadeIn(0, 20);
  const subtitleS = useSpringIn(15, 180);
  const subtitleOpacity = useFadeIn(15, 30);
  const loopLabelOpacity = useFadeIn(110, 130);

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
          paddingTop: SAFE.top + 24,
          paddingLeft: SAFE.side,
          paddingRight: SAFE.side,
          gap: 28,
        }}
      >
        <SceneLabel text="The Core Loop" delay={0} />

        <div
          style={{
            fontFamily,
            fontSize: 68,
            fontWeight: 800,
            color: COLORS.white,
            textAlign: "center",
            lineHeight: 1.1,
            opacity: titleOpacity,
          }}
        >
          Agents <span style={{ color: COLORS.indigo }}>Think</span>,{" "}
          <span style={{ color: COLORS.green }}>Act</span>,{" "}
          <span style={{ color: "#f59e0b" }}>Learn</span>
        </div>

        <div
          style={{
            fontFamily,
            fontSize: 36,
            fontWeight: 400,
            color: COLORS.gray,
            textAlign: "center",
            lineHeight: 1.5,
            opacity: subtitleOpacity,
            transform: `translateY(${(1 - subtitleS) * 20}px)`,
            maxWidth: 820,
          }}
        >
          A continuous loop that runs until the task is complete.
        </div>
      </div>

      {/* SVG diagram */}
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <LoopRing delay={30} />
        {NODES.map((node, i) => (
          <NodeCircle key={node.label} node={node} delay={40 + i * 10} index={i} />
        ))}
        <CenterPulse delay={80} />

        {/* Loop forever label */}
        <text
          x={CX}
          y={CY + R + 120}
          textAnchor="middle"
          fill={COLORS.indigo}
          fontFamily={fontFamily}
          fontSize="34"
          fontWeight="600"
          opacity={loopLabelOpacity}
          letterSpacing="3"
        >
          ↻ REPEATS UNTIL DONE
        </text>
      </svg>

      {/* Bottom explanation cards */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom + 40,
          left: SAFE.side,
          right: SAFE.side,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {[
          { step: "1", text: "Perceive — read the environment & task", delay: 90 },
          { step: "2", text: "Reason — plan the next best action", delay: 102 },
          { step: "3", text: "Act — call a tool, write code, search the web", delay: 114 },
          { step: "4", text: "Observe — check results, update memory", delay: 126 },
        ].map(({ step, text, delay }) => {
          return <StepRow key={step} step={step} text={text} delay={delay} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

const StepRow: React.FC<{ step: string; text: string; delay: number }> = ({
  step,
  text,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 180, stiffness: 100 },
    durationInFrames: 30,
  });
  const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        opacity,
        transform: `translateX(${(1 - s) * -30}px)`,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: COLORS.indigo,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily,
          fontSize: 22,
          fontWeight: 800,
          color: COLORS.white,
          flexShrink: 0,
        }}
      >
        {step}
      </div>
      <div
        style={{
          fontFamily,
          fontSize: 32,
          fontWeight: 400,
          color: COLORS.gray,
        }}
      >
        {text}
      </div>
    </div>
  );
};
