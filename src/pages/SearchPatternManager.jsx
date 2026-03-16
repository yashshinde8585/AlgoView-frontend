import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { SEARCH_PATTERN_CODE_TEMPLATES as CODE_TEMPLATES } from '../constants';
import Header from '../components/layout/Header';
import ComplexityPulse from '../components/layout/ComplexityPulse';
import LogicTrace from '../components/layout/LogicTrace';
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Shuffle, Search, Target, HelpCircle, Layers, ArrowRight, CheckCircle2 } from "lucide-react";

/**
 * SearchPatternManager visualizes Advanced Searching Techniques:
 * Binary Search, Binary Search on Answer, Cyclic Sort
 */
const SearchPatternManager = () => {
    const location = useLocation();
    const [type, setType] = useState("BINARY");
    const [array, setArray] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeOperation, setActiveOperation] = useState(null);
    const [activeComplexity, setActiveComplexity] = useState(null);
    const [selectedLang, setSelectedLang] = useState("JAVA");
    const [animationSpeed, setAnimationSpeed] = useState(800);
    const [showHex, setShowHex] = useState(false);

    // States
    const [lPtr, setLPtr] = useState(null);
    const [rPtr, setRPtr] = useState(null);
    const [midPtr, setMidPtr] = useState(null);
    const [targetVal, setTargetVal] = useState(null);
    const [foundIdx, setFoundIdx] = useState(null);
    const [swapIndices, setSwapIndices] = useState([]);
    const [checkResult, setCheckResult] = useState(null);

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const resetStates = useCallback(() => {
        setLPtr(null);
        setRPtr(null);
        setMidPtr(null);
        setFoundIdx(null);
        setSwapIndices([]);
        setCheckResult(null);
        setActiveOperation(null);
        setActiveComplexity(null);
    }, []);

    const generateData = useCallback(() => {
        resetStates();
        if (type === "CYCLIC") {
            // Unsorted range [1, N]
            let arr = Array.from({ length: 8 }, (_, i) => i + 1);
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            setArray(arr);
        } else if (type === "BSONANSWER") {
            // Monotonic range for solution search
            setArray(Array.from({ length: 15 }, (_, i) => i + 1));
            setTargetVal(Math.floor(Math.random() * 10) + 3); // The "Answer" we are looking for
        } else {
            // Standard Binary Search
            let arr = Array.from({ length: 12 }, () => Math.floor(Math.random() * 90) + 10).sort((a,b)=>a-b);
            setArray(arr);
            setTargetVal(arr[Math.floor(Math.random() * arr.length)]);
        }
    }, [type, resetStates]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const t = params.get("type");
        if (t) setType(t.toUpperCase());
        generateData();
    }, [location.search, generateData]);

    // --- ALGORITHMS ---

    const runBinarySearch = async () => {
        setIsProcessing(true);
        setActiveOperation("BINARY_SEARCH");
        setActiveComplexity("O(log n)");
        let l = 0, r = array.length - 1;
        while (l <= r) {
            setLPtr(l); setRPtr(r);
            let m = Math.floor(l + (r - l) / 2);
            setMidPtr(m);
            await wait(2200 - animationSpeed);
            
            if (array[m] === targetVal) {
                setFoundIdx(m);
                setIsProcessing(false);
                return;
            }
            if (array[m] < targetVal) l = m + 1;
            else r = m - 1;
        }
        setIsProcessing(false);
    };

    const runBSOnAnswer = async () => {
        setIsProcessing(true);
        setActiveOperation("BS_ON_ANSWER");
        setActiveComplexity("O(log N * check)");
        let l = 0, r = array.length - 1;
        let ans = -1;
        
        while (l <= r) {
            setLPtr(l); setRPtr(r);
            let mid = Math.floor(l + (r - l) / 2);
            setMidPtr(mid);
            await wait(2200 - animationSpeed);
            
            // Simulation check logic
            const isPossible = array[mid] >= targetVal;
            setCheckResult(isPossible ? "SUCCESS" : "FAIL");
            await wait(1000);

            if (isPossible) {
                ans = mid;
                setFoundIdx(mid);
                r = mid - 1;
            } else {
                l = mid + 1;
            }
            setCheckResult(null);
        }
        setIsProcessing(false);
    };

    const runCyclicSort = async () => {
        setIsProcessing(true);
        setActiveOperation("CYCLIC_SORT");
        setActiveComplexity("O(n)");
        let arr = [...array];
        let i = 0;
        while (i < arr.length) {
            setLPtr(i);
            const correct = arr[i] - 1;
            setRPtr(correct);
            await wait(2200 - animationSpeed);

            if (arr[i] !== arr[correct]) {
                setSwapIndices([i, correct]);
                await wait(800);
                [arr[i], arr[correct]] = [arr[correct], arr[i]];
                setArray([...arr]);
                setSwapIndices([]);
            } else {
                i++;
            }
            await wait(500);
        }
        setLPtr(null); setRPtr(null);
        setIsProcessing(false);
    };

    const handleRun = () => {
        if (type === "BINARY") runBinarySearch();
        else if (type === "BSONANSWER") runBSOnAnswer();
        else if (type === "CYCLIC") runCyclicSort();
    };

    const getNarrative = () => {
        switch(type) {
            case "BINARY": return "The foundation. We jump to the middle, check our target, and discard half the array instantly. Requires a sorted list.";
            case "BSONANSWER": return "Used when you don't have an array to search in, but you have a range of potential answers. We binary search the result space.";
            case "CYCLIC": return "A genius pattern for arrays with numbers in range 1 to N. We swap every number to its 'correct' index (value - 1).";
            default: return "";
        }
    };

    const getCommentary = () => {
        if (!isProcessing) return "Dataset ready. Initiate computational trace.";
        if (type === "CYCLIC") {
            if (swapIndices.length > 0) return `Value ${array[swapIndices[0]]} is at index ${swapIndices[0]}. Correct position is ${array[swapIndices[0]]-1}. SWAPPING now.`;
            return `Checking element at index ${lPtr}. Value is ${array[lPtr]}. ${array[lPtr] === lPtr + 1 ? "Already in correct spot." : "Out of place."}`;
        }
        if (type === "BSONANSWER") {
            if (checkResult) return `Testing if answer '${array[midPtr]}' satisfies conditions... Result: ${checkResult}.`;
            return `Searching range [${lPtr} to ${rPtr}]. Current candidate answer is ${array[midPtr]}.`;
        }
        return `Narrowing search to range [${lPtr} to ${rPtr}]. Middle value at index ${midPtr} is ${array[midPtr]}. ${array[midPtr] === targetVal ? "FOUND MATCH!" : array[midPtr] < targetVal ? "Too small, search right." : "Too large, search left."}`;
    };

    return (
        <div className="h-screen bg-[#020617] text-slate-300 font-sans flex flex-col overflow-hidden">
            <Header 
                abbr="SPAT"
                moduleName={`MOD_10: ${type}`}
                moduleDesc="(Searching Patterns)"
                themeColor="emerald"
                config={{
                    label: "Pattern",
                    value: type,
                    onChange: setType,
                    options: [
                        { value: "BINARY", label: "Binary Search (Standard)" },
                        { value: "BSONANSWER", label: "BS on Answer (Greedy Search)" },
                        { value: "CYCLIC", label: "Cyclic Sort (Range 1-N)" }
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
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
                    <section className="bg-gradient-to-br from-emerald-600/20 to-teal-600/10 border border-emerald-500/20 rounded-2xl p-4 shadow-xl shrink-0">
                        <h2 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Theory Overview
                        </h2>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-medium italic">
                            "{getNarrative()}"
                        </p>
                    </section>

                    <section className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 shadow-xl shrink-0">
                         <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                            <Layers size={14} className="text-emerald-500" />
                            <h2 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">TRACE_LOGS</h2>
                         </div>

                         <div className="space-y-4">
                             <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 min-h-[80px] flex items-center">
                                 <p className="text-[11px] text-blue-300 font-mono leading-relaxed">
                                     <span className="text-emerald-500 font-black tracking-tighter mr-2 font-black">{">"}</span>
                                     {getCommentary()}
                                 </p>
                             </div>

                             <div className="grid grid-cols-2 gap-2">
                                <button 
                                  onClick={handleRun}
                                  disabled={isProcessing}
                                  className="py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all rounded-xl flex items-center justify-center gap-2 text-white text-[9px] font-black uppercase tracking-widest shadow-lg"
                                >
                                    <Play size={14} /> Run Trace
                                </button>
                                <button 
                                  onClick={generateData}
                                  disabled={isProcessing}
                                  className="py-3 bg-slate-900 border border-white/5 hover:border-emerald-500/30 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all"
                                >
                                    <Shuffle size={14} /> Re-Gen
                                </button>
                             </div>
                         </div>
                    </section>
                    
                    <LogicTrace 
                        themeColor="emerald"
                        activeOperation={activeOperation}
                        codeTemplates={CODE_TEMPLATES}
                        selectedLang={selectedLang}
                    />
                </div>

                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden relative">
                    <div className="bg-[#030816]/60 border border-white/5 rounded-[40px] p-8 lg:p-12 flex flex-col gap-8 overflow-hidden relative flex-1 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-sm animate-pulse"></span> PATTERN_SOLVER_CORE
                            </h3>
                            {type !== "CYCLIC" && targetVal !== null && (
                                <div className="text-[10px] bg-emerald-500/10 px-4 py-1 rounded-full border border-emerald-500/20 font-black text-emerald-400">
                                    TARGET: {targetVal}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 flex flex-wrap content-center justify-center gap-3 relative">
                            {array.map((val, idx) => {
                                const isMid = midPtr === idx;
                                const isL = lPtr === idx;
                                const isR = rPtr === idx;
                                const isFound = foundIdx === idx;
                                const isSwap = swapIndices.includes(idx);
                                const isPruned = (type !== "CYCLIC") && lPtr !== null && (idx < lPtr || idx > rPtr);
                                
                                return (
                                    <div key={idx} className="relative">
                                        <AnimatePresence>
                                            {(isL || isR || isMid) && (
                                                <motion.div 
                                                  initial={{ y: -10, opacity: 0 }}
                                                  animate={{ y: 0, opacity: 1 }}
                                                  exit={{ y: -10, opacity: 0 }}
                                                  className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-20"
                                                >
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black text-white uppercase shadow-lg ${
                                                        isMid ? "bg-emerald-500" : isL ? "bg-blue-600" : "bg-red-600"
                                                    }`}>
                                                        {isMid ? 'MID' : isL ? 'LOW' : 'HIGH'}
                                                    </span>
                                                    <div className={`w-px h-3 ${isMid ? "bg-emerald-500" : isL ? "bg-blue-500" : "bg-red-500"}`}></div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <motion.div 
                                            layout
                                            className={`w-14 h-16 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden
                                            ${isFound ? "bg-emerald-500/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-110 z-10" : 
                                              isSwap ? "bg-amber-500/20 border-amber-500 animate-bounce" :
                                              isMid ? "bg-emerald-500/10 border-emerald-400 scale-105" :
                                              isPruned ? "opacity-20 grayscale scale-90" : 
                                              "bg-slate-900 border-white/5"}
                                            `}
                                        >
                                            <span className="text-[8px] font-mono text-slate-600 absolute top-1">[{idx}]</span>
                                            <span className={`text-md font-black font-mono ${isFound ? 'text-emerald-400' : isSwap ? 'text-amber-400' : 'text-slate-300'}`}>
                                                {val}
                                            </span>
                                            {isFound && <CheckCircle2 size={12} className="text-emerald-400 absolute bottom-1" />}
                                            {checkResult && isMid && (
                                                <div className={`absolute inset-0 flex items-center justify-center bg-[#020617]/80 text-[8px] font-black ${checkResult === 'SUCCESS' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {checkResult}
                                                </div>
                                            )}
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex gap-6 justify-center pt-8 border-t border-white/5">
                             <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Candidate</span>
                             </div>
                             <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Pruned_Area</span>
                             </div>
                             {type === "CYCLIC" && (
                                 <div className="flex items-center gap-2">
                                     <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Swap_Logic</span>
                                 </div>
                             )}
                        </div>
                    </div>

                    <ComplexityPulse 
                        themeColor="emerald"
                        activeComplexity={activeComplexity}
                        operationName={activeOperation || "IDLE_CORE"}
                        position="bottom-8 right-8"
                    />
                </div>
            </main>
        </div>
    );
};

export default SearchPatternManager;
