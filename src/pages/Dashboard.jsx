import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hierarchy } from "../constants";
import { Navbar } from "../components/dashboard/Navbar";
import { ModuleCard } from "../components/dashboard/ModuleCard";
import { BookPage } from "../components/dashboard/BookPage";
import { AmbientBackground } from "../components/dashboard/AmbientBackground";
import { ScrollProgress } from "../components/dashboard/ScrollProgress";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Database, Box, ToggleLeft, Type, Hash, CheckCircle2, RotateCcw, Activity, GitBranch, Network, Zap, Search, Brain, HelpCircle, ExternalLink, BookOpen, X } from "lucide-react";
import { patternRules, practiceProblems, quizQuestions } from "../data/patternsData";

const primitiveIcons = {
    "Integer": <Hash size={32} className="text-blue-400 group-hover:text-blue-300 transition-colors" />,
    "Float": <Box size={32} className="text-blue-400 group-hover:text-blue-300 transition-colors" />,
    "Character": <Type size={32} className="text-blue-400 group-hover:text-blue-300 transition-colors" />,
    "Boolean": <ToggleLeft size={32} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
};

const masteryDomains = {
    "Arrays": {
        icon: <Activity size={18} />,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        patterns: [
            { name: "Two Pointers", path: "/pattern-module?type=twopointers", complexity: "O(N)", space: "O(1)" },
            { name: "Sliding Window", path: "/pattern-module?type=slidingwindow", complexity: "O(N)", space: "O(1)" },
            { name: "Prefix Sum", path: "/pattern-module?type=prefixsum", complexity: "O(1)", space: "O(N)" },
            { name: "Cyclic Sort", path: "/search-pattern-module?type=cyclic", complexity: "O(N)", space: "O(1)" },
            { name: "Hashing", path: "/pattern-module?type=hashing", complexity: "O(1)", space: "O(N)" }
        ]
    },
    "Strings": {
        icon: <Type size={18} />,
        color: "text-indigo-400",
        bg: "bg-indigo-500/10",
        border: "border-indigo-500/30",
        patterns: [
            { name: "Two Pointers", path: "/pattern-module?type=twopointers", complexity: "O(N)", space: "O(1)" },
            { name: "Sliding Window", path: "/pattern-module?type=slidingwindow", complexity: "O(N)", space: "O(1)" },
            { name: "Hashing", path: "/pattern-module?type=hashing", complexity: "O(N)", space: "O(N)" }
        ]
    },
    "Trees": {
        icon: <GitBranch size={18} />,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        patterns: [
            { name: "Recursion", path: "/recursion-module?type=recursion", complexity: "O(N)", space: "O(H)" },
            { name: "Backtracking", path: "/recursion-module?type=backtracking", complexity: "O(2^N)", space: "O(N)" }
        ]
    },
    "Graphs": {
        icon: <Network size={18} />,
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        patterns: [
            { name: "Recursion (DFS)", path: "/recursion-module?type=recursion", complexity: "O(V+E)", space: "O(V)" },
            { name: "Hashing", path: "/pattern-module?type=hashing", complexity: "O(V+E)", space: "O(V)" },
            { name: "Backtracking", path: "/recursion-module?type=backtracking", complexity: "O(2^V)", space: "O(V)" }
        ]
    },
    "Optimization": {
        icon: <Zap size={18} />,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        patterns: [
            { name: "Binary Search on Answer", path: "/search-pattern-module?type=bsonanswer", complexity: "O(log N)", space: "O(1)" },
            { name: "Bit Manipulation", path: "/recursion-module?type=bitwise", complexity: "O(1)", space: "O(1)" },
            { name: "Backtracking", path: "/recursion-module?type=backtracking", complexity: "O(K^N)", space: "O(N)" }
        ]
    },
    "Combinatorics": {
        icon: <Box size={18} />,
        color: "text-fuchsia-400",
        bg: "bg-fuchsia-500/10",
        border: "border-fuchsia-500/30",
        patterns: [
            { name: "Recursion", path: "/recursion-module?type=recursion", complexity: "O(N!)", space: "O(N)" },
            { name: "Backtracking", path: "/recursion-module?type=backtracking", complexity: "O(N!)", space: "O(N)" }
        ]
    }
};


