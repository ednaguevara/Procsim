import { useState, useEffect } from "react";

const COLORS = {
  bg: "#0F1117",
  panel: "#1A1D2E",
  panelBorder: "#2A2D3E",
  cardBg: "#1E2130",
  blue: "#4F8EF7",
  blueLight: "#7AABFF",
  yellow: "#F7C94F",
  green: "#4FD1A5",
  red: "#F7706A",
  textPrimary: "#E2E8F0",
  textSecondary: "#8892A4",
  textMuted: "#555E6E",
  inputBg: "#13151F",
  highlight: "#2D3A5C",
};

const CASOS = [
  { id: 1, label: "Caso 1 — M/M/1 Simple" },
  { id: 2, label: "Caso 2 — En Serie" },
  { id: 3, label: "Caso 3 — Compuerta XOR" },
];

// ─── NODE SHAPES ──────────────────────────────────────────────────────────────

function CircleNode({ x, y, label, color, active, onClick }) {
  const c = color || COLORS.blue;
  return (
    <g style={{ cursor: "pointer" }} onClick={onClick}>
      <circle cx={x} cy={y} r={22} fill={active ? c : COLORS.cardBg}
        stroke={c} strokeWidth={2} />
      {label && (
        <text x={x} y={y + 35} textAnchor="middle" fill={COLORS.textSecondary}
          fontSize={11} fontFamily="JetBrains Mono">
          {label}
        </text>
      )}
    </g>
  );
}

function RectNode({ x, y, w = 72, h = 44, label, color, active, onClick }) {
  const c = color || COLORS.blue;
  return (
    <g style={{ cursor: "pointer" }} onClick={onClick}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={6}
        fill={active ? `${c}22` : COLORS.cardBg}
        stroke={c} strokeWidth={2} />
      <text x={x} y={y + 4} textAnchor="middle" fill={COLORS.textPrimary}
        fontSize={11} fontFamily="JetBrains Mono">
        {label}
      </text>
    </g>
  );
}

function DiamondNode({ x, y, label, subLabel, active, onClick }) {
  const size = 32;
  const points = `${x},${y - size} ${x + size},${y} ${x},${y + size} ${x - size},${y}`;
  return (
    <g style={{ cursor: "pointer" }} onClick={onClick}>
      <polygon points={points}
        fill={active ? `${COLORS.yellow}22` : COLORS.cardBg}
        stroke={COLORS.yellow} strokeWidth={2} />
      <text x={x} y={y - 4} textAnchor="middle" fill={COLORS.yellow}
        fontSize={10} fontFamily="JetBrains Mono" fontWeight="bold">
        {label}
      </text>
      {subLabel && (
        <text x={x} y={y + 8} textAnchor="middle" fill={COLORS.textSecondary}
          fontSize={9} fontFamily="JetBrains Mono">
          {subLabel}
        </text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, label, color, dashed }) {
  const c = color || COLORS.textMuted;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ex = x2 - ux * 10, ey = y2 - uy * 10;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x1} y1={y1} x2={ex} y2={ey}
        stroke={c} strokeWidth={1.5}
        strokeDasharray={dashed ? "5,4" : "none"} />
      <polygon
        points={`${x2},${y2} ${x2 - ux * 10 - uy * 5},${y2 - uy * 10 + ux * 5} ${x2 - ux * 10 + uy * 5},${y2 - uy * 10 - ux * 5}`}
        fill={c} />
      {label && (
        <text x={mx} y={my - 8} textAnchor="middle" fill={c}
          fontSize={10} fontFamily="JetBrains Mono">
          {label}
        </text>
      )}
    </g>
  );
}

// ─── DIAGRAMS ─────────────────────────────────────────────────────────────────

function Diagram1({ active, onNodeClick }) {
  const a = active || {};
  return (
    <svg width="100%" viewBox="0 0 400 130" style={{ overflow: "visible" }}>
      <Arrow x1={55} y1={60} x2={108} y2={60} />
      <Arrow x1={182} y1={60} x2={235} y2={60} />
      <CircleNode x={35} y={60} label="Llegada" active={a.llegada} onClick={() => onNodeClick("llegada")} />
      <RectNode x={145} y={60} label="Taquilla" active={a.taquilla} onClick={() => onNodeClick("taquilla")} />
      <CircleNode x={258} y={60} label="Salida" color={COLORS.green} active={a.salida} onClick={() => onNodeClick("salida")} />
    </svg>
  );
}

