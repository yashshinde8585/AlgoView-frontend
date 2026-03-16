import React from 'react';

const themes = {
    blue: {
        text: 'text-blue-500',
        bg: 'bg-blue-600/[0.05]',
        border: 'border-blue-500/30',
        ring: 'ring-blue-500/10',
        dot: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]',
    },
    green: {
        text: 'text-green-500',
        bg: 'bg-green-600/[0.05]',
        border: 'border-green-500/30',
        ring: 'ring-green-500/10',
        dot: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]',
    },
    orange: {
        text: 'text-orange-500',
        bg: 'bg-orange-600/[0.05]',
        border: 'border-orange-500/30',
        ring: 'ring-orange-500/10',
        dot: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]',
    },
    purple: {
        text: 'text-purple-500',
        bg: 'bg-purple-600/[0.05]',
        border: 'border-purple-500/30',
        ring: 'ring-purple-500/10',
        dot: 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]',
    },
    cyan: {
        text: 'text-cyan-500',
        bg: 'bg-cyan-600/[0.05]',
        border: 'border-cyan-500/30',
        ring: 'ring-cyan-500/10',
        dot: 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]',
    },
    emerald: {
        text: 'text-emerald-500',
        bg: 'bg-emerald-600/[0.05]',
        border: 'border-emerald-500/30',
        ring: 'ring-emerald-500/10',
        dot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]',
    }
};

const MemoryGrid = ({
    title = "PHYSICAL_MEMORY_LAYOUT",
    themeColor = "blue",
    gridSize = 24,
    cols = 6,
    showHex = false,
    memoryAddresses = [],
    reserved = [],
    getCellValue, // func(index) => { hasData, isActive, isAltActive, isScanning, label, subLabel, colorOverride, ringColor }
    legend = [], // array of { color, label }
    className = "",
    containerClassName = ""
}) => {
    const theme = themes[themeColor] || themes.blue;

    return (
        <div className={`bg-[#030816]/60 border border-white/5 rounded-[40px] p-6 flex flex-col gap-5 overflow-hidden relative shadow-2xl ${containerClassName}`}>
            <div className="shrink-0 flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className={`w-1 h-1 rounded-full ${theme.dot.split(' ')[0]}`}></span> {title}
                </h3>
                {legend.length > 0 && (
                    <div className="flex gap-2.5">
                        {legend.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${item.color}`}></div>
                                <span className="text-[7px] font-black text-slate-500 uppercase">{item.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scroll pr-1 pb-2">
                <div className={`grid grid-cols-${cols} gap-3 content-start ${className}`}>
                    {Array.from({ length: gridSize }).map((_, i) => {
                        const cell = getCellValue ? getCellValue(i) : {};
                        const isReserved = reserved.includes(i);
                        
                        const hasData = cell.hasData;
                        const isActive = cell.isActive;
                        const isAltActive = cell.isAltActive;
                        const isScanning = cell.isScanning;

                        let cellClass = "bg-slate-950/40 border-white/5 opacity-40";
                        let dotClass = "bg-slate-900";
                        let textClass = "text-slate-800";

                        if (isReserved) {
                            cellClass = cell.colorOverride || "bg-amber-500/5 border-amber-500/20 grayscale opacity-30";
                            dotClass = "bg-amber-900/40";
                            textClass = "text-amber-600/50";
                        } else if (hasData) {
                            cellClass = `${theme.bg} ${theme.border} ${theme.ring}`;
                            dotClass = theme.dot;
                            textClass = theme.text;
                        }

                        if (isScanning) {
                            cellClass = "!border-purple-500 bg-purple-500/20 z-10 !opacity-100 animate-pulse";
                            dotClass = "bg-purple-400";
                            if (cell.scale) cellClass += " scale-105";
                        } else if (isActive) {
                            cellClass = "!border-green-500 bg-green-500/20 z-10 !opacity-100 scale-105";
                            dotClass = "bg-green-400 scale-125";
                        } else if (isAltActive) {
                            // Specialized for things like tortoise/hare or custom active states
                            cellClass = cell.colorOverride || "!border-blue-500 bg-blue-500/20 z-10 !opacity-100 scale-110";
                            dotClass = cell.dotColor || "bg-blue-400";
                        }

                        return (
                            <div
                                key={i}
                                className={`relative aspect-square rounded-2xl border flex flex-col items-center justify-center transition-all duration-700 ${cellClass}`}
                            >
                                <span className={`text-[7px] font-mono absolute top-2 font-black ${textClass}`}>
                                    {showHex && memoryAddresses[i] ? memoryAddresses[i] : i}
                                </span>

                                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${dotClass}`}></div>

                                <span className={`text-[6px] font-black absolute bottom-1.5 uppercase tracking-tighter italic ${cell.subLabelClass || 'text-slate-800'}`}>
                                    {cell.subLabel || (isReserved ? "SYS" : "FREE")}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MemoryGrid;
