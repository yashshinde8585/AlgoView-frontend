import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { PATTERN_CODE_TEMPLATES as CODE_TEMPLATES } from '../constants';
import Header from '../components/layout/Header';
import ComplexityPulse from '../components/layout/ComplexityPulse';
import LogicTrace from '../components/layout/LogicTrace';
import { motion, AnimatePresence } from "framer-motion";
import { Play, Shuffle, Database, Layout, ArrowRightLeft, Maximize2, Hash, Layers } from "lucide-react";

/**
 * PatternManager VISUALIZES Array & String problem-solving patterns.
 */
const PatternManager = () => {
    const location = useLocation();
    const [type, setType] = useState("TWOPOINTERS");
    const [array, setArray] = useState([10, 20, 30, 40, 50, 60, 70, 80]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeOperation, setActiveOperation] = useState(null);
    const [activeComplexity, setActiveComplexity] = useState(null);
    const [selectedLang, setSelectedLang] = useState("JAVA");
    const [animationSpeed, setAnimationSpeed] = useState(800);
    const [showHex, setShowHex] = useState(false);

    // Two Pointers State
    const [lPtr, setLPtr] = useState(null);
    const [rPtr, setRPtr] = useState(null);
    const [target, setTarget] = useState(100);

    // Sliding Window State
    const [windowRange, setWindowRange] = useState({ start: 0, end: 2 });
    const [windowSum, setWindowSum] = useState(0);

    // Prefix Sum State
    const [prefixArr, setPrefixArr] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(-1);

    // Hashing State
    const [hashMap, setHashMap] = useState({});
    const [activeKey, setActiveKey] = useState(null);

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const resetStates = useCallback(() => {
        setLPtr(null);
        setRPtr(null);
        setWindowRange({ start: 0, end: 2 });
        setWindowSum(0);
        setPrefixArr([]);
        setCurrentIdx(-1);
        setHashMap({});
        setActiveKey(null);
        setActiveOperation(null);
        setActiveComplexity(null);
    }, []);

    const generateData = useCallback(() => {
        resetStates();
        const size = type === "TWOPOINTERS" ? 10 : 8;
        let newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 40) + 10);
        if (type === "TWOPOINTERS") newArr.sort((a, b) => a - b);
        setArray(newArr);
        if (type === "TWOPOINTERS") {
            // Pick a likely target
            const r1 = Math.floor(Math.random() * size);
            const r2 = Math.floor(Math.random() * size);
            if (r1 !== r2) setTarget(newArr[r1] + newArr[r2]);
            else setTarget(newArr[r1] * 2);
        }
    }, [type, resetStates]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const t = params.get("type");
        if (t) setType(t.toUpperCase());
        generateData();
    }, [location.search, generateData]);

    // --- ALGORITHMS ---

    const runTwoPointers = async () => {
        setIsProcessing(true);
        setActiveOperation("TWO_POINTERS");
        setActiveComplexity("O(n)");
        let l = 0, r = array.length - 1;
        
        while (l < r) {
            setLPtr(l);
            setRPtr(r);
            await wait(2200 - animationSpeed);
            
            const sum = array[l] + array[r];
            if (sum === target) {
                setIsProcessing(false);
                return;
            }
            if (sum < target) l++;
            else r--;
        }
        setLPtr(null);
        setRPtr(null);
        setIsProcessing(false);
    };

    const runSlidingWindow = async () => {
        setIsProcessing(true);
        setActiveOperation("SLIDING_WINDOW");
        setActiveComplexity("O(n)");
        const k = 3;
        let curr = 0;
        
        // Initial window
        for(let i=0; i<k; i++) curr += array[i];
        setWindowRange({ start: 0, end: k-1 });
        setWindowSum(curr);
        await wait(2200 - animationSpeed);

        for (let i = k; i < array.length; i++) {
            curr += array[i] - array[i-k];
            setWindowRange({ start: i-k+1, end: i });
            setWindowSum(curr);
            await wait(2200 - animationSpeed);
        }
        setIsProcessing(false);
    };

    const runPrefixSum = async () => {
        setIsProcessing(true);
        setActiveOperation("PREFIX_SUM");
        setActiveComplexity("O(n)");
        const newPrefix = [];
        let curr = 0;
        
        for (let i = 0; i < array.length; i++) {
            setCurrentIdx(i);
            curr += array[i];
            newPrefix.push(curr);
            setPrefixArr([...newPrefix]);
            await wait(2200 - animationSpeed);
        }
        setIsProcessing(false);
    };

    const runHashing = async () => {
        setIsProcessing(true);
        setActiveOperation("HASHING");
        setActiveComplexity("O(n)");
        const map = {};
        
        for (let i = 0; i < array.length; i++) {
            setCurrentIdx(i);
            const val = array[i];
            setActiveKey(val);
            await wait(2200 - animationSpeed);
            
            map[val] = (map[val] || 0) + 1;
            setHashMap({ ...map });
            await wait((2200 - animationSpeed) / 2);
        }
        setActiveKey(null);
        setIsProcessing(false);
    };

    const handleRun = () => {
        if (type === "TWOPOINTERS") runTwoPointers();
        else if (type === "SLIDINGWINDOW") runSlidingWindow();
        else if (type === "PREFIXSUM") runPrefixSum();
        else if (type === "HASHING") runHashing();
    };

    const getPatternNarrative = () => {
        switch(type) {
            case "TWOPOINTERS": return "Goal: Find two numbers that add up to the target. Strategy: Start at both ends. If the sum is too small, move the left pointer up. If too large, move the right pointer down.";
            case "SLIDINGWINDOW": return "Goal: Find the max sum of a fixed size sub-section. Strategy: Slide a 'window' along the array, adding the next element and removing the first one to keep efficiency high.";
            case "PREFIXSUM": return "Goal: Answer range sum queries instantly. Strategy: Create a cumulative total array. Sum of any range can be found by simple subtraction of two numbers.";
            case "HASHING": return "Goal: Count occurrences or find duplicates in constant time. Strategy: 'Record' every number you see into a mental notebook (the Map) for instant lookup later.";
            default: return "";
        }
    };

    const getLiveCommentary = () => {
        if (!isProcessing) return "Standby. Click 'Run Trace' to see the pattern logic in action.";
        
        switch(type) {
            case "TWOPOINTERS":
                const sum = array[lPtr] + array[rPtr];
                if (sum === target) return `MATCH! ${array[lPtr]} + ${array[rPtr]} = ${target}. Quest complete.`;
                return `Current Sum: ${sum}. ${sum < target ? `Too small! We need bigger numbers, moving [L] index ${lPtr} to ${lPtr+1}.` : `Too big! Decreasing the sum by moving [R] index ${rPtr} to ${rPtr-1}.`}`;
            case "SLIDINGWINDOW":
                return `Calculating sum of window [${windowRange.start} to ${windowRange.end}]. Window sum is ${windowSum}.`;
            case "PREFIXSUM":
                return `Adding ${array[currentIdx]} to previous total. The cumulative sum at index ${currentIdx} is now ${prefixArr[currentIdx] || '...'}`;
            case "HASHING":
                return `Recording value ${array[currentIdx]} in the Frequency Map. It has appeared ${hashMap[array[currentIdx]] || 1} time(s) so far.`;
            default: return "Executing logic...";
        }
    };

    return (
        <div className="h-screen bg-[#020617] text-slate-300 font-sans flex flex-col overflow-hidden">
            <Header 
                abbr="PAT"
                moduleName={`MOD_09: ${type}`}
                moduleDesc="(Array Logic Patterns)"
                themeColor="purple"
                config={{
                    label: "Pattern",
                    value: type,
                    onChange: setType,
                    options: [
                        { value: "TWOPOINTERS", label: "Two Pointers (Symmetry)" },
                        { value: "SLIDINGWINDOW", label: "Sliding Window (Frames)" },
                        { value: "PREFIXSUM", label: "Prefix Sum (Pre-Calc)" },
                        { value: "HASHING", label: "Hashing (Quick-Look)" }
                    ]
                }}
                showHex={showHex}
                setShowHex={setShowHex}
                selectedLang={selectedLang}
                setSelectedLang={setSelectedLang}
                animationSpeed={animationSpeed}
                setAnimationSpeed={setAnimationSpeed}
            >
                <button 
                  onClick={handleRun}
                  disabled={isProcessing}
                  className="bg-purple-600 hover:bg-purple-500 px-4 py-1 rounded text-[10px] font-black uppercase text-white shadow-lg active:scale-95 disabled:opacity-50"
                >
                    Run Trace
                </button>
            </Header>

            <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 grid grid-cols-12 gap-6 overflow-hidden">
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
                    {/* Beginner Story Section */}
                    <section className="bg-gradient-to-br from-purple-600/20 to-indigo-600/10 border border-purple-500/20 rounded-2xl p-4 shadow-xl shrink-0">
                        <h2 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></span> Logic Narrative
                        </h2>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-medium italic">
                            "{getPatternNarrative()}"
                        </p>
                    </section>

                    <section className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 shadow-xl shrink-0">
                         <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                            <Layers size={14} className="text-purple-500" />
                            <h2 className="text-[10px] font-black text-purple-400 uppercase tracking-widest">LIVE_COMMENTARY</h2>
                         </div>

                         <div className="space-y-4">
                             <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 min-h-[80px] flex items-center">
                                 <p className="text-[11px] text-blue-300 font-mono leading-relaxed">
                                     <span className="text-purple-500 font-black tracking-tighter mr-2">{">"}</span>
                                     {getLiveCommentary()}
                                 </p>
                             </div>

                             <button 
                               onClick={generateData}
                               disabled={isProcessing}
                               className="w-full py-3 bg-slate-900 border border-white/5 hover:border-purple-500/30 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all"
                             >
                                <Shuffle size={14} /> New Random dataset
                             </button>
                         </div>
                    </section>
                    
                    <LogicTrace 
                        themeColor="purple"
                        activeOperation={activeOperation}
                        codeTemplates={CODE_TEMPLATES}
                        selectedLang={selectedLang}
                    />
                </div>

                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden relative">
                    <div className="bg-[#030816]/60 border border-white/5 rounded-[40px] p-8 lg:p-12 flex flex-col gap-8 overflow-hidden relative flex-1 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                                <span className="w-1.5 h-3 bg-purple-500 rounded-full animate-pulse"></span> PATTERN_EXECUTION_SPACE
                            </h3>
                            {type === "SLIDINGWINDOW" && (
                                <div className="bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 text-[9px] font-black text-blue-400 uppercase tracking-widest">
                                    Window Sum: {windowSum}
                                </div>
                            )}
                        </div>

                        {/* DATA DISPLAY SPACE */}
                        <div className="flex-1 flex flex-col justify-center gap-12">
                            {/* Input Array View */}
                            <div className="flex flex-wrap items-center justify-center gap-2 relative">
                                {array.map((val, idx) => {
                                    const isL = lPtr === idx;
                                    const isR = rPtr === idx;
                                    const isInWindow = type === "SLIDINGWINDOW" && idx >= windowRange.start && idx <= windowRange.end;
                                    const isScanning = currentIdx === idx;

                                    return (
                                        <div key={idx} className="relative">
                                            {/* Pointers mapping */}
                                            {(isL || isR) && (
                                                <motion.div 
                                                  layoutId={isL ? "l" : "r"}
                                                  className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
                                                >
                                                    <span className={`text-[10px] font-black p-1 rounded ${isL ? 'bg-blue-600' : 'bg-red-600'} text-white shadow-lg`}>
                                                        {isL ? 'L' : 'R'}
                                                    </span>
                                                    <div className={`w-0.5 h-4 ${isL ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                                                </motion.div>
                                            )}

                                            <motion.div 
                                                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center font-mono font-black text-sm transition-all duration-300 relative
                                                ${isInWindow ? 'bg-blue-500/20 border-blue-400 z-10 scale-110 shadow-xl' : 
                                                  isScanning ? 'bg-purple-500/20 border-purple-400 z-10' :
                                                  'bg-slate-900 border-white/5 text-slate-500'}
                                                `}
                                            >
                                                {val}
                                                {isInWindow && <div className="absolute inset-0 bg-blue-400/10 animate-pulse"></div>}
                                            </motion.div>
                                            <div className="text-[9px] font-mono font-bold text-slate-700 text-center mt-1">[{idx}]</div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Transformation View (Prefix Sum / Hashing) */}
                            <AnimatePresence>
                                {(type === "PREFIXSUM" || type === "HASHING") && (
                                    <motion.div 
                                      initial={{ y: 50, opacity: 0 }}
                                      animate={{ y: 0, opacity: 1 }}
                                      exit={{ y: 50, opacity: 0 }}
                                      className="flex flex-col gap-6 items-center"
                                    >
                                        <div className="w-1.5 h-8 bg-gradient-to-b from-purple-500 to-transparent"></div>
                                        
                                        {type === "PREFIXSUM" ? (
                                            <div className="flex flex-wrap items-center justify-center gap-2">
                                                {prefixArr.map((val, idx) => (
                                                    <motion.div 
                                                        key={idx}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="w-14 h-14 rounded-xl border-2 border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center font-mono font-black text-sm text-emerald-400"
                                                    >
                                                        {val}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap items-center justify-center gap-4 max-w-2xl">
                                                {Object.entries(hashMap).map(([key, count]) => (
                                                    <motion.div 
                                                      key={key} 
                                                      layout
                                                      className={`px-4 py-2 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all
                                                      ${activeKey === parseInt(key) ? 'bg-purple-500/40 border-purple-400 scale-125 z-20 shadow-xl shadow-purple-500/20' : 'bg-slate-900 border-white/10'}
                                                      `}
                                                    >
                                                        <span className="text-xs font-black text-slate-500 uppercase">Val: <span className="text-white">{key}</span></span>
                                                        <span className="text-[10px] font-mono text-purple-400">Freq: {count}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center justify-center gap-8 pt-8 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active_Target</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Transformation</span>
                            </div>
                        </div>
                    </div>

                    <ComplexityPulse 
                        themeColor="purple"
                        activeComplexity={activeComplexity}
                        operationName={activeOperation || "IDLE_CORE"}
                        position="bottom-8 right-8"
                    />
                </div>
            </main>
        </div>
    );
};

export default PatternManager;
