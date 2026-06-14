import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const COLORS = {
  bg: "#F7F8FA",
  white: "#FFFFFF",
  border: "#E4E7ED",
  panel: "#F0F2F5",
  blue: "#5B6AF5",
  blueLight: "#EEF0FE",
  blueDot: "#5B6AF5",
  green: "#22C55E",
  greenLight: "#DCFCE7",
  yellow: "#F59E0B",
  yellowLight: "#FEF3C7",
  red: "#EF4444",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  inputBg: "#FFFFFF",
};

const CASOS = [
  { id: 1, label: "Caso 1 — M/M/1 Simple" },
  { id: 2, label: "Caso 2 — En Serie" },
  { id: 3, label: "Caso 3 — Compuerta XOR" },
];

// ─── NODE SHAPES ──────────────────────────────────────────────────────────────

function CircleNode({ x, y, label, sublabel, color, filled, active, onClick }) {
  const c = color || COLORS.blue;
  return (
    <g style={{ cursor: "pointer" }} onClick={onClick}>
      <circle cx={x} cy={y} r={28} fill={active ? c : COLORS.white} stroke={c} strokeWidth={2.5} />
      {filled && <circle cx={x} cy={y} r={14} fill={c} />}
      {!filled && <rect x={x - 8} y={y - 8} width={16} height={16} rx={3} fill={active ? COLORS.white : c} />}
      {label && (
        <text x={x} y={y + 46} textAnchor="middle" fill={COLORS.textSecondary} fontSize={13} fontFamily="Inter, sans-serif" fontWeight="500">
          {label}
        </text>
      )}
      {sublabel && (
        <text x={x} y={y + 62} textAnchor="middle" fill={COLORS.textMuted} fontSize={11} fontFamily="Inter, sans-serif">
          {sublabel}
        </text>
      )}
    </g>
  );
}

function RectNode({ x, y, w = 200, h = 72, label, sublabel, badge, color, active, onClick }) {
  const c = color || COLORS.blue;
  return (
    <g style={{ cursor: "pointer" }} onClick={onClick}>
      {badge && (
        <text x={x} y={y - h / 2 - 8} textAnchor="middle" fill={COLORS.textMuted} fontSize={10} fontFamily="Inter, sans-serif">
          • {badge}
        </text>
      )}
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={10}
        fill={active ? COLORS.blueLight : COLORS.white}
        stroke={active ? c : COLORS.border} strokeWidth={active ? 2 : 1.5} />
      {/* icon */}
      <rect x={x - w / 2 + 12} y={y - 10} width={18} height={18} rx={4} fill={active ? c : COLORS.blueLight} />
      <text x={x - w / 2 + 21} y={y + 4} textAnchor="middle" fill={active ? COLORS.white : c} fontSize={11} fontFamily="Inter">■</text>
      <text x={x - w / 2 + 38} y={y - 4} textAnchor="start" fill={COLORS.textPrimary} fontSize={14} fontFamily="Inter, sans-serif" fontWeight="600">
        {label}
      </text>
      {sublabel && (
        <text x={x - w / 2 + 38} y={y + 14} textAnchor="start" fill={COLORS.textMuted} fontSize={10} fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.5">
          {sublabel}
        </text>
      )}
      {label && (
        <text x={x} y={y + h / 2 + 18} textAnchor="middle" fill={COLORS.textSecondary} fontSize={12} fontFamily="Inter, sans-serif">
          Servicio
        </text>
      )}
    </g>
  );
}

function DiamondNode({ x, y, label, subLabel, active, onClick }) {
  const s = 34;
  const points = `${x},${y - s} ${x + s},${y} ${x},${y + s} ${x - s},${y}`;
  return (
    <g style={{ cursor: "pointer" }} onClick={onClick}>
      <polygon points={points}
        fill={active ? COLORS.yellowLight : COLORS.white}
        stroke={COLORS.yellow} strokeWidth={2} />
      <text x={x} y={y - 2} textAnchor="middle" fill={COLORS.yellow} fontSize={11} fontFamily="Inter" fontWeight="700">{label}</text>
      {subLabel && <text x={x} y={y + 12} textAnchor="middle" fill={COLORS.textSecondary} fontSize={10} fontFamily="Inter">{subLabel}</text>}
    </g>
  );
}

