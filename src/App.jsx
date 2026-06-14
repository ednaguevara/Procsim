import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const COLORS = {
  bg: "#0F1117",
  panel: "#1A1D2E",
  panelBorder: "#2A2D3E",
  cardBg: "#1E2130",
  blue: "#4F8EF7",
  yellow: "#F7C94F",
  green: "#4FD1A5",
  textPrimary: "#E2E8F0",
  textSecondary: "#8892A4",
  textMuted: "#555E6E",
  inputBg: "#13151F",
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
      <circle cx={x} cy={y} r={20} fill={active ? c : COLORS.cardBg} stroke={c} strokeWidth={2} />
      {label && (
        <text x={x} y={y + 32} textAnchor="middle" fill={COLORS.textSecondary} fontSize={10} fontFamily="JetBrains Mono">
          {label}
        </text>
      )}
    </g>
  );
}

function RectNode({ x, y, w = 68, h = 40, label, color, active, onClick }) {
  const c = color || COLORS.blue;
  return (
    <g style={{ cursor: "pointer" }} onClick={onClick}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={5}
        fill={active ? `${c}22` : COLORS.cardBg} stroke={c} strokeWidth={2} />
      <text x={x} y={y + 4} textAnchor="middle" fill={COLORS.textPrimary} fontSize={10} fontFamily="JetBrains Mono">
        {label}
      </text>
    </g>
  );
}

function DiamondNode({ x, y, label, subLabel, active, onClick }) {
  const s = 28;
  const points = `${x},${y - s} ${x + s},${y} ${x},${y + s} ${x - s},${y}`;
  return (
    <g style={{ cursor: "pointer" }} onClick={onClick}>
      <polygon points={points} fill={active ? `${COLORS.yellow}22` : COLORS.cardBg} stroke={COLORS.yellow} strokeWidth={2} />
      <text x={x} y={y - 3} textAnchor="middle" fill={COLORS.yellow} fontSize={9} fontFamily="JetBrains Mono" fontWeight="bold">{label}</text>
      {subLabel && <text x={x} y={y + 9} textAnchor="middle" fill={COLORS.textSecondary} fontSize={8} fontFamily="JetBrains Mono">{subLabel}</text>}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, label, color }) {
  const c = color || COLORS.textMuted;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ex = x2 - ux * 9, ey = y2 - uy * 9;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={c} strokeWidth={1.5} />
      <polygon points={`${x2},${y2} ${x2 - ux * 9 - uy * 4},${y2 - uy * 9 + ux * 4} ${x2 - ux * 9 + uy * 4},${y2 - uy * 9 - ux * 4}`} fill={c} />
      {label && <text x={mx} y={my - 7} textAnchor="middle" fill={c} fontSize={9} fontFamily="JetBrains Mono">{label}</text>}
    </g>
  );
}

// ─── DIAGRAMS ─────────────────────────────────────────────────────────────────

function Diagram1({ active, onNodeClick }) {
  const a = active || {};
  return (
    <svg width="100%" viewBox="0 0 360 100" style={{ overflow: "visible" }}>
      <Arrow x1={50} y1={50} x2={100} y2={50} />
      <Arrow x1={168} y1={50} x2={218} y2={50} />
      <CircleNode x={30} y={50} label="Llegada" active={a.llegada} onClick={() => onNodeClick("llegada")} />
      <RectNode x={134} y={50} label="Taquilla" active={a.taquilla} onClick={() => onNodeClick("taquilla")} />
      <CircleNode x={238} y={50} label="Salida" color={COLORS.green} active={a.salida} onClick={() => onNodeClick("salida")} />
    </svg>
  );
}

function Diagram2({ active, onNodeClick }) {
  const a = active || {};
  return (
    <svg width="100%" viewBox="0 0 520 100" style={{ overflow: "visible" }}>
      <Arrow x1={50} y1={50} x2={100} y2={50} />
      <Arrow x1={168} y1={50} x2={218} y2={50} />
      <Arrow x1={286} y1={50} x2={336} y2={50} />
      <Arrow x1={404} y1={50} x2={454} y2={50} />
      <CircleNode x={30} y={50} label="Llegada" active={a.llegada} onClick={() => onNodeClick("llegada")} />
      <RectNode x={134} y={50} label="Taquilla" active={a.taquilla} onClick={() => onNodeClick("taquilla")} />
      <RectNode x={252} y={50} label="Revisión" active={a.revision} onClick={() => onNodeClick("revision")} />
      <RectNode x={370} y={50} label="Entrada" active={a.entrada} onClick={() => onNodeClick("entrada")} />
      <CircleNode x={474} y={50} label="Sala" color={COLORS.green} active={a.sala} onClick={() => onNodeClick("sala")} />
    </svg>
  );
}

