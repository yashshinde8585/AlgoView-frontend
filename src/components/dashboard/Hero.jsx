import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export const Hero = ({ title }) => {
    return (
        <div className="mb-12 text-center flex flex-col items-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="inline-block"
            >
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="py-1.5 px-5 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6 mx-auto w-fit shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                >
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] leading-none">System Architecture</span>
                </motion.div>
                
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 font-outfit drop-shadow-lg">
                    {title}
                </h2>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-blue-500 flex flex-col items-center"
            >
                <div className="h-16 w-0.5 bg-gradient-to-b from-blue-500/0 via-blue-500/80 to-blue-500/100"></div>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                    <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] border-t-blue-500 border-l-transparent border-r-transparent drop-shadow-[0_4px_8px_rgba(59,130,246,0.5)]"></div>
                </motion.div>
            </motion.div>
        </div>
    );
};