function Diagram2({ active, onNodeClick }) {
  const a = active || {};
  return (
    <svg width="100%" viewBox="0 0 560 130" style={{ overflow: "visible" }}>
      <Arrow x1={55} y1={60} x2={108} y2={60} />
      <Arrow x1={182} y1={60} x2={235} y2={60} />
      <Arrow x1={309} y1={60} x2={362} y2={60} />
      <Arrow x1={436} y1={60} x2={489} y2={60} />
      <CircleNode x={35} y={60} label="Llegada" active={a.llegada} onClick={() => onNodeClick("llegada")} />
      <RectNode x={145} y={60} label="Taquilla" active={a.taquilla} onClick={() => onNodeClick("taquilla")} />
      <RectNode x={272} y={60} label="Revisión" active={a.revision} onClick={() => onNodeClick("revision")} />
      <RectNode x={399} y={60} label="Entrada" active={a.entrada} onClick={() => onNodeClick("entrada")} />
      <CircleNode x={510} y={60} label="Sala" color={COLORS.green} active={a.sala} onClick={() => onNodeClick("sala")} />
    </svg>
  );
}

function Diagram3({ active, onNodeClick }) {
  const a = active || {};
  return (
    <svg width="100%" viewBox="0 0 580 230" style={{ overflow: "visible" }}>
      {/* Main flow */}
      <Arrow x1={55} y1={90} x2={108} y2={90} />
      <Arrow x1={182} y1={90} x2={238} y2={90} />
      {/* Gateway to branches */}
      <Arrow x1={272} y1={60} x2={340} y2={30} label="Sí" color={COLORS.yellow} />
      <Arrow x1={272} y1={120} x2={340} y2={170} label="No" color={COLORS.textSecondary} />
      {/* Branch exits */}
      <Arrow x1={414} y1={30} x2={490} y2={30} />
      <Arrow x1={414} y1={170} x2={490} y2={170} />

      <CircleNode x={35} y={90} label="Llegada" active={a.llegada} onClick={() => onNodeClick("llegada")} />
      <RectNode x={145} y={90} label="Taquilla" active={a.taquilla} onClick={() => onNodeClick("taquilla")} />
      <DiamondNode x={270} y={90} label="XOR" subLabel="¿Dulces?" active={a.gateway} onClick={() => onNodeClick("gateway")} />
      <RectNode x={377} y={30} w={74} label="Comprar" active={a.comprar} color={COLORS.yellow} onClick={() => onNodeClick("comprar")} />
      <RectNode x={377} y={170} w={74} label="Ir a sala" active={a.sala} color={COLORS.blue} onClick={() => onNodeClick("sala")} />
      <CircleNode x={512} y={30} label="Salida A" color={COLORS.green} active={a.salidaA} onClick={() => onNodeClick("salidaA")} />
      <CircleNode x={512} y={170} label="Salida B" color={COLORS.green} active={a.salidaB} onClick={() => onNodeClick("salidaB")} />
    </svg>
  );
}

const DIAGRAMS = { 1: Diagram1, 2: Diagram2, 3: Diagram3 };

// ─── SIMULATION STEP SEQUENCES ───────────────────────────────────────────────