function Diagram3({ active, onNodeClick }) {
  const a = active || {};
  return (
    <svg width="100%" viewBox="0 0 540 200" style={{ overflow: "visible" }}>
      <Arrow x1={50} y1={90} x2={100} y2={90} />
      <Arrow x1={168} y1={90} x2={218} y2={90} />
      <Arrow x1={250} y1={62} x2={310} y2={30} label="Sí" color={COLORS.yellow} />
      <Arrow x1={250} y1={118} x2={310} y2={155} label="No" color={COLORS.textSecondary} />
      <Arrow x1={384} y1={30} x2={450} y2={30} />
      <Arrow x1={384} y1={155} x2={450} y2={155} />
      <CircleNode x={30} y={90} label="Llegada" active={a.llegada} onClick={() => onNodeClick("llegada")} />
      <RectNode x={134} y={90} label="Taquilla" active={a.taquilla} onClick={() => onNodeClick("taquilla")} />
      <DiamondNode x={246} y={90} label="XOR" subLabel="¿Dulces?" active={a.gateway} onClick={() => onNodeClick("gateway")} />
      <RectNode x={347} y={30} w={70} label="Comprar" active={a.comprar} color={COLORS.yellow} onClick={() => onNodeClick("comprar")} />
      <RectNode x={347} y={155} w={70} label="Ir a sala" active={a.sala} color={COLORS.blue} onClick={() => onNodeClick("sala")} />
      <CircleNode x={470} y={30} label="Salida A" color={COLORS.green} active={a.salidaA} onClick={() => onNodeClick("salidaA")} />
      <CircleNode x={470} y={155} label="Salida B" color={COLORS.green} active={a.salidaB} onClick={() => onNodeClick("salidaB")} />
    </svg>
  );
}

const DIAGRAMS = { 1: Diagram1, 2: Diagram2, 3: Diagram3 };

// ─── DATA ─────────────────────────────────────────────────────────────────────

