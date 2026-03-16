import React, { useState, useEffect, useRef } from "react";
import { GRAPH_CODE_TEMPLATES as CODE_TEMPLATES } from '../constants';
import Header from '../components/layout/Header';
import ComplexityPulse from '../components/layout/ComplexityPulse';
import LogicTrace from '../components/layout/LogicTrace';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Link, Play, Trash2, Eye, Layout } from "lucide-react";

const GraphManager = () => {
    const [nodes, setNodes] = useState([
        { id: 0, x: 100, y: 100, label: 'A' },
        { id: 1, x: 300, y: 100, label: 'B' },
        { id: 2, x: 200, y: 250, label: 'C' }
    ]);
    const [edges, setEdges] = useState([
        { from: 0, to: 1 },
        { from: 1, to: 2 }
    ]);

    const [selectedLang, setSelectedLang] = useState("JAVA");
    const [activeOperation, setActiveOperation] = useState(null);
    const [activeComplexity, setActiveComplexity] = useState(null);
    const [animationSpeed, setAnimationSpeed] = useState(800);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showHex, setShowHex] = useState(true);
    const [learningMode, setLearningMode] = useState("BEGINNER");
    const [activeTab, setActiveTab] = useState("BUILD"); // BUILD, TRAVERSE, VIEW
    
    const [highlightedNodes, setHighlightedNodes] = useState([]);
    const [highlightedEdges, setHighlightedEdges] = useState([]);
    const [edgeStartNode, setEdgeStartNode] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    
    const containerRef = useRef(null);

    const addNode = () => {
        if (isProcessing) return;
        const id = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 0;
        const label = String.fromCharCode(65 + id);
        const newNode = {
            id,
            x: Math.random() * 400 + 50,
            y: Math.random() * 300 + 50,
            label
        };
        setNodes([...nodes, newNode]);
        executeOp("ADD_VERTEX", null);
    };

    const handleNodeClick = (nodeId) => {
        if (activeTab !== "BUILD" || isProcessing) return;
        
        if (edgeStartNode === null) {
            setEdgeStartNode(nodeId);
        } else if (edgeStartNode === nodeId) {
            setEdgeStartNode(null);
        } else {
            // Check if edge already exists
            const exists = edges.some(e => 
                (e.from === edgeStartNode && e.to === nodeId) || 
                (e.from === nodeId && e.to === edgeStartNode)
            );
            
            if (!exists) {
                setEdges([...edges, { from: edgeStartNode, to: nodeId }]);
                executeOp("ADD_EDGE", null);
            }
            setEdgeStartNode(null);
        }
    };

    const executeOp = async (opName, callback) => {
        setIsProcessing(true);
        setActiveOperation(opName);
        setActiveComplexity(opName === "BFS" || opName === "DFS" ? "O(V + E)" : "O(1)");
        
        if (callback) await callback();
        
        setTimeout(() => {
            setActiveOperation(null);
            setActiveComplexity(null);
            setIsProcessing(false);
        }, 2000);
    };

    const runBFS = async () => {
        if (nodes.length === 0 || isProcessing) return;
        
        executeOp("BFS", async () => {
            const startNode = nodes[0].id;
            const queue = [startNode];
            const visited = new Set([startNode]);
            const path = [];
            
            while (queue.length > 0) {
                const current = queue.shift();
                path.push(current);
                setHighlightedNodes([...path]);
                
                await new Promise(r => setTimeout(r, animationSpeed));
                
                const neighbors = edges
                    .filter(e => e.from === current || e.to === current)
                    .map(e => e.from === current ? e.to : e.from);
                
                for (const neighbor of neighbors) {
                    if (!visited.has(neighbor)) {
                        visited.add(neighbor);
                        queue.push(neighbor);
                    }
                }
            }
            
            setTimeout(() => setHighlightedNodes([]), 2000);
        });
    };

    const runDFS = async () => {
        if (nodes.length === 0 || isProcessing) return;
        
        executeOp("DFS", async () => {
            const startNode = nodes[0].id;
            const stack = [startNode];
            const visited = new Set();
            const path = [];
            
            while (stack.length > 0) {
                const current = stack.pop();
                if (!visited.has(current)) {
                    visited.add(current);
                    path.push(current);
                    setHighlightedNodes([...path]);
                    
                    await new Promise(r => setTimeout(r, animationSpeed));
                    
                    const neighbors = edges
                        .filter(e => e.from === current || e.to === current)
                        .map(e => e.from === current ? e.to : e.from);
                    
                    for (const neighbor of neighbors) {
                        if (!visited.has(neighbor)) {
                            stack.push(neighbor);
                        }
                    }
                }
            }
            
            setTimeout(() => setHighlightedNodes([]), 2000);
        });
    };

    const clearGraph = () => {
        setNodes([]);
        setEdges([]);
        setHighlightedNodes([]);
        setEdgeStartNode(null);
    };

    return (
        <div className="h-screen bg-[#020617] text-slate-300 font-sans selection:bg-indigo-500/30 flex flex-col overflow-hidden">
            <Header 
                abbr="GRPH"
                moduleName="MOD_06: NON-LINEAR GRAPHS"
                moduleDesc="(Adjacency List/Matrix Representation)"
                themeColor="purple"
                showHex={showHex}
                setShowHex={setShowHex}
                selectedLang={selectedLang}
                setSelectedLang={setSelectedLang}
                animationSpeed={animationSpeed}
                setAnimationSpeed={setAnimationSpeed}
            />

            <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 grid grid-cols-12 gap-6 overflow-hidden">
                {/* Sector 01: Toolbox */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pb-2 custom-scroll">
                        <section className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-sm"></span> GRAPH_ENGINE_V1
                                </h2>
                                <div className="flex bg-slate-950 border border-white/10 rounded-lg p-1">
                                    <button 
                                        onClick={() => setLearningMode("BEGINNER")}
                                        className={`px-3 py-1 text-[9px] font-black rounded-md transition-all uppercase tracking-widest ${learningMode === "BEGINNER" ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        Beginner
                                    </button>
                                    <button 
                                        onClick={() => setLearningMode("ADVANCED")}
                                        className={`px-3 py-1 text-[9px] font-black rounded-md transition-all uppercase tracking-widest ${learningMode === "ADVANCED" ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        Advanced
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-1 bg-slate-900/50 p-1 rounded-lg border border-white/5">
                                    <button onClick={() => setActiveTab("BUILD")} className={`flex-1 py-1.5 text-[8.5px] font-black rounded uppercase tracking-widest transition-all inline-flex items-center justify-center gap-2 ${activeTab === "BUILD" ? "bg-slate-800 text-indigo-400" : "text-slate-500 hover:text-slate-300"}`}><Plus size={12}/> Builder</button>
                                    <button onClick={() => setActiveTab("TRAVERSE")} className={`flex-1 py-1.5 text-[8.5px] font-black rounded uppercase tracking-widest transition-all inline-flex items-center justify-center gap-2 ${activeTab === "TRAVERSE" ? "bg-slate-800 text-emerald-400" : "text-slate-500 hover:text-slate-300"}`}><Play size={12}/> Traversal</button>
                                    <button onClick={() => setActiveTab("VIEW")} className={`flex-1 py-1.5 text-[8.5px] font-black rounded uppercase tracking-widest transition-all inline-flex items-center justify-center gap-2 ${activeTab === "VIEW" ? "bg-slate-800 text-amber-400" : "text-slate-500 hover:text-slate-300"}`}><Layout size={12}/> Analysis</button>
                                </div>

                                <div className="min-h-[200px] flex flex-col gap-4">
                                    {activeTab === "BUILD" && (
                                        <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-right-2 duration-300">
                                            <button 
                                                onClick={addNode}
                                                disabled={isProcessing}
                                                className="w-full py-3 bg-indigo-600/10 border border-indigo-500/30 hover:bg-indigo-600/20 rounded-xl flex items-center justify-center gap-3 text-indigo-400 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                                            >
                                                <Plus size={16}/> Add New Vertex
                                            </button>
                                            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 flex flex-col gap-2">
                                                <h4 className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-2">
                                                    <Link size={12}/> Connection Guide
                                                </h4>
                                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                                    {edgeStartNode === null 
                                                        ? "Click a node to start a new connection (edge)." 
                                                        : `Selected Node ${nodes.find(n => n.id === edgeStartNode)?.label}. Click another node to connect.`}
                                                </p>
                                                {edgeStartNode !== null && (
                                                    <button onClick={() => setEdgeStartNode(null)} className="text-[9px] text-red-400 font-bold uppercase mt-1 hover:underline">Cancel Connection</button>
                                                )}
                                            </div>
                                            <button 
                                                onClick={clearGraph}
                                                className="w-full py-2 bg-slate-900 border border-red-500/20 hover:border-red-500/40 rounded-lg flex items-center justify-center gap-2 text-red-400/60 text-[9px] font-bold uppercase transition-all"
                                            >
                                                <Trash2 size={12}/> Wipe Environment
                                            </button>
                                        </div>
                                    )}

                                    {activeTab === "TRAVERSE" && (
                                        <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-right-2 duration-300">
                                            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex flex-col gap-1 mb-2">
                                                <span className="text-[10px] font-black text-emerald-400 uppercase">Search Algorithms</span>
                                                <p className="text-[11px] text-emerald-100/40">Traversals will start from the first created vertex (Node A).</p>
                                            </div>
                                            <button 
                                                onClick={runBFS}
                                                disabled={isProcessing || nodes.length === 0}
                                                className="w-full py-3 bg-emerald-600/10 border border-emerald-500/30 hover:bg-emerald-600/20 disabled:opacity-50 rounded-xl flex items-center justify-center gap-3 text-emerald-400 text-[10px] font-black uppercase tracking-widest transition-all"
                                            >
                                                Run Breadth-First (BFS)
                                            </button>
                                            <button 
                                                onClick={runDFS}
                                                disabled={isProcessing || nodes.length === 0}
                                                className="w-full py-3 bg-teal-600/10 border border-teal-500/30 hover:bg-teal-600/20 disabled:opacity-50 rounded-xl flex items-center justify-center gap-3 text-teal-400 text-[10px] font-black uppercase tracking-widest transition-all"
                                            >
                                                Run Depth-First (DFS)
                                            </button>
                                        </div>
                                    )}

                                    {activeTab === "VIEW" && (
                                        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-right-2 duration-300 overflow-y-auto no-scrollbar max-h-[400px]">
                                            <div className="bg-slate-900 border border-white/5 rounded-xl p-4">
                                                <h4 className="text-[9px] font-black text-amber-500 uppercase mb-4 tracking-widest border-b border-white/5 pb-2">Adjacency List</h4>
                                                <div className="flex flex-col gap-2">
                                                    {nodes.length > 0 ? nodes.map(n => {
                                                        const neighbors = edges
                                                            .filter(e => e.from === n.id || e.to === n.id)
                                                            .map(e => nodes.find(node => node.id === (e.from === n.id ? e.to : e.from))?.label);
                                                        return (
                                                            <div key={n.id} className="flex items-center gap-3 text-[11px] font-mono">
                                                                <span className="text-white font-bold w-4">{n.label}</span>
                                                                <span className="text-slate-600">→</span>
                                                                <div className="flex gap-1 flex-wrap">
                                                                    {neighbors.length > 0 ? neighbors.map((neighbor, idx) => (
                                                                        <span key={idx} className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">[{neighbor}]</span>
                                                                    )) : <span className="text-slate-700 italic text-[9px]">Isolation</span>}
                                                                </div>
                                                            </div>
                                                        );
                                                    }) : <p className="text-[10px] text-slate-600 italic">Empty set...</p>}
                                                </div>
                                            </div>

                                            <div className="bg-slate-900 border border-white/5 rounded-xl p-4 overflow-x-auto custom-scroll">
                                                <h4 className="text-[9px] font-black text-amber-500 uppercase mb-4 tracking-widest border-b border-white/5 pb-2">Adjacency Matrix</h4>
                                                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${nodes.length + 1}, minmax(20px, 1fr))` }}>
                                                    <div className="w-5 h-5"></div>
                                                    {nodes.map(n => <div key={n.id} className="w-5 h-5 flex items-center justify-center text-[9px] font-bold text-slate-500">{n.label}</div>)}
                                                    {nodes.map(n1 => (
                                                        <React.Fragment key={n1.id}>
                                                            <div className="w-5 h-5 flex items-center justify-center text-[9px] font-bold text-slate-500">{n1.label}</div>
                                                            {nodes.map(n2 => {
                                                                const connected = edges.some(e => (e.from === n1.id && e.to === n2.id) || (e.from === n2.id && e.to === n1.id));
                                                                return (
                                                                    <div key={n2.id} className={`w-5 h-5 flex items-center justify-center text-[10px] font-mono rounded-sm border transition-all ${connected ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400 font-black' : 'bg-slate-950/40 border-white/5 text-slate-700 opacity-30'}`}>
                                                                        {connected ? '1' : '0'}
                                                                    </div>
                                                                );
                                                            })}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-slate-900 border border-white/5 rounded-xl p-4">
                                                <h4 className="text-[9px] font-black text-amber-500 uppercase mb-4 tracking-widest border-b border-white/5 pb-2">Physical Specs</h4>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-[10px]">
                                                        <span className="text-slate-500 uppercase tracking-tighter">Memory Allocation</span>
                                                        <span className="text-white font-mono">{nodes.length * 4 + edges.length * 8} bytes</span>
                                                    </div>
                                                    <div className="flex justify-between text-[10px]">
                                                        <span className="text-slate-500 uppercase tracking-tighter">Pointer Complexity</span>
                                                        <span className="text-indigo-400 font-mono italic">O(V + E)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Sector 02: Visual Canvas */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden relative">
                    <div className="bg-[#030816]/60 border border-white/5 rounded-[40px] flex flex-col overflow-hidden relative flex-1 shadow-2xl">
                        {/* Static Background Grid */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                        
                        <div className="flex items-center justify-between p-6 pb-0 relative z-10">
                             <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                 <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse"></span> GEOMETRIC_RELATIONS (UNWEIGHTED)
                             </h3>
                             <div className="flex gap-2">
                                <span className="px-2 py-0.5 rounded bg-slate-950 border border-white/10 text-[8px] font-bold text-slate-500 uppercase tracking-widest">Type: UNDIRECTED</span>
                                <span className="px-2 py-0.5 rounded bg-slate-950 border border-white/10 text-[8px] font-bold text-slate-500 uppercase tracking-widest">Nodes: {nodes.length}</span>
                             </div>
                        </div>

                        {/* Graph Canvas */}
                        <div 
                            className="flex-1 relative overflow-hidden cursor-crosshair" 
                            ref={containerRef}
                            onMouseMove={(e) => {
                                if (edgeStartNode !== null) {
                                    // Trigger re-render to update dynamic edge line
                                    setNodes([...nodes]);
                                }
                            }}
                        >
                            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                                <AnimatePresence>
                                    {edges.map((edge) => {
                                        const fromNode = nodes.find(n => n.id === edge.from);
                                        const toNode = nodes.find(n => n.id === edge.to);
                                        if (!fromNode || !toNode) return null;
                                        
                                        const isHighlighted = highlightedNodes.includes(edge.from) && highlightedNodes.includes(edge.to);
                                        
                                        return (
                                            <motion.line
                                                key={`${edge.from}-${edge.to}`}
                                                initial={{ pathLength: 0, opacity: 0 }}
                                                animate={{ pathLength: 1, opacity: 1 }}
                                                x1={fromNode.x}
                                                y1={fromNode.y}
                                                x2={toNode.x}
                                                y2={toNode.y}
                                                stroke={isHighlighted ? "#10b981" : "rgba(255,255,255,0.1)"}
                                                strokeWidth={2}
                                                transition={{ duration: 0.5 }}
                                            />
                                        );
                                    })}
                                </AnimatePresence>
                            </svg>

                            {nodes.map((node) => {
                                const isHighlighted = highlightedNodes.includes(node.id);
                                const isSelected = edgeStartNode === node.id;
                                
                                return (
                                    <motion.div
                                        key={node.id}
                                        drag
                                        dragMomentum={false}
                                        onDragStart={() => setIsDragging(true)}
                                        onDrag={() => {
                                            // Re-render handled by local state update
                                        }}
                                        onDragEnd={(e, info) => {
                                            setTimeout(() => setIsDragging(false), 50);
                                            const containerRect = containerRef.current.getBoundingClientRect();
                                            const newX = node.x + info.delta.x;
                                            const newY = node.y + info.delta.y;
                                            
                                            // Containment logic
                                            const boundedX = Math.max(20, Math.min(containerRect.width - 20, newX));
                                            const boundedY = Math.max(20, Math.min(containerRect.height - 20, newY));

                                            const newNodes = nodes.map(n => 
                                                n.id === node.id 
                                                ? { ...n, x: boundedX, y: boundedY } 
                                                : n
                                            );
                                            setNodes(newNodes);
                                        }}
                                        style={{ left: node.x, top: node.y, x: "-50%", y: "-50%" }}
                                        className="absolute cursor-grab active:cursor-grabbing z-20"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isDragging) handleNodeClick(node.id);
                                        }}
                                    >
                                        <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 relative group ${
                                            isHighlighted 
                                            ? "bg-emerald-500/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" 
                                            : isSelected
                                            ? "bg-indigo-500/30 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-110"
                                            : "bg-slate-950 border-white/10 hover:border-white/40 shadow-2xl"
                                        }`}>
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 rounded-full transition-opacity"></div>
                                            <span className={`font-black text-sm tracking-tighter ${isHighlighted ? "text-white" : isSelected ? "text-indigo-200" : "text-slate-400 group-hover:text-white"}`}>
                                                {node.label}
                                            </span>
                                            
                                            {/* Logic Rings */}
                                            {isHighlighted && (
                                                <>
                                                    <div className="absolute inset-[-4px] border border-emerald-500/50 rounded-full animate-ping opacity-30"></div>
                                                    <div className="absolute inset-[-8px] border border-emerald-500/20 rounded-full animate-pulse opacity-10"></div>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    <ComplexityPulse 
                        themeColor="purple"
                        activeComplexity={activeComplexity}
                        operationName={activeOperation || "STANDBY"}
                    />

                    {learningMode === "ADVANCED" && (
                        <LogicTrace 
                            themeColor="purple"
                            activeOperation={activeOperation}
                            codeTemplates={CODE_TEMPLATES}
                            selectedLang={selectedLang}
                            infoText="ADJ_LIST_MUTATION"
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default GraphManager;