const STEPS = {
  1: [
    { node: "llegada", msg: "Cliente #1 llega al sistema (t=0.0 min)" },
    { node: "taquilla", msg: "Inicia atención en taquilla (t=0.0 → 2.3 min)" },
    { node: "salida", msg: "Cliente sale del sistema (t=2.3 min)" },
    { node: "llegada", msg: "Cliente #2 llega (t=2.8 min) — fila: 0" },
    { node: "taquilla", msg: "Inicia atención (t=2.8 → 5.1 min)" },
    { node: "salida", msg: "Cliente #2 sale (t=5.1 min)" },
  ],
  2: [
    { node: "llegada", msg: "Cliente llega (t=0.0 min)" },
    { node: "taquilla", msg: "Compra boleto en taquilla (t=0.0 → 1.8 min)" },
    { node: "revision", msg: "Revisión de boleto (t=1.8 → 2.4 min)" },
    { node: "entrada", msg: "Pasa por entrada (t=2.4 → 2.9 min)" },
    { node: "sala", msg: "Cliente en sala (t=2.9 min)" },
  ],
  3: [
    { node: "llegada", msg: "Cliente llega (t=0.0 min)" },
    { node: "taquilla", msg: "Compra boleto en taquilla (t=0.0 → 2.1 min)" },
    { node: "gateway", msg: "Evaluando compuerta XOR — ¿quiere dulces?" },
    { node: "comprar", msg: "Sí → Compra dulces en dulcería (t=2.1 → 4.5 min)" },
    { node: "salidaA", msg: "Cliente entra a sala con dulces (t=4.5 min)" },
  ],
};

// ─── RESULTS DATA ─────────────────────────────────────────────────────────────

