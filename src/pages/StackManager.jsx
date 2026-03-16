import React, { useState } from "react";
import { STACK_CODE_TEMPLATES as CODE_TEMPLATES, memoryAddresses } from '../constants';
import Header from '../components/layout/Header';
import ComplexityReporter from '../components/layout/ComplexityReporter';
import SystemMetrics from '../components/layout/SystemMetrics';
import ComplexityPulse from '../components/layout/ComplexityPulse';
import LogicTrace from '../components/layout/LogicTrace';
import MemoryGrid from '../components/layout/MemoryGrid';

const StackManager = () => {
    const [stack, setStack] = useState([
        { id: 101, data: "KERNEL_INIT", physical: 4 },
        { id: 102, data: "SYS_DAEMON", physical: 5 }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLang, setSelectedLang] = useState("JAVA");
    const [activeOperation, setActiveOperation] = useState(null);
    const [activeComplexity, setActiveComplexity] = useState(null);
    const [systemError, setSystemError] = useState(null);
    const [animationSpeed, setAnimationSpeed] = useState(800);
    const [runtimeStats, setRuntimeStats] = useState({ reads: 0, writes: 0, allocs: 0, steps: 0 });
    const [isProcessing, setIsProcessing] = useState(false);
    const [showHex, setShowHex] = useState(true);
    const [implementation, setImplementation] = useState("ARRAY"); // ARRAY or LINKED_LIST
    const [isScanningId, setIsScanningId] = useState(null);
    const [baseAddr] = useState(4);
    const [reserved] = useState([0, 1, 10, 11, 18, 19, 23]);

    const [insight, setInsight] = useState({
        time: "O(1)",
        space: "O(n)",
        efficiency: "98%"
    });

    const MAX_CAPACITY = 8;

    const resetStats = () => {
        setRuntimeStats({ reads: 0, writes: 0, allocs: 0, steps: 0 });
    };

    const getFreePhysicalSlot = () => {
        const usedSlots = [...stack.map(s => s.physical), ...reserved];
        if (implementation === "ARRAY") {
            const nextTarget = baseAddr + stack.length;
            if (!usedSlots.includes(nextTarget) && nextTarget < 24) return nextTarget;
        } else {
            for (let i = 0; i < 24; i++) {
                if (!usedSlots.includes(i)) return i;
            }
        }
        return -1;
    };

    const handleCheckEmpty = () => {
        setIsProcessing(true);
        setActiveOperation("IS_EMPTY");
        setActiveComplexity("O(1)");

        const result = stack.length === 0;
        setInsight(prev => ({ ...prev, time: "O(1)", efficiency: "100%" }));

        if (result) setSystemError("STATUS: STACK_EMPTY_TRUE");
        else setSystemError("STATUS: STACK_EMPTY_FALSE");

        setTimeout(() => {
            setIsProcessing(false);
            setActiveComplexity(null);
            setActiveOperation(null);
            setSystemError(null);
        }, 1500);
    };

    const handleCheckFull = () => {
        setIsProcessing(true);
        setActiveOperation("IS_FULL");
        setActiveComplexity("O(1)");

        const result = stack.length >= MAX_CAPACITY;
        setInsight(prev => ({ ...prev, time: "O(1)", efficiency: "100%" }));

        if (result) setSystemError("STATUS: STACK_OVERFLOW_TRUE");
        else setSystemError("STATUS: STACK_OVERFLOW_FALSE");

        setTimeout(() => {
            setIsProcessing(false);
            setActiveComplexity(null);
            setActiveOperation(null);
            setSystemError(null);
        }, 1500);
    };

    const handleSearch = async () => {
        if (!searchQuery || isProcessing || stack.length === 0) return;
        setIsProcessing(true);
        resetStats();
        setActiveComplexity("O(n)");
        setActiveOperation("SEARCH");

        let found = false;
        for (let i = stack.length - 1; i >= 0; i--) {
            setIsScanningId(stack[i].id);
            setRuntimeStats(prev => ({ ...prev, steps: stack.length - i, reads: stack.length - i }));
            await new Promise(r => setTimeout(r, animationSpeed));
            if (stack[i].data.toLowerCase() === searchQuery.toLowerCase()) {
                found = true;
                break;
            }
        }

        if (!found) {
            setSystemError("NOT_FOUND: Element not present in stack buffer.");
            setTimeout(() => setSystemError(null), 3000);
        }

        setTimeout(() => {
            setIsScanningId(null);
            setActiveComplexity(null);
            setActiveOperation(null);
            setIsProcessing(false);
            setSearchQuery("");
        }, 1500);
    };

    const handleReverse = async () => {
        if (stack.length < 2 || isProcessing) return;
        setIsProcessing(true);
        resetStats();
        setActiveComplexity("O(n)");
        setActiveOperation("REVERSE");
        setInsight({ time: "O(n)", space: "O(n)", efficiency: "65%" });

        await new Promise(r => setTimeout(r, animationSpeed));
        setStack(prev => [...prev].reverse());
        setRuntimeStats(prev => ({ ...prev, writes: stack.length }));

        setTimeout(() => {
            setActiveComplexity(null);
            setActiveOperation(null);
            setIsProcessing(false);
        }, 1500);
    };

    const handlePush = async () => {
        if (!inputValue || isProcessing) return;
        if (stack.length >= MAX_CAPACITY) {
            setSystemError("STACK_OVERFLOW: SEGMENTATION_FAULT at " + (baseAddr + MAX_CAPACITY));
            setTimeout(() => setSystemError(null), 3000);
            return;
        }

        setIsProcessing(true);
        resetStats();
        setActiveComplexity("O(1)");
        setActiveOperation("PUSH");
        setInsight({ time: "O(1)", space: "O(1)", efficiency: "94%" });

        await new Promise(r => setTimeout(r, animationSpeed));

        const freeSlot = getFreePhysicalSlot();
        const newNode = {
            id: Date.now(),
            data: inputValue.toUpperCase(),
            physical: freeSlot
        };

        setStack(prev => [...prev, newNode]);
        setRuntimeStats(prev => ({ ...prev, writes: 1, allocs: 1 }));
        setInputValue("");

        setTimeout(() => {
            setActiveComplexity(null);
            setActiveOperation(null);
            setIsProcessing(false);
        }, 1500);
    };

    const handlePop = async () => {
        if (stack.length === 0 || isProcessing) {
            if (stack.length === 0) {
                setSystemError("STACK_UNDERFLOW: BUFFER_EMPTY_EXCEPTION");
                setTimeout(() => setSystemError(null), 3000);
            }
            return;
        }

        setIsProcessing(true);
        resetStats();
        setActiveComplexity("O(1)");
        setActiveOperation("POP");
        setInsight({ time: "O(1)", space: "O(1)", efficiency: "96%" });

        await new Promise(r => setTimeout(r, animationSpeed));

        setStack(prev => prev.slice(0, -1));
        setRuntimeStats(prev => ({ ...prev, writes: 1 }));

        setTimeout(() => {
            setActiveComplexity(null);
            setActiveOperation(null);
            setIsProcessing(false);
        }, 1500);
    };

    const handlePeek = async () => {
        if (stack.length === 0 || isProcessing) return;

        setIsProcessing(true);
        resetStats();
        setActiveComplexity("O(1)");
        setActiveOperation("PEEK");

        await new Promise(r => setTimeout(r, animationSpeed / 2));
        setRuntimeStats(prev => ({ ...prev, reads: 1 }));

        setTimeout(() => {
            setActiveComplexity(null);
            setActiveOperation(null);
            setIsProcessing(false);
        }, 1500);
    };

    const handleClear = async () => {
        if (stack.length === 0 || isProcessing) return;
        setIsProcessing(true);
        setActiveComplexity("O(n)");
        setActiveOperation("CLEAR");
        setInsight({ time: "O(n)", space: "O(1)", efficiency: "40%" });

        await new Promise(r => setTimeout(r, 1000));
        setStack([]);
        setRuntimeStats(prev => ({ ...prev, steps: stack.length }));

        setTimeout(() => {
            setActiveComplexity(null);
            setActiveOperation(null);
            setIsProcessing(false);
        }, 1000);
    };

    return (
        <div className="h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col">
            <style>{`
                .stack-container-gradient {
                    background: linear-gradient(180deg, rgba(30, 41, 59, 0) 0%, rgba(30, 41, 59, 0.4) 100%);
                }
                @keyframes push-animation {
                    0% { transform: translateY(-100px) scale(0.9); opacity: 0; }
                    60% { transform: translateY(10px) scale(1.05); }
                    100% { transform: translateY(0) scale(1); opacity: 1; }
                }
                .push-item { animation: push-animation 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
                @keyframes complexity-pop { 
                    0% { transform: scale(0.8) translateY(10px); opacity: 0; } 
                    20% { transform: scale(1.1) translateY(0); opacity: 1; } 
                    100% { transform: scale(1) translateY(0); opacity: 1; } 
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .custom-scroll::-webkit-scrollbar { width: 4px; }
            `}</style>

            <Header 
                abbr="ST"
                moduleName="MOD_03: STACKS (LIFO)"
                moduleDesc="(LIFO Buffer)"
                themeColor="blue"
                config={{
                    label: "Implementation",
                    value: implementation,
                    onChange: setImplementation,
                    options: [
                        { value: "ARRAY", label: "CONTIGUOUS_ARRAY" },
                        { value: "LINKED_LIST", label: "LINKED_NODES" }
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
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar pb-2">
                        <section className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-5">
                            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></span> SYSTEM_OPERATIONS
                            </h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">LIFO_STREAM_INPUT</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="data..."
                                            className="flex-1 h-10 bg-[#01040f] border border-white/5 rounded-xl px-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-mono"
                                        />
                                        <button onClick={handlePush} disabled={isProcessing} className="px-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl text-white text-[9.5px] font-black transition-all shadow-lg uppercase tracking-widest">PUSH</button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                        <button onClick={handlePop} disabled={isProcessing} className="py-2.5 bg-slate-900 border border-white/5 hover:border-red-500/30 disabled:opacity-50 rounded-lg text-slate-400 hover:text-red-400 text-[9px] font-black transition-all uppercase tracking-widest">POP</button>
                                        <button onClick={handlePeek} disabled={isProcessing} className="py-2.5 bg-slate-800 border border-white/5 hover:border-blue-500/30 disabled:opacity-50 rounded-lg text-slate-400 hover:text-blue-400 text-[9px] font-black transition-all uppercase tracking-widest">PEEK</button>
                                        <button onClick={handleCheckEmpty} disabled={isProcessing} className="py-2.5 bg-slate-900 border border-purple-500/20 hover:border-purple-500/50 disabled:opacity-50 rounded-lg text-slate-400 hover:text-purple-400 text-[9px] font-black transition-all uppercase tracking-widest">isEmpty()</button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <button onClick={handleReverse} disabled={isProcessing} className="py-2 bg-slate-900/50 border border-white/5 hover:border-purple-500/20 disabled:opacity-50 rounded-lg text-slate-500 hover:text-purple-300 text-[8px] font-black transition-all uppercase tracking-widest text-[7px]">REVERSE_STACK</button>
                                        <button onClick={handleCheckFull} disabled={isProcessing} className="py-2 bg-slate-900/50 border border-white/5 hover:border-orange-500/20 disabled:opacity-50 rounded-lg text-slate-500 hover:text-orange-300 text-[8px] font-black transition-all uppercase tracking-widest">isFull()</button>
                                    </div>
                                </div>
                                <div className="h-px bg-white/5"></div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">ADVANCED_SEARCH_OFFSET</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="find_element..."
                                            className="flex-1 h-9 bg-slate-950 border border-white/5 rounded-lg px-3 text-xs text-white outline-none focus:border-blue-500/50 font-mono"
                                        />
                                        <button onClick={handleSearch} disabled={isProcessing} className="px-4 bg-blue-500/10 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-lg text-[9px] font-black uppercase transition-all">SEARCH</button>
                                    </div>
                                </div>
                                <button onClick={handleClear} disabled={isProcessing} className="w-full py-2 bg-slate-900 border border-red-500/10 hover:border-red-500/30 disabled:opacity-50 rounded-lg text-red-500/40 hover:text-red-400 text-[9px] font-black transition-all uppercase tracking-widest">WIPE_STACK_BUFFER (CLEAR)</button>
                            </div>
                        </section>

                        <ComplexityReporter
                            themeColor="blue"
                            stats={[
                                { label: "Writes", value: runtimeStats.writes },
                                { label: "Reads/Steps", value: runtimeStats.reads || runtimeStats.steps }
                            ]}
                        />

                        <SystemMetrics 
                            themeColor="blue"
                            insight={insight}
                            activeComplexity={null}
                            systemError={systemError}
                        />
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden relative">
                    <div className="shrink-0 flex gap-4 h-14">
                        <section className="flex-1 bg-slate-900/20 border border-white/5 rounded-xl px-5 flex items-center justify-between overflow-hidden relative">
                            {stack.length / MAX_CAPACITY >= 0.8 && <div className="absolute inset-0 bg-red-500/[0.01]"></div>}
                            <div className="flex items-center gap-4">
                                <span className={`text-[8px] font-black tracking-widest px-2 py-1 rounded transition-colors ${stack.length >= MAX_CAPACITY ? 'bg-red-500 text-white animate-pulse' : stack.length === 0 ? 'bg-slate-800 text-slate-500' : 'bg-green-500/10 text-green-400'}`}>
                                    {stack.length >= MAX_CAPACITY ? 'O_CAPACITY' : stack.length === 0 ? 'STATUS::EMPTY' : 'STATUS::READY'}
                                </span>
                                <div>
                                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Architecture_Mode</p>
                                    <p className="text-[11px] font-black text-white leading-none uppercase tracking-tighter">
                                        {implementation === "ARRAY" ? "CONTIGUOUS_STATIC_ARRAY" : "DYNAMIC_LINKED_RESOURCES"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">Buffer_Saturation</p>
                                    <div className="w-32 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                                        <div className={`h-full transition-all duration-700 ${stack.length / MAX_CAPACITY > 0.8 ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${(stack.length / MAX_CAPACITY) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="flex-[0.4] bg-slate-900/20 border border-white/5 rounded-xl px-5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center border border-white/5 font-mono text-xs text-blue-500">
                                {stack.length}
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none">Total_Count</p>
                                <p className="text-[10px] font-bold text-white tracking-widest">SIZE(n)</p>
                            </div>
                        </section>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
                        <div className="bg-[#030816]/60 border border-white/5 rounded-[40px] p-6 flex flex-col gap-5 overflow-hidden relative">
                            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-blue-500"></span> LOGICAL_STACK (LIFO_STRUCTURE)
                            </h3>

                            <div className="flex-1 flex justify-center items-end pb-12 relative">
                                <div className={`w-[200px] h-full max-h-[480px] border-x-4 border-b-4 border-white/10 rounded-b-[40px] relative stack-container-gradient flex flex-col-reverse items-center p-4 overflow-y-auto no-scrollbar pt-20 transition-all duration-500 
                                    ${implementation === "LINKED_LIST" ? "gap-6 border-dashed" : "gap-2"}`}>
                                    {stack.map((item, index) => (
                                        <div
                                            key={item.id}
                                            id={`logical-node-${item.id}`}
                                            className={`w-full shrink-0 h-10 border rounded-2xl flex items-center justify-center relative push-item transition-all duration-500
                                                ${isScanningId === item.id ? 'border-purple-500 bg-purple-500/20 scale-105 z-10' :
                                                    index === stack.length - 1 && activeOperation === 'PEEK' ? 'border-blue-400 bg-blue-500/20 scale-105 shadow-[0_0_20px_rgba(59,130,246,0.3)]' :
                                                        'bg-blue-600/10 border-blue-500/30'}`}
                                        >
                                            <span className="text-[10px] font-mono font-black text-blue-400 tracking-tighter">{item.data}</span>
                                        </div>
                                    ))}
                                    {stack.length === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center opacity-10 italic text-[10px] tracking-[0.5em] uppercase">STACK_HALT</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <MemoryGrid 
                            title="PHYSICAL_RAM (HARDWARE)"
                            cols={4}
                            themeColor="blue"
                            showHex={showHex}
                            memoryAddresses={memoryAddresses}
                            reserved={reserved}
                            getCellValue={(i) => {
                                const stackItem = stack.find(s => s.physical === i);
                                const isTop = stackItem && stack.indexOf(stackItem) === stack.length - 1;
                                const isScanning = stackItem && isScanningId === stackItem.id;
                                
                                return {
                                    hasData: !!stackItem,
                                    isScanning: isScanning,
                                    isActive: isTop && isProcessing && activeOperation !== 'SEARCH',
                                    subLabel: stackItem ? `STK_${stack.indexOf(stackItem)}` : null
                                };
                            }}
                        />
                    </div>

                    <ComplexityPulse 
                        themeColor="blue"
                        activeComplexity={activeComplexity}
                        operationName="EXECUTING_LIFO_OP"
                    />

                    <LogicTrace 
                        themeColor="blue"
                        activeOperation={activeOperation}
                        codeTemplates={CODE_TEMPLATES}
                        selectedLang={selectedLang}
                        infoText="KERNEL_CLOCK::2.4GHz"
                    />
                </div>
            </main>
        </div>
    );
};

export default StackManager;
