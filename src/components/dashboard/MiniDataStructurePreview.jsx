import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const MiniDataStructurePreview = ({ type }) => {
    const t = type.toLowerCase();
    
    if (t.includes("array")) {
        return (
            <div className="flex items-center gap-1 group-hover:gap-1.5 transition-all duration-300">
                {[1, 2, 3, 4].map((i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ y: -2, backgroundColor: "rgba(59,130,246,0.4)" }}
                        className="w-4 h-4 md:w-5 md:h-5 bg-slate-800/80 border border-blue-500/30 rounded flex items-center justify-center text-[8px] text-blue-300 font-bold shadow-[0_0_5px_rgba(59,130,246,0)] group-hover:shadow-[0_0_8px_rgba(59,130,246,0.3)] transition-all"
                    >
                        {i}
                    </motion.div>
                ))}
            </div>
        );
    }
    
    if (t.includes("list")) {
        return (
            <div className="flex items-center group-hover:gap-0.5 transition-all duration-300">
                {[1, 2, 3].map((i, idx) => (
                    <div key={i} className="flex items-center">
                        <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-slate-800/80 border border-blue-400/50 flex items-center justify-center group-hover:shadow-[0_0_8px_rgba(59,130,246,0.4)] transition-all">
                            <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform"></div>
                        </div>
                        {idx < 2 && (
                            <div className="w-2.5 h-px bg-blue-500/50 mx-0.5 group-hover:bg-blue-400 transition-colors"></div>
                        )}
                    </div>
                ))}
            </div>
        );
    }
    
    if (t.includes("stack")) {
        return (
            <div className="flex flex-col-reverse justify-end items-center gap-[2px] group-hover:gap-1 transition-all duration-300 mt-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 md:w-10 h-1.5 md:h-2 bg-slate-800/80 border border-blue-500/40 rounded-sm group-hover:border-blue-400 group-hover:shadow-[0_0_6px_rgba(59,130,246,0.3)] transition-all"></div>
                ))}
            </div>
        );
    }
    
    if (t.includes("queue")) {
        return (
            <div className="flex items-center gap-[2px] group-hover:gap-1 transition-all duration-300">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="w-1.5 md:w-2 h-6 md:h-8 bg-slate-800/80 border border-blue-500/40 rounded-sm group-hover:border-blue-400 group-hover:shadow-[0_0_6px_rgba(59,130,246,0.3)] transition-all"></div>
                ))}
            </div>
        );
    }
    
    if (t.includes("tree")) {
        return (
            <div className="flex flex-col items-center group-hover:scale-110 transition-all duration-300 relative mt-3">
                <div className="w-3 h-3 rounded-full bg-slate-800/80 border border-blue-400 z-10 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                <div className="flex gap-4 -mt-1">
                    <div className="w-px h-3 bg-blue-500/60 -rotate-45 translate-x-1 group-hover:bg-blue-400"></div>
                    <div className="w-px h-3 bg-blue-500/60 rotate-45 -translate-x-1 group-hover:bg-blue-400"></div>
                </div>
                <div className="flex gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800/80 border border-blue-400/60 z-10 group-hover:border-blue-400 mt-0.5"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800/80 border border-blue-400/60 z-10 group-hover:border-blue-400 mt-0.5"></div>
                </div>
            </div>
        );
    }
    
    if (t.includes("graph")) {
        return (
            <div className="relative w-8 h-8 group-hover:rotate-12 transition-all duration-300 mt-1">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-400 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.8)] z-10"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 rounded-full bg-blue-400/70 group-hover:bg-blue-400 z-10"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-blue-400/70 group-hover:bg-blue-400 z-10"></div>
                <svg className="absolute inset-0 w-full h-full opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 100 100">
                    <line x1="50" y1="10" x2="10" y2="90" stroke="#3b82f6" strokeWidth="6" />
                    <line x1="50" y1="10" x2="90" y2="90" stroke="#3b82f6" strokeWidth="6" />
                    <line x1="10" y1="90" x2="90" y2="90" stroke="#3b82f6" strokeWidth="6" />
                </svg>
            </div>
        );
    }

    if (t.includes("sort")) {
        return (
            <div className="flex items-end gap-1 h-6 mt-1 overflow-hidden">
                {[15, 25, 10, 20].map((h, i) => (
                    <motion.div 
                        key={i}
                        animate={{ height: [`${h}%`, `${h+10}%`, `${h}%`] }}
                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                        className="w-2 bg-blue-500/30 border-t border-blue-400/50 rounded-t-sm"
                    ></motion.div>
                ))}
            </div>
        );
    }

    if (t.includes("search")) {
        return (
            <div className="flex items-center gap-1 mt-1">
                <div className="flex gap-[2px]">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`w-3 h-4 bg-blue-500/20 border border-blue-400/30 rounded-sm ${i === 3 ? 'bg-blue-500/60 border-blue-400 animate-pulse' : ''}`}></div>
                    ))}
                </div>
                <div className="w-4 h-4 rounded-full border border-blue-400/50 flex items-center justify-center -ml-2 -mt-2 bg-slate-900 shadow-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                </div>
            </div>
        );
    }

    if (t.includes("pointers")) {
        return (
            <div className="flex gap-4 items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></div>
                <div className="w-12 h-0.5 bg-white/10 relative">
                    <div className="absolute right-0 w-2 h-2 rounded-full bg-indigo-400 animate-ping"></div>
                </div>
            </div>
        );
    }

    if (t.includes("window")) {
        return (
            <div className="relative w-16 h-4 bg-white/5 rounded border border-white/10 flex items-center overflow-hidden">
                <motion.div 
                    animate={{ x: [0, 40, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="w-1/3 h-full bg-blue-500/30 border-x border-blue-400/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                ></motion.div>
            </div>
        );
    }

    if (t.includes("prefix")) {
        return (
            <div className="flex items-end gap-[1px]">
                {[2, 4, 6, 8].map(h => (
                    <div key={h} style={{ height: `${h * 2}px` }} className="w-3 bg-blue-400/40 rounded-t-sm"></div>
                ))}
            </div>
        );
    }

    if (t.includes("hashing")) {
        return (
            <div className="flex flex-col gap-[2px]">
                <div className="flex gap-[2px]">
                    <div className="w-2 h-2 bg-blue-500/40 rounded-sm"></div>
                    <div className="w-6 h-2 bg-white/5 border border-white/5 rounded-sm"></div>
                </div>
                <div className="flex gap-[2px]">
                    <div className="w-2 h-2 bg-indigo-500/40 rounded-sm"></div>
                    <div className="w-6 h-2 bg-white/5 border border-white/5 rounded-sm"></div>
                </div>
            </div>
        );
    }

    if (t.includes("recursion")) {
        return (
            <div className="flex items-center justify-center">
                <motion.div 
                    animate={{ scale: [1, 0.5, 1], rotate: [0, 180, 360] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="w-6 h-6 border-2 border-blue-400/50 rounded-lg flex items-center justify-center"
                >
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </motion.div>
            </div>
        );
    }

    if (t.includes("backtracking")) {
        return (
            <div className="flex gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <ArrowRight size={10} className="text-white/20" />
                <motion.div 
                    animate={{ x: [0, 5, 0], opacity: [1, 0.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-2 h-2 rounded-full bg-red-400"
                ></motion.div>
                <ArrowRight size={10} className="text-white/20 rotate-180" />
                <div className="w-2 h-2 rounded-full bg-blue-400/40"></div>
            </div>
        );
    }

    if (t.includes("bitwise")) {
        return (
            <div className="flex gap-1 items-center">
                <div className="w-4 h-4 rounded-sm border border-blue-400 flex items-center justify-center text-[6px] font-black group-hover:bg-blue-400 transition-all">1</div>
                <div className="w-4 h-4 rounded-sm border border-blue-400/40 flex items-center justify-center text-[6px] font-black">0</div>
                <div className="w-4 h-4 rounded-sm border border-blue-400 flex items-center justify-center text-[6px] font-black group-hover:bg-blue-400 transition-all">1</div>
            </div>
        );
    }

    return <div className="h-4"></div>;
};
