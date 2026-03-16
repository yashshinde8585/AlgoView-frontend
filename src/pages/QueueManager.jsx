import React, { useState } from "react";
import { QUEUE_CODE_TEMPLATES as CODE_TEMPLATES, memoryAddresses } from '../constants';
import Header from '../components/layout/Header';
import ComplexityReporter from '../components/layout/ComplexityReporter';
import SystemMetrics from '../components/layout/SystemMetrics';
import ComplexityPulse from '../components/layout/ComplexityPulse';
import LogicTrace from '../components/layout/LogicTrace';
import MemoryGrid from '../components/layout/MemoryGrid';

const QueueManager = () => {
    const [queue, setQueue] = useState([
        { id: 101, data: "PKT_01", physical: 4 },
        { id: 102, data: "PKT_02", physical: 5 }
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
    const [implementation, setImplementation] = useState("CIRCULAR"); // LINEAR, CIRCULAR, LINKED_LIST
    const [isScanningId, setIsScanningId] = useState(null);
    const [baseAddr] = useState(4);
    const [reserved] = useState([0, 1, 10, 11, 18, 19, 23]);

    const [front, setFront] = useState(0);
    const [rear, setRear] = useState(1); 

    const [insight, setInsight] = useState({
        time: "O(1)",
        space: "O(n)",
        efficiency: "96%"
    });

    const MAX_CAPACITY = 8;

    const resetStats = () => {
        setRuntimeStats({ reads: 0, writes: 0, allocs: 0, steps: 0 });
    };

    const handleCheckEmpty = () => {
        setIsProcessing(true);
        setActiveOperation("IS_EMPTY");
        setActiveComplexity("O(1)");

        const result = queue.length === 0;
        setInsight(prev => ({ ...prev, time: "O(1)", efficiency: "100%" }));

        if (result) setSystemError("STATUS: QUEUE_EMPTY_TRUE");
        else setSystemError("STATUS: QUEUE_EMPTY_FALSE");

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

        const result = queue.length >= MAX_CAPACITY;
        setInsight(prev => ({ ...prev, time: "O(1)", efficiency: "100%" }));

        if (result) setSystemError("STATUS: QUEUE_OVERFLOW_TRUE");
        else setSystemError("STATUS: QUEUE_OVERFLOW_FALSE");

        setTimeout(() => {
            setIsProcessing(false);
            setActiveComplexity(null);
            setActiveOperation(null);
            setSystemError(null);
        }, 1500);
    };

    const handleEnqueue = async () => {
        if (!inputValue || isProcessing) return;
        if (queue.length >= MAX_CAPACITY) {
            setSystemError("QUEUE_OVERFLOW: CIRCULAR_BUFFER_MAXED");
            setTimeout(() => setSystemError(null), 3000);
            return;
        }

        setIsProcessing(true);
        resetStats();
        setActiveComplexity("O(1)");
        setActiveOperation("ENQUEUE");
        setInsight({ time: "O(1)", space: "O(1)", efficiency: "98%" });

        await new Promise(r => setTimeout(r, animationSpeed));

        const nextRear = (rear + 1) % MAX_CAPACITY;
        const physicalSlot = baseAddr + nextRear;

        const newNode = {
            id: Date.now(),
            data: inputValue.toUpperCase(),
            physical: physicalSlot
        };

        setQueue(prev => [...prev, newNode]);
        setRear(nextRear);
        setRuntimeStats(prev => ({ ...prev, writes: 1, allocs: 1 }));
        setInputValue("");

        setTimeout(() => {
            setActiveComplexity(null);
            setActiveOperation(null);
            setIsProcessing(false);
        }, 1500);
    };

    const handleDequeue = async () => {
        if (queue.length === 0 || isProcessing) {
            if (queue.length === 0) {
                setSystemError("QUEUE_UNDERFLOW: BUFFER_EMPTY");
                setTimeout(() => setSystemError(null), 3000);
            }
            return;
        }

        setIsProcessing(true);
        resetStats();
        setActiveComplexity("O(1)");
        setActiveOperation("DEQUEUE");
        setInsight({ time: "O(1)", space: "O(1)", efficiency: "99%" });

        await new Promise(r => setTimeout(r, animationSpeed));

        setQueue(prev => prev.slice(1));
        setFront((front + 1) % MAX_CAPACITY);
        setRuntimeStats(prev => ({ ...prev, writes: 1 }));

        setTimeout(() => {
            setActiveComplexity(null);
            setActiveOperation(null);
            setIsProcessing(false);
        }, 1500);
    };

    const handlePeek = async () => {
        if (queue.length === 0 || isProcessing) return;

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

    const handleSearch = async () => {
        if (!searchQuery || isProcessing || queue.length === 0) return;
        setIsProcessing(true);
        resetStats();
        setActiveComplexity("O(n)");
        setActiveOperation("SEARCH");

        let found = false;
        for (let i = 0; i < queue.length; i++) {
            setIsScanningId(queue[i].id);
            setRuntimeStats(prev => ({ ...prev, steps: i + 1, reads: i + 1 }));
            await new Promise(r => setTimeout(r, animationSpeed));
            if (queue[i].data.toLowerCase() === searchQuery.toLowerCase()) {
                found = true;
                break;
            }
        }

        if (!found) {
            setSystemError("NOT_FOUND: Element not at current stream offset.");
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

    const handleClear = async () => {
        if (queue.length === 0 || isProcessing) return;
        setIsProcessing(true);
        setActiveOperation("CLEAR");
        setQueue([]);
        setFront(0);
        setRear(-1);
        setTimeout(() => setIsProcessing(false), 1000);
    };

    return (
        <div className="h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col">
            <style>{`
                @keyframes enqueue-animation {
                    0% { transform: translateX(100px) scale(0.9); opacity: 0; }
                    60% { transform: translateX(-10px) scale(1.05); }
                    100% { transform: translateX(0) scale(1); opacity: 1; }
                }
                .enqueue-item { animation: enqueue-animation 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .custom-scroll::-webkit-scrollbar { width: 4px; }
            `}</style>

            <Header 
                abbr="QU"
                moduleName="MOD_04: QUEUES (FIFO)"
                moduleDesc="(System Pipeline)"
                themeColor="orange"
                config={{
                    label: "Architecture",
                    value: implementation,
                    onChange: setImplementation,
                    options: [
                        { value: "LINEAR", label: "LINEAR_PIPELINE" },
                        { value: "CIRCULAR", label: "CIRCULAR_BUFFER" },
                        { value: "LINKED", label: "LINKED_NODES" }
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
                            <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-sm"></span> SYSTEM_PIPELINE_OPS
                            </h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">DATA_PACKET_INPUT</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="packet_id..."
                                            className="flex-1 h-10 bg-[#01040f] border border-white/5 rounded-xl px-4 text-xs text-white outline-none focus:border-orange-500/50 transition-all font-mono"
                                        />
                                        <button onClick={handleEnqueue} disabled={isProcessing} className="px-6 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 rounded-xl text-white text-[9.5px] font-black transition-all shadow-lg uppercase tracking-widest">ENQUEUE</button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                        <button onClick={handleDequeue} disabled={isProcessing} className="py-2.5 bg-slate-900 border border-white/5 hover:border-red-500/30 disabled:opacity-50 rounded-lg text-slate-400 hover:text-red-400 text-[9px] font-black transition-all uppercase tracking-widest">DEQUEUE</button>
                                        <button onClick={handlePeek} disabled={isProcessing} className="py-2.5 bg-slate-800 border border-white/5 hover:border-blue-500/30 disabled:opacity-50 rounded-lg text-slate-400 hover:text-blue-400 text-[9px] font-black transition-all uppercase tracking-widest">PEEK</button>
                                        <button onClick={handleCheckEmpty} disabled={isProcessing} className="py-2.5 bg-slate-900 border border-white/5 hover:border-purple-500/30 disabled:opacity-50 rounded-lg text-slate-400 hover:text-purple-400 text-[9px] font-black transition-all uppercase tracking-widest text-[8px]">isEmpty()</button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <button onClick={handleCheckFull} disabled={isProcessing} className="py-2 bg-slate-900/50 border border-white/5 hover:border-orange-500/20 disabled:opacity-50 rounded-lg text-slate-500 hover:text-orange-300 text-[8px] font-black transition-all uppercase tracking-widest">isFull()</button>
                                        <button onClick={() => setQueue([])} disabled={isProcessing} className="py-2 bg-slate-900/50 border border-white/5 hover:border-red-500/20 disabled:opacity-50 rounded-lg text-slate-500 hover:text-red-300 text-[8px] font-black transition-all uppercase tracking-widest">WIPE_QUEUE</button>
                                    </div>
                                </div>
                                <div className="h-px bg-white/5"></div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">SEQUENTIAL_SCAN_SEARCH</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="find_packet..."
                                            className="flex-1 h-9 bg-slate-950 border border-white/5 rounded-lg px-3 text-xs text-white outline-none focus:border-orange-500/50 font-mono"
                                        />
                                        <button onClick={handleSearch} disabled={isProcessing} className="px-4 bg-orange-500/10 hover:bg-orange-500/30 border border-orange-500/30 text-orange-400 rounded-lg text-[9px] font-black uppercase transition-all">SEARCH</button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <ComplexityReporter
                            themeColor="orange"
                            stats={[
                                { label: "I/O_Writes", value: runtimeStats.writes },
                                { label: "Scanning_Steps", value: runtimeStats.steps || runtimeStats.reads }
                            ]}
                        />

                        <SystemMetrics 
                            themeColor="orange"
                            title="SYSTEM_PIPELINE_METRICS"
                            insight={insight}
                            efficiencyLabel="Throughput"
                            systemError={systemError}
                        />
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden relative">
                    <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
                        <div className="bg-[#030816]/60 border border-white/5 rounded-[40px] p-6 flex flex-col gap-5 overflow-hidden relative shadow-2xl">
                            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-orange-500"></span> LOGICAL_PIPELINE (FIFO_STREAM)
                            </h3>
                            <div className="flex-1 flex flex-col justify-center items-center min-h-0">
                                {implementation === "CIRCULAR" ? (
                                    <div className="relative w-64 h-64 border-4 border-dashed border-white/10 rounded-full flex items-center justify-center">
                                        {Array.from({ length: MAX_CAPACITY }).map((_, i) => {
                                            const angle = (i * 360) / MAX_CAPACITY;
                                            const radius = 95;
                                            const x = radius * Math.cos((angle - 90) * (Math.PI / 180));
                                            const y = radius * Math.sin((angle - 90) * (Math.PI / 180));

                                            const item = queue.find(q => (q.physical - baseAddr) === i);
                                            const isFront = (front % MAX_CAPACITY) === i;
                                            const isRear = (rear % MAX_CAPACITY) === i;

                                            return (
                                                <div
                                                    key={i}
                                                    style={{ transform: `translate(${x}px, ${y}px)` }}
                                                    className={`absolute w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 border
                                                        ${item ? 'bg-orange-600/20 border-orange-500/40' : 'bg-slate-900/40 border-white/5'}
                                                        ${isScanningId === item?.id ? 'ring-2 ring-purple-500' : ''}
                                                        ${activeOperation === 'PEEK' && isFront ? 'ring-2 ring-blue-500 animate-pulse' : ''}
                                                    `}
                                                >
                                                    <span className="text-[9px] font-mono font-black text-white">{item?.data || i}</span>
                                                    {isFront && (
                                                        <div className="absolute -top-6 text-[8px] font-black text-red-500 animate-bounce tracking-widest">FRONT</div>
                                                    )}
                                                    {isRear && (
                                                        <div className="absolute -bottom-6 text-[8px] font-black text-green-500 animate-bounce tracking-widest uppercase">REAR</div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="w-full flex items-center gap-3 overflow-x-auto no-scrollbar py-12 px-8">
                                        {queue.map((item, index) => (
                                            <div
                                                key={item.id}
                                                className={`min-w-[80px] h-12 bg-orange-600/10 border border-orange-500/30 rounded-xl flex items-center justify-center relative enqueue-item transition-all duration-500
                                                    ${isScanningId === item.id ? 'bg-purple-500/20 border-purple-500 scale-110' : ''}
                                                    ${index === 0 && activeOperation === 'PEEK' ? 'bg-blue-500/20 border-blue-500 scale-110' : ''}
                                                `}
                                            >
                                                <span className="text-[10px] font-mono font-black text-orange-400">{item.data}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <MemoryGrid 
                            title="PHYSICAL_RAM (ALLOCATED_IO)"
                            themeColor="orange"
                            showHex={showHex}
                            memoryAddresses={memoryAddresses}
                            reserved={reserved}
                            getCellValue={(i) => {
                                const queueItem = queue.find(q => q.physical === i);
                                const isScanning = queueItem && isScanningId === queueItem.id;
                                
                                return {
                                    hasData: !!queueItem,
                                    isScanning: isScanning,
                                    subLabel: queueItem ? `Q_IDX_${queue.indexOf(queueItem)}` : null
                                };
                            }}
                        />
                    </div>

                    <ComplexityPulse 
                        themeColor="orange"
                        activeComplexity={activeComplexity}
                        operationName="EXECUTING_FIFO_IO"
                    />

                    <LogicTrace 
                        themeColor="orange"
                        activeOperation={activeOperation}
                        codeTemplates={CODE_TEMPLATES}
                        selectedLang={selectedLang}
                        infoText={`PIPE_DEPTH: ${queue.length}`}
                    />
                </div>
            </main>
        </div>
    );
};

export default QueueManager;
