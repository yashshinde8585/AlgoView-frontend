import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const TreeNode = ({ title, subtitle, children, isGlow = false }) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="flex flex-col items-center w-full z-10 transition-all">
            <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => setExpanded(!expanded)}
                className={`relative cursor-pointer flex flex-col items-center justify-center px-6 py-2.5 rounded-2xl border backdrop-blur-md transition-all z-20
                    ${isGlow 
                        ? 'bg-slate-900 border-blue-500/40 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]' 
                        : 'bg-slate-900 border-white/10 text-slate-300 hover:border-blue-500/40 hover:text-white'}
                `}
            >
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-widest">{title}</span>
                    {children && (
                        <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
                            <ChevronDown size={14} className="opacity-70 text-blue-400" />
                        </motion.div>
                    )}
                </div>
                {subtitle && <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5 font-bold">{subtitle}</span>}
            </motion.div>

            <AnimatePresence>
                {expanded && children && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="flex flex-col items-center w-full origin-top relative z-0"
                    >
                        <motion.div 
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            exit={{ scaleY: 0 }}
                            className="w-px h-8 bg-blue-500/50 origin-top"
                        />
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
