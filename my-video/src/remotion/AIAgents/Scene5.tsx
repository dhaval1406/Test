import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, SAFE, SceneLabel, fontFamily, useFadeIn } from "./shared";

// Particle system
interface Particle {
  id: number;
  x: number;
  baseY: number;
  size: number;
  speed: number;
  opacity: number;
  hue: number;
}

const PARTICLES: Particle[] = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: random(`px-${i}`) * 1080,
  baseY: 1920 + random(`py-${i}`) * 400,
  size: 8 + random(`ps-${i}`) * 22,
  speed: 0.6 + random(`psp-${i}`) * 1.2,
  opacity: 0.15 + random(`po-${i}`) * 0.35,
  hue: random(`ph-${i}`) > 0.5 ? 0 : 1, // 0 = indigo, 1 = green
}));

const ParticleField: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg
      width="1080"
      height="1920"
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      {PARTICLES.map((p) => {
        const y = p.baseY - frame * p.speed * 2;
        const color = p.hue === 0 ? COLORS.indigo : COLORS.green;
        const visible = y < 1920 && y > -50;
        if (!visible) return null;
        return (
          <circle
            key={p.id}
            cx={p.x}
            cy={y}
            r={p.size}
            fill={color}
            opacity={p.opacity}
            style={{ filter: `blur(${p.size * 0.6}px)` }}
          />
        );
      })}
    </svg>
  );
};

// Glow bloom at center
const GlowBloom: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 40 },
    durationInFrames: 60,
  });
  const pulse = 1 + 0.06 * Math.sin((frame / 40) * Math.PI * 2);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${progress * pulse})`,
        width: 600,
        height: 600,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${COLORS.indigo}22 0%, ${COLORS.indigo}00 70%)`,
        pointerEvents: "none",
      }}
    />
  );
};

// Animated stat counter
interface StatConfig {
  label: string;
  prefix: string;
  suffix: string;
  from: number;
  to: number;
  color: string;
  delay: number;
  isInfinity?: boolean;
}

const STATS: StatConfig[] = [
  {
    label: "AI agents actively deployed",
    prefix: "",
    suffix: "M+",
    from: 0,
    to: 10,
    color: COLORS.indigo,
    delay: 40,
  },
  {
    label: "automated tasks per year",
    prefix: "",
    suffix: "B+",
    from: 0,
    to: 100,
    color: COLORS.green,
    delay: 65,
  },
  {
    label: "possibilities ahead",
    prefix: "",
    suffix: "",
    from: 0,
    to: 0,
    color: COLORS.white,
    delay: 90,
    isInfinity: true,
  },
];

const StatCard: React.FC<{ stat: StatConfig }> = ({ stat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({
    frame: frame - stat.delay,
    fps,
    config: { damping: 200, stiffness: 100, mass: 0.7 },
    durationInFrames: 40,
  });
  const opacity = interpolate(
    frame,
    [stat.delay, stat.delay + 15],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const value = stat.isInfinity
    ? "∞"
    : Math.floor(
        interpolate(frame, [stat.delay + 10, stat.delay + 60], [stat.from, stat.to], {
          extrapolateRight: "clamp",
          extrapolateLeft: "clamp",
        })
      );

  return (
    <div
      style={{
        background: `${COLORS.grayDark}cc`,
        border: `2px solid ${stat.color}44`,
        borderRadius: 24,
        padding: "32px 40px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        opacity,
        transform: `scale(${s}) translateY(${(1 - s) * 30}px)`,
        backdropFilter: "blur(8px)",
        boxShadow: `0 0 40px ${stat.color}18`,
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 72,
          fontWeight: 800,
          color: stat.color,
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          textShadow: `0 0 30px ${stat.color}88`,
        }}
      >
        {stat.prefix}{value}{stat.suffix}
      </div>
      <div
        style={{
          fontFamily,
          fontSize: 30,
          fontWeight: 400,
          color: COLORS.gray,
          lineHeight: 1.3,
        }}
      >
        {stat.label}
      </div>
    </div>
  );
};

const PulsingHeadline: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(
    Math.sin((frame / 35) * Math.PI * 2),
    [-1, 1],
    [0.96, 1.0]
  );
  const opacity = useFadeIn(delay, delay + 20);

  return (
    <div
      style={{
        fontFamily,
        fontSize: 76,
        fontWeight: 800,
        color: COLORS.white,
        textAlign: "center",
        lineHeight: 1.1,
        opacity,
        transform: `scale(${pulse})`,
      }}
    >
      The{" "}
      <span
        style={{
          color: COLORS.indigo,
          textShadow: `0 0 40px ${COLORS.indigo}99`,
        }}
      >
        Agentic Era
      </span>
      <br />
      Is Here
    </div>
  );
};

const FinalCTA: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 80 },
    durationInFrames: 35,
  });
  const opacity = useFadeIn(delay, delay + 15);

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${COLORS.indigo}33, ${COLORS.green}22)`,
        border: `2px solid ${COLORS.indigo}66`,
        borderRadius: 20,
        padding: "26px 44px",
        opacity,
        transform: `scale(${s})`,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 36,
          fontWeight: 600,
          color: COLORS.white,
          lineHeight: 1.5,
        }}
      >
        AI Agents are already coding, researching,
        <br />
        and managing workflows — <span style={{ color: COLORS.green }}>today</span>.
      </div>
    </div>
  );
};

export const Scene5: React.FC = () => {
  const subtitleOpacity = useFadeIn(18, 35);

  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: "hidden" }}>
      {/* Particle background */}
      <ParticleField />
      {/* Center glow */}
      <GlowBloom delay={10} />

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
          paddingBottom: SAFE.bottom + 20,
          gap: 36,
        }}
      >
        <SceneLabel text="The Future" delay={0} />

        <PulsingHeadline delay={8} />

        <div
          style={{
            fontFamily,
            fontSize: 36,
            fontWeight: 400,
            color: COLORS.gray,
            textAlign: "center",
            lineHeight: 1.5,
            opacity: subtitleOpacity,
            maxWidth: 820,
          }}
        >
          The question isn't <em>if</em> — it's <strong style={{ color: COLORS.white }}>how fast</strong>.
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            width: "100%",
          }}
        >
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        {/* CTA */}
        <FinalCTA delay={110} />
      </div>
    </AbsoluteFill>
  );
};
