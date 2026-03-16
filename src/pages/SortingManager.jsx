import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { SORTING_CODE_TEMPLATES as CODE_TEMPLATES } from '../constants';
import Header from '../components/layout/Header';
import ComplexityPulse from '../components/layout/ComplexityPulse';
import LogicTrace from '../components/layout/LogicTrace';
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Shuffle, Zap, BarChart2, ChevronLeft, ChevronRight, Pause } from "lucide-react";
import { useAlgorithm } from "../engine/useAlgorithm";
import { bubbleSort, quickSort, mergeSort } from "../engine/algorithms/sorting";

const ALGOS = {
    BUBBLESORT: bubbleSort,
    QUICKSORT: quickSort,
    MERGESORT: mergeSort
};

const SortingManager = () => {
    const location = useLocation();
    const [array, setArray] = useState([]);
    const [arraySize, setArraySize] = useState(15);
    const [selectedAlgo, setSelectedAlgo] = useState("BUBBLESORT");
    
    const [selectedLang, setSelectedLang] = useState("JAVA");
    const [animationSpeed, setAnimationSpeed] = useState(800);
    const [showHex, setShowHex] = useState(false);
    const [learningMode, setLearningMode] = useState("BEGINNER");

    const activeOperation = state?.operation || (isPlaying ? selectedAlgo : null);
    const activeComplexity = selectedAlgo === "BUBBLESORT" ? "O(n²)" : "O(n log n)";

    // Integration with new Core Engine
    const { 
        state, 
        isPlaying, 
        stepForward, 
        stepBackward, 
        reset, 
        togglePlay, 
        setSpeed: setEngineSpeed, 
        speed, 
        progress 
    } = useAlgorithm(ALGOS[selectedAlgo], { array });

    // Synchronization of speed
    useEffect(() => {
        setEngineSpeed(animationSpeed);
    }, [animationSpeed, setEngineSpeed]);

    const generateArray = useCallback((size = arraySize) => {
        const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
        setArray(newArray);
        reset({ array: newArray });
    }, [arraySize, reset]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const algo = params.get("algo");
        if (algo) setSelectedAlgo(algo.toUpperCase());
        generateArray();
    }, [location.search, generateArray]);

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleRun = () => {
        togglePlay();
    };

    const isProcessing = isPlaying || progress.current >= 0;
    
    // Derive visualization state from Engine State
    const displayArray = state ? state.array : array;
    const comparingIndices = state?.type === 'COMPARE' ? state.indices : [];
    const swappingIndices = state?.type === 'SWAP' ? state.indices : [];
    const pivotIndex = state?.type === 'PIVOT' ? state.indices[0] : null;
    const sortedIndices = state?.sortedIndices || [];
    const currentExplanation = state?.explanation || (isPlaying ? "Executing..." : "Ready to sort.");

    const getAlgoDescription = () => {
        switch(selectedAlgo) {
            case "BUBBLESORT": return "Imagine heavy bubbles sinking to the bottom. In each pass, the largest value 'sinks' to the end of the line by comparing neighbors.";
            case "QUICKSORT": return "Picking a 'Leader' (Pivot) and putting everyone smaller on the left and everyone bigger on the right. Then repeating for each group.";
            case "MERGESORT": return "The 'Divide and Conquer' champion. It splits the list into tiny pieces and then zips them back together in perfect order.";
            default: return "";
        }
    };

    const getStepExplanation = () => {
        return currentExplanation;
    };

    return (
        <div className="h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30 flex flex-col overflow-hidden">
            <Header 
                abbr="SORT"
                moduleName={`MOD_07: ${selectedAlgo}`}
                moduleDesc="(Algorithmic Permutations)"
                themeColor="blue"
                config={{
                    label: "Algorithm",
                    value: selectedAlgo,
                    onChange: setSelectedAlgo,
                    options: [
                        { value: "BUBBLESORT", label: "BUBBLE_SORT (Simple)" },
                        { value: "QUICKSORT", label: "QUICK_SORT (Fast)" },
                        { value: "MERGESORT", label: "MERGE_SORT (Stable)" },
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
                        {/* Narrative Guide for Beginners */}
                        <section className="bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 rounded-2xl p-4 shadow-xl">
                            <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span> Story Mode: How it works
                            </h2>
                            <p className="text-[11px] text-slate-300 leading-relaxed font-medium italic">
                                "{getAlgoDescription()}"
                            </p>
                        </section>

                        <section className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></span> KERNEL_CONTROLS
                                </h2>
                                <div className="flex bg-slate-950 border border-white/10 rounded-lg p-1">
                                    <button 
                                        onClick={() => setLearningMode("BEGINNER")}
                                        className={`px-3 py-1 text-[9px] font-black rounded-md transition-all uppercase tracking-widest ${learningMode === "BEGINNER" ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        Friendly
                                    </button>
                                    <button 
                                        onClick={() => setLearningMode("ADVANCED")}
                                        className={`px-3 py-1 text-[9px] font-black rounded-md transition-all uppercase tracking-widest ${learningMode === "ADVANCED" ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        Code
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <button 
                                        onClick={() => generateArray()} 
                                        disabled={isProcessing}
                                        className="py-3 bg-slate-900 border border-white/5 hover:border-blue-500/30 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all"
                                    >
                                        <Shuffle size={14} /> New Random Set
                                    </button>
                                    <button 
                                        onClick={handleRun} 
                                        className={`py-3 ${isPlaying ? 'bg-orange-600 hover:bg-orange-500' : 'bg-blue-600 hover:bg-blue-500'} rounded-xl flex items-center justify-center gap-2 text-white text-[9px] font-black shadow-lg shadow-blue-500/20 uppercase tracking-widest transition-all active:scale-95`}
                                    >
                                        {isPlaying ? <Pause size={14} /> : <Play size={14} />} 
                                        {isPlaying ? "Pause Execution" : progress.current >= 0 ? "Resume Sorting" : "Start Sorting"}
                                    </button>
                                </div>

                                {/* Step-by-Step Navigation (Power User Feature) */}
                                <div className="grid grid-cols-2 gap-2">
                                    <button 
                                        onClick={stepBackward} 
                                        disabled={isPlaying || progress.current <= 0}
                                        className="py-2 bg-slate-900 border border-white/5 disabled:opacity-30 rounded-lg flex items-center justify-center gap-2 text-slate-400 text-[8px] font-black uppercase tracking-widest transition-all"
                                    >
                                        <ChevronLeft size={12} /> Step Back
                                    </button>
                                    <button 
                                        onClick={stepForward} 
                                        disabled={isPlaying}
                                        className="py-2 bg-slate-900 border border-white/5 disabled:opacity-30 rounded-lg flex items-center justify-center gap-2 text-slate-400 text-[8px] font-black uppercase tracking-widest transition-all"
                                    >
                                        Step Forward <ChevronRight size={12} />
                                    </button>
                                </div>

                                <div className="space-y-3 p-4 bg-slate-900/50 rounded-2xl border border-white/5 shadow-inner">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Number of Items</label>
                                        <span className="text-[10px] font-mono font-bold text-blue-400">{arraySize}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="5" 
                                        max="30" 
                                        value={arraySize}
                                        onChange={(e) => setArraySize(parseInt(e.target.value))}
                                        disabled={isProcessing}
                                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" 
                                    />
                                </div>

                                <div className="bg-slate-900/40 p-4 rounded-xl border-l-2 border-blue-500/50 space-y-2">
                                     <h3 className="text-[8px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                         <BarChart2 size={10}/> TEACHER_NOTES
                                     </h3>
                                     <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                                         {getStepExplanation()}
                                     </p>
                                </div>
                            </div>
                        </section>
                        
                        {learningMode === "ADVANCED" && (
                            <LogicTrace 
                                themeColor="blue"
                                activeOperation={state?.operation || selectedAlgo}
                                codeTemplates={CODE_TEMPLATES}
                                selectedLang={selectedLang}
                                infoText={`STEP_${progress.current + 1}_OF_TOTAL`}
                            />
                        )}
                    </div>
                </div>

                {/* Sector 02: Visualization Canvas */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden relative">
                    <div className="bg-[#030816]/60 border border-white/5 rounded-[40px] p-8 lg:p-12 flex flex-col gap-8 overflow-hidden relative flex-1 shadow-2xl">
                         <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                             <span className="w-1.5 h-1.5 bg-blue-500 rounded-sm animate-pulse"></span> GEOMETRIC_SORT_SPACE
                         </h3>

                         <div className="flex-1 flex items-end justify-center gap-2 lg:gap-3 px-4 relative">
                            {/* Visual Grid Lines */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to top, white 1px, transparent 1px)', backgroundSize: '100% 10%' }}></div>

                            <AnimatePresence mode="popLayout">
                                {displayArray.map((value, idx) => {
                                    const isComparing = comparingIndices.includes(idx);
                                    const isSwapping = swappingIndices.includes(idx);
                                    const isSorted = sortedIndices.includes(idx);
                                    const isPivot = pivotIndex === idx;

                                    // Dynamic Variable Labeling
                                    let ptrLabel = null;
                                    if (isPivot) ptrLabel = "PIVOT";
                                    else if (isComparing && idx === comparingIndices[0]) ptrLabel = "i";
                                    else if (isComparing && idx === comparingIndices[1]) ptrLabel = "j";
                                    else if (isSwapping && idx === swappingIndices[0]) ptrLabel = "SWAP";

                                    return (
                                        <motion.div
                                            key={`${idx}-${value}`}
                                            layout
                                            initial={{ opacity: 0, scaleY: 0 }}
                                            animate={{ opacity: 1, scaleY: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            className="relative flex-1 group"
                                            style={{ height: `${value}%` }}
                                        >
                                            {/* Variable Pointer Label */}
                                            {ptrLabel && (
                                                <motion.div 
                                                    initial={{ y: -20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    className="absolute -top-10 left-1/2 -translate-x-1/2 z-30"
                                                >
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                                        isPivot ? "bg-purple-600 text-white" :
                                                        isSwapping ? "bg-red-600 text-white" :
                                                        "bg-amber-500 text-slate-900"
                                                    } shadow-lg ring-1 ring-white/20`}>
                                                        {ptrLabel}
                                                    </span>
                                                    <div className={`w-px h-3 mx-auto ${isPivot ? "bg-purple-500" : isSwapping ? "bg-red-500" : "bg-amber-500"}`}></div>
                                                </motion.div>
                                            )}

                                            <div className={`w-full h-full rounded-t-xl transition-all duration-300 border-x border-t relative overflow-hidden ${
                                                isSwapping ? 'bg-red-500 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)] z-10' :
                                                isComparing ? 'bg-amber-400 border-amber-300 scale-x-110 z-10 shadow-lg' :
                                                isPivot ? 'bg-purple-600 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]' :
                                                isSorted ? 'bg-emerald-500/30 border-emerald-400/50' :
                                                'bg-blue-600/10 border-blue-500/20 group-hover:bg-blue-600/20 group-hover:border-blue-500/40'
                                            }`}>
                                                {/* Ambient light effect inside bars */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5"></div>
                                                
                                                {/* Value tag on hover */}
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    <span className="text-[10px] font-mono font-black text-white px-2 py-1 bg-slate-900 rounded-md border border-white/10 shadow-xl">{value}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Index Marker at Bottom */}
                                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold text-slate-700">
                                                [{idx}]
                                            </div>

                                            {/* Reflection Layer */}
                                            <div className="absolute top-full left-0 right-0 h-1/4 opacity-10 pointer-events-none bg-gradient-to-b from-blue-500/20 to-transparent"></div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                         </div>
                         
                         {/* Visualization Legend */}
                         <div className="flex items-center justify-center gap-8 border-t border-white/5 pt-6">
                             <div className="flex items-center gap-2">
                                 <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Compare</span>
                             </div>
                             <div className="flex items-center gap-2">
                                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Swap</span>
                             </div>
                             <div className="flex items-center gap-2">
                                 <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pivot</span>
                             </div>
                             <div className="flex items-center gap-2">
                                 <div className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-400/50"></div>
                                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sorted</span>
                             </div>
                         </div>
                    </div>

                    <ComplexityPulse 
                        themeColor="blue"
                        activeComplexity={activeComplexity}
                        operationName={activeOperation || "IDLE_CORE"}
                        position="bottom-12 right-12"
                    />
                </div>
            </main>
        </div>
    );
};

export default SortingManager;
