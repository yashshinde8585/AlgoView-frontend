import React, { useState, useMemo } from 'react';
import Header from '../components/layout/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, TrendingUp, Star, AlertTriangle, CheckCircle, XCircle, Zap } from 'lucide-react';

/* ─── Data ─────────────────────────────────────── */
const CLASSES = [
    {
        label: 'O(1)',       name: 'Constant',      stroke: '#10b981', textColor: 'text-emerald-400',
        rating: 5, tier: 'excellent',
        desc: 'Best possible. Time never changes no matter how large N grows.',
        example: 'Array index access, hash map lookup',
    },
    {
        label: 'O(log n)',   name: 'Logarithmic',   stroke: '#22d3ee', textColor: 'text-cyan-400',
        rating: 4, tier: 'good',
        desc: 'Each step cuts the problem in half. Barely feels input growth.',
        example: 'Binary Search, balanced BST operations',
    },
    {
        label: 'O(n)',       name: 'Linear',         stroke: '#60a5fa', textColor: 'text-blue-400',
        rating: 3, tier: 'ok',
        desc: 'Proportional to input. Double N → double time. Acceptable.',
        example: 'Linear Search, array traversal',
    },
    {
        label: 'O(n log n)', name: 'Linearithmic',  stroke: '#818cf8', textColor: 'text-indigo-400',
        rating: 3, tier: 'ok',
        desc: 'Slightly worse than linear but still considered efficient.',
        example: 'Merge Sort, Heap Sort, Quick Sort (avg)',
    },
    {
        label: 'O(n²)',      name: 'Quadratic',      stroke: '#fbbf24', textColor: 'text-amber-400',
        rating: 2, tier: 'bad',
        desc: 'Nested loops. Double N → 4× the time. Avoid for large inputs.',
        example: 'Bubble Sort, Selection Sort, Insertion Sort',
    },
    {
        label: 'O(2ⁿ)',      name: 'Exponential',   stroke: '#f97316', textColor: 'text-orange-500',
        rating: 1, tier: 'terrible',
        desc: 'Explosion. Every new element doubles the workload. Impractical.',
        example: 'Recursive Fibonacci, Power Set brute force',
    },
    {
        label: 'O(n!)',      name: 'Factorial',      stroke: '#ef4444', textColor: 'text-red-500',
        rating: 0, tier: 'terrible',
        desc: 'Catastrophic. Even N=20 is incomputable. Only theoretical.',
        example: 'Brute-force Traveling Salesman, all permutations',
    },
];

const TIER_CONFIG = {
    excellent: { bg: 'rgba(16,185,129,0.06)', label: 'EXCELLENT',  color: '#10b981' },
    good:      { bg: 'rgba(34,211,238,0.06)', label: 'GOOD',       color: '#22d3ee' },
    ok:        { bg: 'rgba(99,102,241,0.06)', label: 'ACCEPTABLE', color: '#6366f1' },
    bad:       { bg: 'rgba(245,158,11,0.06)', label: 'AVOID',      color: '#f59e0b' },
    terrible:  { bg: 'rgba(239,68,68,0.06)',  label: 'DANGER',     color: '#ef4444' },
};

/* ─── Helpers ───────────────────────────────────── */
const calcVal = (label, n) => {
    switch (label) {
        case 'O(1)':       return 1;
        case 'O(log n)':  return Math.log2(Math.max(n, 1));
        case 'O(n)':       return n;
        case 'O(n log n)': return n * Math.log2(Math.max(n, 1));
        case 'O(n²)':     return n * n;
        case 'O(2ⁿ)':     return Math.min(Math.pow(2, n), 1e15);
        case 'O(n!)': {
            let r = 1;
            for (let i = 2; i <= Math.min(n, 18); i++) r *= i;
            return r;
        }
        default: return 0;
    }
};

const fmt = (v) => {
    if (v >= 1e12) return '> trillion';
    if (v >= 1e9)  return (v / 1e9).toFixed(1) + 'B';
    if (v >= 1e6)  return (v / 1e6).toFixed(1) + 'M';
    if (v >= 1e3)  return (v / 1e3).toFixed(1) + 'K';
    return v.toLocaleString(undefined, { maximumFractionDigits: 1 });
};

/* ─── SVG graph constants ───────────────────────── */
const VW = 800, VH = 320;
const ML = 12, MT = 10, MR = 12, MB = 24;
const GW = VW - ML - MR;
const GH = VH - MT - MB;
const MAX_N = 50;
const LOG_MAX = Math.log10(1e12 + 1);

const xOf = (n) => ML + (n / MAX_N) * GW;
const yOf = (val) => {
    if (val <= 0) return MT + GH;
    const logV = Math.log10(val + 1);
    return MT + GH - (logV / LOG_MAX) * GH;
};