const RESULTS = {
  1: {
    metrics: [
      { key: "λ (tasa llegada)", value: "0.42 cl/min" },
      { key: "μ (tasa servicio)", value: "0.50 cl/min" },
      { key: "ρ (utilización)", value: "84.0%" },
      { key: "Lq (en cola)", value: "4.41 cl" },
      { key: "Wq (espera cola)", value: "10.50 min" },
      { key: "W (tiempo sistema)", value: "12.50 min" },
    ],
    rows: [
      ["1", "0.0", "0.0", "2.3", "2.3", "0"],
      ["2", "2.8", "0.0", "5.1", "2.3", "0"],
      ["3", "4.1", "1.0", "7.4", "2.3", "1"],
      ["4", "5.9", "1.5", "9.7", "2.3", "2"],
      ["5", "7.3", "2.4", "11.8", "2.5", "1"],
    ],
    headers: ["#", "Llegada", "Espera", "Salida", "T.Serv", "En cola"],
  },
  2: {
    metrics: [
      { key: "λ (tasa llegada)", value: "0.38 cl/min" },
      { key: "Nodos en serie", value: "3" },
      { key: "T. total prom.", value: "5.8 min" },
      { key: "Cuello de botella", value: "Taquilla" },
      { key: "ρ taquilla", value: "76.0%" },
      { key: "W (sistema)", value: "8.2 min" },
    ],
    rows: [
      ["1", "0.0", "1.8", "2.4", "2.9", "5.1"],
      ["2", "2.6", "4.4", "5.0", "5.5", "7.9"],
      ["3", "5.1", "6.3", "7.1", "7.6", "9.4"],
    ],
    headers: ["#", "Llegada", "Fin Taq.", "Fin Rev.", "Fin Ent.", "T.Total"],
  },
  3: {
    metrics: [
      { key: "λ (tasa llegada)", value: "0.40 cl/min" },
      { key: "P(quiere dulces)", value: "55%" },
      { key: "T. prom. con dulces", value: "6.3 min" },
      { key: "T. prom. sin dulces", value: "3.9 min" },
      { key: "W prom. ponderado", value: "5.2 min" },
      { key: "ρ taquilla", value: "80.0%" },
    ],
    rows: [
      ["1", "0.0", "2.1", "Sí", "4.5", "6.6"],
      ["2", "1.4", "3.7", "No", "—", "4.8"],
      ["3", "3.2", "5.9", "Sí", "8.4", "9.7"],
      ["4", "5.0", "7.3", "No", "—", "6.8"],
      ["5", "6.8", "9.2", "Sí", "12.1", "13.4"],
    ],
    headers: ["#", "Llegada", "Fin Taq.", "¿Dulces?", "Fin Dulc.", "Salida"],
  },
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("modelo");
  const [caso, setCaso] = useState(3);
  const [activeNode, setActiveNode] = useState(null);
  const [stepIndex, setStepIndex] = useState(-1);
  const [simRunning, setSim] = useState(false);
  const [tSim, setTSim] = useState("120");
  const [llegada, setLlegada] = useState("2.4");
  const [servicio, setServicio] = useState("2.0");
  const [prob, setProb] = useState("0.55");
  const [log, setLog] = useState([]);

  const steps = STEPS[caso] || [];
  const results = RESULTS[caso];
  const DiagramComp = DIAGRAMS[caso];

  useEffect(() => {
    setActiveNode(null);
    setStepIndex(-1);
    setSim(false);
    setLog([]);
  }, [caso]);

  const handleSimulate = () => {
    setSim(true);
    setTab("modelo");
    setStepIndex(0);
    setLog([]);
  };

  useEffect(() => {
    if (!simRunning || stepIndex < 0 || stepIndex >= steps.length) {
      if (simRunning && stepIndex >= steps.length) {
        setSim(false);
        setActiveNode(null);
        setTimeout(() => setTab("resultados"), 600);
      }
      return;
    }
    const s = steps[stepIndex];
    setActiveNode(s.node);
    setLog((prev) => [...prev, s.msg]);
    const t = setTimeout(() => setStepIndex((i) => i + 1), 900);
    return () => clearTimeout(t);
  }, [simRunning, stepIndex]);

  const activeMap = activeNode ? { [activeNode]: true } : {};

  const btnStyle = (active) => ({
    padding: "6px 16px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontFamily: "JetBrains Mono, monospace",
    fontSize: 12,
    fontWeight: 600,
    background: active ? COLORS.blue : COLORS.panelBorder,
    color: active ? "#fff" : COLORS.textSecondary,
    transition: "all 0.15s",
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      color: COLORS.textPrimary,
      fontFamily: "Inter, sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        background: COLORS.panel,
        borderBottom: `1px solid ${COLORS.panelBorder}`,
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}>
        <div style={{
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: 700,
          fontSize: 15,
          color: COLORS.blue,
          letterSpacing: 1,
        }}>
          PROCSIM
        </div>
        <div style={{ color: COLORS.textMuted, fontSize: 12 }}>
          Simulador de Eventos Discretos
        </div>
        <div style={{ flex: 1 }} />
        {/* Caso selector */}
        <div style={{ display: "flex", gap: 6 }}>
          {CASOS.map((c) => (
            <button key={c.id} onClick={() => setCaso(c.id)} style={btnStyle(caso === c.id)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        background: COLORS.panel,
        borderBottom: `1px solid ${COLORS.panelBorder}`,
        padding: "0 24px",
        display: "flex",
        gap: 0,
      }}>
        {["modelo", "resultados"].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: "none",
            border: "none",
            borderBottom: tab === t ? `2px solid ${COLORS.blue}` : "2px solid transparent",
            color: tab === t ? COLORS.blue : COLORS.textSecondary,
            padding: "10px 20px",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            fontWeight: 500,
            textTransform: "capitalize",
            transition: "all 0.15s",
          }}>
            {t === "modelo" ? "📐 Modelo" : "📊 Resultados"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", gap: 0 }}>

        {tab === "modelo" && (
          <>
            {/* Left: Parameters */}
            <div style={{
              width: 220,
              background: COLORS.panel,
              borderRight: `1px solid ${COLORS.panelBorder}`,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}>
              <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: "JetBrains Mono, monospace", letterSpacing: 1, textTransform: "uppercase" }}>
                Parámetros
              </div>

              {[
                { label: "T. entre llegadas (min)", val: llegada, set: setLlegada },
                { label: "T. de servicio (min)", val: servicio, set: setServicio },
                ...(caso === 3 ? [{ label: "P(dulces)", val: prob, set: setProb }] : []),
                { label: "T. simulación (min)", val: tSim, set: setTSim },
              ].map(({ label, val, set }) => (
                <div key={label}>
                  <div style={{ fontSize: 11, color: COLORS.textSecondary, marginBottom: 4 }}>{label}</div>
                  <input
                    value={val}
                    onChange={(e) => set(e.target.value)}
                    style={{
                      width: "100%",
                      background: COLORS.inputBg,
                      border: `1px solid ${COLORS.panelBorder}`,
                      borderRadius: 5,
                      padding: "6px 10px",
                      color: COLORS.textPrimary,
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 13,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}

              <div style={{ flex: 1 }} />

              <button
                onClick={handleSimulate}
                disabled={simRunning}
                style={{
                  background: simRunning ? COLORS.panelBorder : COLORS.blue,
                  border: "none",
                  borderRadius: 7,
                  padding: "10px 0",
                  color: simRunning ? COLORS.textMuted : "#fff",
                  fontFamily: "JetBrains Mono, monospace",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: simRunning ? "not-allowed" : "pointer",
                  letterSpacing: 0.5,
                  transition: "all 0.15s",
                }}
              >
                {simRunning ? "▶ Simulando..." : "▶ Simular"}
              </button>

              {/* Log */}
              {log.length > 0 && (
                <div style={{
                  background: COLORS.inputBg,
                  borderRadius: 6,
                  padding: 10,
                  fontSize: 10,
                  fontFamily: "JetBrains Mono, monospace",
                  color: COLORS.green,
                  maxHeight: 140,
                  overflowY: "auto",
                  lineHeight: 1.8,
                  border: `1px solid ${COLORS.panelBorder}`,
                }}>
                  {log.map((l, i) => <div key={i}>→ {l}</div>)}
                </div>
              )}
            </div>

            {/* Center: Diagram */}
            <div style={{ flex: 1, padding: 40, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{
                background: COLORS.cardBg,
                borderRadius: 12,
                border: `1px solid ${COLORS.panelBorder}`,
                padding: "32px 24px",
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <DiagramComp active={activeMap} onNodeClick={(n) => setActiveNode(activeNode === n ? null : n)} />
              </div>

              {/* Legend */}
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                {[
                  { shape: "○", label: "Evento (llegada/salida)", color: COLORS.blue },
                  { shape: "□", label: "Actividad (proceso)", color: COLORS.blue },
                  { shape: "◇", label: "Compuerta XOR", color: COLORS.yellow },
                ].map(({ shape, label, color }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: COLORS.textSecondary }}>
                    <span style={{ color, fontSize: 14 }}>{shape}</span>
                    {label}
                  </div>
                ))}
                <div style={{ flex: 1 }} />
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>
                  Haz click en un nodo para resaltarlo
                </div>
              </div>
            </div>
          </>
        )}

        {tab === "resultados" && (
          <div style={{ flex: 1, padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Metrics cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {results.metrics.map(({ key, value }) => (
                <div key={key} style={{
                  background: COLORS.cardBg,
                  border: `1px solid ${COLORS.panelBorder}`,
                  borderRadius: 10,
                  padding: "16px 20px",
                }}>
                  <div style={{ fontSize: 11, color: COLORS.textSecondary, marginBottom: 6, fontFamily: "JetBrains Mono, monospace" }}>{key}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.blue, fontFamily: "JetBrains Mono, monospace" }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div style={{
              background: COLORS.cardBg,
              border: `1px solid ${COLORS.panelBorder}`,
              borderRadius: 10,
              overflow: "hidden",
            }}>
              <div style={{
                padding: "14px 20px",
                borderBottom: `1px solid ${COLORS.panelBorder}`,
                fontSize: 12,
                color: COLORS.textSecondary,
                fontFamily: "JetBrains Mono, monospace",
                letterSpacing: 0.5,
              }}>
                Registro de eventos — {CASOS.find(c => c.id === caso)?.label}
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: COLORS.inputBg }}>
                    {results.headers.map((h) => (
                      <th key={h} style={{
                        padding: "10px 20px",
                        textAlign: "left",
                        fontSize: 11,
                        fontFamily: "JetBrains Mono, monospace",
                        color: COLORS.textMuted,
                        fontWeight: 600,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.rows.map((row, i) => (
                    <tr key={i} style={{
                      borderTop: `1px solid ${COLORS.panelBorder}`,
                      background: i % 2 === 0 ? "transparent" : `${COLORS.inputBg}55`,
                    }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{
                          padding: "10px 20px",
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: 13,
                          color: cell === "Sí" ? COLORS.yellow : cell === "No" ? COLORS.textSecondary : COLORS.textPrimary,
                        }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer note */}
            <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: "JetBrains Mono, monospace" }}>
              * Resultados generados con T.sim = {tSim} min · Distribución exponencial · Modelo M/M/1
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
