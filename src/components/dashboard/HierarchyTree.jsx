import { motion } from "framer-motion";
import { TreeNode } from "./TreeNode";
import { ModuleCard } from "./ModuleCard";

export const HierarchyTree = ({ hierarchy }) => {
    const primitive = hierarchy.children[0];
    const nonPrimitive = hierarchy.children[1];
    
    const linear = nonPrimitive.children[0];
    const nonLinear = nonPrimitive.children[1];

    const staticLinear = linear.children[0];
    const dynamicLinear = linear.children[1];

    // Connectors for custom tree lines
    const LeftRightLine = ({ bg = "bg-blue-500/40" }) => (
        <div className={`absolute top-0 right-1/2 left-0 h-px ${bg}`} />
    );
    const RightLeftLine = ({ bg = "bg-blue-500/40" }) => (
        <div className={`absolute top-0 left-1/2 right-0 h-px ${bg}`} />
    );

    return (
        <div className="w-full max-w-[1100px] mx-auto relative mt-8 select-none">
            {/* Main Branches */}
            <div className="flex w-full pt-10">
                {/* Primitive Side */}
                <div className="flex-[1] flex flex-col items-center relative px-2">
                    <RightLeftLine bg="bg-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                    <TreeNode title={primitive.title} isGlow>
                        <motion.div 
                            className="bg-slate-900/40 border border-blue-500/20 rounded-3xl p-5 w-full max-w-[200px] backdrop-blur-md mt-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20"
                            whileHover={{ borderColor: "rgba(59,130,246,0.5)" }}
                        >
                            <div className="space-y-3">
                                {primitive.primitiveList.map((item, i) => (
                                    <motion.div 
                                        key={item}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center justify-between px-3.5 py-2.5 bg-slate-800/50 rounded-lg border border-white/5 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all group"
                                    >
                                        <span className="text-[10px] font-black text-slate-300 tracking-wider uppercase group-hover:text-blue-100 transition-colors">{item}</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 group-hover:bg-blue-400 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all"></div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </TreeNode>
                </div>

                {/* Non-Primitive Side */}
                <div className="flex-[1] flex flex-col items-center relative px-2">
                    <LeftRightLine bg="bg-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                    <TreeNode title={nonPrimitive.title} isGlow>
                        <div className="flex w-full mt-10 relative px-4">
                            {/* Linear */}
                            <div className="flex-1 flex flex-col items-center relative px-4 min-w-[240px]">
                                <RightLeftLine bg="bg-blue-500/30" />
                                <TreeNode title={linear.title}>
                                    <div className="flex w-full mt-10 relative">
                                        {/* Static */}
                                        <div className="flex-1 flex flex-col items-center relative px-2 min-w-[160px]">
                                            <RightLeftLine bg="bg-blue-500/20" />
                                            <TreeNode title={staticLinear.title}>
                                                <div className="w-full mt-6 space-y-3">
                                                    {staticLinear.modules.map((m, i) => (
                                                        <motion.div key={m.id} initial={{ opacity:0, y:15 }} whileInView={{ opacity:1, y:0 }} transition={{ delay: i*0.1 }}>
                                                            <ModuleCard module={m} />
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </TreeNode>
                                        </div>
                                        {/* Dynamic */}
                                        <div className="flex-1 flex flex-col items-center relative px-2 min-w-[160px]">
                                            <LeftRightLine bg="bg-blue-500/20" />
                                            <TreeNode title={dynamicLinear.title}>
                                                <div className="w-full mt-6 space-y-3">
                                                    {dynamicLinear.modules.map((m, i) => (
                                                        <motion.div key={m.id} initial={{ opacity:0, y:15 }} whileInView={{ opacity:1, y:0 }} transition={{ delay: i*0.1 }}>
                                                            <ModuleCard module={m} />
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </TreeNode>
                                        </div>
                                    </div>
                                </TreeNode>
                            </div>
                            
                            {/* Non-Linear */}
                            <div className="flex-1 flex flex-col items-center relative px-4 min-w-[240px]">
                                <LeftRightLine bg="bg-blue-500/30" />
                                <TreeNode title={nonLinear.title}>
                                    <div className="w-full mt-10 space-y-3 px-2">
                                        {nonLinear.modules.map((m, i) => (
                                            <motion.div key={m.id} initial={{ opacity:0, y:15 }} whileInView={{ opacity:1, y:0 }} transition={{ delay: i*0.1 }}>
                                                <ModuleCard module={m} />
                                            </motion.div>
                                        ))}
                                    </div>
                                </TreeNode>
                            </div>
                        </div>
                    </TreeNode>
                </div>
            </div>
        </div>
    );
};
