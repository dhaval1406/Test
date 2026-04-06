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

const CX = 540;
const CY = 820;
const ORCH_R = 90;
const WORKER_R = 68;
const WORKER_DIST = 280;

const WORKERS = [
  { label: "CODER", icon: "</> ", angle: -140, color: COLORS.indigo },
  { label: "RESEARCHER", icon: "🔍", angle: -50, color: COLORS.indigoLight },
  { label: "CRITIC", icon: "✦", angle: 50, color: "#f59e0b" },
  { label: "EXECUTOR", icon: "⚡", angle: 140, color: COLORS.green },
];

function polarToXY(angleDeg: number, radius: number, cx = CX, cy = CY) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

const ConnectionLine: React.FC<{
  workerAngle: number;
  color: string;
  delay: number;
}> = ({ workerAngle, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 60 },
    durationInFrames: 35,
  });

  const wp = polarToXY(workerAngle, WORKER_DIST);

  // Line from orchestrator edge to worker edge
  const dx = wp.x - CX;
  const dy = wp.y - CY;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len;
  const uy = dy / len;

  const x1 = CX + ux * ORCH_R;
  const y1 = CY + uy * ORCH_R;
  const x2 = CX + ux * (WORKER_DIST - WORKER_R);
  const y2 = CY + uy * (WORKER_DIST - WORKER_R);

  const lineLen = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const dashoffset = lineLen * (1 - progress);

  // Flowing dot
  const dotProgress = interpolate(
    ((frame - delay) % 45) / 45,
    [0, 1],
    [0, 1]
  );
  const dotX = x1 + (x2 - x1) * dotProgress;
  const dotY = y1 + (y2 - y1) * dotProgress;
  const dotVisible = frame > delay + 25;

  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth="2.5"
        strokeDasharray={lineLen}
        strokeDashoffset={dashoffset}
        strokeLinecap="round"
        opacity={0.6}
      />
      {dotVisible && (
        <circle
          cx={dotX}
          cy={dotY}
          r={6}
          fill={color}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      )}
    </g>
  );
};

const OrchestratorNode: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 100, mass: 0.8 },
    durationInFrames: 40,
  });
  const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const pulse = 1 + 0.04 * Math.sin((frame / 25) * Math.PI * 2);

  return (
    <g opacity={opacity} style={{ transform: `scale(${s})`, transformOrigin: `${CX}px ${CY}px` }}>
      {/* Outer glow */}
      <circle cx={CX} cy={CY} r={ORCH_R * 1.5 * pulse} fill={COLORS.indigo} opacity={0.1} />
      <circle cx={CX} cy={CY} r={ORCH_R * 1.2 * pulse} fill={COLORS.indigo} opacity={0.08} />
      {/* Main circle */}
      <circle cx={CX} cy={CY} r={ORCH_R} fill={COLORS.grayDark} stroke={COLORS.indigo} strokeWidth="4" />
      <text x={CX} y={CY - 14} textAnchor="middle" dominantBaseline="middle" fontSize="28" fill={COLORS.white} fontFamily={fontFamily} fontWeight="800">
        ORCHES-
      </text>
      <text x={CX} y={CY + 14} textAnchor="middle" dominantBaseline="middle" fontSize="28" fill={COLORS.white} fontFamily={fontFamily} fontWeight="800">
        TRATOR
      </text>
    </g>
  );
};

const WorkerNode: React.FC<{
  worker: (typeof WORKERS)[number];
  delay: number;
}> = ({ worker, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pos = polarToXY(worker.angle, WORKER_DIST);

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

  // Label position — further out
  const labelPos = polarToXY(worker.angle, WORKER_DIST + WORKER_R + 24);
  const isBottom = Math.sin((worker.angle * Math.PI) / 180) > 0.3;
  const isTop = Math.sin((worker.angle * Math.PI) / 180) < -0.3;

  return (
    <g opacity={opacity} style={{ transform: `scale(${s})`, transformOrigin: `${pos.x}px ${pos.y}px` }}>
      {/* Glow */}
      <circle cx={pos.x} cy={pos.y} r={WORKER_R + 14} fill={worker.color} opacity={0.12} />
      {/* Circle */}
      <circle cx={pos.x} cy={pos.y} r={WORKER_R} fill={COLORS.grayDark} stroke={worker.color} strokeWidth="2.5" />
      {/* Icon */}
      <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fontSize="32" fill={worker.color} fontFamily={fontFamily} fontWeight="700">
        {worker.icon}
      </text>
      {/* Label */}
      <text
        x={labelPos.x}
        y={isBottom ? labelPos.y + 8 : isTop ? labelPos.y - 8 : labelPos.y}
        textAnchor="middle"
        dominantBaseline={isBottom ? "hanging" : isTop ? "auto" : "middle"}
        fill={worker.color}
        fontFamily={fontFamily}
        fontSize="28"
        fontWeight="700"
        letterSpacing="1.5"
      >
        {worker.label}
      </text>
    </g>
  );
};

export const Scene4: React.FC = () => {
  const titleOpacity = useFadeIn(0, 20);
  const subtitleS = useSpringIn(15, 180);
  const subtitleOpacity = useFadeIn(15, 30);
  const resultOpacity = useFadeIn(120, 140);

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
        <SceneLabel text="Multi-Agent Systems" delay={0} />

        <div
          style={{
            fontFamily,
            fontSize: 64,
            fontWeight: 800,
            color: COLORS.white,
            textAlign: "center",
            lineHeight: 1.1,
            opacity: titleOpacity,
          }}
        >
          Agents Orchestrate{" "}
          <span style={{ color: COLORS.green }}>Other Agents</span>
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
            transform: `translateY(${(1 - subtitleS) * 16}px)`,
            maxWidth: 820,
          }}
        >
          Complex tasks are broken into subtasks — each handled by a specialist.
        </div>
      </div>

      {/* SVG Network */}
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Connection lines */}
        {WORKERS.map((w, i) => (
          <ConnectionLine
            key={w.label}
            workerAngle={w.angle}
            color={w.color}
            delay={30 + i * 8}
          />
        ))}
        {/* Orchestrator */}
        <OrchestratorNode delay={20} />
        {/* Worker nodes */}
        {WORKERS.map((w, i) => (
          <WorkerNode key={w.label} worker={w} delay={50 + i * 10} />
        ))}
      </svg>

      {/* Bottom result panel */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom + 24,
          left: SAFE.side,
          right: SAFE.side,
          opacity: resultOpacity,
        }}
      >
        <div
          style={{
            background: COLORS.grayDark,
            border: `2px solid ${COLORS.green}44`,
            borderRadius: 20,
            padding: "28px 36px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 30,
              fontWeight: 700,
              color: COLORS.green,
              letterSpacing: "0.08em",
            }}
          >
            ✓ RESULT ASSEMBLED
          </div>
          {[
            "Coder writes the solution",
            "Researcher gathers context",
            "Critic reviews for errors",
            "Executor runs & delivers",
          ].map((line, i) => (
            <ResultLine key={i} text={line} delay={130 + i * 8} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ResultLine: React.FC<{ text: string; delay: number }> = ({
  text,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 180 },
    durationInFrames: 25,
  });
  const opacity = interpolate(frame, [delay, delay + 10], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity,
        transform: `translateX(${(1 - s) * -20}px)`,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: COLORS.green,
          flexShrink: 0,
        }}
      />
      <div
        style={{ fontFamily, fontSize: 30, fontWeight: 400, color: COLORS.gray }}
      >
        {text}
      </div>
    </div>
  );
};
