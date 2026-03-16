import { motion } from "framer-motion";

export const ScrollProgress = ({ activePage = 0, totalPages = 5 }) => {
    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[150] hidden md:flex flex-col items-center gap-3">
            {[...Array(totalPages)].map((_, i) => (
                <div key={i} className="relative flex items-center justify-center p-2">
                    <motion.div 
                        className={`w-1.5 rounded-full transition-all duration-300 ${activePage === i ? 'h-8 bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.9)]' : 'h-2 bg-slate-700 hover:bg-slate-600'}`}
                    />
                    {activePage === i && (
                        <motion.div 
                            layoutId="active-indicator"
                            className="absolute right-6 text-[9px] font-black text-blue-400 tracking-[0.2em] uppercase whitespace-nowrap drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            Page 0{i + 1}
                        </motion.div>
                    )}
                </div>
            ))}
        </div>
    );
};
