import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { RECURSION_CODE_TEMPLATES as CODE_TEMPLATES } from '../constants';
import Header from '../components/layout/Header';
import ComplexityPulse from '../components/layout/ComplexityPulse';
import LogicTrace from '../components/layout/LogicTrace';
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Box, GitBranch, Terminal, HelpCircle, Layers, ArrowDown } from "lucide-react";

/**
 * RecursionManager VISUALIZES Recursive thinking & Backtracking logic.
 */
const RecursionManager = () => {
    const location = useLocation();
    const [type, setType] = useState("RECURSION");
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeOperation, setActiveOperation] = useState(null);
    const [activeComplexity, setActiveComplexity] = useState(null);
    const [selectedLang, setSelectedLang] = useState("JAVA");
    const [animationSpeed, setAnimationSpeed] = useState(800);
    const [showHex, setShowHex] = useState(false);

    // Recursion States (Factorial)
    const [callStack, setCallStack] = useState([]);
    const [returnValue, setReturnValue] = useState(null);

    // Backtracking States (Decision Tree)
    const [treeNodes, setTreeNodes] = useState([{ id: 'root', label: 'Start', state: 'active' }]);
    const [pathCount, setPathCount] = useState(0);

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const resetStates = useCallback(() => {
        setCallStack([]);
        setReturnValue(null);
        setTreeNodes([{ id: 'root', label: 'Start', state: 'active' }]);
        setPathCount(0);
        setActiveOperation(null);
        setActiveComplexity(null);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const t = params.get("type");
        if (t) setType(t.toUpperCase());
        resetStates();
    }, [location.search, resetStates]);

    // --- ALGORITHMS ---

    const runRecursion = async (n) => {
        setIsProcessing(true);
        setActiveOperation("RECURSION");
        setActiveComplexity("O(n)");
        setCallStack([]);
        
        async function factorial(num) {
            const currentCall = { id: Date.now() + Math.random(), val: num, status: 'calling' };
            setCallStack(prev => [currentCall, ...prev]);
            await wait(2200 - animationSpeed);

            if (num <= 1) {
                setCallStack(prev => prev.map(c => c.id === currentCall.id ? { ...c, status: 'returning', ret: 1 } : c));
                await wait(1500 - animationSpeed);
                return 1;
            }

            const res = num * await factorial(num - 1);
            setCallStack(prev => prev.map(c => c.id === currentCall.id ? { ...c, status: 'returning', ret: res } : c));
            await wait(1500 - animationSpeed);
            return res;
        }

        const total = await factorial(n);
        setReturnValue(total);
        setIsProcessing(false);
    };

    const runBacktracking = async () => {
        setIsProcessing(true);
        setActiveOperation("BACKTRACKING");
        setActiveComplexity("O(2^n)");
        setTreeNodes([{ id: 'root', label: 'Start', state: 'active' }]);
        
        async function explore(nodeId, depth, label) {
            if (depth > 2) {
                setTreeNodes(prev => prev.map(n => n.id === nodeId ? { ...n, state: 'dead' } : n));
                await wait(1000 - animationSpeed);
                return;
            }

            // Expand
            const leftId = nodeId + 'L';
            const rightId = nodeId + 'R';
            
            setTreeNodes(prev => [...prev, 
                { id: leftId, parentId: nodeId, label: 'Choose A', state: 'active' },
                { id: rightId, parentId: nodeId, label: 'Choose B', state: 'active' }
            ]);
            await wait(2000 - animationSpeed);

            // Explore Left
            await explore(leftId, depth + 1, 'A');
            
            // Backtrack from Left
            setTreeNodes(prev => prev.map(n => n.id === leftId ? { ...n, state: 'backtracked' } : n));
            await wait(800 - animationSpeed);

            // Explore Right
            if (depth === 1) { // Success condition simulation
                 setTreeNodes(prev => prev.map(n => n.id === rightId ? { ...n, state: 'success' } : n));
                 setPathCount(c => c + 1);
                 await wait(1500 - animationSpeed);
            } else {
                 await explore(rightId, depth + 1, 'B');
                 setTreeNodes(prev => prev.map(n => n.id === rightId ? { ...n, state: 'backtracked' } : n));
                 await wait(800 - animationSpeed);
            }
        }

        await explore('root', 0, 'Start');
        setIsProcessing(false);
    };

    const handleRun = () => {
        resetStates();
        if (type === "RECURSION") runRecursion(5);
        else runBacktracking();
    };

    const getNarrative = () => {
        if (type === "RECURSION") return "Recursion is 'Delayed Gratification'. A function says: 'I can't solve this yet, so I'll ask a smaller version of myself and wait for the result'.";
        return "Backtracking is 'Trial and Error'. We explore a path, and if it leads to a dead end, we 'Undo' our last move and try a different branch.";
    };

    const getCommentary = () => {
        if (!isProcessing) return "Standby. Ready to initiate recursive dive.";
        if (type === "RECURSION") {
            const active = callStack.find(c => c.status === 'calling');
            if (active) return `Function call: fact(${active.val}). Waiting for sub-result...`;
            return `Stack is collapsing. Passing return values back up the chain.`;
        }
        return `Exploring decision space. Searching for valid configurations and pruning dead ends.`;
    };

    return (
        <div className="h-screen bg-[#020617] text-slate-300 font-sans flex flex-col overflow-hidden">
            <Header 
                abbr="REC"
                moduleName={`MOD_11: ${type}`}
                moduleDesc="(Recursive Computation)"
                themeColor="blue"
                config={{
                    label: "Logic",
                    value: type,
                    onChange: setType,
                    options: [
                        { value: "RECURSION", label: "Recursion (Call Stack)" },
                        { value: "BACKTRACKING", label: "Backtracking (Decision Tree)" },
                        { value: "BITWISE", label: "Bit Manipulation (Binary)" }
                    ]
                }}
                showHex={showHex}
                setShowHex={setShowHex}
                selectedLang={selectedLang}
                setSelectedLang={setSelectedLang}
                animationSpeed={animationSpeed}
                setAnimationSpeed={setAnimationSpeed}
            >
                <button 
                  onClick={handleRun}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-1 rounded text-[10px] font-black uppercase text-white shadow-lg active:scale-95 disabled:opacity-50"
                >
                    Run Trace
                </button>
            </Header>

            <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 grid grid-cols-12 gap-6 overflow-hidden">
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
                    <section className="bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 rounded-2xl p-4 shadow-xl shrink-0">
                        <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span> Story Logic
                        </h2>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-medium italic">
                            "{getNarrative()}"
                        </p>
                    </section>

                    <section className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 shadow-xl shrink-0">
                         <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                            <Terminal size={14} className="text-blue-500" />
                            <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">LOGIC_FLOW</h2>
                         </div>

                         <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 min-h-[60px] flex items-center">
                             <p className="text-[11px] text-blue-300 font-mono leading-relaxed italic">
                                 {getCommentary()}
                             </p>
                         </div>
                         
                         <button 
                            onClick={resetStates}
                            disabled={isProcessing}
                            className="w-full py-3 bg-slate-900 border border-white/5 hover:border-blue-500/30 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all"
                         >
                            <RotateCcw size={14} /> Clear Space
                         </button>
                    </section>
                    
                    <LogicTrace 
                        themeColor="blue"
                        activeOperation={activeOperation}
                        codeTemplates={type === "BITWISE" ? require('../constants').BITWISE_CODE_TEMPLATES : CODE_TEMPLATES}
                        selectedLang={selectedLang}
                    />
                </div>

                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden relative">
                    <div className="bg-[#030816]/60 border border-white/5 rounded-[40px] p-8 lg:p-12 flex flex-col gap-8 overflow-hidden relative flex-1 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-sm animate-pulse"></span> VISUAL_EXECUTOR
                            </h3>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center gap-4 relative overflow-y-auto custom-scroll">
                            {type === "BITWISE" ? (
                                <div className="flex flex-col items-center gap-8">
                                    <div className="grid grid-cols-8 gap-2">
                                        {[128, 64, 32, 16, 8, 4, 2, 1].map((bit, idx) => (
                                            <div key={idx} className="flex flex-col items-center gap-2">
                                                <div className={`w-10 h-14 rounded-lg border-2 flex items-center justify-center font-mono font-black text-xl transition-all duration-300
                                                ${(100 & bit) ? 'bg-blue-500/20 border-blue-400 text-blue-400 shadow-lg' : 'bg-slate-900 border-white/5 text-slate-600'}
                                                `}>
                                                    {(100 & bit) ? '1' : '0'}
                                                </div>
                                                <span className="text-[8px] font-black text-slate-500">{bit}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center">
                                         <p className="text-slate-400 text-[10px] font-medium">Binary representation of <span className="text-white font-black">100</span></p>
                                         <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                                             <code className="text-blue-400 text-[11px]">x & (x - 1) == 0</code>
                                             <p className="text-[9px] text-slate-500 mt-1 uppercase font-black">Power of 2 Check</p>
                                         </div>
                                    </div>
                                </div>
                            ) : type === "RECURSION" ? (
                                // ... existing recursion view
                                <div className="flex flex-col gap-2 w-full max-w-xs transition-all">
                                    <AnimatePresence>
                                        {callStack.map((call, idx) => (
                                            <motion.div 
                                                key={call.id}
                                                initial={{ y: -20, opacity: 0, scale: 0.9 }}
                                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                className={`p-4 rounded-xl border-2 flex justify-between items-center relative
                                                ${call.status === 'calling' ? 'bg-blue-500/10 border-blue-500 shadow-lg z-10' : 'bg-emerald-500/5 border-emerald-500/30 opacity-60'}
                                                `}
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black uppercase text-slate-500">Call_Frame</span>
                                                    <span className="font-mono font-black text-white">fact({call.val})</span>
                                                </div>
                                                
                                                {call.status === 'returning' && (
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[8px] font-black uppercase text-emerald-500">Returned</span>
                                                        <span className="font-mono font-black text-emerald-400 underline decoration-2">{call.ret}</span>
                                                    </div>
                                                )}

                                                {idx === 0 && call.status === 'calling' && (
                                                    <motion.div 
                                                      animate={{ y: [0, 5, 0] }}
                                                      transition={{ repeat: Infinity, duration: 1.5 }}
                                                      className="absolute -bottom-4 left-1/2 -translate-x-1/2"
                                                    >
                                                        <ArrowDown size={14} className="text-blue-500" />
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="relative w-full h-full flex flex-col items-center justify-center">
                                    {/* ... existing backtracking view */}
                                    <div className="flex flex-col gap-12 items-center">
                                        <div className="grid grid-cols-4 gap-x-8 gap-y-16 items-start">
                                            {treeNodes.map((node) => (
                                                <motion.div 
                                                  key={node.id}
                                                  initial={{ scale: 0 }}
                                                  animate={{ scale: 1 }}
                                                  className={`flex flex-col items-center gap-2 group
                                                  ${node.id.length === 4 ? 'col-span-1' : node.id.length === 5 ? 'col-span-1' : 'col-span-4'}
                                                  `}
                                                >
                                                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500
                                                    ${node.state === 'active' ? 'bg-blue-500/20 border-blue-400 animate-pulse shadow-lg ring-4 ring-blue-500/10' : 
                                                      node.state === 'dead' ? 'bg-red-500/20 border-red-500 opacity-60 transition-all' : 
                                                      node.state === 'backtracked' ? 'bg-slate-900 border-white/5 opacity-20' : 
                                                      'bg-emerald-500 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]'}
                                                    `}>
                                                        {node.state === 'success' ? <CheckCircle2 size={24} className="text-white" /> : <GitBranch size={20} className="text-white/40" />}
                                                    </div>
                                                    <span className={`text-[8px] font-black uppercase tracking-widest ${node.state === 'active' ? 'text-blue-400' : 'text-slate-500'}`}>
                                                        {node.label}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                                             <span className="text-[8px] font-black text-emerald-500 uppercase block">Valid_Paths</span>
                                             <span className="text-xl font-mono font-black text-white">{pathCount}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center justify-center gap-8 pt-8 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active_Frame</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Resolved/Success</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Pruned_Branch</span>
                            </div>
                        </div>
                    </div>

                    <ComplexityPulse 
                        themeColor="blue"
                        activeComplexity={activeComplexity}
                        operationName={activeOperation || "IDLE_CORE"}
                        position="bottom-8 right-8"
                    />
                </div>
            </main>
        </div>
    );
};

const CheckCircle2 = ({ size, className }) => (
    <svg 
     xmlns="http://www.w3.org/2000/svg" 
     width={size} 
     height={size} 
     viewBox="0 0 24 24" 
     fill="none" 
     stroke="currentColor" 
     strokeWidth="3" 
     strokeLinecap="round" 
     strokeLinejoin="round" 
     className={className}
    >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="m9 12 2 2 4-4"/>
    </svg>
);

export default RecursionManager;