function DashedArrow({ x1, y1, x2, y2, label, color, vertical }) {
  const c = color || COLORS.textMuted;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ex = x2 - ux * 10, ey = y2 - uy * 10;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={c} strokeWidth={1.5} strokeDasharray="5,4" />
      <polygon points={`${x2},${y2} ${x2 - ux * 10 - uy * 5},${y2 - uy * 10 + ux * 5} ${x2 - ux * 10 + uy * 5},${y2 - uy * 10 - ux * 5}`} fill={c} />
      {label && <text x={mx + (vertical ? 10 : 0)} y={my + (vertical ? 0 : -8)} textAnchor="middle" fill={c} fontSize={11} fontFamily="Inter">{label}</text>}
    </g>
  );
}

// ─── DIAGRAMS ─────────────────────────────────────────────────────────────────

function Diagram1({ active, onNodeClick, stats }) {
  const a = active || {};
  return (
    <svg width="100%" viewBox="0 0 600 160" style={{ overflow: "visible" }}>
      <DashedArrow x1={88} y1={80} x2={178} y2={80} />
      <DashedArrow x1={338} y1={80} x2={428} y2={80} />
      <CircleNode x={60} y={80} label="Llegada de Auto" sublabel={stats ? `${stats.llegadas} autos` : ""} filled active={a.llegada} onClick={() => onNodeClick("llegada")} />
      <RectNode x={258} y={80} label="Taquilla" sublabel="ACTIVIDAD · 1 SERVIDOR" badge={stats ? `${stats.uso}% uso` : ""} active={a.taquilla} onClick={() => onNodeClick("taquilla")} />
      <CircleNode x={456} y={80} label="Fin" sublabel={stats ? `${stats.salidas} salidas` : ""} filled={false} color={COLORS.textMuted} active={a.salida} onClick={() => onNodeClick("salida")} />
    </svg>
  );
}

function Diagram2({ active, onNodeClick, stats }) {
  const a = active || {};
  return (
    <svg width="100%" viewBox="0 0 820 160" style={{ overflow: "visible" }}>
      <DashedArrow x1={88} y1={80} x2={158} y2={80} />
      <DashedArrow x1={318} y1={80} x2={388} y2={80} />
      <DashedArrow x1={548} y1={80} x2={618} y2={80} />
      <DashedArrow x1={778} y1={80} x2={820} y2={80} />
      <CircleNode x={60} y={80} label="Llegada" sublabel={stats ? `${stats.llegadas} ents.` : ""} filled active={a.llegada} onClick={() => onNodeClick("llegada")} />
      <RectNode x={238} y={80} label="Taquilla" sublabel="ACTIVIDAD · 1 SERVIDOR" badge={stats ? `${stats.uso}% uso` : ""} active={a.taquilla} onClick={() => onNodeClick("taquilla")} />
      <RectNode x={468} y={80} label="Revisión" sublabel="ACTIVIDAD · 1 SERVIDOR" active={a.revision} onClick={() => onNodeClick("revision")} />
      <RectNode x={698} y={80} label="Entrada" sublabel="ACTIVIDAD · 1 SERVIDOR" active={a.entrada} onClick={() => onNodeClick("entrada")} />
    </svg>
  );
}

