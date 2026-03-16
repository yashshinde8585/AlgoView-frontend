import React, { useState, useMemo } from "react";
import { BST_CODE_TEMPLATES as CODE_TEMPLATES, bstMemoryAddresses as memoryAddresses } from "../constants";
import Header from '../components/layout/Header';
import ComplexityReporter from '../components/layout/ComplexityReporter';
import SystemMetrics from '../components/layout/SystemMetrics';
import ComplexityPulse from '../components/layout/ComplexityPulse';
import MemoryGrid from '../components/layout/MemoryGrid';

const BSTManager = () => {
    const [root, setRoot] = useState({
        id: "root-1",
        data: 50,
        left: { id: "node-2", data: 30, left: null, right: null, physical: 14 },
        right: { id: "node-3", data: 70, left: null, right: null, physical: 18 },
        physical: 10
    });
    const [inputValue, setInputValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLang, setSelectedLang] = useState("JAVA");
    const [activeOperation, setActiveOperation] = useState(null);
    const [activeComplexity, setActiveComplexity] = useState(null);
    const [systemError, setSystemError] = useState(null);
    const [animationSpeed, setAnimationSpeed] = useState(800);
    const [runtimeStats, setRuntimeStats] = useState({ reads: 0, writes: 0, allocs: 0, steps: 0 });
    const [traversalResult, setTraversalResult] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showHex, setShowHex] = useState(true);
    const [isScanningId, setIsScanningId] = useState(null);
    const [isAVLMode, setIsAVLMode] = useState(false);
    const [reserved] = useState([0, 1, 5, 20, 21, 23]);

    const [insight, setInsight] = useState({
        time: "O(log n)",
        space: "O(h)",
        efficiency: "92%"
    });

    const resetStats = () => {
        setRuntimeStats({ reads: 0, writes: 0, allocs: 0, steps: 0 });
    };

    const getFreePhysicalSlot = () => {
        const getAllNodesPhysical = (node, acc = []) => {
            if (!node || typeof node !== 'object') return acc;
            if (node.physical !== undefined) acc.push(node.physical);
            getAllNodesPhysical(node.left, acc);
            getAllNodesPhysical(node.right, acc);
            return acc;
        };
        const usedSlots = [...getAllNodesPhysical(root), ...reserved];
        const possible = Array.from({ length: 24 }).map((_, i) => i).filter(i => !usedSlots.includes(i));
        return possible.length > 0 ? possible[Math.floor(Math.random() * possible.length)] : -1;
    };

    const getHeight = (node) => {
        if (!node) return 0;
        return 1 + Math.max(getHeight(node.left), getHeight(node.right));
    };

    const getBalance = (node) => {
        if (!node) return 0;
        return getHeight(node.left) - getHeight(node.right);
    };

    const rightRotate = async (y) => {
        setSystemError("REBALANCING: Right Rotation Initiated");
        setActiveOperation("ROTATE_RIGHT");
        setIsScanningId(y.id);
        await new Promise(r => setTimeout(r, animationSpeed * 1.5));

        let x = y.left;
        let T2 = x.right;

        x.right = y;
        y.left = T2;

        return x;
    };

    const leftRotate = async (x) => {
        setSystemError("REBALANCING: Left Rotation Initiated");
        setActiveOperation("ROTATE_LEFT");
        setIsScanningId(x.id);
        await waitStep();

        let y = x.right;
        let T2 = y.left;

        y.left = x;
        x.right = T2;

        return y;
    };

    const waitStep = async () => {
        await new Promise(r => setTimeout(r, animationSpeed));
    };

    const handleInsert = async () => {
        const val = parseInt(inputValue);
        if (isNaN(val) || isProcessing) return;
        setIsProcessing(true);
        resetStats();
        setActiveComplexity("O(log n)");
        setActiveOperation("INSERT");
        setInsight({ time: "O(log n)", space: "O(1)", efficiency: "88%" });

        let current = root;
        let steps = 0;

        while (current) {
            steps++;
            setIsScanningId(current.id);
            setRuntimeStats(prev => ({ ...prev, reads: steps, steps }));
            await waitStep();

            if (val < current.data) {
                if (!current.left) break;
                current = current.left;
            } else if (val > current.data) {
                if (!current.right) break;
                current = current.right;
            } else {
                setSystemError("ERR: DUPLICATE_ENTRY_REJECTED");
                setTimeout(() => setSystemError(null), 3000);
                setIsScanningId(null);
                setIsProcessing(false);
                return;
            }
        }

        const newNode = {
            id: `node-${Date.now()}`,
            data: val,
            left: null,
            right: null,
            physical: getFreePhysicalSlot()
        };

        const insertAndBalanceRecursive = async (node, val, newNode) => {
            if (!node) return newNode;

            if (val < node.data) {
                node.left = await insertAndBalanceRecursive(node.left, val, newNode);
            } else if (val > node.data) {
                node.right = await insertAndBalanceRecursive(node.right, val, newNode);
            } else {
                return node;
            }

            if (!isAVLMode) return { ...node };

            const balance = getBalance(node);

            if (balance > 1 && val < node.left.data) {
                return await rightRotate(node);
            }

            if (balance < -1 && val > node.right.data) {
                return await leftRotate(node);
            }

            if (balance > 1 && val > node.left.data) {
                node.left = await leftRotate(node.left);
                return await rightRotate(node);
            }

            if (balance < -1 && val < node.right.data) {
                node.right = await rightRotate(node.right);
                return await leftRotate(node);
            }

            return { ...node };
        };

        const updatedRoot = await insertAndBalanceRecursive(JSON.parse(JSON.stringify(root)), val, newNode);
        setRoot(updatedRoot);
        setRuntimeStats(prev => ({ ...prev, writes: 1, allocs: 1 }));
        setInputValue("");

        setTimeout(() => {
            setIsScanningId(null);
            setIsProcessing(false);
            setSystemError(null);
            setTimeout(() => {
                setActiveComplexity(null);
                setActiveOperation(null);
            }, 3000);
        }, 1000);
    };

    const handleSearch = async () => {
        const val = parseInt(searchQuery);
        if (isNaN(val) || isProcessing || !root) return;
        setIsProcessing(true);
        resetStats();
        setActiveComplexity("O(log n)");
        setActiveOperation("SEARCH");

        let current = root;
        let found = false;
        let steps = 0;

        while (current) {
            steps++;
            setIsScanningId(current.id);
            setRuntimeStats(prev => ({ ...prev, reads: steps, steps }));
            await waitStep();

            if (val === current.data) {
                found = true;
                break;
            }
            current = val < current.data ? current.left : current.right;
        }

        if (!found) {
            setSystemError("NOT_FOUND: Search offset exhausted.");
            setTimeout(() => setSystemError(null), 3000);
        }

        setTimeout(() => {
            setIsScanningId(null);
            setIsProcessing(false);
            setSearchQuery("");
            setTimeout(() => {
                setActiveOperation(null);
                setActiveComplexity(null);
            }, 3000);
        }, 1200);
    };

    const handleDelete = async () => {
        const val = parseInt(inputValue);
        if (isNaN(val) || isProcessing || !root) return;
        setIsProcessing(true);
        resetStats();
        setActiveComplexity("O(log n)");
        setActiveOperation("DELETE");
        setInsight({ time: "O(log n)", space: "O(1)", efficiency: "85%" });

        let current = root;
        let steps = 0;

        while (current) {
            steps++;
            setIsScanningId(current.id);
            setRuntimeStats(prev => ({ ...prev, reads: steps, steps }));
            await waitStep();

            if (val === current.data) break;
            current = val < current.data ? current.left : current.right;
        }

        if (!current) {
            setSystemError("ERR: NODE_NOT_FOUND");
            setTimeout(() => setSystemError(null), 3000);
            setIsScanningId(null);
            setIsProcessing(false);
            return;
        }

        const deleteRecursive = async (node, val) => {
            if (!node) return null;
            if (val < node.data) {
                node.left = await deleteRecursive(node.left, val);
            } else if (val > node.data) {
                node.right = await deleteRecursive(node.right, val);
            } else {
                if (!node.left) return node.right;
                if (!node.right) return node.left;

                setActiveOperation("SEARCH"); 
                setSystemError("TWO_CHILDREN: Locating Successor...");
                let succ = node.right;
                setIsScanningId(succ.id);
                await new Promise(r => setTimeout(r, animationSpeed));

                while (succ.left) {
                    succ = succ.left;
                    setIsScanningId(succ.id);
                    await new Promise(r => setTimeout(r, animationSpeed));
                }

                setSystemError(`CLONE: Successor Value (${succ.data})`);
                await new Promise(r => setTimeout(r, animationSpeed));

                node.data = succ.data;
                setActiveOperation("DELETE");
                node.right = await deleteRecursive(node.right, succ.data);
            }
            return { ...node };
        };

        const newRoot = await deleteRecursive(JSON.parse(JSON.stringify(root)), val);
        setRoot(newRoot);
        setRuntimeStats(prev => ({ ...prev, writes: 1, steps: steps + 2 }));
        setInputValue("");
        setSystemError(null);

        setTimeout(() => {
            setIsScanningId(null);
            setIsProcessing(false);
            setTimeout(() => {
                setActiveComplexity(null);
                setActiveOperation(null);
            }, 3000);
        }, 1000);
    };

    const runTraversal = async (type) => {
        if (isProcessing || !root) return;
        setIsProcessing(true);
        setTraversalResult([]);
        setActiveOperation(type);
        setActiveComplexity("O(n)");
        resetStats();

        const animate = async (nodeId, val) => {
            setIsScanningId(nodeId);
            setTraversalResult(prev => [...prev, val]);
            setRuntimeStats(prev => ({ ...prev, steps: prev.steps + 1, reads: prev.reads + 1 }));
            await new Promise(r => setTimeout(r, animationSpeed));
        };

        const inOrder = async (node) => {
            if (!node) return;
            await inOrder(node.left);
            await animate(node.id, node.data);
            await inOrder(node.right);
        };

        const preOrder = async (node) => {
            if (!node) return;
            await animate(node.id, node.data);
            await preOrder(node.left);
            await preOrder(node.right);
        };

        const postOrder = async (node) => {
            if (!node) return;
            await postOrder(node.left);
            await postOrder(node.right);
            await animate(node.id, node.data);
        };

        const levelOrder = async (node) => {
            if (!node) return;
            const q = [node];
            while (q.length > 0) {
                const curr = q.shift();
                await animate(curr.id, curr.data);
                if (curr.left) q.push(curr.left);
                if (curr.right) q.push(curr.right);
            }
        };

        if (type === "INORDER") await inOrder(root);
        else if (type === "PREORDER") await preOrder(root);
        else if (type === "POSTORDER") await postOrder(root);
        else if (type === "LEVELORDER") await levelOrder(root);

        setTimeout(() => {
            setIsScanningId(null);
            setIsProcessing(false);
            setTimeout(() => {
                setActiveOperation(null);
                setActiveComplexity(null);
            }, 5000);
        }, 1000);
    };

    const flattenedNodes = useMemo(() => {
        const list = [];
        const traverse = (node) => {
            if (!node) return;
            list.push(node);
            traverse(node.left);
            traverse(node.right);
        };
        traverse(root);
        return list;
    }, [root]);

    const renderNode = (node, x, y, level, parentX, parentY) => {
        if (!node || typeof node !== 'object') return null;

        const horizontalSpacing = 200 / Math.pow(2, level + 1);
        const verticalSpacing = 60;

        return (
            <React.Fragment key={node.id}>
                {parentX !== undefined && (
                    <line
                        x1={parentX} y1={parentY}
                        x2={x} y2={y}
                        stroke={isScanningId === node.id ? "#8b5cf6" : "#1e293b"}
                        strokeWidth="2"
                        strokeDasharray={isScanningId === node.id ? "none" : "4 2"}
                        className="transition-all duration-500"
                    />
                )}

                <g
                    transform={`translate(${x},${y})`}
                    className={`transition-all duration-700 ${isScanningId === node.id ? 'scale-110' : ''}`}
                >
                    <circle
                        r="18"
                        className={`transition-all duration-500 stroke-2 
                            ${isScanningId === node.id ? 'fill-purple-600/20 stroke-purple-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'fill-slate-950 stroke-white/10'}`}
                    />
                    <text
                        dy=".3em"
                        textAnchor="middle"
                        className={`text-[9px] font-mono font-black ${isScanningId === node.id ? 'fill-white' : 'fill-slate-500'}`}
                    >
                        {node.data}
                    </text>
                    {isScanningId === node.id && (
                        <circle r="22" className="fill-none stroke-purple-500/20 stroke-1 animate-pulse" />
                    )}
                </g>

                {renderNode(node.left, x - horizontalSpacing, y + verticalSpacing, level + 1, x, y)}
                {renderNode(node.right, x + horizontalSpacing, y + verticalSpacing, level + 1, x, y)}
            </React.Fragment>
        );
    };

    return (
        <div className="h-screen bg-[#020617] text-slate-300 font-sans selection:bg-purple-500/30 overflow-hidden flex flex-col">
            <style>{`
                @keyframes complexity-pop { 
                    0% { transform: scale(0.8) translateY(10px); opacity: 0; } 
                    20% { transform: scale(1.1) translateY(0); opacity: 1; } 
                    100% { transform: scale(1) translateY(0); opacity: 1; } 
                }
                .custom-scroll::-webkit-scrollbar { width: 4px; }
            `}</style>

            <Header 
                abbr="BT"
                moduleName="MOD_05: BINARY_TREES (BST)"
                moduleDesc="(Hierarchical Indexing)"
                themeColor="purple"
                showHex={showHex}
                setShowHex={setShowHex}
                selectedLang={selectedLang}
                setSelectedLang={setSelectedLang}
                animationSpeed={animationSpeed}
                setAnimationSpeed={setAnimationSpeed}
            >
                <div className="h-3 w-px bg-white/10 mx-1"></div>
                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${!isAVLMode ? 'text-blue-400' : 'text-slate-600'}`}>BST_Native</span>
                        <div onClick={() => setIsAVLMode(!isAVLMode)} className="w-6 h-3 bg-slate-900 rounded-full relative flex items-center px-0.5 border border-white/10">
                            <div className={`h-2 w-2 bg-blue-500 rounded-full transition-transform duration-300 ${isAVLMode ? 'translate-x-3' : 'translate-x-0'}`}></div>
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${isAVLMode ? 'text-emerald-400' : 'text-slate-600'}`}>AVLEngine_ON</span>
                    </label>
                </div>
            </Header>

            <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 grid grid-cols-12 gap-6 overflow-hidden">
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-hidden">
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar pb-2">
                        <section className="bg-slate-950/40 border border-white/5 rounded-xl p-3 flex flex-col gap-3">
                            <h2 className="text-[9px] font-black text-purple-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1 h-1 bg-purple-500 rounded-sm"></span> KERNEL_TREE_OPERATIONS
                            </h2>
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">INSERT_OFFSET_VAL</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="num..."
                                            className="flex-1 h-8 bg-[#01040f] border border-white/5 rounded-lg px-3 text-[10px] text-white outline-none focus:border-purple-500/50 transition-all font-mono"
                                        />
                                        <button onClick={handleInsert} disabled={isProcessing} className="px-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-lg text-white text-[9px] font-black transition-all shadow-lg uppercase tracking-widest">INSERT</button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-1.5">
                                        <button onClick={handleDelete} disabled={isProcessing} className="py-2 bg-slate-900 border border-white/5 hover:border-red-500/30 hover:text-red-400 disabled:opacity-50 rounded-md text-slate-500 text-[8px] font-black transition-all uppercase tracking-widest group relative">
                                            DELETE
                                        </button>
                                        <button disabled className="py-2 bg-slate-900 border border-white/5 opacity-50 cursor-not-allowed rounded-md text-slate-600 text-[8px] font-black transition-all uppercase tracking-widest">BALANCE</button>
                                    </div>
                                </div>
                                <div className="h-px bg-white/5"></div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">NODE_RECURSIVE_FIND</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="val..."
                                            className="flex-1 h-8 bg-slate-950 border border-white/5 rounded-lg px-3 text-[10px] text-white outline-none focus:border-purple-500/50 font-mono"
                                        />
                                        <button onClick={handleSearch} disabled={isProcessing} className="px-3 bg-purple-500/10 hover:bg-purple-500/30 border border-purple-500/30 text-purple-400 rounded-lg text-[8px] font-black uppercase transition-all">SEARCH</button>
                                    </div>
                                </div>
                                <div className="h-px bg-white/5"></div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">KERNEL_TRAVERSALS</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => runTraversal('INORDER')} disabled={isProcessing} className="py-1.5 bg-slate-950 border border-white/5 hover:border-purple-500/40 rounded-md text-[8px] font-black text-slate-400 hover:text-purple-400 uppercase tracking-widest transition-all">INORDER</button>
                                        <button onClick={() => runTraversal('PREORDER')} disabled={isProcessing} className="py-1.5 bg-slate-950 border border-white/5 hover:border-purple-500/40 rounded-md text-[8px] font-black text-slate-400 hover:text-purple-400 uppercase tracking-widest transition-all">PREORDER</button>
                                        <button onClick={() => runTraversal('POSTORDER')} disabled={isProcessing} className="py-1.5 bg-slate-950 border border-white/5 hover:border-purple-500/40 rounded-md text-[8px] font-black text-slate-400 hover:text-purple-400 uppercase tracking-widest transition-all">POSTORDER</button>
                                        <button onClick={() => runTraversal('LEVELORDER')} disabled={isProcessing} className="py-1.5 bg-slate-950 border border-white/5 hover:border-purple-500/40 rounded-md text-[8px] font-black text-slate-400 hover:text-purple-400 uppercase tracking-widest transition-all">LEVEL_ORDER</button>
                                    </div>
                                </div>
                                <button onClick={() => setRoot(null)} className="w-full py-1.5 bg-slate-900/50 border border-red-500/10 hover:border-red-500/20 rounded-md text-red-500/40 hover:text-red-400 text-[8px] font-black transition-all uppercase tracking-widest">WIPE_KERNEL_TREE</button>
                            </div>
                        </section>

                        <ComplexityReporter
                            themeColor="purple"
                            stats={[
                                { label: "Heap_Writes", value: runtimeStats.writes },
                                { label: "Kernel_Steps", value: runtimeStats.steps }
                            ]}
                        />

                        <SystemMetrics 
                            themeColor="purple"
                            title="SYSTEM_TREE_METRICS"
                            insight={{ time: "O(log n)", space: "O(n)", efficiency: `${flattenedNodes.length} Nodes` }}
                            timeLabel="Height"
                            efficiencyLabel="Load"
                            activeComplexity={null}
                            systemError={systemError}
                        />
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-9 flex flex-col gap-4 overflow-hidden relative">
                    <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
                        <div className="col-span-8 flex flex-col gap-4 overflow-hidden">
                            <div className="flex-1 bg-[#030816]/60 border border-white/5 rounded-[24px] p-4 flex flex-col gap-3 overflow-hidden relative shadow-2xl">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-purple-500"></span> LOGICAL_STRUCTURE (RECURSIVE_TREE)
                                    </h3>
                                </div>
                                <div className="flex-1 min-h-0 relative overflow-auto custom-scroll p-4">
                                    <svg
                                        width="1000"
                                        height="800"
                                        className="overflow-visible pt-10"
                                        key={root ? 'tree-active' : 'tree-empty'}
                                    >
                                        {root && renderNode(root, 500, 20, 0)}
                                    </svg>
                                    {!root && (
                                        <div className="absolute inset-0 flex items-center justify-center opacity-10 italic text-[10px] tracking-[0.5em] uppercase">TREE_HALTED_NO_ROOT</div>
                                    )}
                                </div>
                            </div>
                            <div className="h-44 bg-slate-950/80 border border-white/5 rounded-[24px] p-4 flex flex-col gap-2 overflow-hidden shadow-xl">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[8px] font-black text-purple-400 uppercase tracking-[0.2em]">KERNEL_LOGIC_TRACE: {activeOperation || 'IDLE_WAIT'}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">{selectedLang}_CORE</span>
                                        <div className={`w-1 h-1 rounded-full ${activeOperation ? 'bg-purple-500 animate-pulse' : 'bg-slate-800'}`}></div>
                                    </div>
                                </div>
                                <div className="flex-1 bg-black/40 rounded-xl p-3 font-mono text-[10px] text-purple-300/70 overflow-y-auto custom-scroll border border-white/5">
                                    {traversalResult.length > 0 && (
                                        <div className="mb-3 flex flex-wrap gap-2 animate-in fade-in slide-in-from-left-2 transition-all">
                                            <span className="text-slate-500 text-[7px] uppercase font-black w-full mb-1">Traversal_Output:</span>
                                            {traversalResult.map((val, idx) => (
                                                <div key={idx} className="flex items-center gap-1.5">
                                                    <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-purple-400 font-black">{val}</span>
                                                    {idx < traversalResult.length - 1 && <span className="text-slate-700">→</span>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <pre className="leading-relaxed whitespace-pre">
                                        {CODE_TEMPLATES[activeOperation || 'IDLE_STRUCTURE'][selectedLang]}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        <MemoryGrid 
                            title="SCATTERED_HEAP"
                            cols={4}
                            themeColor="purple"
                            showHex={showHex}
                            memoryAddresses={memoryAddresses}
                            reserved={reserved}
                            containerClassName="col-span-4"
                            getCellValue={(i) => {
                                const node = flattenedNodes.find(n => n.physical === i);
                                const isScanning = node && isScanningId === node.id;
                                
                                return {
                                    hasData: !!node,
                                    isScanning: isScanning,
                                    subLabel: node ? `V_${node.data}` : null
                                };
                            }}
                        />
                    </div>

                    <ComplexityPulse 
                        themeColor="purple"
                        activeComplexity={activeComplexity}
                        operationName="EXECUTING_LOG_VAL"
                        position="bottom-52 right-8"
                    />
                </div>
            </main>
        </div>
    );
};

export default BSTManager;
