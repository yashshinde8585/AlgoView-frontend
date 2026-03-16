import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { SEARCH_CODE_TEMPLATES as CODE_TEMPLATES } from '../constants';
import Header from '../components/layout/Header';
import ComplexityPulse from '../components/layout/ComplexityPulse';
import LogicTrace from '../components/layout/LogicTrace';
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Shuffle, Zap, Search, Target, HelpCircle } from "lucide-react";

const SearchingManager = () => {
    const location = useLocation();
    const [array, setArray] = useState([]);
    const [arraySize, setArraySize] = useState(12);
    const [selectedAlgo, setSelectedAlgo] = useState("LINEAR_SEARCH");
    const [targetValue, setTargetValue] = useState(null);
    const [searchVal, setSearchVal] = useState("");
    
    const [activeOperation, setActiveOperation] = useState(null);
    const [activeComplexity, setActiveComplexity] = useState(null);
    const [selectedLang, setSelectedLang] = useState("JAVA");
    const [animationSpeed, setAnimationSpeed] = useState(800);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showHex, setShowHex] = useState(false);
    const [learningMode, setLearningMode] = useState("BEGINNER");

    // Visualization specific state
    const [scanningIndex, setScanningIndex] = useState(null);
    const [foundIndex, setFoundIndex] = useState(null);
    const [binaryBounds, setBinaryBounds] = useState({ low: null, mid: null, high: null });
    const [exhausted, setExhausted] = useState(false);

    const generateArray = useCallback((size = arraySize, sort = selectedAlgo === "BINARY_SEARCH") => {
        let newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
        if (sort) newArray.sort((a, b) => a - b);
        setArray(newArray);
        setScanningIndex(null);
        setFoundIndex(null);
        setBinaryBounds({ low: null, mid: null, high: null });
        setExhausted(false);
        setActiveOperation(null);
        setActiveComplexity(null);
        
        // Pick a random value from array as default target for easier testing
        setTargetValue(newArray[Math.floor(Math.random() * newArray.length)]);
    }, [arraySize, selectedAlgo]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const algo = params.get("algo");
        if (algo) setSelectedAlgo(algo === "linear" ? "LINEAR_SEARCH" : "BINARY_SEARCH");
        generateArray(arraySize, (algo === "binary" || selectedAlgo === "BINARY_SEARCH"));
    }, [location.search, generateArray, arraySize, selectedAlgo]);

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const linearSearch = async () => {
        setIsProcessing(true);
        setActiveOperation("LINEAR_SEARCH");
        setActiveComplexity("O(n)");
        setFoundIndex(null);
        setExhausted(false);

        for (let i = 0; i < array.length; i++) {
            setScanningIndex(i);
            await wait(2200 - animationSpeed);
            
            if (array[i] === targetValue) {
                setFoundIndex(i);
                setIsProcessing(false);
                return;
            }
        }

        setExhausted(true);
        setScanningIndex(null);
        setIsProcessing(false);
    };

    const binarySearch = async () => {
        setIsProcessing(true);
        setActiveOperation("BINARY_SEARCH");
        setActiveComplexity("O(log n)");
        setFoundIndex(null);
        setExhausted(false);

        let low = 0;
        let high = array.length - 1;

        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            setBinaryBounds({ low, mid, high });
            await wait(2200 - animationSpeed);

            if (array[mid] === targetValue) {
                setFoundIndex(mid);
                setIsProcessing(false);
                return;
            }

            if (array[mid] < targetValue) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
            setBinaryBounds({ low, mid, high });
            await wait((2200 - animationSpeed) / 2);
        }

        setExhausted(true);
        setBinaryBounds({ low: null, mid: null, high: null });
        setIsProcessing(false);
    };

    const handleRun = () => {
        if (!targetValue && targetValue !== 0) return;
        if (selectedAlgo === "LINEAR_SEARCH") linearSearch();
        else binarySearch();
    };

    const getAlgoDescription = () => {
        if (selectedAlgo === "LINEAR_SEARCH") {
            return "Searching for a needle in a haystack by checking every single piece of straw one by one from left to right.";
        }
        return "The 'Guesser' algorithm. If the list is sorted, we jump to the middle, see if our target is higher or lower, and throw away half the list instantly.";
    };

    const getStepExplanation = () => {
        if (!isProcessing) {
            if (foundIndex !== null) return `Success! Found target ${targetValue} at index [${foundIndex}].`;
            if (exhausted) return `Target ${targetValue} not found in the dataset.`;
            return "Enter a value and click 'Search' to begin the retrieval process.";
        }
        
        if (selectedAlgo === "LINEAR_SEARCH") {
            return `Checking index [${scanningIndex}]. Value is ${array[scanningIndex]}. ${array[scanningIndex] === targetValue ? "Match found!" : "Not a match."}`;
        } else {
            const { low, mid, high } = binaryBounds;
            if (array[mid] === targetValue) return `Found it! The middle value is exactly ${targetValue}.`;
            if (array[mid] < targetValue) return `${array[mid]} is too small. Half the list (left of ${mid}) is ignored. Range is now [${low} to ${high}].`;
            return `${array[mid]} is too big. Half the list (right of ${mid}) is ignored. Range is now [${low} to ${high}].`;
        }
    };

    return (
        <div className="h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30 flex flex-col overflow-hidden">
            <Header 
                abbr="FIND"
                moduleName={`MOD_08: ${selectedAlgo}`}
                moduleDesc="(Information Retrieval)"
                themeColor="emerald"
                config={{
                    label: "Algo",
                    value: selectedAlgo,
                    onChange: setSelectedAlgo,
                    options: [
                        { value: "LINEAR_SEARCH", label: "LINEAR_SEARCH (Unsorted)" },
                        { value: "BINARY_SEARCH", label: "BINARY_SEARCH (Sorted)" },
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
                        <section className="bg-gradient-to-br from-emerald-600/20 to-teal-600/10 border border-emerald-500/20 rounded-2xl p-4 shadow-xl">
                            <h2 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Information Theory
                            </h2>
                            <p className="text-[11px] text-slate-300 leading-relaxed font-medium italic">
                                "{getAlgoDescription()}"
                            </p>
                        </section>

                        <section className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
                            <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-2 pb-2 border-b border-white/5">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-sm"></span> SEARCH_PARAMETERS
                            </h2>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Target_Value</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="number" 
                                            value={searchVal}
                                            onChange={(e) => {
                                                setSearchVal(e.target.value);
                                                setTargetValue(parseInt(e.target.value));
                                            }}
                                            placeholder="Enter target..."
                                            className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-mono outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                                        />
                                        <button 
                                            onClick={handleRun}
                                            disabled={isProcessing || !targetValue && targetValue !== 0}
                                            className="px-6 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl flex items-center gap-2 text-white text-[9px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                                        >
                                            <Search size={14} /> Search
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <button 
                                        onClick={() => generateArray()} 
                                        disabled={isProcessing}
                                        className="py-3 bg-slate-900 border border-white/5 hover:border-emerald-500/30 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all"
                                    >
                                        <Shuffle size={14} /> Re-Gen Set
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setFoundIndex(null);
                                            setScanningIndex(null);
                                            setExhausted(false);
                                            setBinaryBounds({ low: null, mid: null, high: null });
                                        }} 
                                        disabled={isProcessing}
                                        className="py-3 bg-slate-900 border border-white/5 hover:border-emerald-500/30 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all"
                                    >
                                        <RotateCcw size={14} /> Reset
                                    </button>
                                </div>

                                <div className="bg-slate-900/40 p-4 rounded-xl border-l-2 border-emerald-500/50 space-y-2">
                                     <h3 className="text-[8px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                         <HelpCircle size={10}/> SCAN_SUMMARY
                                     </h3>
                                     <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                                         {getStepExplanation()}
                                     </p>
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
                </div>

                {/* Sector 02: Visualizer */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden relative">
                    <div className="bg-[#030816]/60 border border-white/5 rounded-[40px] p-8 lg:p-12 flex flex-col gap-8 overflow-hidden relative flex-1 shadow-2xl">
                         <div className="flex items-center justify-between">
                             <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-sm animate-pulse"></span> LINEAR_STATIC_ACCESS
                             </h3>
                             <div className="flex gap-4">
                                 <div className="flex items-center gap-2">
                                     <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                     <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Normal</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                                     <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Found</span>
                                 </div>
                             </div>
                         </div>

                         <div className="flex-1 flex flex-wrap content-center justify-center gap-3 relative">
                            {array.map((value, idx) => {
                                const isScanning = scanningIndex === idx;
                                const isFound = foundIndex === idx;
                                const isLow = binaryBounds.low === idx;
                                const isHigh = binaryBounds.high === idx;
                                const isMid = binaryBounds.mid === idx;
                                const isOutsideBounds = selectedAlgo === "BINARY_SEARCH" && binaryBounds.low !== null && (idx < binaryBounds.low || idx > binaryBounds.high);
                                
                                let label = null;
                                if (isScanning || isMid) label = selectedAlgo === "LINEAR_SEARCH" ? "PTR" : "MID";
                                if (isLow) label = "LOW";
                                if (isHigh) label = "HIGH";

                                return (
                                    <div key={idx} className="relative transition-all duration-300">
                                        {/* Dynamic pointer label */}
                                        <AnimatePresence>
                                            {label && (
                                                <motion.div
                                                    initial={{ y: -10, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    exit={{ y: -10, opacity: 0 }}
                                                    className="absolute -top-10 left-1/2 -translate-x-1/2 z-20"
                                                >
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black text-white uppercase shadow-lg ${
                                                        label === "MID" || label === "PTR" ? "bg-emerald-500" : "bg-blue-600"
                                                    }`}>
                                                        {label}
                                                    </span>
                                                    <div className={`w-px h-3 mx-auto ${label === "MID" || label === "PTR" ? "bg-emerald-500" : "bg-blue-600"}`}></div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <motion.div 
                                            whileHover={{ scale: 1.05 }}
                                            className={`
                                                w-14 h-16 rounded-xl border flex flex-col items-center justify-center transition-all duration-500 relative overflow-hidden
                                                ${isFound ? "bg-emerald-500/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110 z-10" : 
                                                  isScanning || isMid ? "bg-blue-500/10 border-blue-400 scale-105 z-10 shadow-lg ring-1 ring-blue-400/20" :
                                                  isOutsideBounds ? "opacity-20 bg-slate-900 border-white/5 grayscale" :
                                                  "bg-slate-900/60 border-white/5 active:border-white/20"}
                                            `}
                                        >
                                            <span className="text-[8px] font-mono text-slate-600 absolute top-1">[{idx}]</span>
                                            <span className={`text-sm font-black font-mono tracking-tighter ${isFound ? "text-emerald-400" : isScanning || isMid ? "text-blue-400" : "text-slate-300"}`}>
                                                {value}
                                            </span>
                                            
                                            {/* Found Glow Effect */}
                                            {isFound && (
                                                <div className="absolute inset-0 bg-emerald-500/10 animate-pulse"></div>
                                            )}
                                        </motion.div>
                                    </div>
                                );
                            })}
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

export default SearchingManager;
