import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const BookPage = ({ title, subtitle, desc, children, isLast }) => {
    return (
        <section
            className="h-screen w-full snap-center snap-always relative flex items-center justify-center px-4 md:px-6 pt-16 pb-8 overflow-hidden"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ amount: 0.4 }}
                className="max-w-5xl w-full flex flex-col items-center z-10"
            >
                <div className="text-center mb-6 md:mb-10 flex flex-col items-center">
                    {subtitle && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="py-1.5 px-6 bg-blue-500/10 border border-blue-500/30 rounded-full mb-4 relative group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-blue-500/20 w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
                            <span className="relative text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] leading-none z-10">
                                {subtitle}
                            </span>
                        </motion.div>
                    )}
                    
                    {title && (
                        <motion.h2 
                            initial={{ opacity: 0, filter: "blur(10px)" }}
                            whileInView={{ opacity: 1, filter: "blur(0px)" }}
                            transition={{ delay: 0.1, duration: 0.6 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tighter mb-3 font-outfit drop-shadow-lg shadow-black/50 leading-tight pb-2"
                        >
                            {title}
                        </motion.h2>
                    )}
                    
                    {desc && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="text-slate-400 max-w-2xl mx-auto text-xs md:text-base leading-relaxed tracking-wide font-medium"
                        >
                            {desc}
                        </motion.p>
                    )}
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="w-full flex justify-center perspective-1000 z-20 relative"
                >
                    {children}
                </motion.div>
            </motion.div>

            {!isLast && (
                <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-70 animate-bounce pointer-events-none z-10">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-blue-400 mb-1.5 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]">Scroll</span>
                    <ChevronDown size={18} className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                </div>
            )}

            <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
        </section>
    );
};
