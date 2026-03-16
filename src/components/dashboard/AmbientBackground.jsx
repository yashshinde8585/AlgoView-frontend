import { motion } from "framer-motion";

export const AmbientBackground = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Base gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_70%)]"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.10] mix-blend-overlay"></div>
            
            {/* Network Particles */}
            <div className="absolute inset-0 opacity-40">
                {[...Array(25)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_5px_rgba(59,130,246,1)]"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, Math.random() * -150 - 50],
                            x: [0, (Math.random() - 0.5) * 50],
                            opacity: [0, 0.8, 0],
                            scale: [0, 1.5, 0],
                        }}
                        transition={{
                            duration: Math.random() * 5 + 6,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </div>
            
            {/* Grid Lines Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_80%,transparent_100%)]"></div>
        </div>
    );
};
