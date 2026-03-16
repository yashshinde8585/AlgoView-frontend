import React, { useState, useEffect } from "react";
import { INTEGER_CODE_TEMPLATES as CODE_TEMPLATES, memoryAddresses } from '../constants';
import Header from '../components/layout/Header';
import ComplexityReporter from '../components/layout/ComplexityReporter';
import SystemMetrics from '../components/layout/SystemMetrics';
import ComplexityPulse from '../components/layout/ComplexityPulse';
import LogicTrace from '../components/layout/LogicTrace';
import { motion } from "framer-motion";

const IntegerManager = () => {
    const [bitSize, setBitSize] = useState(8);
    const [isSigned, setIsSigned] = useState(true);
    const [value, setValue] = useState(0);

    const [selectedLang, setSelectedLang] = useState("JAVA");
    const [activeOperation, setActiveOperation] = useState(null);
    const [activeComplexity, setActiveComplexity] = useState(null);
    const [systemError, setSystemError] = useState(null);
    const [animationSpeed, setAnimationSpeed] = useState(800);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showHex, setShowHex] = useState(true);
    const [learningMode, setLearningMode] = useState("BEGINNER"); // BEGINNER or ADVANCED
    const [activeTab, setActiveTab] = useState("ARITHMETIC"); // ARITHMETIC, BITWISE, SHIFTS
    const [hoveredBit, setHoveredBit] = useState(null);

    const [insight, setInsight] = useState({
        time: "O(1)",
        space: "O(1)",
        efficiency: "100%"
    });

    const maxValue = isSigned ? Math.pow(2, bitSize - 1) - 1 : Math.pow(2, bitSize) - 1;
    const minValue = isSigned ? -Math.pow(2, bitSize - 1) : 0;

    const executeOp = async (opName, newTargetValue) => {
        if (isProcessing) return;
        setIsProcessing(true);
        setActiveComplexity("O(1)");
        setActiveOperation(opName);

        const mask = Math.pow(2, bitSize) - 1;
        let visualValue = newTargetValue;
        
        let unsignedVal = visualValue & mask;
        if (isSigned && (unsignedVal & Math.pow(2, bitSize - 1))) {
           visualValue = unsignedVal - Math.pow(2, bitSize);
        } else {
           visualValue = unsignedVal;
        }

        await new Promise(r => setTimeout(r, animationSpeed / 2));
        setValue(visualValue);

        setTimeout(() => {
            setActiveComplexity(null);
            setActiveOperation(null);
            setIsProcessing(false);
        }, 1500);
    };

    const handleIncrement = () => executeOp("INCREMENT", value + 1);
    const handleDecrement = () => executeOp("DECREMENT", value - 1);
    const handleShiftLeft = () => executeOp("SHIFT_LEFT", value << 1);
    const handleShiftRight = () => executeOp("SHIFT_RIGHT", isSigned ? value >> 1 : value >>> 1);
    const handleNot = () => executeOp("NOT", ~value);

    let temp = value;
    if (temp < 0) temp = Math.pow(2, bitSize) + temp;
    const bits = [];
    for (let i = 0; i < bitSize; i++) {
        bits.unshift((temp >> i) & 1);
    }
    
    const toggleBit = (index) => {
        if (isProcessing) return;
        const bitPos = bitSize - 1 - index;
        const currentBit = (temp >> bitPos) & 1;
        let newValue;
        if (currentBit === 1) newValue = temp - Math.pow(2, bitPos);
        else newValue = temp + Math.pow(2, bitPos);
        
        if (isSigned && (newValue & Math.pow(2, bitSize - 1))) {
            newValue = newValue - Math.pow(2, bitSize);
        }
        setValue(newValue);
    };

    useEffect(() => {
        setValue(0);
    }, [bitSize, isSigned]);

    return (
        <div className="h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30 flex flex-col overflow-hidden">
            <Header 
                abbr="INT"
                moduleName="MOD_06: PRIMITIVE INTEGER"
                moduleDesc="(Signed & Unsigned)"
                themeColor="blue"
                config={{
                    label: "Bit Depth",
                    value: bitSize,
                    onChange: (val) => setBitSize(Number(val)),
                    options: [
                        { value: 8, label: "8-BIT (BYTE)" },
                        { value: 16, label: "16-BIT (SHORT)" },
                    ]
                }}
                showHex={showHex}
                setShowHex={setShowHex}
                selectedLang={selectedLang}
                setSelectedLang={setSelectedLang}
                animationSpeed={animationSpeed}
                setAnimationSpeed={setAnimationSpeed}
            />

            <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 grid grid-cols-12 gap-6 overflow-hidden">
                {/* Sector 01: Controls & Intelligence */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pb-2 custom-scroll">
                        <section className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></span> MODE_SELECT
                                </h2>
                                <div className="flex bg-slate-950 border border-white/10 rounded-lg p-1">
                                    <button 
                                        onClick={() => setLearningMode("BEGINNER")}
                                        className={`px-3 py-1 text-[9px] font-black rounded-md transition-all uppercase tracking-widest ${learningMode === "BEGINNER" ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        Beginner
                                    </button>
                                    <button 
                                        onClick={() => setLearningMode("ADVANCED")}
                                        className={`px-3 py-1 text-[9px] font-black rounded-md transition-all uppercase tracking-widest ${learningMode === "ADVANCED" ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        Advanced
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">STEP 1: SET_NUMBER</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={value}
                                            onChange={(e) => {
                                                const v = parseInt(e.target.value);
                                                if (!isNaN(v) && v >= minValue && v <= maxValue) setValue(v);
                                            }}
                                            placeholder="Decimal Value"
                                            className="flex-1 h-9 bg-[#01040f] border border-white/5 rounded-xl px-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-mono"
                                        />
                                        <button onClick={() => setValue(0)} disabled={isProcessing} className="px-5 bg-slate-900 border border-red-500/10 hover:border-red-500/30 disabled:opacity-50 rounded-lg text-red-500/60 hover:text-red-400 text-[9px] font-black transition-all uppercase">ZERO</button>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => setValue(5)} disabled={isProcessing} className="flex-1 py-1.5 bg-slate-900 border border-white/5 hover:bg-slate-800 disabled:opacity-50 rounded-md text-slate-400 text-[8px] font-bold transition-all uppercase">Set 5</button>
                                        <button onClick={() => setValue(-3)} disabled={isProcessing || !isSigned} className="flex-1 py-1.5 bg-slate-900 border border-white/5 hover:bg-slate-800 disabled:opacity-50 rounded-md text-slate-400 text-[8px] font-bold transition-all uppercase">Set -3</button>
                                        <button onClick={() => setValue(maxValue)} disabled={isProcessing} className="flex-1 py-1.5 bg-slate-900 border border-white/5 hover:bg-slate-800 disabled:opacity-50 rounded-md text-slate-400 text-[8px] font-bold transition-all uppercase">Max_Val</button>
                                    </div>
                                </div>

                                <div className="h-px bg-white/5"></div>

                                <div className="space-y-3">
                                    <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">STEP 2: OPERATIONS</label>
                                    
                                    {/* Tabs */}
                                    <div className="flex gap-1 bg-slate-900/50 p-1 rounded-lg border border-white/5">
                                        <button onClick={() => setActiveTab("ARITHMETIC")} className={`flex-1 py-1.5 text-[8.5px] font-black rounded uppercase tracking-widest transition-all ${activeTab === "ARITHMETIC" ? "bg-slate-800 text-blue-400 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>Arithmetic</button>
                                        <button onClick={() => setActiveTab("BITWISE")} className={`flex-1 py-1.5 text-[8.5px] font-black rounded uppercase tracking-widest transition-all ${activeTab === "BITWISE" ? "bg-slate-800 text-purple-400 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>Bitwise</button>
                                        <button onClick={() => setActiveTab("SHIFTS")} className={`flex-1 py-1.5 text-[8.5px] font-black rounded uppercase tracking-widest transition-all ${activeTab === "SHIFTS" ? "bg-slate-800 text-orange-400 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>Shifts</button>
                                    </div>

                                    {/* Operation Panels */}
                                    <div className="min-h-[90px]">
                                        {activeTab === "ARITHMETIC" && (
                                            <div className="grid grid-cols-2 gap-2 animate-in slide-in-from-right-2 fade-in duration-200">
                                                <button onClick={handleIncrement} disabled={isProcessing} className="py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg text-white text-[9px] font-black transition-all shadow-lg uppercase tracking-widest">INCREMENT (+1)</button>
                                                <button onClick={handleDecrement} disabled={isProcessing} className="py-2.5 bg-slate-900 border border-white/5 hover:border-red-500/30 disabled:opacity-50 rounded-lg text-slate-400 hover:text-red-400 text-[9px] font-black transition-all uppercase tracking-widest">DECREMENT (-1)</button>
                                            </div>
                                        )}
                                        {activeTab === "BITWISE" && (
                                            <div className="grid grid-cols-1 gap-2 animate-in slide-in-from-right-2 fade-in duration-200">
                                                <button onClick={handleNot} disabled={isProcessing} className="w-full py-2.5 bg-slate-900 border border-purple-500/20 hover:border-purple-500/40 disabled:opacity-50 rounded-lg text-purple-400/80 hover:text-purple-300 text-[9px] font-black transition-all uppercase tracking-widest">BITWISE NOT (~)</button>
                                                <p className="text-[9px] text-slate-500 italic text-center px-4">Flips all bits (0s become 1s, 1s become 0s). Known as 1's Complement.</p>
                                            </div>
                                        )}
                                        {activeTab === "SHIFTS" && (
                                            <div className="grid grid-cols-2 gap-2 animate-in slide-in-from-right-2 fade-in duration-200">
                                                <button onClick={handleShiftLeft} disabled={isProcessing} className="py-2.5 bg-slate-800 border border-white/5 hover:border-orange-500/30 disabled:opacity-50 rounded-lg text-slate-400 hover:text-orange-400 text-[9px] font-black transition-all uppercase tracking-widest">SHIFT LEFT (&lt;&lt; 1)</button>
                                                <button onClick={handleShiftRight} disabled={isProcessing} className="py-2.5 bg-slate-800 border border-white/5 hover:border-orange-500/30 disabled:opacity-50 rounded-lg text-slate-400 hover:text-orange-400 text-[9px] font-black transition-all uppercase tracking-widest">SHIFT RIGHT (&gt;&gt; 1)</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="h-px bg-white/5"></div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">TYPE_SIGNING_RULES</label>
                                    <div className="flex items-center gap-4 py-2">
                                        <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${!isSigned ? 'text-blue-400' : 'text-slate-600'}`}>UNSIGNED</span>
                                        <div onClick={() => setIsSigned(!isSigned)} className="w-10 h-4 bg-slate-900 rounded-full relative flex items-center px-1 border border-white/10 cursor-pointer">
                                            <div className={`h-2.5 w-2.5 bg-blue-500 rounded-full transition-transform duration-300 ${isSigned ? 'translate-x-5.5' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${isSigned ? 'text-blue-400' : 'text-slate-600'}`}>SIGNED (2's Comp)</span>
                                    </div>
                                    <p className="text-[9px] text-slate-500 leading-tight">
                                        {isSigned ? "MSB determines sign. Negative numbers are stored in Two's Complement." : "All bits represent magnitude. Values are strictly positive."}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Advanced mode block completely removed to streamline IntegerManager metrics */}
                    </div>
                </div>

                {/* Sector 02: Visualizer */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden relative">
                    <div className="bg-[#030816]/60 border border-white/5 rounded-[40px] p-6 lg:p-10 flex flex-col gap-5 overflow-hidden relative flex-1 shadow-2xl">
                         <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                             <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></span> MEMORY_CELL (BASE_10 / BASE_2)
                         </h3>

                         <div className="flex-1 flex flex-col items-center justify-start relative w-full pt-4 gap-8">
                            
                            {/* Decimal / Hex Displays */}
                            <div className="flex gap-4 w-full max-w-2xl justify-center">
                                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 flex flex-col items-center flex-1 shadow-lg relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">DECIMAL (BASE-10)</span>
                                    <span className="text-3xl font-black text-white relative z-10">{value}</span>
                                </div>
                                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 flex flex-col items-center flex-1 shadow-lg relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">HEXADECIMAL (BASE-16)</span>
                                    <span className="text-3xl font-mono font-black text-purple-400 relative z-10">0x{temp.toString(16).toUpperCase().padStart(bitSize/4, '0')}</span>
                                </div>
                                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 flex flex-col items-center flex-1 shadow-lg relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">BINARY (BASE-2)</span>
                                    <span className={`font-mono font-black text-emerald-400 relative z-10 ${bitSize === 16 ? 'text-lg lg:text-2xl tracking-tighter' : 'text-3xl'}`}>{bits.map(b=>b).join('')}</span>
                                </div>
                            </div>
                            
                            {/* Memory Address Simulator Hook */}
                            {learningMode === "ADVANCED" && (
                                <div className="w-full max-w-2xl text-center border-y border-dashed border-white/10 py-3 mt-2">
                                    <span className="text-[10px] font-mono text-slate-500">MEMORY_ADDR: <span className="text-blue-400">0x10A4</span> | BUFFER_ALLOC: {bitSize} BITS | PTR_SIZE: {bitSize/8} BYTES</span>
                                </div>
                            )}

                            {/* Binary Bit Array with Educational Layers */}
                            <div className="w-full flex flex-col items-center mt-4">
                                <div className="text-center mb-6">
                                    <span className="text-[11px] font-black text-white uppercase tracking-widest">INTERACTIVE BITWISE ARRAY</span>
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">Click cells to toggle bits securely in RAM</p>
                                </div>
                                
                                <div className="relative">
                                    {/* Power Layer */}
                                    <div className="flex justify-center flex-wrap gap-2 w-full mb-2 px-2">
                                        {bits.map((_, i) => (
                                            <div key={`pow-${i}`} className={`w-10 md:w-14 text-center ${isSigned && i===0 ? 'text-red-400/80 font-black' : 'text-slate-500'}`}>
                                                <span className="text-[9px] uppercase">
                                                    {isSigned && i===0 ? '-(2^' + (bitSize - 1) + ')' : '2^' + (bitSize - 1 - i)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Interactive Bit Block Layer */}
                                    <div className="flex justify-center flex-wrap gap-2 w-full relative z-10">
                                        {/* Dynamic Label Overlays */}
                                        <div className="absolute -left-12 top-1/2 -translate-y-1/2">
                                            <span className="text-[8px] font-black text-slate-600 rotate-180" style={{ writingMode: 'vertical-rl' }}>MSB LAYER</span>
                                        </div>
                                        <div className="absolute -right-12 top-1/2 -translate-y-1/2">
                                            <span className="text-[8px] font-black text-slate-600" style={{ writingMode: 'vertical-rl' }}>LSB LAYER</span>
                                        </div>

                                        {bits.map((b, i) => {
                                            const isSignBit = isSigned && i === 0;
                                            const powerVal = Math.pow(2, bitSize - 1 - i);
                                            const activeClass = b === 1 ? (isSignBit ? 'bg-red-500/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-blue-600/20 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]') : 'bg-slate-950 border-white/10 opacity-70 hover:opacity-100';
                                            const textClass = b === 1 ? (isSignBit ? 'text-red-400' : 'text-blue-400') : 'text-slate-600';
                                            
                                            // Tooltip variables
                                            const contribution = isSignBit ? -powerVal : powerVal;

                                            return (
                                                <div 
                                                    key={i} 
                                                    className="relative group"
                                                    onMouseEnter={() => setHoveredBit({ pos: bitSize - 1 - i, val: b, powerVal: powerVal, contribution: contribution, isSignBit })}
                                                    onMouseLeave={() => setHoveredBit(null)}
                                                >
                                                    {isSignBit && <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest whitespace-nowrap">SIGN_BIT</div>}
                                                    <div 
                                                        onClick={() => toggleBit(i)}
                                                        className={`w-10 h-14 md:w-14 md:h-16 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${activeClass} hover:-translate-y-1`}
                                                    >
                                                        <span className={`text-2xl font-mono font-black ${textClass}`}>{b}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* Value Addends Layer */}
                                    <div className="flex justify-center flex-wrap gap-2 w-full mt-3 px-2 border-t border-dashed border-white/5 pt-2">
                                        {bits.map((b, i) => {
                                            const isSignBit = isSigned && i === 0;
                                            const val = Math.pow(2, bitSize - 1 - i);
                                            return (
                                                <div key={`val-${i}`} className={`w-10 md:w-14 text-center ${b === 1 ? (isSignBit ? 'text-red-400' : 'text-blue-400') : 'text-slate-700/50'}`}>
                                                    <span className="text-[10px] font-bold">
                                                        {b === 1 ? (isSignBit ? `-${val}` : val) : '0'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Tooltip Hover Overlay */}
                                    {hoveredBit && (
                                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-slate-900 border border-blue-500/30 p-3 rounded-xl shadow-2xl flex items-center gap-4 z-50 whitespace-nowrap fade-in pointer-events-none">
                                            <div>
                                                <p className="text-[8px] font-black text-slate-500 uppercase">Bit Position</p>
                                                <p className="text-[11px] font-bold text-white">{hoveredBit.pos}</p>
                                            </div>
                                            <div className="h-6 w-px bg-white/10"></div>
                                            <div>
                                                <p className="text-[8px] font-black text-slate-500 uppercase">Magnitude Value</p>
                                                <p className="text-[11px] font-bold text-white">{hoveredBit.powerVal}</p>
                                            </div>
                                            <div className="h-6 w-px bg-white/10"></div>
                                            <div className="text-right">
                                                <p className="text-[8px] font-black text-slate-500 uppercase">{hoveredBit.val === 1 ? 'Contributes' : 'Ignored'}</p>
                                                <p className={`text-[12px] font-black ${hoveredBit.val === 1 ? (hoveredBit.isSignBit ? 'text-red-400' : 'text-green-400') : 'text-slate-600'}`}>
                                                    {hoveredBit.val === 1 ? (hoveredBit.contribution > 0 ? `+${hoveredBit.contribution}` : hoveredBit.contribution) : '+0'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                         </div>
                    </div>

                    <ComplexityPulse 
                        themeColor="blue"
                        activeComplexity={activeComplexity}
                        operationName="PRIMITIVE_OP"
                    />

                    {learningMode === "ADVANCED" && (
                        <LogicTrace 
                            themeColor="blue"
                            activeOperation={activeOperation}
                            codeTemplates={CODE_TEMPLATES}
                            selectedLang={selectedLang}
                            infoText="ALU_CLOCK::4.2GHz"
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default IntegerManager;