function Dashboard() {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()
    const [activePage, setActivePage] = useState(0);
    const [selectedDomain, setSelectedDomain] = useState("Arrays");
    const [activePracticePattern, setActivePracticePattern] = useState(null);

    const handleScroll = (e) => {
        const scrollPosition = e.target.scrollTop;
        const pageHeight = window.innerHeight;
        const pageIndex = Math.round(scrollPosition / pageHeight);
        setActivePage(pageIndex);
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"))
        if (!storedUser) {
            navigate("/login")
        } else {
            setUser(storedUser)
        }
    }, [navigate])

    if (!user) return null

    const complexity = hierarchy.children[0];
    const primitive = hierarchy.children[1];
    const nonPrimitive = hierarchy.children[2];

    const linear = nonPrimitive.children[0];
    const nonLinear = nonPrimitive.children[1];

    const staticLinear = linear.children[0];
    const dynamicLinear = linear.children[1];

    return (
        <div 
            onScroll={handleScroll}
            className="h-screen w-screen bg-[#020617] text-slate-100 overflow-y-scroll overflow-x-hidden snap-y snap-mandatory scroll-smooth smooth-scroll no-scrollbar relative selection:bg-blue-500/30"
        >
            <AmbientBackground />
            <ScrollProgress activePage={activePage} totalPages={9} />

            {/* Fixed Navbar Layer */}
            <div className="fixed top-0 left-0 right-0 z-[100] px-4 backdrop-blur-xl bg-[#020617]/50 border-b border-blue-500/10">
                <Navbar user={user} />
            </div>

            {/* Page 0: Cover */}
            <BookPage
                desc="A visual and interactive handbook for learning Data Structures and Algorithms. Scroll down to explore the theoretical concepts and interact with the dynamic memory visualizers."
            >
                <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80 flex items-center justify-center -mt-6">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="absolute inset-0 border border-blue-400/30 rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.05, 0.2] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
                        className="absolute -inset-10 border border-blue-500/20 rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                        className="absolute inset-4 border-[2px] border-dashed border-blue-500/30 rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                        className="absolute inset-8 border-[1px] border-blue-400/40 rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                        transition={{ 
                            rotate: { repeat: Infinity, duration: 15, ease: "linear" }, 
                            scale: { repeat: Infinity, duration: 2, ease: "easeInOut" } 
                        }}
                        className="absolute inset-16 border-t-2 border-r-2 border-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    />
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <Layers size={80} strokeWidth={1.5} className="text-white drop-shadow-[0_0_25px_rgba(59,130,246,0.8)] z-10" />
                </div>
            </BookPage>

            {/* Page 1: Complexity */}
            <BookPage
                title={complexity.title}
                subtitle="The Foundation of Efficiency"
                desc={complexity.desc}
            >
                <div className="w-full max-w-xl mx-auto transform transition-all group">
                    <div className="text-center mb-6">
                        <div className="inline-block py-1 px-3 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-slate-400 uppercase tracking-widest backdrop-blur-md">Core Concepts</div>
                    </div>
                    {complexity.modules.map(m => (
                        <ModuleCard key={m.id} module={m} />
                    ))}
                </div>
            </BookPage>

            {/* Page 2: Primitive */}
            <BookPage
                title={primitive.title}
                subtitle="Core Data Types"
                desc={primitive.desc}
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl px-4">
                    {primitive.primitiveList.map((item) => (
                        <motion.div
                            key={item}
                            onClick={() => {
                                if (item === "Integer") navigate("/integer-module");
                                if (item === "Float") navigate("/float-module");
                                if (item === "Character") navigate("/character-module");
                                if (item === "Boolean") navigate("/boolean-module");
                            }}
                            whileHover={{ scale: 1.05, y: -8 }}
                            className={`${(item === "Integer" || item === "Float" || item === "Character" || item === "Boolean") ? "cursor-pointer" : "cursor-not-allowed opacity-80"} bg-slate-900/60 backdrop-blur-xl border border-white/5 hover:border-blue-500/40 p-8 rounded-3xl flex flex-col items-center justify-center aspect-square shadow-[0_5px_20px_rgba(0,0,0,0.5)] group transition-all relative overflow-hidden`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="p-4 bg-blue-500/10 rounded-2xl group-hover:bg-blue-500/20 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0)] group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] z-10">
                                {primitiveIcons[item] || <Database size={32} className="text-blue-400" />}
                            </div>
                            <span className="mt-8 text-[13px] font-black tracking-widest uppercase text-slate-300 group-hover:text-white z-10">{item}</span>
                            <div className="w-8 h-1 bg-blue-500/30 rounded-full mt-4 group-hover:bg-blue-400 group-hover:w-16 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all duration-300 z-10"></div>
                        </motion.div>
                    ))}
                </div>
            </BookPage>

            {/* Page 3: Non-Primitive Linear Static */}
            <BookPage
                title={`${linear.title} - ${staticLinear.title}`}
                subtitle="Non-Primitive Structures"
                desc="Pre-allocated memory chunks offering sequential storage and immediate, constant-time access methodologies."
            >
                <div className="w-full max-w-xl mx-auto transform transition-all group">
                    <div className="text-center mb-6">
                        <div className="inline-block py-1 px-3 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-slate-400 uppercase tracking-widest backdrop-blur-md">Single Representation</div>
                    </div>
                    {staticLinear.modules.map(m => (
                        <ModuleCard key={m.id} module={m} />
                    ))}
                </div>
            </BookPage>

            {/* Page 4: Non-Primitive Linear Dynamic */}
            <BookPage
                title={`${linear.title} - ${dynamicLinear.title}`}
                subtitle="Non-Primitive Structures"
                desc="Node-based architectural components handling robust sequential access without needing contiguous memory allocation."
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl px-4">
                    {dynamicLinear.modules.map(m => (
                        <div key={m.id} className="w-full transform transition-all h-full">
                            <ModuleCard module={m} />
                        </div>
                    ))}
                </div>
            </BookPage>

            {/* Page 5: Non-Primitive Non-Linear */}
            <BookPage
                title={nonLinear.title}
                subtitle="Complex Relations"
                desc="Advanced multi-dimensional hierarchies designed to delineate parent-child networking behaviors and inter-relational graphs."
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4">
                    {nonLinear.modules.map((m) => (
                        <div key={m.id} className="w-full transform transition-all h-full">
                            <ModuleCard module={m} />
                        </div>
                    ))}
                </div>
            </BookPage>

            {/* Page 6: Algorithms - Sorting */}
            <BookPage
                title={`${hierarchy.children[3].title} - ${hierarchy.children[3].children[0].title}`}
                subtitle="Efficiency & Order"
                desc={hierarchy.children[3].children[0].desc}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
                    {hierarchy.children[3].children[0].modules.map((m) => (
                        <div key={m.id} className="w-full transform transition-all h-full">
                            <ModuleCard module={m} />
                        </div>
                    ))}
                </div>
            </BookPage>

            {/* Page 7: Algorithms - Searching */}
            <BookPage
                title={`${hierarchy.children[3].title} - ${hierarchy.children[3].children[1].title}`}
                subtitle="Retrieval Dynamics"
                desc={hierarchy.children[3].children[1].desc}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4">
                    {hierarchy.children[3].children[1].modules.map((m) => (
                        <div key={m.id} className="w-full transform transition-all h-full">
                            <ModuleCard module={m} />
                        </div>
                    ))}
                </div>
            </BookPage>

            {/* Page 8: Mastery Roadmap */}
            <BookPage
                title="DSA Patterns"
                subtitle="Problem Solving Hub"
                desc="Master common problem-solving techniques to efficiently identify and implement the best approach for any algorithmic challenge."
                isLast={true}
            >
                <div className="w-full max-w-5xl bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[40px] overflow-hidden flex h-[480px] shadow-2xl relative">
                    {/* Domain Glow Background */}
                    <AnimatePresence>
                        <motion.div
                            key={selectedDomain}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.15 }}
                            exit={{ opacity: 0 }}
                            className={`absolute inset-0 ${masteryDomains[selectedDomain].bg} blur-[120px] pointer-events-none`}
                        />
                    </AnimatePresence>

                    {/* Left Sidebar: Domains & Tools */}
                    <div className="w-56 border-r border-white/5 flex flex-col p-6 z-10 bg-black/20 overflow-y-auto custom-scrollbar">
                        <span className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase mb-4">Categories</span>
                        <div className="space-y-2 mb-6">
                            {Object.entries(masteryDomains).map(([name, data]) => (
                                <motion.button
                                    key={name}
                                    onClick={() => setSelectedDomain(name)}
                                    whileHover={{ x: 6 }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${selectedDomain === name ? 'bg-white/10 border border-white/10 shadow-lg translate-x-1' : 'opacity-50 hover:opacity-100 hover:bg-white/5'}`}
                                >
                                    <div className={`transition-colors ${selectedDomain === name ? data.color : 'text-slate-400 group-hover:text-white'}`}>
                                        {data.icon}
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${selectedDomain === name ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                        {name}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Right Pane: Content Grid */}
                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar z-10 scroll-smooth">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl ${masteryDomains[selectedDomain]?.bg} ${masteryDomains[selectedDomain]?.color}`}>
                                    {masteryDomains[selectedDomain]?.icon}
                                </div>
                                <h4 className="text-3xl font-black text-white uppercase tracking-tighter">{selectedDomain}</h4>
                            </div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                {masteryDomains[selectedDomain]?.patterns.length} Modules
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnimatePresence mode="popLayout">
                                {masteryDomains[selectedDomain]?.patterns.map((pattern, i) => (
                                    <motion.div
                                        key={pattern.name}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => navigate(pattern.path)}
                                        className={`group relative p-6 bg-slate-900/60 border border-white/5 rounded-3xl hover:border-blue-500/40 transition-all hover:bg-slate-800/80 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] cursor-pointer overflow-hidden mb-2`}
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
                                        
                                        <div className="flex items-start justify-between mb-4">
                                            <span className="text-[12px] font-black text-white uppercase tracking-widest group-hover:text-blue-400 transition-colors">
                                                {pattern.name}
                                            </span>
                                            <div className="flex gap-2">
                                                <div className="p-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                                    <ExternalLink size={14} />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/40 rounded-lg border border-white/5">
                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Time</span>
                                                <span className="text-[9px] font-bold text-blue-400">{pattern.complexity}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/40 rounded-lg border border-white/5">
                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Space</span>
                                                <span className="text-[9px] font-bold text-emerald-400">{pattern.space}</span>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setActivePracticePattern(pattern.name); }}
                                            className="mt-2 w-full py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black text-blue-400 uppercase tracking-widest hover:bg-blue-500/20 transition-all group-hover:border-blue-500/40"
                                        >
                                            <BookOpen size={12} /> Practice Problems
                                        </button>

                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Global Practice Overlay */}
                        <AnimatePresence>
                            {activePracticePattern && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl z-50 flex items-center justify-center p-8"
                                    onClick={() => setActivePracticePattern(null)}
                                >
                                    <motion.div 
                                        initial={{ scale: 0.9, y: 20 }}
                                        animate={{ scale: 1, y: 0 }}
                                        exit={{ scale: 0.9, y: 20 }}
                                        className="w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-[32px] p-8 shadow-2xl relative flex flex-col max-h-[80vh]"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                                                    <BookOpen size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Practice Library</h4>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{activePracticePattern}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setActivePracticePattern(null)}
                                                className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>

                                        <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2">
                                            {practiceProblems[activePracticePattern] ? practiceProblems[activePracticePattern].map((prob, pi) => (
                                                <a 
                                                    key={pi} 
                                                    href={prob.link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="group/item p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-blue-500/30 flex items-center justify-between transition-all"
                                                >
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[14px] font-bold text-slate-200 group-hover/item:text-white transition-colors">{prob.title}</span>
                                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Platform: LeetCode</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                            {prob.difficulty}
                                                        </span>
                                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                            <ExternalLink size={14} />
                                                        </div>
                                                    </div>
                                                </a>
                                            )) : (
                                                <div className="py-12 text-center">
                                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <BookOpen size={24} className="text-slate-600" />
                                                    </div>
                                                    <p className="text-slate-500 text-sm font-medium italic">New problems for {activePracticePattern} are being added...</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </BookPage>
        </div>
    );
}

export default Dashboard;