/* ─── Component ─────────────────────────────────── */
export default function ComplexityManager() {
    const [n, setN] = useState(10);
    const [hovered, setHovered] = useState(null);
    const [selectedLang, setSelectedLang] = useState("JAVA");
    const [showHex, setShowHex]     = useState(false);

    /* build log-scale paths once */
    const paths = useMemo(() => {
        const pts = [];
        for (let i = 0; i <= MAX_N; i++) pts.push(i);

        return CLASSES.map(c => ({
            ...c,
            d: pts.map((i, idx) => {
                const v = calcVal(c.label, i);
                return `${idx === 0 ? 'M' : 'L'} ${xOf(i).toFixed(1)} ${yOf(v).toFixed(1)}`;
            }).join(' '),
        }));
    }, []);

    /* values at current N */
    const vals = useMemo(() => {
        return CLASSES.map(c => ({ ...c, val: calcVal(c.label, n) }));
    }, [n]);

    const curX = xOf(Math.min(n, MAX_N));
    const hovClass = hovered ? CLASSES.find(c => c.label === hovered) : null;

    return (
        <div className="h-screen bg-[#020617] text-slate-300 font-sans flex flex-col overflow-hidden selection:bg-blue-500/30">
            <Header
                abbr="COMP"
                moduleName="MOD_00: BIG-O ANALYSIS"
                moduleDesc="(Algorithmic Complexity Matrix)"
                themeColor="blue"
                config={{
                    label: "Scale",
                    value: "LOG_SCALE",
                    options: [{ value: "LOG_SCALE", label: "LOG_SCALE (Recommended)" }]
                }}
                showHex={showHex}
                setShowHex={setShowHex}
                selectedLang={selectedLang}
                setSelectedLang={setSelectedLang}
            />

            <main className="flex-1 overflow-hidden grid grid-cols-12 gap-4 px-4 pb-4">

                {/* ═══════════════ LEFT PANEL ═══════════════ */}
                <aside className="col-span-3 flex flex-col gap-3 overflow-hidden">

                    {/* N Slider */}
                    <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-4 flex-shrink-0">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.25em] flex items-center gap-1.5">
                                <Activity size={10} /> Input Size
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-slate-600">N =</span>
                                <span className="text-[18px] font-black font-mono text-blue-400 leading-none">{n}</span>
                            </div>
                        </div>
                        <input
                            type="range" min="1" max="50" value={n}
                            onChange={e => setN(+e.target.value)}
                            className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between mt-1.5 text-[7px] font-bold text-slate-700 uppercase tracking-widest">
                            <span>1</span><span>25</span><span>50</span>
                        </div>
                    </div>

                    {/* Complexity rows */}
                    <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto pr-0.5 custom-scroll">
                        {vals.map(({ label, name, stroke, textColor, rating, tier, val, desc, example }) => {
                            const isHov = hovered === label;
                            const tierCfg = TIER_CONFIG[tier];
                            const displayVal = fmt(val);
                            const isGiant = val >= 1e12;

                            return (
                                <motion.div
                                    key={label}
                                    layout
                                    onMouseEnter={() => setHovered(label)}
                                    onMouseLeave={() => setHovered(null)}
                                    className={`rounded-2xl border transition-all duration-200 cursor-default overflow-hidden ${
                                        isHov ? 'border-white/10 shadow-2xl' : 'border-white/5'
                                    }`}
                                    style={{ background: isHov ? tierCfg.bg : 'rgba(0,0,0,0.2)' }}
                                >
                                    {/* Main row */}
                                    <div className="px-3 py-2.5 flex items-center justify-between">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            {/* Color dot */}
                                            <div
                                                className="w-2 h-2 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: stroke, boxShadow: isHov ? `0 0 8px ${stroke}` : 'none' }}
                                            />
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[12px] font-black tracking-tight ${textColor}`}>{label}</span>
                                                    <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest hidden md:inline">{name}</span>
                                                </div>
                                                {/* Star rating */}
                                                <div className="flex gap-0.5 mt-0.5">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className="w-1.5 h-1.5 rounded-sm"
                                                            style={{ backgroundColor: i < rating ? tierCfg.color : '#1e293b' }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right flex-shrink-0 ml-2">
                                            <div className={`text-[13px] font-mono font-black leading-none ${isGiant ? 'text-red-500' : 'text-slate-200'}`}>
                                                {isGiant ? '∞' : displayVal}
                                            </div>
                                            <div className="text-[7px] text-slate-600 font-bold uppercase tracking-tighter mt-0.5">ops at N={n}</div>
                                        </div>
                                    </div>

                                    {/* Expandable description */}
                                    <AnimatePresence>
                                        {isHov && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.18 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-3 pb-3 border-t border-white/5 pt-2.5 space-y-1.5">
                                                    <p className="text-[10px] text-slate-300 leading-relaxed">{desc}</p>
                                                    <div className="flex items-start gap-1.5">
                                                        <Zap size={9} className="flex-shrink-0 mt-0.5" style={{ color: stroke }} />
                                                        <p className="text-[9px] italic leading-relaxed" style={{ color: stroke }}>{example}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Tier legend */}
                    <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-3 flex-shrink-0 grid grid-cols-5 gap-1">
                        {Object.entries(TIER_CONFIG).map(([tier, cfg]) => (
                            <div key={tier} className="flex flex-col items-center gap-1">
                                <div className="w-full h-1 rounded-full" style={{ backgroundColor: cfg.color }} />
                                <span className="text-[6px] font-black uppercase tracking-wider text-slate-600">{cfg.label}</span>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* ═══════════════ GRAPH PANEL ═══════════════ */}
                <section className="col-span-9 flex flex-col gap-3 overflow-hidden">
                    <div className="flex-1 bg-[#030816]/70 border border-white/5 rounded-3xl p-5 flex flex-col gap-3 overflow-hidden shadow-2xl relative">

                        {/* Panel header */}
                        <div className="flex items-center justify-between flex-shrink-0">
                            <div>
                                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                                    Big-O Growth Curves — Log Scale
                                </h3>
                                <p className="text-[8px] text-slate-600 font-bold mt-0.5 uppercase tracking-widest">
                                    Y-axis: operations (log₁₀ scale) · X-axis: input size N · Drag slider to explore
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                {[
                                    { icon: CheckCircle, color: 'text-emerald-400', label: 'Scalable' },
                                    { icon: AlertTriangle, color: 'text-amber-400', label: 'Slow' },
                                    { icon: XCircle, color: 'text-red-500', label: 'Impractical' },
                                ].map(({ icon: Icon, color, label }) => (
                                    <div key={label} className="flex items-center gap-1.5">
                                        <Icon size={11} className={color} />
                                        <span className="text-[8px] font-black text-slate-500 uppercase">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SVG Graph */}
                        <div className="flex-1 relative rounded-2xl overflow-hidden bg-black/30 border border-white/5">
                            <svg
                                viewBox={`0 0 ${VW} ${VH}`}
                                className="w-full h-full"
                                preserveAspectRatio="none"
                            >
                                {/* ── Zone background bands ── */}
                                <rect x={ML} y={MT + GH * 0.7} width={GW} height={GH * 0.3} fill="rgba(16,185,129,0.04)" />
                                <rect x={ML} y={MT + GH * 0.4} width={GW} height={GH * 0.3} fill="rgba(99,102,241,0.04)" />
                                <rect x={ML} y={MT}             width={GW} height={GH * 0.4} fill="rgba(239,68,68,0.04)" />

                                {/* Zone labels */}
                                <text x={ML + 6} y={MT + GH * 0.85} fill="#10b981" fillOpacity="0.4" fontSize="7" fontWeight="900" fontFamily="monospace" letterSpacing="2">EFFICIENT ZONE</text>
                                <text x={ML + 6} y={MT + GH * 0.55} fill="#6366f1" fillOpacity="0.4" fontSize="7" fontWeight="900" fontFamily="monospace" letterSpacing="2">ACCEPTABLE ZONE</text>
                                <text x={ML + 6} y={MT + GH * 0.12} fill="#ef4444" fillOpacity="0.4" fontSize="7" fontWeight="900" fontFamily="monospace" letterSpacing="2">DANGER ZONE</text>

                                {/* ── Grid lines ── */}
                                {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(t => (
                                    <line key={`h${t}`}
                                        x1={ML} y1={MT + GH * t} x2={ML + GW} y2={MT + GH * t}
                                        stroke="white" strokeOpacity="0.03" strokeWidth="1"
                                    />
                                ))}
                                {[0, 0.25, 0.5, 0.75, 1].map(t => (
                                    <line key={`v${t}`}
                                        x1={ML + GW * t} y1={MT} x2={ML + GW * t} y2={MT + GH}
                                        stroke="white" strokeOpacity="0.04" strokeWidth="1"
                                    />
                                ))}

                                {/* Axis */}
                                <line x1={ML} y1={MT} x2={ML} y2={MT + GH + 2} stroke="white" strokeOpacity="0.1" strokeWidth="1" />
                                <line x1={ML - 2} y1={MT + GH} x2={ML + GW} y2={MT + GH} stroke="white" strokeOpacity="0.1" strokeWidth="1" />

                                {/* X-axis tick labels */}
                                {[0, 10, 20, 30, 40, 50].map(v => (
                                    <text key={v} x={xOf(v)} y={VH - 6} fill="#374151" fontSize="7" fontWeight="700" fontFamily="monospace" textAnchor="middle">{v}</text>
                                ))}

                                {/* ── Curves ── */}
                                {paths.map(({ label, stroke, d }) => (
                                    <motion.path
                                        key={label}
                                        d={d}
                                        fill="none"
                                        stroke={stroke}
                                        strokeWidth={hovered === label ? 2.5 : 1.5}
                                        opacity={hovered ? (hovered === label ? 1 : 0.07) : 0.65}
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: hovered ? (hovered === label ? 1 : 0.07) : 0.65 }}
                                        transition={{ pathLength: { duration: 1.8, ease: 'easeOut' }, opacity: { duration: 0.2 } }}
                                    />
                                ))}

                                {/* ── N cursor line ── */}
                                <line
                                    x1={curX} y1={MT} x2={curX} y2={MT + GH}
                                    stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" opacity="0.5"
                                />
                                <text x={curX + 3} y={MT + 10} fill="#60a5fa" fontSize="8" fontWeight="900" fontFamily="monospace">N={n}</text>

                                {/* ── Dots on curves at N ── */}
                                {vals.map(({ label, stroke, val }) => {
                                    const cx = curX;
                                    const cy = yOf(val);
                                    if (cy < MT || cy > MT + GH) return null;
                                    const isHov = hovered === label;
                                    return (
                                        <g key={label}>
                                            {/* Glow ring */}
                                            <circle cx={cx} cy={cy} r={isHov ? 6 : 3} fill={stroke} opacity={isHov ? 0.2 : 0.1} />
                                            {/* Core dot */}
                                            <circle cx={cx} cy={cy} r={isHov ? 3.5 : 2} fill={stroke} opacity={0.9} />
                                        </g>
                                    );
                                })}

                                {/* ── Curve-end labels (right side) ── */}
                                {paths.map(({ label, stroke, textColor }) => {
                                    const v = calcVal(label, 48);
                                    const cy = yOf(v);
                                    if (cy < MT + 6 || cy > MT + GH - 4) return null;
                                    const isHov = hovered === label;
                                    return (
                                        <g key={`lbl-${label}`} opacity={hovered ? (isHov ? 1 : 0.08) : 0.85}>
                                            <text
                                                x={ML + GW - 2}
                                                y={cy + 3}
                                                fill={stroke}
                                                fontSize="8"
                                                fontWeight="900"
                                                fontFamily="monospace"
                                                textAnchor="end"
                                            >
                                                {label}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>

                            {/* Tooltip card at N — shows all values */}
                            <AnimatePresence>
                                {hovered && hovClass && (
                                    <motion.div
                                        key={hovered}
                                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute bottom-3 left-3 rounded-2xl border border-white/10 p-3 min-w-[200px] backdrop-blur-xl"
                                        style={{ background: 'rgba(2,6,23,0.94)', borderColor: hovClass.stroke + '44' }}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: hovClass.stroke }} />
                                            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: hovClass.stroke }}>
                                                {hovClass.label} — {hovClass.name}
                                            </span>
                                        </div>
                                        <div className="flex gap-3 items-end">
                                            <div>
                                                <div className="text-[8px] text-slate-500 uppercase font-bold">At N = {n}</div>
                                                <div className="text-[20px] font-mono font-black text-white leading-tight">
                                                    {fmt(calcVal(hovClass.label, n))}
                                                </div>
                                                <div className="text-[8px] text-slate-500 font-bold">operations</div>
                                            </div>
                                            <div className="flex gap-0.5 pb-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <div key={i} className="w-2 h-2 rounded-sm" style={{
                                                        backgroundColor: i < hovClass.rating ? hovClass.stroke : '#1e293b'
                                                    }} />
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ── Bottom legend strips ── */}
                        <div className="flex gap-2 flex-shrink-0">
                            {CLASSES.map(({ label, stroke, name, textColor }) => (
                                <div
                                    key={label}
                                    onMouseEnter={() => setHovered(label)}
                                    onMouseLeave={() => setHovered(null)}
                                    className={`flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all duration-150 cursor-default ${
                                        hovered === label ? 'border-white/15 scale-105' : 'border-white/5'
                                    }`}
                                    style={{ background: hovered === label ? stroke + '18' : 'rgba(0,0,0,0.2)' }}
                                >
                                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stroke }} />
                                    <span className={`text-[8px] font-black tracking-tight ${textColor} whitespace-nowrap`}>{label}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                </section>

            </main>
        </div>
    );
}
