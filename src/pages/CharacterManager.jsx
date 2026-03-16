import React, { useState, useEffect } from "react";
import { CHARACTER_CODE_TEMPLATES as CODE_TEMPLATES } from '../constants';
import Header from '../components/layout/Header';
import ComplexityPulse from '../components/layout/ComplexityPulse';
import LogicTrace from '../components/layout/LogicTrace';
import { motion, AnimatePresence } from "framer-motion";

const CharacterManager = () => {
    const [encoding, setEncoding] = useState(8); // 8-bit (ASCII) or 16-bit (Unicode)
    const [charValue, setCharValue] = useState('A');
    const [bits, setBits] = useState(new Array(8).fill(0));

    const [selectedLang, setSelectedLang] = useState("JAVA");
    const [activeOperation, setActiveOperation] = useState(null);
    const [activeComplexity, setActiveComplexity] = useState(null);
    const [animationSpeed, setAnimationSpeed] = useState(800);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showHex, setShowHex] = useState(true);
    const [learningMode, setLearningMode] = useState("BEGINNER");
    const [activeTab, setActiveTab] = useState("TRANSFORM"); // TRANSFORM, ENCODING
    const [hoveredBit, setHoveredBit] = useState(null);

    // Sync bits when charValue or encoding changes
    useEffect(() => {
        const code = charValue.charCodeAt(0) || 0;
        const newBits = [];
        for (let i = encoding - 1; i >= 0; i--) {
            newBits.push((code >> i) & 1);
        }
        setBits(newBits);
    }, [charValue, encoding]);

    const handleCharInput = (e) => {
        const val = e.target.value;
        if (val.length > 0) {
            setCharValue(val[val.length - 1]);
        } else {
            setCharValue('\0');
        }
    };

    const toggleBit = (index) => {
        if (isProcessing) return;
        const newBits = [...bits];
        newBits[index] = newBits[index] === 1 ? 0 : 1;
        setBits(newBits);
        
        const newCode = parseInt(newBits.join(''), 2);
        setCharValue(String.fromCharCode(newCode));
    };

    const executeOp = async (opName, newVal) => {
        if (isProcessing) return;
        setIsProcessing(true);
        setActiveComplexity("O(1)");
        setActiveOperation(opName);

        await new Promise(r => setTimeout(r, animationSpeed / 2));
        setCharValue(newVal);

        setTimeout(() => {
            setActiveComplexity(null);
            setActiveOperation(null);
            setIsProcessing(false);
        }, 1200);
    };

    const toUpper = () => executeOp("TO_UPPER", charValue.toUpperCase());
    const toLower = () => executeOp("TO_LOWER", charValue.toLowerCase());
    const getAscii = () => executeOp("GET_ASCII", charValue);

    const asciiCode = charValue.charCodeAt(0) || 0;

    return (
        <div className="h-screen bg-[#020617] text-slate-300 font-sans selection:bg-emerald-500/30 flex flex-col overflow-hidden">
            <Header 
                abbr="CHR"
                moduleName="MOD_08: PRIMITIVE CHARACTER"
                moduleDesc="(ASCII / Unicode Encoding)"
                themeColor="emerald"
                config={{
                    label: "Encoding Standard",
                    value: encoding,
                    onChange: (val) => {
                        setEncoding(Number(val));
                        setCharValue('A'); // Reset to 'A' to avoid overflow issues on 8-bit switch
                    },
                    options: [
                        { value: 8, label: "8-BIT (ASCII)" },
                        { value: 16, label: "16-BIT (UNICODE)" },
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
                {/* Sector 01: Controls */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pb-2 custom-scroll">
                        <section className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-sm"></span> SCHEMATIC_CONTROLS
                                </h2>
                                <div className="flex bg-slate-950 border border-white/10 rounded-lg p-1">
                                    <button 
                                        onClick={() => setLearningMode("BEGINNER")}
                                        className={`px-3 py-1 text-[9px] font-black rounded-md transition-all uppercase tracking-widest ${learningMode === "BEGINNER" ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        Beginner
                                    </button>
                                    <button 
                                        onClick={() => setLearningMode("ADVANCED")}
                                        className={`px-3 py-1 text-[9px] font-black rounded-md transition-all uppercase tracking-widest ${learningMode === "ADVANCED" ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        Advanced
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">STEP 1: CHAR_ASSIGNMENT</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            maxLength={1}
                                            value={charValue === '\0' ? '' : charValue}
                                            onChange={handleCharInput}
                                            placeholder="Type a character..."
                                            className="flex-1 h-9 bg-[#01040f] border border-white/5 rounded-xl px-4 text-xs text-white outline-none focus:border-emerald-500/50 transition-all font-mono text-center text-lg"
                                        />
                                        <button onClick={() => setCharValue('A')} disabled={isProcessing} className="px-5 bg-slate-900 border border-emerald-500/10 hover:border-emerald-500/30 disabled:opacity-50 rounded-lg text-emerald-500/60 hover:text-emerald-400 text-[9px] font-black transition-all uppercase">RESET</button>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 mt-2">
                                        {['A', 'z', '@', '7'].map(c => (
                                            <button key={c} onClick={() => setCharValue(c)} className="py-1.5 bg-slate-900 border border-white/5 hover:bg-slate-800 rounded-md text-slate-400 text-[10px] font-bold">'{c}'</button>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-white/5"></div>

                                <div className="space-y-3">
                                    <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">STEP 2: OPERATIONS</label>
                                    <div className="flex gap-1 bg-slate-900/50 p-1 rounded-lg border border-white/5">
                                        <button onClick={() => setActiveTab("TRANSFORM")} className={`flex-1 py-1.5 text-[8.5px] font-black rounded uppercase tracking-widest transition-all ${activeTab === "TRANSFORM" ? "bg-slate-800 text-emerald-400 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>Transform</button>
                                        <button onClick={() => setActiveTab("ENCODING")} className={`flex-1 py-1.5 text-[8.5px] font-black rounded uppercase tracking-widest transition-all ${activeTab === "ENCODING" ? "bg-slate-800 text-blue-400 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>Metadata</button>
                                    </div>

                                    <div className="min-h-[90px]">
                                        {activeTab === "TRANSFORM" && (
                                            <div className="grid grid-cols-2 gap-2 animate-in slide-in-from-right-2 fade-in duration-200">
                                                <button onClick={toUpper} disabled={isProcessing} className="py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg text-white text-[9px] font-black transition-all shadow-lg uppercase tracking-widest">TO_UPPER</button>
                                                <button onClick={toLower} disabled={isProcessing} className="py-2.5 bg-slate-800 border border-white/5 hover:border-emerald-500/30 disabled:opacity-50 rounded-lg text-slate-400 hover:text-emerald-400 text-[9px] font-black transition-all uppercase tracking-widest">TO_LOWER</button>
                                                <button onClick={getAscii} disabled={isProcessing} className="col-span-2 py-2.5 bg-slate-900 border border-white/5 hover:border-emerald-500/30 disabled:opacity-50 rounded-lg text-slate-400 hover:text-emerald-400 text-[9px] font-black transition-all uppercase tracking-widest">GET_CODE_POINT</button>
                                            </div>
                                        )}
                                        {activeTab === "ENCODING" && (
                                            <div className="animate-in slide-in-from-right-2 fade-in duration-200 flex flex-col gap-2">
                                                <div className="bg-slate-900 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase">Numeric Code</span>
                                                    <span className="text-xs font-mono font-black text-emerald-400">{asciiCode}</span>
                                                </div>
                                                <div className="bg-slate-900 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase">Binary Width</span>
                                                    <span className="text-xs font-mono font-black text-blue-400">{encoding} Bits</span>
                                                </div>
                                                <div className="bg-slate-900 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase">Hex Range</span>
                                                    <span className="text-xs font-mono font-black text-purple-400">{encoding === 8 ? '0x00 - 0xFF' : '0x0000 - 0xFFFF'}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Sector 02: Visualizer */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden relative">
                    <div className="bg-[#030816]/60 border border-white/5 rounded-[40px] p-6 lg:p-10 flex flex-col gap-8 overflow-hidden relative flex-1 shadow-2xl">
                         <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                             <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span> MEMORY_STREAM (CHAR_MAP)
                         </h3>

                         <div className="flex-1 flex flex-col items-center justify-center relative w-full gap-12">
                            
                            {/* Main Display Cards */}
                            <div className="flex gap-6 w-full max-w-2xl justify-center items-stretch">
                                {/* Large Char Preview */}
                                <div className="bg-slate-900/80 border-2 border-emerald-500/20 rounded-[32px] p-8 flex flex-col items-center justify-center flex-1 shadow-2xl relative overflow-hidden group min-h-[200px]">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 relative z-10">CHARACTER</span>
                                    <AnimatePresence mode="wait">
                                        <motion.span 
                                            key={charValue}
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 1.5, opacity: 0 }}
                                            className="text-8xl font-black text-white relative z-10 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                        >
                                            {charValue === '\0' ? '∅' : (charValue === ' ' ? '␣' : charValue)}
                                        </motion.span>
                                    </AnimatePresence>
                                </div>

                                <div className="flex flex-col gap-4 flex-1">
                                    <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-4 flex flex-col items-center justify-center flex-1 shadow-lg group relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">CODE_POINT (10)</span>
                                        <span className="text-3xl font-black text-white relative z-10 font-mono">{asciiCode}</span>
                                    </div>
                                    <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-4 flex flex-col items-center justify-center flex-1 shadow-lg group relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">HEX_REPRESENT (16)</span>
                                        <span className="text-3xl font-black text-purple-400 relative z-10 font-mono">0x{asciiCode.toString(16).toUpperCase().padStart(encoding/4, '0')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Binary Map Visualization */}
                            <div className="w-full max-w-3xl flex flex-col items-center gap-6">
                                <div className="flex flex-col items-center gap-3 w-full bg-black/40 border border-white/5 p-6 rounded-[30px] backdrop-blur-md">
                                    <div className="flex gap-4 mb-2">
                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Active Bits</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 border border-white/5">
                                            <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Idle Nodes</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-center flex-wrap gap-2">
                                        {bits.map((b, i) => {
                                            const weight = Math.pow(2, encoding - 1 - i);
                                            return (
                                                <div 
                                                    key={i} 
                                                    className="group flex flex-col items-center gap-2 cursor-pointer"
                                                    onClick={() => toggleBit(i)}
                                                    onMouseEnter={() => setHoveredBit({ index: i, weight })}
                                                    onMouseLeave={() => setHoveredBit(null)}
                                                >
                                                    <span className="text-[8px] font-bold text-slate-600 font-mono group-hover:text-emerald-400 transition-colors">{weight}</span>
                                                    <div className={`w-8 h-12 md:w-10 md:h-14 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${b ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-900/50 border-white/10 hover:border-white/20'}`}>
                                                        <span className={`text-lg font-black font-mono transition-colors ${b ? 'text-emerald-400' : 'text-slate-700'}`}>{b}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="h-8 flex items-center justify-center mt-2">
                                        <AnimatePresence mode="wait">
                                            {hoveredBit ? (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -5 }}
                                                    className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/5 px-4 py-1 rounded-full border border-emerald-500/10"
                                                >
                                                    Bit Index {hoveredBit.index} <span className="mx-2 text-slate-700">|</span> Weight: {hoveredBit.weight} <span className="mx-2 text-slate-700">|</span> Value: {bits[hoveredBit.index] * hoveredBit.weight}
                                                </motion.div>
                                            ) : (
                                                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em]">Toggle bits to change the binary value of the character</span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                         </div>
                    </div>

                    <ComplexityPulse 
                        themeColor="emerald"
                        activeComplexity={activeComplexity}
                        operationName="CHAR_ALU"
                    />

                    {learningMode === "ADVANCED" && (
                        <LogicTrace 
                            themeColor="emerald"
                            activeOperation={activeOperation}
                            codeTemplates={CODE_TEMPLATES}
                            selectedLang={selectedLang}
                            infoText="UNICODE_MAPPING_SEQUENCE"
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default CharacterManager;
