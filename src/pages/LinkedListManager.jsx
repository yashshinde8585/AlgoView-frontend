import React, { useState, useEffect, useRef, useMemo } from "react"
import { api } from "../services/api"
import { LINKED_LIST_CODE_TEMPLATES as CODE_TEMPLATES, memoryAddresses } from '../constants';
import Header from '../components/layout/Header';
import ComplexityReporter from '../components/layout/ComplexityReporter';
import SystemMetrics from '../components/layout/SystemMetrics';
import ComplexityPulse from '../components/layout/ComplexityPulse';
import MemoryGrid from '../components/layout/MemoryGrid';

const LinkedListManager = () => {
    // Initial nodes scattered in memory
    const [nodes, setNodes] = useState([
        { id: 104, data: "Block_A", next: 112, prev: null, physical: 4 },
        { id: 112, data: "Block_B", next: 107, prev: 104, physical: 12 },
        { id: 107, data: "Block_C", next: null, prev: 112, physical: 7 }
    ])
    const [head, setHead] = useState(104)
    const [tail, setTail] = useState(107)
    const [listType, setListType] = useState("SINGLY") // SINGLY, DOUBLY, CIRCULAR
    const [inputValue, setInputValue] = useState("")
    const [insertIdx, setInsertIdx] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [accessIdx, setAccessIdx] = useState("")
    const [isScanningId, setIsScanningId] = useState(null)
    const [isAccessingId, setIsAccessingId] = useState(null)
    const [showHex, setShowHex] = useState(false)
    const [animationSpeed, setAnimationSpeed] = useState(800)
    const [systemError, setSystemError] = useState(null)
    const [activeComplexity, setActiveComplexity] = useState(null)
    const [reserved, setReserved] = useState([0, 1, 5, 10, 11, 15, 18, 19, 23])

    // Algorithm Specific States
    const [tortoiseId, setTortoiseId] = useState(null)
    const [hareId, setHareId] = useState(null)
    const [isReversing, setIsReversing] = useState(false)
    const [orphanedNodes, setOrphanedNodes] = useState([])
    const [isGCSweeping, setIsGCSweeping] = useState(false)
    const [runtimeStats, setRuntimeStats] = useState({ reads: 0, writes: 0, allocs: 0, steps: 0 })
    const [selectedLang, setSelectedLang] = useState("JAVA")
    const [activeOperation, setActiveOperation] = useState(null)
    const resetStats = () => {
        setRuntimeStats({ reads: 0, writes: 0, allocs: 0, steps: 0 })
    }


    const logicalScrollRef = useRef(null)

    const [insight, setInsight] = useState({
        time: "O(1)",
        space: "O(n)",
        efficiency: "64%"
    })



    // Smart Scroll: Follow the active node or newly created tail
    useEffect(() => {
        const activeId = isAccessingId || isScanningId || hareId || tortoiseId || (isReversing ? null : tail);
        if (activeId && logicalScrollRef.current) {
            const activeNodeElement = document.getElementById(`logical-node-${activeId}`);
            if (activeNodeElement) {
                activeNodeElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
            }
        }
    }, [isAccessingId, isScanningId, hareId, tortoiseId, tail, isReversing]);

    // Helper to get nodes in logical order
    const getOrderedNodes = () => {
        const ordered = []
        let currentId = head
        const visited = new Set()

        while (currentId !== null && !visited.has(currentId)) {
            const node = nodes.find(n => n.id === currentId)
            if (!node) break
            ordered.push(node)
            visited.add(currentId)
            currentId = node.next
        }
        return ordered
    }

    const handleTypeChange = (type) => {
        setListType(type);
        const ordered = getOrderedNodes();
        if (ordered.length === 0) return;

        let newNodes = [...nodes];
        const tailNode = ordered[ordered.length - 1];

        if (type === "CIRCULAR") {
            newNodes = newNodes.map(n => n.id === tailNode.id ? { ...n, next: head } : n);
        } else {
            newNodes = newNodes.map(n => n.id === tailNode.id ? { ...n, next: null } : n);
        }

        setNodes(newNodes);
    }

    const handlePrepend = async () => {
        if (!inputValue) return
        resetStats()
        setActiveComplexity("O(1)")
        setActiveOperation("PREPEND")
        setInsight({ time: "O(1)", space: "O(1)", efficiency: "85%" })

        // Find a free physical slot
        const usedSlots = [...nodes.map(n => n.physical), ...reserved]
        let freeSlot = -1
        for (let i = 0; i < 24; i++) {
            if (!usedSlots.includes(i)) {
                freeSlot = i
                break
            }
        }

        if (freeSlot === -1) {
            setSystemError("HEAP_FULL: No free memory segments available.")
            setTimeout(() => setSystemError(null), 3000)
            return
        }

        const newNodeId = 100 + Math.floor(Math.random() * 900)
        const newNode = {
            id: newNodeId,
            data: inputValue,
            next: head,
            prev: null,
            physical: freeSlot
        }

        let newNodes = [...nodes];
        if (listType === "DOUBLY" && head) {
            newNodes = newNodes.map(n => n.id === head ? { ...n, prev: newNodeId } : n);
        }

        if (listType === "CIRCULAR") {
            const ordered = getOrderedNodes();
            if (ordered.length > 0) {
                const tailId = ordered[ordered.length - 1].id;
                newNodes = newNodes.map(n => n.id === tailId ? { ...n, next: newNodeId } : n);
            } else {
                newNode.next = newNodeId;
            }
        }

        await new Promise(resolve => setTimeout(resolve, animationSpeed))
        setNodes([newNode, ...newNodes])
        setHead(newNodeId)
        if (!tail) setTail(newNodeId)
        setRuntimeStats({
            reads: head ? 1 : 0,
            writes: 1 + (listType === "DOUBLY" && head ? 1 : 0) + (listType === "CIRCULAR" ? 1 : 0),
            allocs: 1,
            steps: 0
        })
        setInputValue("")
        setTimeout(() => {
            setActiveComplexity(null);
            setActiveOperation(null);
        }, 2000)
    }

    const handleInsert = async () => {
        const idx = parseInt(insertIdx)
        const ordered = getOrderedNodes()
        if (isNaN(idx) || idx < 0 || idx > ordered.length || !inputValue) return

        if (idx === 0) return handlePrepend()
        if (idx === ordered.length) return handleAppend()

        resetStats()
        setActiveComplexity("O(n)")
        setActiveOperation("INSERT")
        setInsight(prev => ({ ...prev, time: "O(n)" }))

        for (let i = 0; i < idx; i++) {
            setIsAccessingId(ordered[i].id)
            setRuntimeStats(prev => ({ ...prev, steps: i + 1, reads: i + 1 }))
            await new Promise(r => setTimeout(r, animationSpeed / 2))
        }

        const freeSlot = getFreePhysicalSlot()
        if (freeSlot === -1) {
            return
        }

        const newNodeId = 100 + Math.floor(Math.random() * 900)
        const prevNode = ordered[idx - 1]
        const nextNode = ordered[idx]

        await new Promise(r => setTimeout(r, animationSpeed))

        const newNode = {
            id: newNodeId,
            data: inputValue,
            next: nextNode.id,
            prev: listType === "DOUBLY" ? prevNode.id : null,
            physical: freeSlot
        }

        let newNodes = [...nodes, newNode]
        newNodes = newNodes.map(n => n.id === prevNode.id ? { ...n, next: newNodeId } : n)
        if (listType === "DOUBLY") {
            newNodes = newNodes.map(n => n.id === nextNode.id ? { ...n, prev: newNodeId } : n)
        }

        setNodes(newNodes)
        setRuntimeStats(prev => ({
            ...prev,
            allocs: 1,
            writes: 2 + (listType === "DOUBLY" ? 1 : 0)
        }))
        setInputValue("")
        setInsertIdx("")
        setIsAccessingId(null)
        setTimeout(() => {
            setActiveComplexity(null);
            setActiveOperation(null);
        }, 2000)
    }

    const handleReverse = async () => {
        if (nodes.length < 2) return
        resetStats()
        setActiveComplexity("O(n)")
        setActiveOperation("REVERSE")
        setIsReversing(true)
        setInsight(prev => ({ ...prev, time: "O(n)" }))

        const ordered = getOrderedNodes()
        let localStack = []

        // Phase 1: Recursion Drilling (Pushing frames)
        for (let i = 0; i < ordered.length; i++) {
            setIsAccessingId(ordered[i].id)
            setRuntimeStats(prev => ({ ...prev, steps: i + 1, reads: i + 1 }))
            const frameName = `reverse(node_${ordered[i].id})`
            localStack.unshift({ name: frameName, id: ordered[i].id })
            await new Promise(r => setTimeout(r, animationSpeed))
        }

        let newNodes = [...nodes]
        const oldHead = head

        // Phase 2: Resolver Phase (Popping frames & flipping pointers)
        let prevId = null
        for (let i = 0; i < ordered.length; i++) {
            const currentFrame = localStack[0]
            setIsAccessingId(currentFrame.id)

            await new Promise(r => setTimeout(r, animationSpeed / 2))

            const node = newNodes.find(n => n.id === currentFrame.id)
            const nextInOrig = i < ordered.length - 1 ? ordered[i + 1].id : null

            // Perform the in-place flip
            newNodes = newNodes.map(n => n.id === currentFrame.id ? { ...n, next: prevId, prev: nextInOrig } : n)
            setRuntimeStats(prev => ({ ...prev, writes: prev.writes + 1 }))

            prevId = currentFrame.id
            localStack.shift()
            await new Promise(r => setTimeout(r, animationSpeed / 2))
        }

        setHead(prevId)
        setTail(oldHead)
        setNodes(newNodes)
        setIsAccessingId(null)
        setIsReversing(false)
        setTimeout(() => {
            setActiveComplexity(null);
            setActiveOperation(null);
        }, 2000)
    }

    const handleDetectCycle = async () => {
        if (listType !== "CIRCULAR") {
            setSystemError("ERR: Cycle detection requires CIRCULAR_LIST architecture.")
            setTimeout(() => setSystemError(null), 3000)
            return
        }

        setActiveComplexity("O(n)")
        setActiveOperation("DETECT_CYCLE") // Assuming you'd add this to CODE_TEMPLATES
        setInsight(prev => ({ ...prev, time: "O(n)" }))

        let slow = head
        let fast = head
        let detected = false

        while (fast !== null) {
            const slowNode = nodes.find(n => n.id === slow)
            const fastNode = nodes.find(n => n.id === fast)
            const fastNext = nodes.find(n => n.id === fastNode?.next)

            setTortoiseId(slow)
            setHareId(fast)

            await new Promise(r => setTimeout(r, animationSpeed / 2))

            slow = slowNode.next
            fast = fastNext ? (nodes.find(n => n.id === fastNext.id)?.next || null) : null

            if (slow === fast && slow !== null) {
                detected = true
                break
            }
        }

        if (detected) {
            setSystemError("CYCLE_DETECTED: Hare caught Tortoise at Tail->Head loop.")
        } else {
            setSystemError("NO_CYCLE: List terminal reached.")
        }

        setTimeout(() => {
            setTortoiseId(null)
            setHareId(null)
            setActiveComplexity(null)
            setSystemError(null)
            setActiveOperation(null)
        }, 3000)
    }

    const handleGarbageCollect = async () => {
        setIsGCSweeping(true)
        setActiveComplexity("O(n)")
        setActiveOperation("GARBAGE_COLLECT") // Assuming you'd add this to CODE_TEMPLATES

        await new Promise(r => setTimeout(r, 1000))
        setOrphanedNodes([])
        setIsGCSweeping(false)
        setActiveComplexity(null)
        setActiveOperation(null)
    }

    const getFreePhysicalSlot = () => {
        const usedSlots = [...nodes.map(n => n.physical), ...reserved, ...orphanedNodes]
        for (let i = 0; i < 24; i++) {
            if (!usedSlots.includes(i)) return i
        }
        setSystemError("HEAP_FULL: Memory allocation failed.")
        setTimeout(() => setSystemError(null), 3000)
        return -1
    }

    const handleAccess = async () => {
        const targetIdx = parseInt(accessIdx)
        const ordered = getOrderedNodes()
        if (isNaN(targetIdx) || targetIdx < 0 || targetIdx >= ordered.length) {
            setSystemError(`IndexError: linked list index ${targetIdx} out of range`)
            setTimeout(() => setSystemError(null), 3000)
            return
        }

        resetStats()
        setActiveComplexity("O(n)")
        setActiveOperation("ACCESS") // Assuming you'd add this to CODE_TEMPLATES
        setInsight({ time: "O(n)", space: "O(1)" })

        for (let i = 0; i <= targetIdx; i++) {
            setIsAccessingId(ordered[i].id)
            setRuntimeStats(prev => ({ ...prev, steps: i + 1, reads: i + 1 }))
            await new Promise(resolve => setTimeout(resolve, animationSpeed))
        }

        setTimeout(() => {
            setIsAccessingId(null)
            setActiveComplexity(null)
            setActiveOperation(null)
        }, 1000)
    }

    const handleAppend = async () => {
        if (!inputValue) return
        setActiveComplexity("O(n)")
        setActiveOperation("APPEND")
        setInsight({ time: "O(n)", space: "O(1)" })

        const ordered = getOrderedNodes()

        // 1. Traverse to the tail
        for (let i = 0; i < ordered.length; i++) {
            setIsAccessingId(ordered[i].id)
            setRuntimeStats(prev => ({ ...prev, steps: i + 1, reads: i + 1 }))
            await new Promise(resolve => setTimeout(resolve, animationSpeed / 2))
        }

        // 2. Find free slot in heap
        const usedSlots = [...nodes.map(n => n.physical), ...reserved]
        let freeSlot = -1
        for (let i = 0; i < 24; i++) {
            if (!usedSlots.includes(i)) {
                freeSlot = i
                break
            }
        }

        if (freeSlot === -1) {
            setSystemError("HEAP_FULL: Memory allocation failed.")
            setTimeout(() => setSystemError(null), 3000)
            setIsAccessingId(null)
            setActiveComplexity(null)
            setActiveOperation(null)
            return
        }

        const newNodeId = 100 + Math.floor(Math.random() * 900)
        const lastNode = ordered.length > 0 ? ordered[ordered.length - 1] : null

        const newNode = {
            id: newNodeId,
            data: inputValue,
            next: listType === "CIRCULAR" ? head : null,
            prev: listType === "DOUBLY" ? lastNode?.id : null,
            physical: freeSlot
        }

        if (!lastNode) {
            setHead(newNodeId)
            setTail(newNodeId)
            if (listType === "CIRCULAR") newNode.next = newNodeId;
            setNodes([newNode])
        } else {
            setNodes(nodes.map(n => n.id === lastNode.id ? { ...n, next: newNodeId } : n).concat(newNode))
            setTail(newNodeId)
        }

        setRuntimeStats(prev => ({
            ...prev,
            allocs: 1,
            writes: 1 + (listType === "DOUBLY" ? 1 : 0) + (listType === "CIRCULAR" ? 1 : 0)
        }))

        await new Promise(resolve => setTimeout(resolve, 500))
        setIsAccessingId(null)
        setInputValue("")
        setTimeout(() => {
            setActiveComplexity(null);
            setActiveOperation(null);
        }, 2000)
    }

    const handleSearch = async () => {
        if (!searchQuery) return;
        resetStats()
        setActiveComplexity("O(n)");
        setActiveOperation("SEARCH")
        setInsight({ time: "O(n)", space: "O(1)" });

        const ordered = getOrderedNodes();
        let found = false;

        for (let i = 0; i < ordered.length; i++) {
            setIsScanningId(ordered[i].id);
            setRuntimeStats(prev => ({ ...prev, steps: i + 1, reads: i + 1 }))
            const isMatch = ordered[i].data.toLowerCase() === searchQuery.toLowerCase();
            await new Promise(resolve => setTimeout(resolve, animationSpeed));

            if (isMatch) {
                found = true;
                break;
            }
        }

        if (!found) {
            setSystemError(`SEARCH_ERROR: '${searchQuery}' not found in logical chain`);
            setTimeout(() => setSystemError(null), 3000);
        }

        setTimeout(() => {
            setIsScanningId(null);
            setActiveComplexity(null);
            setActiveOperation(null);
        }, 2000);
    };

    const handleDelete = async (nodeId) => {
        const ordered = getOrderedNodes()
        const nodeIdx = ordered.findIndex(n => n.id === nodeId)

        resetStats()
        setActiveComplexity("O(n)")
        setActiveOperation("DELETE")
        setInsight({ time: "O(n)", space: "O(1)" })

        // 1. Traverse to find the node and its predecessor
        for (let i = 0; i <= nodeIdx; i++) {
            setIsAccessingId(ordered[i].id)
            setRuntimeStats(prev => ({ ...prev, steps: i + 1, reads: i + 1 }))
            await new Promise(resolve => setTimeout(resolve, animationSpeed))
        }

        // 2. Logic to rewire pointers
        const prevNode = ordered[nodeIdx - 1]
        const targetNode = ordered[nodeIdx]
        const nextNode = ordered[nodeIdx + 1]

        let newNodes = nodes.filter(n => n.id !== nodeId)

        if (nodeId === head) {
            const nextHeadId = targetNode.next === head ? (newNodes.length > 0 ? newNodes[0].id : null) : targetNode.next;
            setHead(nextHeadId)

            if (nextHeadId) {
                if (listType === "DOUBLY") {
                    newNodes = newNodes.map(n => n.id === nextHeadId ? { ...n, prev: null } : n)
                }
                if (listType === "CIRCULAR") {
                    const tail = ordered[ordered.length - 1]
                    newNodes = newNodes.map(n => n.id === tail.id ? { ...n, next: nextHeadId } : n)
                }
            }
        } else {
            if (prevNode) {
                newNodes = newNodes.map(n => n.id === prevNode.id ? { ...n, next: targetNode.next } : n)
            }
            if (listType === "DOUBLY" && nextNode) {
                newNodes = newNodes.map(n => n.id === nextNode.id ? { ...n, prev: targetNode.prev } : n)
            }
            if (listType === "CIRCULAR" && targetNode.next === head) {
                // Deleting real tail
                newNodes = newNodes.map(n => n.id === prevNode.id ? { ...n, next: head } : n)
            }
        }

        setNodes(newNodes)
        setRuntimeStats(prev => ({ ...prev, writes: prev.writes + (listType === "DOUBLY" ? 2 : 1) }))
        await new Promise(resolve => setTimeout(resolve, 500))
        setIsAccessingId(null)
        setTimeout(() => {
            setActiveComplexity(null);
            setActiveOperation(null);
        }, 2000)
    }

    return (
        <div className="h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col">
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .custom-scroll::-webkit-scrollbar { width: 4px; }
                .custom-scroll-thumb { background: rgba(59,130,246,0.1); border-radius: 10px; }
                @keyframes complexity-pop { 0% { transform: scale(0.8) translateY(10px); opacity: 0; } 20% { transform: scale(1.1) translateY(0); opacity: 1; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
                @keyframes flow-line { to { stroke-dashoffset: -20; } }
                .flowing-path { stroke-dasharray: 5, 5; animation: flow-line 1s linear infinite; }
                @keyframes tc-pulse { 0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); } 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }
            `}</style>

            {/* Header */}
            <Header 
                abbr="LL"
                title="DSA_OS_ENGINE"
                moduleName="MOD_02: LINKED_LISTS"
                moduleDesc="(Non-Contiguous Memory)"
                themeColor="green"
                config={{
                    label: "List_Type",
                    value: listType,
                    onChange: handleTypeChange,
                    options: [
                        { value: "SINGLY", label: "SINGLY_LINKED" },
                        { value: "DOUBLY", label: "DOUBLY_LINKED" },
                        { value: "CIRCULAR", label: "CIRCULAR_LINKED" }
                    ]
                }}
                showHex={showHex}
                setShowHex={setShowHex}
                selectedLang={selectedLang}
                setSelectedLang={setSelectedLang}
                animationSpeed={animationSpeed}
                setAnimationSpeed={setAnimationSpeed}
            />

            <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 grid grid-cols-12 gap-6 overflow-hidden">
                {/* Sector 01: Controls */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-y-auto custom-scroll pr-2">
                    <section className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-5">
                        <h2 className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-sm"></span> SYSTEM_OPERATIONS
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">NODE_DATA_INPUT</label>
                                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="new_node_segment..." className="w-full h-10 bg-[#01040f] border border-white/5 rounded-xl px-4 text-xs text-white outline-none focus:border-green-500/50 transition-all font-mono" />
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <button onClick={handlePrepend} className="py-2.5 bg-green-600 hover:bg-green-500 rounded-lg text-white text-[9.5px] font-black transition-all shadow-lg uppercase tracking-widest">PREPEND (O(1))</button>
                                    <button onClick={handleAppend} className="py-2.5 bg-slate-900 border border-white/5 hover:border-green-500/30 rounded-lg text-slate-400 hover:text-green-400 text-[9.5px] font-black transition-all uppercase tracking-widest">APPEND (O(n))</button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">ADVANCED_ALGORITHMS</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={handleReverse} disabled={isReversing} className="h-10 bg-blue-500/10 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-xl text-[9px] font-black uppercase transition-all">REVERSE_LIST</button>
                                    <button onClick={handleGarbageCollect} className="h-10 bg-slate-800 hover:bg-slate-700 border border-white/5 text-slate-400 rounded-xl text-[9px] font-black uppercase transition-all">GARBAGE_COLLECT</button>
                                    {listType === "CIRCULAR" && (
                                        <button onClick={handleDetectCycle} className="h-10 bg-orange-500/10 hover:bg-orange-500/30 border border-orange-500/30 text-orange-400 rounded-xl text-[9px] font-black uppercase transition-all col-span-2">DETECT_CYCLE</button>
                                    )}
                                    <div className="flex gap-2 col-span-2">
                                        <div className="relative flex-1">
                                            <input type="number" placeholder="Target_Index" value={insertIdx} onChange={(e) => setInsertIdx(e.target.value)} className="w-full h-10 bg-slate-950 border border-white/5 rounded-xl px-4 text-[10px] text-white outline-none focus:border-green-500/50 transition-all font-mono" />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-700 uppercase">POS</span>
                                        </div>
                                        <button onClick={handleInsert} className="px-6 h-10 bg-green-500/10 hover:bg-green-500/30 border border-green-500/30 text-green-400 rounded-xl text-[9px] font-black uppercase transition-all">INSERT_AT</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sector 1.25: Complexity Reporter */}
                    <ComplexityReporter
                        themeColor="green"
                        stats={[
                            { label: "Pointer Reads", value: runtimeStats.reads },
                            { label: "Pointer Writes", value: runtimeStats.writes },
                            { label: "Memory Allocs", value: runtimeStats.allocs },
                            { label: "Traversal Steps", value: runtimeStats.steps }
                        ]}
                    />

                    {/* System Metrics */}
                    <SystemMetrics 
                        themeColor="green"
                        insight={insight}
                        activeComplexity={activeComplexity}
                        systemError={systemError}
                    />

                </div>

                {/* Sector 02: Visualizer */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden relative">
                    <ComplexityPulse 
                        themeColor="green"
                        activeComplexity={activeComplexity}
                        operationName="EXECUTING_ALGORITHM"
                    />
                    <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
                        {/* Logical View */}
                        <div className="bg-[#030816]/60 border border-white/5 rounded-[40px] p-6 flex flex-col gap-5 overflow-hidden relative">
                            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-green-500"></span> LOGICAL_VIEW (POINTER_CHAIN)
                            </h3>
                            <div ref={logicalScrollRef} className="flex-1 overflow-y-auto custom-scroll pr-1 flex flex-col items-center pt-8 pb-32 transition-all">
                                {/* HEAD Pointer */}
                                <div className="flex flex-col items-center mb-6">
                                    <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full mb-2">
                                        <span className="text-[8px] font-black text-green-500 uppercase tracking-widest leading-none">HEAD_PTR</span>
                                    </div>
                                    <svg width="20" height="40" viewBox="0 0 20 40" fill="none">
                                        <path d="M10 0V40" stroke="currentColor" className="text-green-500/20" strokeWidth="1" strokeDasharray="4 4" />
                                        <path d="M10 40 L6 34 M10 40 L14 34" stroke="currentColor" className="text-green-500" strokeWidth="2" />
                                    </svg>
                                </div>
                                {getOrderedNodes().map((node, index) => (
                                    <React.Fragment key={node.id}>
                                        <div id={`logical-node-${node.id}`} className={`p-4 bg-[#050b1d] border rounded-2xl w-full max-w-[280px] transition-all duration-500 relative group 
                                            ${isAccessingId === node.id ? 'border-green-500 bg-green-500/10' :
                                                isScanningId === node.id ? 'border-purple-500 bg-purple-500/10' :
                                                    tortoiseId === node.id ? 'border-orange-500 bg-orange-500/10 scale-105 z-10' :
                                                        hareId === node.id ? 'border-blue-500 bg-blue-500/10 scale-110 z-20' :
                                                            'border-white/5'}`}>

                                            {/* Head/Tail Indicators */}
                                            <div className="absolute -top-2 left-2 flex gap-1">
                                                {head === node.id && <span className="px-1.5 py-0.5 bg-green-600 text-[6px] font-black text-white rounded skew-x-[-10deg]">HEAD</span>}
                                                {tail === node.id && <span className="px-1.5 py-0.5 bg-blue-600 text-[6px] font-black text-white rounded skew-x-[-10deg]">TAIL</span>}
                                            </div>

                                            {/* Algo Indicators */}
                                            <div className="absolute -right-2 -top-2 flex flex-col gap-1">
                                                {tortoiseId === node.id && <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center text-[10px] shadow-lg shadow-orange-500/40">🐢</div>}
                                                {hareId === node.id && <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] shadow-lg shadow-blue-500/40">🐇</div>}
                                            </div>
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[7px] font-black text-slate-600 uppercase tracking-tighter">Node::{index}</span>
                                                    <span className="text-[7px] font-mono text-green-500/50">{showHex ? memoryAddresses[node.physical] : `ptr::${node.id}`}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(node.id)}
                                                    className="w-5 h-5 rounded-md border border-red-500/20 bg-red-500/5 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                                                    <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">ELEMENT_DATA</span>
                                                    <span className="text-sm font-black text-slate-200">{node.data}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {listType === "DOUBLY" && (
                                                        <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex flex-col gap-0.5 min-h-[36px] justify-center">
                                                            <span className="text-[6px] font-black text-slate-600 uppercase">PREV_PTR</span>
                                                            <span className="text-[9px] font-mono text-orange-400 font-bold tracking-tighter">{node.prev ? `*${node.prev}` : "NULL"}</span>
                                                        </div>
                                                    )}
                                                    <div className={`bg-black/40 p-2 rounded-lg border border-white/5 flex flex-col gap-0.5 min-h-[36px] justify-center ${listType !== "DOUBLY" ? "col-span-2" : ""}`}>
                                                        <span className="text-[6px] font-black text-slate-600 uppercase">NEXT_PTR</span>
                                                        <span className="text-[9px] font-mono text-blue-400 font-bold tracking-tighter">{node.next ? (node.next === head ? "HEAD_PTR" : `*${node.next}`) : "NULL_PTR"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {node.next && (
                                            <div className="py-4 relative flex flex-col items-center">
                                                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="overflow-visible">
                                                    {/* Next Path */}
                                                    <path
                                                        d={node.next === head ? "M30 0 C 80 20, 80 40, 30 60" : "M30 0 V60"}
                                                        stroke="currentColor"
                                                        className={`transition-all duration-700 ${isAccessingId === node.id || isScanningId === node.id || hareId === node.id ? "text-green-400 stroke-[3px] flowing-path" : "text-green-900/20 stroke-[1.5px]"}`}
                                                    />
                                                    <path
                                                        d={node.next === head ? "M35 52 L30 60 L22 55" : "M30 60 L24 50 M30 60 L36 50"}
                                                        stroke="currentColor"
                                                        className={`transition-all duration-700 ${isAccessingId === node.id || isScanningId === node.id || hareId === node.id ? "text-green-400 stroke-[3px]" : "text-green-900/30"}`}
                                                    />

                                                    {/* Prev Path (Doubly Only) */}
                                                    {listType === "DOUBLY" && !isReversing && (
                                                        <>
                                                            <path
                                                                d="M15 60 V0"
                                                                stroke="currentColor"
                                                                className={`transition-all duration-700 opacity-40 ${isAccessingId === node.id ? "text-orange-400 stroke-[2px]" : "text-orange-900/10 stroke-[1px]"}`}
                                                            />
                                                            <path
                                                                d="M15 0 L9 10 M15 0 L21 10"
                                                                stroke="currentColor"
                                                                className={`transition-all duration-700 opacity-40 ${isAccessingId === node.id ? "text-orange-400 stroke-[2px]" : "text-orange-900/20"}`}
                                                            />
                                                        </>
                                                    )}
                                                </svg>
                                                <div className="absolute top-1/2 -right-16 translate-y-[-50%] bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10 whitespace-nowrap">
                                                    <span className="text-[6px] font-mono text-blue-400 font-bold tracking-tighter">
                                                        {node.next === head ? "loopback::HEAD" : `next::${node.next}`}
                                                    </span>
                                                </div>
                                                {listType === "DOUBLY" && !isReversing && (
                                                    <div className="absolute top-1/2 -left-16 translate-y-[-50%] bg-orange-500/5 px-2 py-0.5 rounded border border-orange-500/10 whitespace-nowrap">
                                                        <span className="text-[6px] font-mono text-orange-400 font-bold tracking-tighter">prev::*</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {!node.next && listType !== "CIRCULAR" && (
                                            <div className="flex flex-col items-center mt-4">
                                                <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
                                                    <path d="M10 0 V30" stroke="currentColor" className="text-slate-800" strokeWidth="1" strokeDasharray="3 3" />
                                                </svg>
                                                <div className="px-3 py-1 bg-slate-900 border border-white/5 rounded-full shadow-2xl">
                                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">NULL_TERMINAL</span>
                                                </div>
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Physical View & Logic Trace Column */}
                        <div className="flex flex-col gap-4 min-h-0">
                            {/* Physical View */}
                            <MemoryGrid 
                                title="PHYSICAL_HEAP (SCATTERED)"
                                themeColor="green"
                                showHex={showHex}
                                memoryAddresses={memoryAddresses}
                                reserved={reserved}
                                legend={[
                                    { color: "bg-green-500", label: "Node" },
                                    { color: "bg-red-500", label: "Orphan" },
                                    { color: "bg-slate-950", label: "Free" }
                                ]}
                                containerClassName="flex-1"
                                getCellValue={(i) => {
                                    const nodeFound = nodes.find(n => n.physical === i);
                                    const isOrphaned = orphanedNodes.includes(i);
                                    const isScanning = nodeFound && isScanningId === nodeFound.id;
                                    const isAccessing = nodeFound && isAccessingId === nodeFound.id;
                                    const isTortoise = nodeFound && tortoiseId === nodeFound.id;
                                    const isHare = nodeFound && hareId === nodeFound.id;
                                    
                                    const isHidden = isGCSweeping && isOrphaned;

                                    if (isHidden) return { scale: 0 };

                                    return {
                                        hasData: !!nodeFound,
                                        isScanning: isScanning,
                                        isActive: isAccessing,
                                        isAltActive: isTortoise || isHare || isOrphaned,
                                        colorOverride: isOrphaned ? 'bg-red-500/10 border-red-500/20 animate-pulse' : null,
                                        dotColor: isTortoise ? 'bg-orange-500' : isHare ? 'bg-blue-400' : isOrphaned ? 'bg-red-500' : null,
                                        subLabel: nodeFound ? `ID:${nodeFound.id}` : isOrphaned ? "Orphan" : null,
                                        subLabelClass: isOrphaned ? "text-red-500/40" : "text-slate-600"
                                    };
                                }}
                            />

                            {/* Logic Trace Panel (Repositioned) */}
                            <div className="bg-[#030816]/60 border border-white/5 rounded-[40px] p-6 flex flex-col gap-4 relative overflow-hidden group min-h-[280px]">
                                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                    <h3 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-sm italic"></span> {activeOperation ? `TRACE: ${activeOperation}` : `LOGIC_TRACE_${selectedLang}`}
                                    </h3>
                                    <div className="flex gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-red-500/20 group-hover:bg-red-500 transition-colors"></span>
                                        <span className="w-2 h-2 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500 transition-colors"></span>
                                        <span className="w-2 h-2 rounded-full bg-green-500/20 group-hover:bg-green-500 transition-colors"></span>
                                    </div>
                                </div>

                                <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5 flex-1 font-mono relative overflow-hidden flex flex-col">
                                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-white/[0.02] border-r border-white/5 flex flex-col items-center py-4 gap-1 text-[8px] text-slate-700 font-black">
                                        <span>01</span><span>02</span><span>03</span><span>04</span><span>05</span><span>06</span><span>07</span><span>08</span><span>09</span><span>10</span>
                                    </div>
                                    <div className="pl-8 text-[11px] leading-relaxed select-all font-mono text-blue-50/90 relative z-10 overflow-y-auto custom-scroll">
                                        {(((activeOperation && CODE_TEMPLATES[activeOperation])
                                            ? CODE_TEMPLATES[activeOperation][selectedLang]
                                            : (CODE_TEMPLATES.IDLE_STRUCTURE ? CODE_TEMPLATES.IDLE_STRUCTURE[selectedLang] : 'class Node {}')) || '').split('\n').map((line, i) => (
                                                <div key={i} className="group/line min-h-[1.2rem] flex items-center hover:bg-white/[0.05] transition-colors rounded px-2 -ml-2">
                                                    {(line || '').split(/(\s+)/).map((part, pi) => {
                                                        const isWhitespace = /^\s+$/.test(part);
                                                        if (isWhitespace) return <span key={pi}>{part}</span>;

                                                        const cleanWord = (part || '').replace(/[.*;()]/g, '');
                                                        const isKeyword = ['Node', 'new', 'if', 'while', 'return', 'null', 'None', 'nullptr', 'range', 'in', 'for', 'int', 'true', 'True', 'false', 'False', 'bool', 'boolean', 'class', 'struct', 'def', 'import', 'void'].includes(cleanWord);
                                                        const isType = ['void', 'int', 'Node', 'data', 'next', 'prev'].includes(cleanWord);
                                                        return (
                                                            <span
                                                                key={pi}
                                                                className={isKeyword ? 'text-blue-400 font-bold' : (isType ? 'text-purple-400' : 'text-slate-300')}
                                                            >
                                                                {part}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                <div className="text-[7.5px] font-black text-slate-700 uppercase tracking-widest flex justify-between items-center opacity-60">
                                    <span>Status: {activeOperation ? 'ANALYZING_ALGORITHM' : 'WAITING_FOR_DAEMON'}</span>
                                    <span className="text-blue-500/40">DS_OS_TRACE_v1.4</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Application Footer / Status Bar */}
            <footer className="h-6 shrink-0 bg-slate-950 border-t border-white/5 flex items-center px-6 justify-between z-50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.2em]">System_Core: ONLINE</span>
                    </div>
                    <div className="h-2 w-px bg-white/10"></div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[7px] font-black text-slate-600 uppercase">Memory_Architecture:</span>
                        <span className="text-[7px] font-mono text-blue-400 font-bold">{listType}_64bit</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">DSA_LAB_OS // v1.4.2_STABLE</span>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-white/5"></div>
                        <div className="w-2 h-2 rounded-full bg-white/5"></div>
                        <div className="w-2 h-2 rounded-full bg-white/5"></div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LinkedListManager;
