import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { MiniDataStructurePreview } from "./MiniDataStructurePreview";

export const ModuleCard = ({ module }) => {
    return (
        <div className="w-full relative group">
            <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-full relative"
            >
                {/* Neon Glow Hover Element underneath card */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500 z-0 pointer-events-none"></div>
                
                <Link
                    to={module.locked ? "#" : module.path}
                    className={`flex flex-col relative overflow-hidden rounded-2xl bg-[#0B1120]/90 backdrop-blur-md border border-white/5 group-hover:border-blue-500/50 transition-all p-5 sm:p-6 h-full z-10 ${module.locked ? 'cursor-not-allowed opacity-50' : 'shadow-[0_5px_15px_rgba(0,0,0,0.5)]'}`}
                >
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[2px_0_10px_rgba(59,130,246,0.6)]"></div>
                    
                    <div className="flex flex-col z-10 h-full justify-between gap-6 pointer-events-none">
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col text-left">
                                <h4 className="text-xl md:text-2xl font-black text-slate-100 group-hover:text-blue-400 transition-colors tracking-tight uppercase group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]">
                                    {module.title}
                                </h4>
                                <div className="h-10 flex items-center mt-2 group-hover:pl-2 transition-all duration-300">
                                    <MiniDataStructurePreview type={module.title} />
                                </div>
                            </div>
                            
                            {!module.locked ? (
                                <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] group-hover:text-white group-hover:rotate-[-45deg] transition-all duration-300">
                                    <ChevronRight size={20} />
                                </div>
                            ) : (
                                <div className="px-2.5 py-1 rounded text-[10px] font-bold text-slate-500 border border-slate-700 uppercase tracking-widest shrink-0 bg-slate-800/50">
                                    Restricted
                                </div>
                            )}
                        </div>
                        
                        {module.desc && (
                            <p className="text-[13px] sm:text-[14px] text-slate-400 leading-relaxed font-medium transition-colors group-hover:text-slate-300 text-left">
                                {module.desc}
                            </p>
                        )}
                        
                        <div className="w-full h-px bg-white/5 mt-2 relative overflow-hidden">
                           <div className="absolute left-0 top-0 bottom-0 w-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-transparent group-hover:w-full transition-all duration-700 ease-out"></div>
                        </div>
                    </div>
                </Link>
            </motion.div>
        </div>
    );
};