function Diagram3({ active, onNodeClick, stats }) {
  const a = active || {};
  return (
    <svg width="100%" viewBox="0 0 780 260" style={{ overflow: "visible" }}>
      <DashedArrow x1={88} y1={130} x2={158} y2={130} />
      <DashedArrow x1={318} y1={130} x2={388} y2={130} />
      <DashedArrow x1={424} y1={96} x2={504} y2={50} label="Sí" color={COLORS.yellow} />
      <DashedArrow x1={424} y1={164} x2={504} y2={210} label="No" color={COLORS.textMuted} />
      <DashedArrow x1={664} y1={50} x2={720} y2={50} />
      <DashedArrow x1={664} y1={210} x2={720} y2={210} />
      <CircleNode x={60} y={130} label="Llegada" sublabel={stats ? `${stats.llegadas} autos` : ""} filled active={a.llegada} onClick={() => onNodeClick("llegada")} />
      <RectNode x={238} y={130} label="Taquilla" sublabel="ACTIVIDAD · 1 SERVIDOR" badge={stats ? `${stats.uso}% uso` : ""} active={a.taquilla} onClick={() => onNodeClick("taquilla")} />
      <DiamondNode x={422} y={130} label="XOR" subLabel="¿Dulces?" active={a.gateway} onClick={() => onNodeClick("gateway")} />
      <RectNode x={584} y={50} w={160} h={64} label="Comprar" sublabel="ACTIVIDAD · DULCERÍA" active={a.comprar} color={COLORS.yellow} onClick={() => onNodeClick("comprar")} />
      <RectNode x={584} y={210} w={160} h={64} label="Ir a sala" sublabel="ACTIVIDAD · DIRECTO" active={a.sala} onClick={() => onNodeClick("sala")} />
      <CircleNode x={742} y={50} label="Fin A" filled={false} color={COLORS.textMuted} active={a.salidaA} onClick={() => onNodeClick("salidaA")} />
      <CircleNode x={742} y={210} label="Fin B" filled={false} color={COLORS.textMuted} active={a.salidaB} onClick={() => onNodeClick("salidaB")} />
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
    stats: { llegadas: 50, salidas: 43, uso: 84 },
    metrics: [
      { key: "Tiempo de espera", value: "10,5", unit: "min", sub: "Promedio en cola", color: COLORS.blue },
      { key: "Clientes atendidos", value: "43", unit: "", sub: "de 50 llegadas", color: COLORS.blue },
      { key: "Utilización servidor", value: "84,0", unit: "%", sub: "Uso del servidor", color: COLORS.green, bar: 84 },
      { key: "Tiempo en sistema", value: "12,5", unit: "min", sub: "Espera + servicio", color: COLORS.blue },
    ],
    headers: ["Cliente", "Llegada", "Inicio Serv.", "Fin Serv.", "Espera"],
    rows: [
      ["Cliente 1", "0,0", "0,0", "2,3", "• 0,0"],
      ["Cliente 2", "2,8", "2,8", "5,1", "• 0,0"],
      ["Cliente 3", "4,1", "5,1", "7,4", "• 1,0"],
      ["Cliente 4", "5,9", "7,4", "9,7", "• 1,5"],
      ["Cliente 5", "7,3", "9,7", "11,8", "• 2,4"],
    ],
  },
  2: {
    stats: { llegadas: 40, salidas: 37, uso: 76 },
    metrics: [
      { key: "Tiempo total prom.", value: "5,8", unit: "min", sub: "Por cliente", color: COLORS.blue },
      { key: "Clientes atendidos", value: "37", unit: "", sub: "de 40 llegadas", color: COLORS.blue },
      { key: "Utilización taquilla", value: "76,0", unit: "%", sub: "Cuello de botella", color: COLORS.green, bar: 76 },
      { key: "Tiempo en sistema", value: "8,2", unit: "min", sub: "Espera + servicio", color: COLORS.blue },
    ],
    headers: ["Cliente", "Llegada", "Fin Taq.", "Fin Rev.", "Fin Ent.", "T.Total"],
    rows: [
      ["Cliente 1", "0,0", "1,8", "2,4", "2,9", "5,1"],
      ["Cliente 2", "2,6", "4,4", "5,0", "5,5", "7,9"],
      ["Cliente 3", "5,1", "6,3", "7,1", "7,6", "9,4"],
    ],
  },
  3: {
    stats: { llegadas: 50, salidas: 48, uso: 80 },
    metrics: [
      { key: "T. prom. con dulces", value: "6,3", unit: "min", sub: "55% de clientes", color: COLORS.yellow },
      { key: "T. prom. sin dulces", value: "3,9", unit: "min", sub: "45% de clientes", color: COLORS.blue },
      { key: "Utilización taquilla", value: "80,0", unit: "%", sub: "Uso del servidor", color: COLORS.green, bar: 80 },
      { key: "W prom. ponderado", value: "5,2", unit: "min", sub: "Espera + servicio", color: COLORS.blue },
    ],
    headers: ["Cliente", "Llegada", "Fin Taq.", "¿Dulces?", "Fin Dulc.", "Salida"],
    rows: [
      ["Cliente 1", "0,0", "2,1", "Sí", "4,5", "6,6"],
      ["Cliente 2", "1,4", "3,7", "No", "—", "4,8"],
      ["Cliente 3", "3,2", "5,9", "Sí", "8,4", "9,7"],
      ["Cliente 4", "5,0", "7,3", "No", "—", "6,8"],
      ["Cliente 5", "6,8", "9,2", "Sí", "12,1", "13,4"],
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
  const [llegada, setLlegada] = useState("8");
  const [servicio, setServicio] = useState("12");
  const [servidores, setServidores] = useState("2");
  const [prob, setProb] = useState("0.55");
  const [log, setLog] = useState([]);
  const [filterEspera, setFilterEspera] = useState(false);

  const steps = STEPS[caso] || [];
  const results = RESULTS[caso];
  const DiagramComp = DIAGRAMS[caso];
  const casoLabel = CASOS.find((c) => c.id === caso)?.label || "";

  useEffect(() => {
    setActiveNode(null);
    setStepIndex(-1);
    setSim(false);
    setSimDone(false);
    setLog([]);
    setFilterEspera(false);
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
    const data = [
      ["PROCSIM — Exportación de resultados"],
      [],
      ["PARÁMETROS"],
      ["Caso", casoLabel],
      ["T. entre llegadas (min)", llegada],
      ["T. de servicio (min)", servicio],
      ["Servidores", servidores],
      ...(caso === 3 ? [["P(dulces)", prob]] : []),
      ["T. simulación (min)", tSim],
      [],
      ["MÉTRICAS"],
      ...results.metrics.map((m) => [m.key, `${m.value}${m.unit}`]),
      [],
      ["TRAZA DE EVENTOS"],
      results.headers,
      ...results.rows,
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws["!cols"] = [{ wch: 28 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Simulación");
    XLSX.writeFile(wb, `procsim_caso${caso}.xlsx`);
  };

  const activeMap = activeNode ? { [activeNode]: true } : {};

  const filteredRows = filterEspera
    ? results.rows.filter((r) => {
        const espera = r[r.length - 1];
        const num = parseFloat(String(espera).replace("• ", "").replace(",", "."));
        return !isNaN(num) && num > 0;
      })
    : results.rows;

  const inputStyle = {
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 15,
    fontFamily: "Inter, sans-serif",
    color: COLORS.textPrimary,
    background: COLORS.white,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
  };

  const labelStyle = {
    fontSize: 14,
    fontWeight: 500,
    color: COLORS.textPrimary,
    marginBottom: 4,
    display: "block",
  };

  const subLabelStyle = {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.textPrimary, fontFamily: "Inter, sans-serif" }}>

      {/* Top nav */}
      <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.border}`, padding: "0 32px", display: "flex", alignItems: "center", gap: 0, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.blue, padding: "14px 0", marginRight: 32, letterSpacing: 0.5 }}>PROCSIM</div>
        {CASOS.map((c) => (
          <button key={c.id} onClick={() => setCaso(c.id)} style={{
            background: "none", border: "none",
            borderBottom: caso === c.id ? `2px solid ${COLORS.blue}` : "2px solid transparent",
            color: caso === c.id ? COLORS.blue : COLORS.textSecondary,
            padding: "14px 18px", cursor: "pointer",
            fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500,
          }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Page content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Title */}
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: COLORS.textPrimary }}>
            Simulación de proceso — {casoLabel.split("—")[1]?.trim()}
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: COLORS.textSecondary }}>
            Configura los parámetros y ejecuta una réplica de eventos discretos para el modelo seleccionado.
          </p>
        </div>

        {/* ── SECTION 1: Diagram ── */}
        <div style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: "20px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>Modelo</span>
              <span style={{ fontWeight: 600, fontSize: 14, color: COLORS.textPrimary }}>{casoLabel}</span>
            </div>
            <span style={{ fontSize: 12, color: COLORS.textMuted }}>
              {caso === 1 ? "Cola M/M/1 · 1 actividad" : caso === 2 ? "Cola M/M/1 · 3 actividades en serie" : "Cola M/M/1 · Compuerta XOR"}
            </span>
          </div>
          <div style={{ overflowX: "auto", padding: "8px 0 20px" }}>
            <DiagramComp active={activeMap} onNodeClick={(n) => setActiveNode(activeNode === n ? null : n)} stats={simDone ? results.stats : null} />
          </div>
          {/* Log strip */}
          {log.length > 0 && (
            <div style={{ background: COLORS.panel, borderRadius: 8, padding: "10px 16px", fontSize: 12, color: COLORS.textSecondary, fontFamily: "JetBrains Mono, monospace", lineHeight: 1.8, maxHeight: 100, overflowY: "auto" }}>
              {log.map((l, i) => <div key={i} style={{ color: i === log.length - 1 ? COLORS.blue : COLORS.textMuted }}>→ {l}</div>)}
              {simDone && <div style={{ color: COLORS.green, fontWeight: 600 }}>✓ Simulación completa</div>}
            </div>
          )}
        </div>

        {/* ── SECTION 2: Config + Metrics ── */}
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}>

          {/* Config panel */}
          <div style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>02</span>
              <span style={{ fontWeight: 600, fontSize: 15 }}>Configuración</span>
            </div>

            {[
              { label: "Tiempo entre llegadas", sub: "Intervalo promedio entre dos llegadas consecutivas.", unit: "min", val: llegada, set: setLlegada },
              { label: "Tiempo de servicio", sub: "Duración promedio del servicio.", unit: "min", val: servicio, set: setServicio },
              { label: "Servidores disponibles", sub: "Número de servidores en paralelo.", unit: "#", val: servidores, set: setServidores },
              ...(caso === 3 ? [{ label: "P(quiere dulces)", sub: "Probabilidad de ir a dulcería.", unit: "%", val: prob, set: setProb }] : []),
              { label: "Tiempo de simulación", sub: "Duración total de la corrida.", unit: "min", val: tSim, set: setTSim },
            ].map(({ label, sub, unit, val, set }) => (
              <div key={label}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={labelStyle}>{label}</label>
                  <span style={{ fontSize: 11, color: COLORS.textMuted }}>media · {unit}</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input value={val} onChange={(e) => set(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <button onClick={() => set(String(parseFloat(val) + 1))} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 4, background: COLORS.white, width: 24, height: 18, cursor: "pointer", fontSize: 9, color: COLORS.textSecondary }}>▲</button>
                    <button onClick={() => set(String(Math.max(0, parseFloat(val) - 1)))} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 4, background: COLORS.white, width: 24, height: 18, cursor: "pointer", fontSize: 9, color: COLORS.textSecondary }}>▼</button>
                  </div>
                  <span style={{ fontSize: 12, color: COLORS.textMuted, width: 28 }}>{unit}</span>
                </div>
                <div style={subLabelStyle}>{sub}</div>
              </div>
            ))}

            <button onClick={handleSimulate} disabled={simRunning} style={{
              background: simRunning ? COLORS.border : COLORS.blue,
              border: "none", borderRadius: 9, padding: "11px 0",
              color: simRunning ? COLORS.textMuted : COLORS.white,
              fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14,
              cursor: simRunning ? "not-allowed" : "pointer", marginTop: 4,
            }}>
              {simRunning ? "▶  Simulando..." : "▶  Ejecutar simulación"}
            </button>
          </div>

          {/* Metrics */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {results.metrics.map(({ key, value, unit, sub, color, bar }) => (
                <div key={key} style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
                    <span style={{ fontSize: 12, color: COLORS.textSecondary }}>{key}</span>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.textPrimary, lineHeight: 1 }}>
                    {value}<span style={{ fontSize: 14, fontWeight: 400, color: COLORS.textSecondary, marginLeft: 3 }}>{unit}</span>
                  </div>
                  {bar !== undefined && (
                    <div style={{ marginTop: 10, background: COLORS.border, borderRadius: 4, height: 5 }}>
                      <div style={{ width: `${bar}%`, height: "100%", background: COLORS.green, borderRadius: 4 }} />
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 6 }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 3: Event trace ── */}
        <div style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>03</span>
              <span style={{ fontWeight: 600, fontSize: 15 }}>Traza de eventos</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleExport} style={{
                background: COLORS.green, border: "none", borderRadius: 6,
                padding: "5px 16px", color: COLORS.white,
                fontFamily: "Inter", fontWeight: 600, fontSize: 12, cursor: "pointer",
              }}>
                ⬇ Exportar Excel
              </button>
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: COLORS.panel }}>
                {results.headers.map((h) => (
                  <th key={h} style={{ padding: "10px 24px", textAlign: "left", fontSize: 11, color: COLORS.textMuted, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                  {row.map((cell, j) => {
                    const isEspera = j === row.length - 1 && String(cell).startsWith("•");
                    const isDulces = cell === "Sí" || cell === "No";
                    return (
                      <td key={j} style={{
                        padding: "12px 24px", fontSize: 13,
                        color: isEspera ? COLORS.green : isDulces && cell === "Sí" ? COLORS.yellow : COLORS.textPrimary,
                        fontWeight: j === 0 ? 500 : 400,
                      }}>
                        {isEspera ? <span style={{ color: COLORS.green }}>● {String(cell).replace("• ", "")}</span> : cell}
                        {j === 1 && i < 2 && <span style={{ marginLeft: 8, fontSize: 10, color: COLORS.textMuted, background: COLORS.panel, borderRadius: 4, padding: "2px 6px" }}>M{i + 1}</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "12px 24px", borderTop: `1px solid ${COLORS.border}`, fontSize: 11, color: COLORS.textMuted }}>
            * T.sim = {tSim} min · Distribución exponencial · {servidores} servidor(es)
          </div>
        </div>

      </div>
    </div>
  );
}