const STEPS = {
  1: [
    { node: "llegada", msg: "Cliente #1 llega (t=0.0 min)" },
    { node: "taquilla", msg: "Atención en taquilla (t=0.0 → 2.3 min)" },
    { node: "salida", msg: "Cliente #1 sale (t=2.3 min)" },
    { node: "llegada", msg: "Cliente #2 llega (t=2.8 min)" },
    { node: "taquilla", msg: "Atención en taquilla (t=2.8 → 5.1 min)" },
    { node: "salida", msg: "Cliente #2 sale (t=5.1 min)" },
  ],
  2: [
    { node: "llegada", msg: "Cliente llega (t=0.0 min)" },
    { node: "taquilla", msg: "Compra boleto (t=0.0 → 1.8 min)" },
    { node: "revision", msg: "Revisión de boleto (t=1.8 → 2.4 min)" },
    { node: "entrada", msg: "Pasa por entrada (t=2.4 → 2.9 min)" },
    { node: "sala", msg: "Cliente en sala (t=2.9 min)" },
  ],
  3: [
    { node: "llegada", msg: "Cliente llega (t=0.0 min)" },
    { node: "taquilla", msg: "Compra boleto (t=0.0 → 2.1 min)" },
    { node: "gateway", msg: "Evaluando compuerta XOR — ¿quiere dulces?" },
    { node: "comprar", msg: "Sí → Compra dulces (t=2.1 → 4.5 min)" },
    { node: "salidaA", msg: "Entra a sala con dulces (t=4.5 min)" },
  ],
};

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
    headers: ["#", "Llegada", "Espera", "Salida", "T.Serv", "En cola"],
    rows: [
      ["1", "0.0", "0.0", "2.3", "2.3", "0"],
      ["2", "2.8", "0.0", "5.1", "2.3", "0"],
      ["3", "4.1", "1.0", "7.4", "2.3", "1"],
      ["4", "5.9", "1.5", "9.7", "2.3", "2"],
      ["5", "7.3", "2.4", "11.8", "2.5", "1"],
    ],
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
    headers: ["#", "Llegada", "Fin Taq.", "Fin Rev.", "Fin Ent.", "T.Total"],
    rows: [
      ["1", "0.0", "1.8", "2.4", "2.9", "5.1"],
      ["2", "2.6", "4.4", "5.0", "5.5", "7.9"],
      ["3", "5.1", "6.3", "7.1", "7.6", "9.4"],
    ],
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
    headers: ["#", "Llegada", "Fin Taq.", "¿Dulces?", "Fin Dulc.", "Salida"],
    rows: [
      ["1", "0.0", "2.1", "Sí", "4.5", "6.6"],
      ["2", "1.4", "3.7", "No", "—", "4.8"],
      ["3", "3.2", "5.9", "Sí", "8.4", "9.7"],
      ["4", "5.0", "7.3", "No", "—", "6.8"],
      ["5", "6.8", "9.2", "Sí", "12.1", "13.4"],
    ],
  },
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [caso, setCaso] = useState(3);
  const [activeNode, setActiveNode] = useState(null);
  const [stepIndex, setStepIndex] = useState(-1);
  const [simRunning, setSim] = useState(false);
  const [simDone, setSimDone] = useState(false);
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
    setSimDone(false);
    setLog([]);
  }, [caso]);

  const handleSimulate = () => {
    setSim(true);
    setSimDone(false);
    setStepIndex(0);
    setLog([]);
    setActiveNode(null);
  };

  useEffect(() => {
    if (!simRunning || stepIndex < 0) return;
    if (stepIndex >= steps.length) {
      setSim(false);
      setSimDone(true);
      setActiveNode(null);
      return;
    }
    const s = steps[stepIndex];
    setActiveNode(s.node);
    setLog((prev) => [...prev, s.msg]);
    const t = setTimeout(() => setStepIndex((i) => i + 1), 900);
    return () => clearTimeout(t);
  }, [simRunning, stepIndex]);

  const handleExport = () => {
    const casoLabel = CASOS.find((c) => c.id === caso)?.label || "";
    const data = [
      ["PROCSIM — Exportación de resultados"],
      [],
      ["PARÁMETROS"],
      ["Caso", casoLabel],
      ["T. entre llegadas (min)", llegada],
      ["T. de servicio (min)", servicio],
      ...(caso === 3 ? [["P(dulces)", prob]] : []),
      ["T. simulación (min)", tSim],
      [],
      ["MÉTRICAS"],
      ...results.metrics.map((m) => [m.key, m.value]),
      [],
      ["REGISTRO DE EVENTOS"],
      results.headers,
      ...results.rows,
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws["!cols"] = [{ wch: 28 }, { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Simulación");
    XLSX.writeFile(wb, `procsim_caso${caso}.xlsx`);
  };

  const activeMap = activeNode ? { [activeNode]: true } : {};

  const input = (label, val, set) => (
    <div key={label}>
      <div style={{ fontSize: 10, color: COLORS.textSecondary, marginBottom: 3 }}>{label}</div>
      <input value={val} onChange={(e) => set(e.target.value)} style={{
        width: "100%", background: COLORS.inputBg, border: `1px solid ${COLORS.panelBorder}`,
        borderRadius: 5, padding: "5px 8px", color: COLORS.textPrimary,
        fontFamily: "JetBrains Mono, monospace", fontSize: 12, boxSizing: "border-box",
      }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.textPrimary, fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ background: COLORS.panel, borderBottom: `1px solid ${COLORS.panelBorder}`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, fontSize: 14, color: COLORS.blue, letterSpacing: 1 }}>PROCSIM</span>
        <span style={{ color: COLORS.textMuted, fontSize: 11 }}>Simulador de Eventos Discretos</span>
        <div style={{ flex: 1 }} />
        {CASOS.map((c) => (
          <button key={c.id} onClick={() => setCaso(c.id)} style={{
            padding: "5px 14px", borderRadius: 6, border: "none", cursor: "pointer",
            fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 600,
            background: caso === c.id ? COLORS.blue : COLORS.panelBorder,
            color: caso === c.id ? "#fff" : COLORS.textSecondary,
          }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Body: 3 columns */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* LEFT: Parameters */}
        <div style={{
          width: 200, background: COLORS.panel, borderRight: `1px solid ${COLORS.panelBorder}`,
          padding: 16, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto",
        }}>
          <div style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: "JetBrains Mono, monospace", letterSpacing: 1, textTransform: "uppercase" }}>Parámetros</div>
          {input("T. entre llegadas (min)", llegada, setLlegada)}
          {input("T. de servicio (min)", servicio, setServicio)}
          {caso === 3 && input("P(dulces)", prob, setProb)}
          {input("T. simulación (min)", tSim, setTSim)}

          <div style={{ flex: 1 }} />

          <button onClick={handleSimulate} disabled={simRunning} style={{
            background: simRunning ? COLORS.panelBorder : COLORS.blue,
            border: "none", borderRadius: 7, padding: "9px 0",
            color: simRunning ? COLORS.textMuted : "#fff",
            fontFamily: "JetBrains Mono, monospace", fontWeight: 700, fontSize: 12,
            cursor: simRunning ? "not-allowed" : "pointer",
          }}>
            {simRunning ? "▶ Simulando..." : "▶ Simular"}
          </button>

          {/* Event log */}
          {log.length > 0 && (
            <div style={{
              background: COLORS.inputBg, borderRadius: 6, padding: 8,
              fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: COLORS.green,
              maxHeight: 160, overflowY: "auto", lineHeight: 1.9,
              border: `1px solid ${COLORS.panelBorder}`,
            }}>
              {log.map((l, i) => <div key={i}>→ {l}</div>)}
              {simDone && <div style={{ color: COLORS.blue, marginTop: 4 }}>✓ Simulación completa</div>}
            </div>
          )}

          {/* Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 8, borderTop: `1px solid ${COLORS.panelBorder}` }}>
            {[
              { shape: "○", label: "Evento", color: COLORS.blue },
              { shape: "□", label: "Actividad", color: COLORS.blue },
              { shape: "◇", label: "Compuerta XOR", color: COLORS.yellow },
            ].map(({ shape, label, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: COLORS.textSecondary }}>
                <span style={{ color, fontSize: 13 }}>{shape}</span>{label}
              </div>
            ))}
          </div>
        </div>

        {/* CENTER: Diagram */}
        <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
          <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: "JetBrains Mono, monospace", letterSpacing: 1, textTransform: "uppercase" }}>
            Modelo — {CASOS.find(c => c.id === caso)?.label}
          </div>
          <div style={{
            background: COLORS.cardBg, borderRadius: 10, border: `1px solid ${COLORS.panelBorder}`,
            padding: "28px 20px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200,
          }}>
            <DiagramComp active={activeMap} onNodeClick={(n) => setActiveNode(activeNode === n ? null : n)} />
          </div>
          <div style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: "JetBrains Mono, monospace" }}>
            Haz click en un nodo para resaltarlo
          </div>
        </div>

        {/* RIGHT: Results */}
        <div style={{
          width: 340, background: COLORS.panel, borderLeft: `1px solid ${COLORS.panelBorder}`,
          padding: 16, display: "flex", flexDirection: "column", gap: 14, overflowY: "auto",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: "JetBrains Mono, monospace", letterSpacing: 1, textTransform: "uppercase" }}>
              Resultados
            </div>
            <button onClick={handleExport} style={{
              background: COLORS.green, border: "none", borderRadius: 5,
              padding: "5px 12px", color: "#0F1117",
              fontFamily: "JetBrains Mono, monospace", fontWeight: 700, fontSize: 10,
              cursor: "pointer",
            }}>
              ⬇ Exportar Excel
            </button>
          </div>

          {/* Metric cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {results.metrics.map(({ key, value }) => (
              <div key={key} style={{
                background: COLORS.cardBg, border: `1px solid ${COLORS.panelBorder}`,
                borderRadius: 8, padding: "10px 12px",
              }}>
                <div style={{ fontSize: 9, color: COLORS.textSecondary, marginBottom: 4, fontFamily: "JetBrains Mono, monospace" }}>{key}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.blue, fontFamily: "JetBrains Mono, monospace" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.panelBorder}`, borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.panelBorder}`, fontSize: 10, color: COLORS.textSecondary, fontFamily: "JetBrains Mono, monospace" }}>
              Registro de eventos
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: COLORS.inputBg }}>
                    {results.headers.map((h) => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.rows.map((row, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${COLORS.panelBorder}`, background: i % 2 === 0 ? "transparent" : `${COLORS.inputBg}55` }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{
                          padding: "7px 10px", fontFamily: "JetBrains Mono, monospace", fontSize: 11,
                          color: cell === "Sí" ? COLORS.yellow : cell === "No" ? COLORS.textSecondary : COLORS.textPrimary,
                        }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ fontSize: 9, color: COLORS.textMuted, fontFamily: "JetBrains Mono, monospace" }}>
            * T.sim = {tSim} min · Distribución exponencial · M/M/1
          </div>
        </div>
      </div>
    </div>
  );
}
