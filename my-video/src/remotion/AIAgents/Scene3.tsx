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

// SVG Icons as components
const SearchIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke={COLORS.indigo} strokeWidth="2" />
    <line x1="16.5" y1="16.5" x2="22" y2="22" stroke={COLORS.indigo} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const CodeIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <polyline points="16,18 22,12 16,6" stroke={COLORS.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="8,6 2,12 8,18" stroke={COLORS.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ApiIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="3" width="20" height="14" rx="2" stroke={COLORS.indigo} strokeWidth="2" />
    <line x1="8" y1="21" x2="16" y2="21" stroke={COLORS.indigo} strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="17" x2="12" y2="21" stroke={COLORS.indigo} strokeWidth="2" strokeLinecap="round" />
    <path d="M7 8h2l2 4 2-4h2" stroke={COLORS.indigo} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ContextIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={COLORS.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StorageIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="5" rx="9" ry="3" stroke={COLORS.green} strokeWidth="2" />
    <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" stroke={COLORS.green} strokeWidth="2" />
    <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" stroke={COLORS.green} strokeWidth="2" />
  </svg>
);

const RetrievalIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <polyline points="1,4 1,10 7,10" stroke={COLORS.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.51 15a9 9 0 102.13-9.36L1 10" stroke={COLORS.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface CardData {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}

const TOOLS: CardData[] = [
  { icon: <SearchIcon />, title: "Web Search", desc: "Real-time info retrieval", color: COLORS.indigo },
  { icon: <CodeIcon />, title: "Code Exec", desc: "Run & test code directly", color: COLORS.indigo },
  { icon: <ApiIcon />, title: "APIs & Apps", desc: "Connect any external service", color: COLORS.indigo },
];

const MEMORY: CardData[] = [
  { icon: <ContextIcon />, title: "Context", desc: "Active conversation window", color: COLORS.green },
  { icon: <StorageIcon />, title: "Long-term", desc: "Persistent vector storage", color: COLORS.green },
  { icon: <RetrievalIcon />, title: "Retrieval", desc: "Fetch past knowledge fast", color: COLORS.green },
];

const Card: React.FC<{ data: CardData; delay: number }> = ({ data, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 100, mass: 0.6 },
    durationInFrames: 35,
  });
  const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        background: COLORS.grayDark,
        border: `2px solid ${data.color}44`,
        borderRadius: 20,
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 12,
        flex: 1,
        opacity,
        transform: `scale(${s}) translateY(${(1 - s) * 24}px)`,
        boxShadow: `0 0 24px ${data.color}22`,
      }}
    >
      <div>{data.icon}</div>
      <div
        style={{
          fontFamily,
          fontSize: 30,
          fontWeight: 700,
          color: COLORS.white,
          lineHeight: 1.2,
        }}
      >
        {data.title}
      </div>
      <div
        style={{
          fontFamily,
          fontSize: 26,
          fontWeight: 400,
          color: COLORS.gray,
          lineHeight: 1.3,
        }}
      >
        {data.desc}
      </div>
    </div>
  );
};

const ColumnHeader: React.FC<{
  label: string;
  color: string;
  delay: number;
}> = ({ label, color, delay }) => {
  const opacity = useFadeIn(delay, delay + 15);
  const s = useSpringIn(delay, 180);
  return (
    <div
      style={{
        fontFamily,
        fontSize: 40,
        fontWeight: 800,
        color,
        letterSpacing: "0.1em",
        opacity,
        transform: `translateY(${(1 - s) * -16}px)`,
        textAlign: "center",
        borderBottom: `3px solid ${color}`,
        paddingBottom: 14,
        marginBottom: 4,
      }}
    >
      {label}
    </div>
  );
};

export const Scene3: React.FC = () => {
  const titleOpacity = useFadeIn(0, 20);
  const subtitleOpacity = useFadeIn(15, 30);
  const subtitleS = useSpringIn(15, 180);

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
          paddingBottom: SAFE.bottom + 20,
          gap: 32,
        }}
      >
        <SceneLabel text="Capabilities" delay={0} />

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
          Agents Have{" "}
          <span style={{ color: COLORS.indigo }}>Super</span>
          <span style={{ color: COLORS.green }}>powers</span>
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
          Tools extend what they can do. Memory stores what they know.
        </div>

        {/* Two column layout */}
        <div
          style={{
            display: "flex",
            gap: 36,
            flex: 1,
            width: "100%",
          }}
        >
          {/* Tools column */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <ColumnHeader label="🔧 TOOLS" color={COLORS.indigo} delay={20} />
            {TOOLS.map((tool, i) => (
              <Card key={tool.title} data={tool} delay={30 + i * 12} />
            ))}
          </div>

          {/* Divider */}
          <DividerLine delay={25} />

          {/* Memory column */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <ColumnHeader label="🧠 MEMORY" color={COLORS.green} delay={20} />
            {MEMORY.map((mem, i) => (
              <Card key={mem.title} data={mem} delay={66 + i * 12} />
            ))}
          </div>
        </div>

        {/* Bottom stat */}
        <BottomStat delay={110} />
      </div>
    </AbsoluteFill>
  );
};

const DividerLine: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 60 },
    durationInFrames: 40,
  });

  return (
    <div
      style={{
        width: 2,
        background: `linear-gradient(to bottom, transparent, ${COLORS.grayMid}, transparent)`,
        height: `${progress * 100}%`,
        flexShrink: 0,
        alignSelf: "center",
      }}
    />
  );
};

const BottomStat: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const count = Math.floor(
    interpolate(frame, [delay, delay + 50], [0, 100], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    })
  );
  const opacity = useFadeIn(delay, delay + 15);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity,
        background: COLORS.grayDark,
        border: `1px solid ${COLORS.grayMid}`,
        borderRadius: 16,
        padding: "20px 36px",
      }}
    >
      <span
        style={{
          fontFamily,
          fontSize: 52,
          fontWeight: 800,
          color: COLORS.indigo,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {count}+
      </span>
      <span
        style={{
          fontFamily,
          fontSize: 34,
          fontWeight: 400,
          color: COLORS.gray,
        }}
      >
        tools available in MCP ecosystem
      </span>
    </div>
  );
};
