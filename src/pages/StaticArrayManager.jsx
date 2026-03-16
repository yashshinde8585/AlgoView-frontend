import React, { useState } from "react"
import { memoryAddresses } from "../constants"
import Header from '../components/layout/Header';
import SystemMetrics from '../components/layout/SystemMetrics';
import MemoryGrid from '../components/layout/MemoryGrid';

const StaticArrayManager = () => {
    const [items, setItems] = useState(["Val A", "Val B", "Val C"])
    const [capacity] = useState(6) // Fixed capacity for Static Array
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
    const [baseAddr] = useState(2) // Fixed physical address
    const [reserved] = useState([0, 1, 8, 9, 15, 16, 21, 22]) 
    const [activeComplexity, setActiveComplexity] = useState(null)

    const [insight, setInsight] = useState({
        time: "O(1)",
        space: "O(N)"
    })

    const handleInsert = async () => {
        if (!inputValue) return
        if (items.length >= capacity) {
            setSystemError("StackOverflow/ArrayBoundsError: Static Array is FULL");
            setTimeout(() => setSystemError(null), 3000);
            return;
        }

        try {
            setActiveComplexity("O(1)")
            setItems([...items, inputValue])
            setInsight({
                time: "O(1)",
                space: "O(1)"
            })
            setTimeout(() => setActiveComplexity(null), 1000)
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
                break;
            }
        }
        setTimeout(() => {
            setIsScanningIndex(null);
            setActiveComplexity(null);
        }, 1500);
    };

    const handleDelete = async (index) => {
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
    }

    const handleAccess = async () => {
        const idx = parseInt(accessIdx);
        if (isNaN(idx) || idx < 0 || idx >= items.length) {
            setSystemError(`IndexOutOfBounds: Accessed ${idx} but array has ${items.length} units`);
            setTimeout(() => setSystemError(null), 3000);
            return;
        }

        setInsight({ time: "O(1)", space: "O(1)" });
        setActiveComplexity("O(1)");
        setIsAccessingIndex(idx);
        await new Promise(resolve => setTimeout(resolve, animationSpeed * 2));
        setIsAccessingIndex(null);
        setActiveComplexity(null);
    };

    return (
        <div className="h-screen bg-[#020617] text-slate-300 font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col">
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .custom-scroll::-webkit-scrollbar { width: 4px; }
                .custom-scroll::-webkit-scrollbar-track { background: transparent; }
                .custom-scroll::-webkit-scrollbar-thumb { background: rgba(6,182,212,0.1); border-radius: 10px; }
            `}</style>

            <Header 
                abbr="SA"
                moduleName="MOD_1.1: STATIC_ARRAYS"
                moduleDesc="(Fixed Capacity)"
                themeColor="cyan"
                showHex={showHex}
                setShowHex={setShowHex}
                animationSpeed={animationSpeed}
                setAnimationSpeed={setAnimationSpeed}
            >
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Use Case:</span>
                    <span className="text-[9px] font-bold text-cyan-300/40 uppercase bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/5">Fixed_Buffers // Low_Level_Storage</span>
                </div>
            </Header>

            <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 grid grid-cols-12 gap-4 overflow-hidden">

                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar pb-2">
                        <section className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-5">
                            <h2 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-sm"></span> ARRAY_INTERFACE
                            </h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-600 uppercase px-1 tracking-widest">DATA_INPUT</label>
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="data_chunk..."
                                        className="w-full h-10 bg-[#01040f] border border-white/5 rounded-xl px-4 text-xs text-white placeholder:text-slate-800 focus:border-cyan-500/50 outline-none transition-all font-mono"
                                    />
                                    <div className="grid grid-cols-1 gap-2 mt-2">
                                        <button 
                                            onClick={handleInsert} 
                                            disabled={items.length >= capacity}
                                            className="py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 rounded-lg text-white text-[9.5px] font-black transition-all shadow-lg shadow-cyan-900/10 uppercase tracking-widest"
                                        >
                                            {items.length >= capacity ? "ARRAY_FULL (OVERFLOW)" : "INSERT_DATA (O(1))"}
                                        </button>
                                    </div>
                                </div>
                                <div className="h-px bg-white/5"></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">LINEAR_SEARCH</label>
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="Val..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 h-9 bg-slate-950 border border-white/5 rounded-lg px-3 text-xs text-white outline-none focus:border-purple-500/50" />
                                            <button onClick={handleSearch} className="px-3 bg-purple-600/10 hover:bg-purple-600/30 border border-purple-500/30 text-purple-400 rounded-lg text-[9px] font-black uppercase tracking-tighter">Search (O(n))</button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">DIRECT_INDEX</label>
                                        <div className="flex gap-2">
                                            <input type="number" placeholder="Idx" value={accessIdx} className="flex-1 h-9 bg-slate-950 border border-white/5 rounded-lg px-2 text-xs text-white outline-none focus:border-green-500/50"
                                                onChange={(e) => setAccessIdx(e.target.value)}
                                            />
                                            <button onClick={handleAccess} className="px-3 bg-green-500/10 hover:bg-green-500/30 border border-green-500/30 text-green-400 rounded-lg text-[9px] font-black uppercase tracking-tighter">Access (O(1))</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <SystemMetrics 
                            themeColor="cyan"
                            insight={{ time: insight.time, space: insight.space }}
                            timeLabel="Complexity_Metric"
                            activeComplexity={activeComplexity}
                            systemError={systemError}
                        />
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden">
                    <div className="shrink-0 flex gap-4 h-14">
                        <section className="flex-1 bg-slate-900/20 border border-white/5 rounded-xl px-5 flex items-center justify-between overflow-hidden relative">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl bg-[#030816] border border-white/10 flex items-center justify-center text-sm">💾</div>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1.5">FIXED_ALLOCATION</p>
                                    <p className="text-sm font-black text-white leading-none uppercase">
                                        USAGE: <span className="text-cyan-400">{items.length}</span> <span className="text-slate-700 mx-1">/</span> <span className="text-slate-400">{capacity}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex-1 max-w-[200px] h-2 bg-slate-950 rounded-full overflow-hidden ml-6 border border-white/10">
                                <div className="h-full bg-cyan-600 transition-all duration-1000" style={{ width: `${(items.length / capacity) * 100}%` }}></div>
                            </div>
                        </section>
                        <section className="flex-1 bg-slate-900/20 border border-white/5 rounded-xl px-5 flex items-center gap-4 relative overflow-hidden group">
                           <div className="w-9 h-9 rounded-lg flex items-center justify-center border bg-slate-950/40 border-white/5 text-slate-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1.5">Memory_Integrity</p>
                                <p className="text-[11px] font-black leading-none uppercase tracking-tight text-white">Immutable_Boundaries_Set</p>
                            </div>
                        </section>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
                        <div className="bg-[#030816]/60 border border-white/5 rounded-[40px] p-6 flex flex-col gap-5 overflow-hidden relative shadow-2xl">
                            <div className="shrink-0 flex items-center justify-between border-b border-white/10 pb-4">
                                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-cyan-500"></span> LOGICAL_VIEW (FIXED)
                                </h3>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scroll pr-1 space-y-3">
                                {items.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`
                                            p-4 bg-[#050b1d] border border-white/5 rounded-3xl flex items-center justify-between transition-all duration-500 relative group
                                            ${isShifting === index && shiftDirection === "left" ? "opacity-0 scale-95 translate-x-12" : "opacity-100"}
                                            ${isShifting !== null && index > isShifting && shiftDirection === "left" ? "translate-y-[-115%]" : ""}
                                            ${isScanningIndex === index ? "border-purple-500/50 bg-purple-500/[0.02] z-10" : isAccessingIndex === index ? "border-green-500/50 bg-green-500/[0.02] z-10" : "hover:border-white/10"}
                                        `}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="flex flex-col items-center bg-[#01040f] border border-white/10 rounded-2xl px-3 py-1.5 min-w-[60px] shadow-inner">
                                                <span className="text-[7px] font-black text-slate-600 leading-none mb-1 tracking-widest uppercase">Index</span>
                                                <span className={`text-sm font-mono font-black ${isScanningIndex === index ? "text-purple-400" : isAccessingIndex === index ? "text-green-400" : "text-cyan-500"} leading-none tracking-tighter`}>0{index}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest font-mono">CONTENT</span>
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
                                    </div>
                                ))}
                                {Array.from({ length: capacity - items.length }).map((_, i) => (
                                    <div key={`empty-${i}`} className="p-4 bg-[#050b1d]/20 border border-dashed border-white/5 rounded-3xl flex items-center justify-center h-[74px]">
                                        <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest">Uninitialized_Memory_Slot</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <MemoryGrid 
                            title="CONTIGUOUS_RAM_LAYOUT"
                            themeColor="cyan"
                            showHex={showHex}
                            memoryAddresses={memoryAddresses}
                            reserved={reserved}
                            getCellValue={(i) => {
                                const isOurArray = i >= baseAddr && i < baseAddr + capacity;
                                const arrayRelativeIdx = i - baseAddr;
                                const hasData = isOurArray && arrayRelativeIdx < items.length;
                                const isAccessing = isAccessingIndex === arrayRelativeIdx;
                                const isScanning = isScanningIndex === arrayRelativeIdx;
                                
                                return {
                                    hasData,
                                    isActive: isAccessing,
                                    isScanning: isScanning,
                                    subLabel: isOurArray ? `[${arrayRelativeIdx}]` : null
                                };
                            }}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default StaticArrayManager;
