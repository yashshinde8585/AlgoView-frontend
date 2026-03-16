import React, { useState, useEffect } from "react";
import { BOOLEAN_CODE_TEMPLATES as CODE_TEMPLATES } from '../constants';
import Header from '../components/layout/Header';
import ComplexityPulse from '../components/layout/ComplexityPulse';
import LogicTrace from '../components/layout/LogicTrace';
import { motion, AnimatePresence } from "framer-motion";

const BooleanManager = () => {
    const [boolValue, setBoolValue] = useState(true);
    const [bits, setBits] = useState([1]); // 1 bit for boolean usually

    const [selectedLang, setSelectedLang] = useState("JAVA");
    const [activeOperation, setActiveOperation] = useState(null);
    const [activeComplexity, setActiveComplexity] = useState(null);
    const [animationSpeed, setAnimationSpeed] = useState(800);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showHex, setShowHex] = useState(true);
    const [learningMode, setLearningMode] = useState("BEGINNER");
    const [activeTab, setActiveTab] = useState("LOGIC"); // LOGIC, MEMORY

    // Sync bits when boolValue changes
    useEffect(() => {
        setBits([boolValue ? 1 : 0]);
    }, [boolValue]);

    const toggleBool = () => {
        if (isProcessing) return;
        setBoolValue(!boolValue);
    };

    const executeOp = async (opName, newVal) => {
        if (isProcessing) return;
        setIsProcessing(true);
        setActiveComplexity("O(1)");
        setActiveOperation(opName);

        await new Promise(r => setTimeout(r, animationSpeed / 2));
        setBoolValue(newVal);

        setTimeout(() => {
            setActiveComplexity(null);
            setActiveOperation(null);
            setIsProcessing(false);
        }, 1200);
    };

    const handleNot = () => executeOp("LOGICAL_NOT", !boolValue);
    const handleAnd = () => executeOp("LOGICAL_AND", boolValue && true);
    const handleOr = () => executeOp("LOGICAL_OR", boolValue || false);

    return (
        <div className="h-screen bg-[#020617] text-slate-300 font-sans selection:bg-green-500/30 flex flex-col overflow-hidden">
            <Header 
                abbr="BOL"
                moduleName="MOD_09: PRIMITIVE BOOLEAN"
                moduleDesc="(Logical Truth Values)"
                themeColor="green"
                config={{
                    label: "Internal Storage",
                    value: "8-bit",
                    onChange: () => {},
                    options: [
                        { value: "1-bit", label: "LOGICAL (1-BIT)" },
                        { value: "8-bit", label: "JVM/STRUC (8-BIT)" },
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
                                <h2 className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-sm"></span> LOGIC_CONTROLLER
                                </h2>
                                <div className="flex bg-slate-950 border border-white/10 rounded-lg p-1">
                                    <button 
                                        onClick={() => setLearningMode("BEGINNER")}
                                        className={`px-3 py-1 text-[9px] font-black rounded-md transition-all uppercase tracking-widest ${learningMode === "BEGINNER" ? 'bg-green-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
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
                                    <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">STEP 1: TRUTH_ASSIGNMENT</label>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setBoolValue(true)} 
                                            disabled={isProcessing}
                                            className={`flex-1 py-3 rounded-xl border-2 transition-all font-black uppercase tracking-widest text-[10px] ${boolValue ? 'bg-green-500/10 border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'bg-slate-900 border-white/5 text-slate-500 hover:border-white/10'}`}
                                        >
                                            SET TRUE
                                        </button>
                                        <button 
                                            onClick={() => setBoolValue(false)} 
                                            disabled={isProcessing}
                                            className={`flex-1 py-3 rounded-xl border-2 transition-all font-black uppercase tracking-widest text-[10px] ${!boolValue ? 'bg-red-500/10 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-slate-900 border-white/5 text-slate-500 hover:border-white/10'}`}
                                        >
                                            SET FALSE
                                        </button>
                                    </div>
                                </div>

                                <div className="h-px bg-white/5"></div>

                                <div className="space-y-3">
                                    <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">STEP 2: LOGICAL_OPERATIONS</label>
                                    <div className="flex gap-1 bg-slate-900/50 p-1 rounded-lg border border-white/5">
                                        <button onClick={() => setActiveTab("LOGIC")} className={`flex-1 py-1.5 text-[8.5px] font-black rounded uppercase tracking-widest transition-all ${activeTab === "LOGIC" ? "bg-slate-800 text-green-400 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>Gates</button>
                                        <button onClick={() => setActiveTab("MEMORY")} className={`flex-1 py-1.5 text-[8.5px] font-black rounded uppercase tracking-widest transition-all ${activeTab === "MEMORY" ? "bg-slate-800 text-blue-400 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>Storage</button>
                                    </div>

                                    <div className="min-h-[90px]">
                                        {activeTab === "LOGIC" && (
                                            <div className="grid grid-cols-1 gap-2 animate-in slide-in-from-right-2 fade-in duration-200">
                                                <button onClick={handleNot} disabled={isProcessing} className="py-2.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-lg text-white text-[9px] font-black transition-all shadow-lg uppercase tracking-widest">LOGICAL_NOT (!)</button>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button onClick={handleAnd} disabled={isProcessing} className="py-2.5 bg-slate-800 border border-white/5 hover:border-green-500/30 disabled:opacity-50 rounded-lg text-slate-400 hover:text-green-400 text-[9px] font-black transition-all uppercase tracking-widest">AND (&&)</button>
                                                    <button onClick={handleOr} disabled={isProcessing} className="py-2.5 bg-slate-800 border border-white/5 hover:border-green-500/30 disabled:opacity-50 rounded-lg text-slate-400 hover:text-green-400 text-[9px] font-black transition-all uppercase tracking-widest">OR (||)</button>
                                                </div>
                                            </div>
                                        )}
                                        {activeTab === "MEMORY" && (
                                            <div className="animate-in slide-in-from-right-2 fade-in duration-200 flex flex-col gap-2">
                                                <div className="bg-slate-900 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase">Theoretical size</span>
                                                    <span className="text-xs font-mono font-black text-green-400">1 Bit</span>
                                                </div>
                                                <div className="bg-slate-900 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase">Actual structure</span>
                                                    <span className="text-xs font-mono font-black text-blue-400">1 Byte (JVM)</span>
                                                </div>
                                                <p className="text-[8px] text-slate-600 italic px-1">Most modern CPUs cannot address individual bits, so booleans often occupy a full byte in memory.</p>
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
                             <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span> BINARY_STATE_CELL
                         </h3>

                         <div className="flex-1 flex flex-col items-center justify-center relative w-full gap-16">
                            
                            {/* Visual State Gate */}
                            <div className="relative">
                                <motion.div 
                                    animate={{ 
                                        rotate: boolValue ? 0 : 180,
                                        scale: boolValue ? 1 : 0.95
                                    }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    className={`w-64 h-64 rounded-[48px] border-4 flex flex-col items-center justify-center gap-2 shadow-2xl relative overflow-hidden transition-colors duration-500 ${boolValue ? 'bg-green-500/10 border-green-500/40' : 'bg-red-500/10 border-red-500/40'}`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500 ${boolValue ? 'from-green-500/20 to-transparent' : 'from-red-500/20 to-transparent'}`}></div>
                                    
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest relative z-10">LOGICAL_STATE</span>
                                    <AnimatePresence mode="wait">
                                        <motion.span 
                                            key={boolValue ? "TRUE" : "FALSE"}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -20, opacity: 0 }}
                                            className={`text-6xl font-black relative z-10 drop-shadow-2xl ${boolValue ? 'text-green-400' : 'text-red-400'}`}
                                        >
                                            {boolValue ? "TRUE" : "FALSE"}
                                        </motion.span>
                                    </AnimatePresence>
                                </motion.div>
                                
                                {/* Orbiting Bit Indicator */}
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-40px] border border-dashed border-white/10 rounded-full pointer-events-none"
                                >
                                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono font-black text-xs ${boolValue ? 'bg-green-500 border-green-400 text-white' : 'bg-slate-800 border-white/20 text-slate-400'}`}>
                                        {boolValue ? "1" : "0"}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Memory Grid Visualization */}
                            <div className="w-full max-w-2xl flex flex-col items-center gap-6">
                                <div className="bg-black/40 border border-white/5 p-8 rounded-[40px] w-full relative">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Silicon Bit Register</span>
                                            <span className="text-[8px] font-bold text-slate-500 uppercase">Interactive Hardware Level</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                <span className="text-[8px] font-bold text-slate-500 uppercase">HIGH (1)</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                                                <span className="text-[8px] font-bold text-slate-500 uppercase">LOW (0)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <div 
                                            onClick={toggleBool}
                                            className={`w-32 h-48 rounded-3xl border-4 cursor-pointer transition-all duration-500 flex flex-col items-center justify-center gap-4 group ${boolValue ? 'bg-green-500/20 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'bg-slate-900/50 border-white/10 shadow-inner'}`}
                                        >
                                            <span className={`text-4xl font-black font-mono transition-colors duration-500 ${boolValue ? 'text-green-400' : 'text-slate-700'}`}>
                                                {boolValue ? "1" : "0"}
                                            </span>
                                            <div className={`w-12 h-1 rounded-full transition-all duration-500 ${boolValue ? 'bg-green-400 w-16' : 'bg-slate-800 w-8'}`}></div>
                                            <span className="text-[8px] font-bold text-slate-600 uppercase opacity-0 group-hover:opacity-100 transition-opacity">FLIP_GATE</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 text-center">
                                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
                                            In digital electronics, Booleans are simply a voltage state. **High (1)** or **Low (0)**. While we think of them as English words, the computer only sees a single wire's electrical charge.
                                        </p>
                                    </div>
                                </div>
                            </div>
                         </div>
                    </div>

                    <ComplexityPulse 
                        themeColor="green"
                        activeComplexity={activeComplexity}
                        operationName="LOGIC_ALU"
                    />

                    {learningMode === "ADVANCED" && (
                        <LogicTrace 
                            themeColor="green"
                            activeOperation={activeOperation}
                            codeTemplates={CODE_TEMPLATES}
                            selectedLang={selectedLang}
                            infoText="TRUTH_TABLE_EVAL"
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default BooleanManager;
