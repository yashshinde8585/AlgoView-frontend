import React, { useState, useEffect } from "react"
import { api } from "../services/api"
import { memoryAddresses } from "../constants"
import Header from '../components/layout/Header';
import SystemMetrics from '../components/layout/SystemMetrics';

const ListManager = () => {
    const [items, setItems] = useState(["Task 1", "Task 2", "Task 3"])
    const [capacity, setCapacity] = useState(4)
    const [isResizing, setIsResizing] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [isShifting, setIsShifting] = useState(null)
    const [shiftDirection, setShiftDirection] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [isScanningIndex, setIsScanningIndex] = useState(null)
    const [showHex, setShowHex] = useState(false)
    const [animationSpeed, setAnimationSpeed] = useState(600)
    const [accessIdx, setAccessIdx] = useState("")
    const [isAccessingIndex, setIsAccessingIndex] = useState(null)
    const [systemError, setSystemError] = useState(null)
    const [baseAddr, setBaseAddr] = useState(4) // Start at physical address 4
    const [reserved, setReserved] = useState([0, 1, 10, 11, 18, 19, 23]) // Foreign memory blocks
    const [isCompacting, setIsCompacting] = useState(false)
    const [activeComplexity, setActiveComplexity] = useState(null)

    const [insight, setInsight] = useState({
        time: "O(1)",
        space: "O(n)"
    })



    const handleAdd = async (atStart = false) => {
        if (!inputValue) return

        if (items.length >= capacity) {
            setIsResizing(true)
            setActiveComplexity("O(n)")
            setInsight({
                time: "O(n)",
                space: "O(2n)"
            })
            // Move to a new physical location to simulate finding a new contiguous block
            const newBase = (baseAddr + 8) % 12
            await new Promise(resolve => setTimeout(resolve, animationSpeed * 1.5))
            setBaseAddr(newBase)
            setCapacity(prev => prev * 2)
            setIsResizing(false)
            setTimeout(() => setActiveComplexity(null), 1000)
        }

        try {
            await api.post("/list/add", { item: inputValue, atStart })
            if (atStart) {
                setActiveComplexity("O(n)")
                setInsight({
                    time: "O(n)",
                    space: "O(1)"
                })
                setIsShifting(0)
                setShiftDirection("right")
                setTimeout(() => {
                    setItems([inputValue, ...items])
                    setIsShifting(null)
                    setShiftDirection(null)
                    setActiveComplexity(null)
                }, animationSpeed)
            } else {
                setActiveComplexity("O(1)")
                setItems([...items, inputValue])
                setInsight({
                    time: "AMORTIZED O(1)",
                    space: "O(1)"
                })
                setTimeout(() => setActiveComplexity(null), 1000)
            }
            setInputValue("")
        } catch (err) { console.error("Add failed", err) }
    }

    const handleSearch = async () => {
        if (!searchQuery) return;
        setActiveComplexity("O(n)");
        setInsight({
            time: "O(n)",
            space: "O(1)"
        });

        for (let i = 0; i < items.length; i++) {
            setIsScanningIndex(i);
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
            if (items[i].toLowerCase() === searchQuery.toLowerCase()) {
                setInsight(prev => ({
                    ...prev
                }));
                break;
            }
        }
        setTimeout(() => {
            setIsScanningIndex(null);
            setActiveComplexity(null);
        }, 1500);
    };

    const handleDelete = async (index) => {
        try {
            await api.delete(`/list/${index}`)
            setActiveComplexity("O(n)")
            setIsShifting(index)
            setShiftDirection("left")
            setInsight({
                time: "O(n)",
                space: "O(1)"
            })
            setTimeout(() => {
                setItems(items.filter((_, i) => i !== index))
                setIsShifting(null)
                setShiftDirection(null)
                setActiveComplexity(null)
            }, animationSpeed)
        } catch (err) { console.error("Delete failed", err) }
    }

    const handleAccess = async () => {
        const idx = parseInt(accessIdx);
        if (isNaN(idx) || idx < 0 || idx >= items.length) {
            setSystemError(`IndexError: list index ${idx} out of range`);
            setTimeout(() => setSystemError(null), 3000);
            return;
        }

        setInsight({ time: "O(1)", space: "O(n)" });
        setActiveComplexity("O(1)");
        setIsAccessingIndex(idx);
        await new Promise(resolve => setTimeout(resolve, animationSpeed * 2));
        setIsAccessingIndex(null);
        setActiveComplexity(null);
    };

    const handleCompact = async () => {
        setIsCompacting(true);
        setActiveComplexity("O(n)");
        setInsight({ time: "O(n)", space: "O(1)" });
        await new Promise(resolve => setTimeout(resolve, animationSpeed * 2));

        // Logical Compaction: Move everything to front
        setBaseAddr(0);
        // Move reserved blocks to the end to simulate defragmentation
        setReserved([20, 21, 22, 23]);

        await new Promise(resolve => setTimeout(resolve, animationSpeed * 2));
        setIsCompacting(false);
        setActiveComplexity(null);
    };

    return (
        <div className="h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col">
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .custom-scroll::-webkit-scrollbar { width: 4px; }
                .custom-scroll::-webkit-scrollbar-track { background: transparent; }
                .custom-scroll::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.1); border-radius: 10px; }
                @keyframes pulse-ring { 0% { transform: scale(0.98); opacity: 0.3; } 50% { transform: scale(1); opacity: 0.1; } 100% { transform: scale(0.98); opacity: 0.3; } }
                @keyframes complexity-pop { 0% { transform: scale(0.8) translateY(10px); opacity: 0; } 20% { transform: scale(1.1) translateY(0); opacity: 1; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
            `}</style>


            {/* Header / Nav */}
            <Header 
                abbr="DA"
                moduleName="MOD_01: DYNAMIC_ARRAYS"
                moduleDesc="(Contiguous Memory)"
                themeColor="blue"
                showHex={showHex}
                setShowHex={setShowHex}
                animationSpeed={animationSpeed}
                setAnimationSpeed={setAnimationSpeed}
            >
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Use Case:</span>
                    <span className="text-[9px] font-bold text-blue-300/40 uppercase bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/5">Playlist_Manager // Vector_Buffer</span>
                </div>
            </Header>

            <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 grid grid-cols-12 gap-4 overflow-hidden">

                {/* --- SECTOR 01: CONTROLS & INTELLIGENCE --- */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar pb-2">
                        {/* 01_CONTROL_PANE */}
                        <section className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-5">
                            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></span> SYSTEM_OPERATIONS
                            </h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-600 uppercase px-1 tracking-widest">DATA_ELEMENT_INPUT</label>
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="system_data_stream_alpha..."
                                        className="w-full h-10 bg-[#01040f] border border-white/5 rounded-xl px-4 text-xs text-white placeholder:text-slate-800 focus:border-blue-500/50 outline-none transition-all font-mono"
                                    />
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <button onClick={() => handleAdd(true)} className="py-2.5 bg-slate-900/50 border border-white/5 rounded-lg hover:border-blue-500/30 transition-all text-[9.5px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-400">
                                            INSERT_AT (O(n))
                                        </button>
                                        <button onClick={() => handleAdd(false)} className="py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-[9.5px] font-black transition-all shadow-lg shadow-blue-900/10 uppercase tracking-widest">
                                            PUSH_BACK (O(1))
                                        </button>
                                    </div>
                                    <button onClick={handleCompact} className="w-full py-2 bg-slate-900/80 border border-white/10 rounded-lg text-[9px] font-black text-blue-400/60 uppercase tracking-widest hover:bg-blue-400/10 hover:border-blue-500/30 transition-all mt-2">
                                        COMPACT_HEAP_SEGMENT (O(n))
                                    </button>
                                </div>
                                <div className="h-px bg-white/5"></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">SEARCH_QUERY</label>
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="Value..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 h-9 bg-slate-950 border border-white/5 rounded-lg px-3 text-xs text-white outline-none focus:border-purple-500/50" />
                                            <button onClick={handleSearch} className="px-3 bg-purple-600/10 hover:bg-purple-600/30 border border-purple-500/30 text-purple-400 rounded-lg text-[9px] font-black uppercase">Search (O(n))</button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">INDEX_ACCESS</label>
                                        <div className="flex gap-2">
                                            <input type="number" placeholder="Idx" value={accessIdx} className="flex-1 h-9 bg-slate-950 border border-white/5 rounded-lg px-2 text-xs text-white outline-none focus:border-green-500/50"
                                                onChange={(e) => setAccessIdx(e.target.value)}
                                            />
                                            <button onClick={handleAccess} className="px-3 bg-green-500/10 hover:bg-green-500/30 border border-green-500/30 text-green-400 rounded-lg text-[9px] font-black uppercase">Access (O(1))</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 02_METRICS & SYSTEM_LOGIC */}
                        <SystemMetrics 
                            themeColor="blue"
                            insight={{ time: insight.time, space: insight.space }}
                            timeLabel="Time_Complexity"
                            activeComplexity={activeComplexity}
                            systemError={systemError}
                        />
                    </div>
                </div>

                {/* --- SECTOR 02: SYSTEM VISUALIZATION --- */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden">
                    {/* Allocation Ribbon */}
                    <div className="shrink-0 flex gap-4 h-14">
                        <section className="flex-[1.2] bg-slate-900/20 border border-white/5 rounded-xl px-5 flex items-center justify-between overflow-hidden relative">
                            {items.length / capacity >= 0.8 && <div className="absolute inset-0 bg-red-500/[0.01]"></div>}
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl bg-[#030816] border border-white/10 flex items-center justify-center text-sm">📊</div>
                                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#020617] transition-colors ${items.length / capacity >= 0.8 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1.5">ARRAY_SIZE_METRICS</p>
                                    <p className="text-sm font-black text-white leading-none">
                                        SIZE: <span className="text-blue-400">{items.length}</span> <span className="text-slate-700 mx-2">|</span> CAP: <span className="text-slate-400">{capacity}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex-1 max-w-[250px] h-2 bg-slate-950 rounded-full overflow-hidden ml-6 border border-white/10 relative">
                                <div className={`h-full transition-all duration-1000 ${items.length / capacity >= 0.8 ? 'bg-red-500' : items.length / capacity >= 0.6 ? 'bg-orange-500' : 'bg-blue-600'}`} style={{ width: `${(items.length / capacity) * 100}%` }}></div>
                                {isResizing && <div className="absolute top-0 h-full bg-white opacity-40 animate-[shimmer_1s_infinite]" style={{ width: '40%' }}></div>}
                            </div>
                        </section>
                        <section className="flex-1 bg-slate-900/20 border border-white/5 rounded-xl px-5 flex items-center gap-4 relative overflow-hidden group">
                            {isResizing && <div className="absolute inset-0 bg-red-500/[0.01]"></div>}
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-500 ${isResizing ? "bg-red-500/5 border-red-500/20 text-red-400" : "bg-slate-950/40 border-white/5 text-slate-700"}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isResizing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1.5">Heap_Alignment_State</p>
                                <p className={`text-[11px] font-black leading-none uppercase tracking-tight ${isResizing || isCompacting ? "text-red-400" : "text-white"}`}>
                                    {isResizing ? "Allocating_New_Segment" : isCompacting ? "Compacting_Memory_Block" : "BLOCK_CONTIGUOUS_VERIFIED"}
                                </p>
                            </div>
                        </section>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
                        {/* --- THE LOGICAL VIEW (ARRAY) --- */}
                        <div className="bg-[#030816]/60 border border-white/5 rounded-[40px] p-6 flex flex-col gap-5 overflow-hidden relative shadow-2xl">
                            <div className="shrink-0 flex items-center justify-between border-b border-white/10 pb-4">
                                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-blue-500"></span> LOGICAL_VIEW (ARRAY)
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tighter bg-white/5 px-2 py-0.5 rounded border border-white/5">[Contiguous Block]</span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scroll pr-1 space-y-3">
                                {items.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`
                                            p-4 bg-[#050b1d] border border-white/5 rounded-3xl flex items-center justify-between transition-all duration-500 relative group
                                            ${isShifting === index && shiftDirection === "left" ? "opacity-0 scale-95 translate-x-12" : "opacity-100"}
                                            ${isShifting !== null && index > isShifting && shiftDirection === "left" ? "translate-y-[-115%]" : ""}
                                            ${isShifting !== null && index >= isShifting && shiftDirection === "right" ? "translate-y-[115%]" : ""}
                                            ${isScanningIndex === index ? "border-purple-500/50 bg-purple-500/[0.02] z-10" : isAccessingIndex === index ? "border-green-500/50 bg-green-500/[0.02] z-10" : "hover:border-white/10"}
                                        `}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="flex flex-col items-center bg-[#01040f] border border-white/10 rounded-2xl px-3 py-1.5 min-w-[60px] shadow-inner">
                                                <span className="text-[7px] font-black text-slate-600 leading-none mb-1 tracking-widest uppercase">Index</span>
                                                <span className={`text-sm font-mono font-black ${isScanningIndex === index ? "text-purple-400" : isAccessingIndex === index ? "text-green-400" : "text-blue-500"} leading-none tracking-tighter`}>0{index}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest font-mono">ELEMENT_DATA</span>
                                                    <div className="w-1 h-1 rounded-full bg-white/10"></div>
                                                    <span className="text-[8px] font-mono text-slate-600 tracking-tighter">
                                                        {showHex ? memoryAddresses[index % memoryAddresses.length] : `offset::+${index * 4}b`}
                                                    </span>
                                                </div>
                                                <span className={`text-lg font-black tracking-tight leading-none ${isScanningIndex === index || isAccessingIndex === index ? "text-white" : "text-slate-200"}`}>{item}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(index)} className="w-10 h-10 rounded-2xl bg-red-400/5 border border-transparent hover:border-red-400/20 flex items-center justify-center text-slate-700 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                        {index < items.length - 1 && <div className="absolute -bottom-3 left-10 w-px h-3 bg-white/5"></div>}
                                    </div>
                                ))}
                                {isResizing && (
                                    <div className="h-24 flex items-center justify-center border-4 border-dashed border-red-500/10 rounded-[32px] bg-red-500/[0.01] animate-pulse">
                                        <div className="text-center">
                                            <span className="text-[10px] font-black text-red-400/80 uppercase tracking-[0.4em] block mb-1">HEAP_EXPANSION_TRIGGERED</span>
                                            <span className="text-[8px] font-mono text-slate-700">Allocating new memory block...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="shrink-0 pt-3 flex justify-between items-center text-[7px] font-black text-slate-800 uppercase tracking-[0.5em]">
                                <span>Segment::Base_PTR</span>
                                <span>Segment::Bound_Check</span>
                            </div>
                        </div>

                        {/* --- THE PHYSICAL RAM VIEW --- */}
                        <div className="bg-[#030816]/60 border border-white/5 rounded-[40px] p-6 flex flex-col gap-5 overflow-hidden relative shadow-2xl">
                            <div className="shrink-0 flex items-center justify-between border-b border-white/10 pb-4">
                                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-green-500"></span> PHYSICAL_RAM (HARDWARE)
                                </h3>
                                <div className="flex gap-2.5">
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        <span className="text-[7px] font-black text-slate-500 uppercase">Array</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-900/40"></div>
                                        <span className="text-[7px] font-black text-slate-500 uppercase">System</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                                        <span className="text-[7px] font-black text-slate-500 uppercase">Free</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scroll pr-1 pb-2">
                                <div className="grid grid-cols-6 gap-3 content-start">
                                    {Array.from({ length: 24 }).map((_, i) => {
                                        const isOurArray = i >= baseAddr && i < baseAddr + capacity;
                                        const arrayRelativeIdx = i - baseAddr;
                                        const hasData = isOurArray && arrayRelativeIdx < items.length;
                                        const isReserved = reserved.includes(i);
                                        const isAccessing = isAccessingIndex === arrayRelativeIdx;
                                        const isScanning = isScanningIndex === arrayRelativeIdx;

                                        return (
                                            <div
                                                key={i}
                                                className={`
                                                    relative aspect-square rounded-2xl border flex flex-col items-center justify-center transition-all duration-700
                                                    ${isCompacting ? "blur-[1px] opacity-70" : ""}
                                                    ${hasData ? "bg-blue-600/[0.05] border-blue-500/30 ring-1 ring-blue-500/10" :
                                                        isOurArray ? "bg-blue-500/[0.01] border-blue-500/10 border-dashed" :
                                                            isReserved ? "bg-amber-500/5 border-amber-500/20 grayscale" : "bg-slate-950/40 border-white/5 opacity-40"}
                                                    ${isScanning ? "!border-purple-500 bg-purple-500/20 z-10 !opacity-100" :
                                                        isAccessing ? "!border-green-500 bg-green-500/20 z-10 !opacity-100 scale-105" : ""}
                                                `}
                                            >
                                                <span className={`text-[7px] font-mono absolute top-2 font-black ${isReserved ? "text-amber-600/50" : hasData ? "text-blue-500" : "text-slate-800"}`}>
                                                    {showHex ? memoryAddresses[i] : i}
                                                </span>

                                                <div className={`
                                                    w-1.5 h-1.5 rounded-full transition-all duration-700
                                                    ${isScanning ? "bg-white" :
                                                        isAccessing ? "bg-green-400 scale-125" :
                                                            hasData ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" :
                                                                isReserved ? "bg-amber-900/40" : "bg-slate-900"}
                                                `}></div>

                                                <span className="text-[6px] font-black absolute bottom-1.5 text-slate-800 uppercase tracking-tighter italic">
                                                    {isReserved ? "SYS_RES" : isOurArray ? `A[${arrayRelativeIdx}]` : "FREE"}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ListManager;
