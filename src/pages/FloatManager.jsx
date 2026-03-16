import React, { useState, useEffect } from "react";
import { FLOAT_CODE_TEMPLATES as CODE_TEMPLATES, memoryAddresses } from '../constants';
import Header from '../components/layout/Header';
import ComplexityPulse from '../components/layout/ComplexityPulse';
import LogicTrace from '../components/layout/LogicTrace';
import { motion } from "framer-motion";

const FloatManager = () => {
    const [precision, setPrecision] = useState(32); // 32 (Single) or 64 (Double)
    const [value, setValue] = useState(0.0);
    const [bits, setBits] = useState(new Array(32).fill(0));

    const [selectedLang, setSelectedLang] = useState("JAVA");
    const [activeOperation, setActiveOperation] = useState(null);
    const [activeComplexity, setActiveComplexity] = useState(null);
    const [animationSpeed, setAnimationSpeed] = useState(800);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showHex, setShowHex] = useState(true);
    const [learningMode, setLearningMode] = useState("BEGINNER"); // BEGINNER or ADVANCED
    const [activeTab, setActiveTab] = useState("CONVERSION"); // CONVERSION, MATH
    const [hoveredBit, setHoveredBit] = useState(null);
    const [inputValue, setInputValue] = useState("0"); // Using string to allow '.' typing safely

    // Sync Float Value with Bits representation
    useEffect(() => {
        setBits(numberToBits(value, precision));
        setInputValue(value.toString());
    }, [precision, value]);

    // Format JS Number cleanly if they typed weird
    const handleInputChange = (e) => {
        const str = e.target.value;
        setInputValue(str);
        const parsed = parseFloat(str);
        if (!isNaN(parsed)) {
            const newBits = numberToBits(parsed, precision);
            // Re-eval parsing natively so that 0 doesn't glitch text, updates array visually
            setBits(newBits);
        }
    };

    const commitInput = () => {
        const parsed = parseFloat(inputValue);
        if(!isNaN(parsed)) {
            setValue(parsed);
        } else {
            setInputValue("0");
            setValue(0.0);
        }
    }

    const numberToBits = (num, prec) => {
        if (prec === 32) {
            const arr = new Float32Array([num]);
            const intArr = new Uint32Array(arr.buffer);
            const intVal = intArr[0];
            const result = [];
            for (let i = 31; i >= 0; i--) result.push((intVal >> i) & 1);
            return result;
        } else {
            const arr = new Float64Array([num]);
            const bigIntArr = new BigUint64Array(arr.buffer);
            const bigVal = bigIntArr[0];
            const result = [];
            for (let i = 63n; i >= 0n; i--) result.push(Number((bigVal >> i) & 1n));
            return result;
        }
    };

    const bitsToNumber = (bitArray, prec) => {
        const binStr = bitArray.join('');
        if (prec === 32) {
            const intNum = parseInt(binStr, 2);
            const arr = new Uint32Array([intNum]);
            const floatArr = new Float32Array(arr.buffer);
            return floatArr[0];
        } else {
            const bigVal = BigInt('0b' + binStr);
            const arr = new BigUint64Array([bigVal]);
            const fArr = new Float64Array(arr.buffer);
            return fArr[0];
        }
    };

    const toggleBit = (index) => {
        if (isProcessing) return;
        const newBits = [...bits];
        newBits[index] = newBits[index] === 1 ? 0 : 1;
        setBits(newBits);
        const num = bitsToNumber(newBits, precision);
        
        // Setting values securely
        setInputValue(num.toString());
        // To avoid useEffect resetting our toggled bit array instantly if value parses to same JS floating precision limit
        setValue(num);
    };

    const executeOp = async (opName, newTargetValue) => {
        if (isProcessing) return;
        setIsProcessing(true);
        setActiveComplexity("O(1)");
        setActiveOperation(opName);

        await new Promise(r => setTimeout(r, animationSpeed / 2));
        setValue(newTargetValue);

        setTimeout(() => {
            setActiveComplexity(null);
            setActiveOperation(null);
            setIsProcessing(false);
        }, 1500);
    };

    const handleMultiply = () => executeOp("MULTIPLICATION", value * 2.0);
    const handleDivide = () => executeOp("DIVISION", value / 2.0);
    const handleAdd = () => executeOp("ADDITION", value + 1.5);
    const handleSubtract = () => executeOp("ADDITION", value - 1.5); // Using addition template as standard logic applies
    const handleConst = (constVal) => executeOp("ASSIGNMENT", constVal);

    // Dynamic bit coloring mappings based on IEEE-754 logic
    const getIeee754Props = (bitArray, prec) => {
        const expBitsCount = prec === 32 ? 8 : 11;
        const fractionBitsCount = prec === 32 ? 23 : 52;
        const expBias = prec === 32 ? 127 : 1023;

        const signBit = bitArray[0];
        const exponentArr = bitArray.slice(1, 1 + expBitsCount);
        const fractionArr = bitArray.slice(1 + expBitsCount);

        const expBinStr = exponentArr.join('');
        const expValRaw = parseInt(expBinStr, 2);
        const expValFinal = expValRaw - expBias;

        let hexRep = "0x";
        if(prec === 32) {
            hexRep += parseInt(bitArray.join(''), 2).toString(16).toUpperCase().padStart(8, '0');
        } else {
            hexRep += BigInt('0b' + bitArray.join('')).toString(16).toUpperCase().padStart(16, '0');
        }

        return { signBit, expBitsCount, fractionBitsCount, expValRaw, expValFinal, hexRep };
    };

    const ieeeMeta = getIeee754Props(bits, precision);

    return (
        <div className="h-screen bg-[#020617] text-slate-300 font-sans selection:bg-purple-500/30 flex flex-col overflow-hidden">
            <Header 
                abbr="FLT"
                moduleName="MOD_07: PRIMITIVE FLOAT"
                moduleDesc="(IEEE 754 Floating-Point)"
                themeColor="purple"
                config={{
                    label: "Precision Standard",
                    value: precision,
                    onChange: (val) => setPrecision(Number(val)),
                    options: [
                        { value: 32, label: "32-BIT (SINGLE FP)" },
                        { value: 64, label: "64-BIT (DOUBLE FP)" },
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
                {/* Sector 01: Controls & Intelligence */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pb-2 custom-scroll">
                        <section className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <h2 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-sm"></span> COMPILER_MODE
                                </h2>
                                <div className="flex bg-slate-950 border border-white/10 rounded-lg p-1">
                                    <button 
                                        onClick={() => setLearningMode("BEGINNER")}
                                        className={`px-3 py-1 text-[9px] font-black rounded-md transition-all uppercase tracking-widest ${learningMode === "BEGINNER" ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
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
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">STEP 1: DECIMAL_INTERPRETER</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={handleInputChange}
                                            onBlur={commitInput}
                                            onKeyDown={(e) => e.key === "Enter" && commitInput()}
                                            placeholder="Assign Float, e.g. 3.1415"
                                            className="flex-1 h-9 bg-[#01040f] border border-white/5 rounded-xl px-4 text-xs text-white outline-none focus:border-purple-500/50 transition-all font-mono"
                                        />
                                        <button onClick={() => { setInputValue("0.0"); setValue(0.0); }} disabled={isProcessing} className="px-5 bg-slate-900 border border-red-500/10 hover:border-red-500/30 disabled:opacity-50 rounded-lg text-red-500/60 hover:text-red-400 text-[9px] font-black transition-all uppercase">AC</button>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 mt-2">
                                        <button onClick={() => handleConst(3.14159)} disabled={isProcessing} className="py-1.5 bg-slate-900 border border-white/5 hover:bg-slate-800 disabled:opacity-50 rounded-md text-slate-400 text-[8px] font-bold transition-all uppercase text-center w-full">π (Pi)</button>
                                        <button onClick={() => handleConst(0.3)} disabled={isProcessing} className="py-1.5 bg-slate-900 border border-white/5 hover:bg-slate-800 disabled:opacity-50 rounded-md text-slate-400 text-[8px] font-bold transition-all uppercase text-center w-full">0.3 (Err)</button>
                                        <button onClick={() => handleConst(-118.625)} disabled={isProcessing} className="py-1.5 bg-slate-900 border border-white/5 hover:bg-slate-800 disabled:opacity-50 rounded-md text-slate-400 text-[8px] font-bold transition-all uppercase text-center w-full">-118.625</button>
                                        <button onClick={() => handleConst(0.0)} disabled={isProcessing} className="py-1.5 bg-slate-900 border border-white/5 hover:bg-slate-800 disabled:opacity-50 rounded-md text-slate-400 text-[8px] font-bold transition-all uppercase text-center w-full">0.0</button>
                                    </div>
                                </div>

                                <div className="h-px bg-white/5"></div>

                                <div className="space-y-3">
                                    <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">STEP 2: OPERATIONS</label>
                                    
                                    <div className="flex gap-1 bg-slate-900/50 p-1 rounded-lg border border-white/5">
                                        <button onClick={() => setActiveTab("MATH")} className={`flex-1 py-1.5 text-[8.5px] font-black rounded uppercase tracking-widest transition-all ${activeTab === "MATH" ? "bg-slate-800 text-purple-400 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>Arithmetic</button>
                                        <button onClick={() => setActiveTab("CONVERSION")} className={`flex-1 py-1.5 text-[8.5px] font-black rounded uppercase tracking-widest transition-all ${activeTab === "CONVERSION" ? "bg-slate-800 text-teal-400 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>IEEE 754 Map</button>
                                    </div>

                                    <div className="min-h-[90px]">
                                        {activeTab === "MATH" && (
                                            <div className="grid grid-cols-2 gap-2 animate-in slide-in-from-right-2 fade-in duration-200">
                                                <button onClick={handleMultiply} disabled={isProcessing} className="py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-lg text-white text-[9px] font-black transition-all shadow-lg uppercase tracking-widest">MULTIPLY (* 2.0)</button>
                                                <button onClick={handleDivide} disabled={isProcessing} className="py-2.5 bg-slate-800 border border-white/5 hover:border-purple-500/30 disabled:opacity-50 rounded-lg text-slate-400 hover:text-purple-400 text-[9px] font-black transition-all uppercase tracking-widest">DIVIDE (/ 2.0)</button>
                                                <button onClick={handleAdd} disabled={isProcessing} className="py-2.5 bg-slate-800 border border-white/5 hover:border-purple-500/30 disabled:opacity-50 rounded-lg text-slate-400 hover:text-purple-400 text-[9px] font-black transition-all uppercase tracking-widest">ADD (+ 1.5)</button>
                                                <button onClick={handleSubtract} disabled={isProcessing} className="py-2.5 bg-slate-800 border border-white/5 hover:border-purple-500/30 disabled:opacity-50 rounded-lg text-slate-400 hover:text-purple-400 text-[9px] font-black transition-all uppercase tracking-widest">SUBTRACT (- 1.5)</button>
                                            </div>
                                        )}
                                        {activeTab === "CONVERSION" && (
                                            <div className="animate-in slide-in-from-right-2 fade-in duration-200 flex flex-col gap-2">
                                                <div className="bg-slate-900 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase">Sign Bit</span>
                                                    <span className="text-xs font-mono font-black text-red-400">{ieeeMeta.signBit === 1 ? '-' : '+'} ({ieeeMeta.signBit})</span>
                                                </div>
                                                <div className="bg-slate-900 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase">Exponent Value <span className="text-slate-700 mx-1">|</span> Raw {ieeeMeta.expValRaw}</span>
                                                    <span className="text-xs font-mono font-black text-emerald-400">2^{ieeeMeta.expValFinal}</span>
                                                </div>
                                                <div className="bg-slate-900 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase">Mantissa Array</span>
                                                    <span className="text-xs font-mono font-black text-blue-400 truncate max-w-[120px]" title={bits.slice(1 + ieeeMeta.expBitsCount).join('')}>1.{bits.slice(1 + ieeeMeta.expBitsCount).join('')}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Sector 02: Visualizer */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden relative">
                     <div className="bg-[#030816]/60 border border-white/5 rounded-[40px] p-6 lg:p-10 flex flex-col gap-5 overflow-hidden relative flex-1 shadow-2xl">
                         <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                             <span className="w-1 h-1 rounded-full bg-purple-500 animate-pulse"></span> ALLOCATED_FLOAT_BLOCK
                         </h3>

                         <div className="flex-1 flex flex-col items-center justify-start relative w-full pt-4 gap-8">
                            
                             {/* Decimal / Hex Displays */}
                            <div className="flex gap-4 w-full max-w-2xl justify-center">
                                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 flex flex-col items-center flex-1 shadow-lg relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">DECIMAL_VALUE (BASE-10)</span>
                                    <span className={`font-black text-white relative z-10 ${value.toString().length > 10 ? 'text-xl' : 'text-3xl'}`}>{value}</span>
                                </div>
                                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 flex flex-col items-center flex-1 shadow-lg relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent"></div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">HEXADECIMAL_INTERPRET</span>
                                    <span className="text-3xl font-mono font-black text-orange-400 relative z-10">{ieeeMeta.hexRep}</span>
                                </div>
                            </div>
                            
                            {/* Memory Address Simulator Hook */}
                            {learningMode === "ADVANCED" && (
                                <div className="w-full max-w-4xl text-center border-y border-dashed border-white/10 py-3 mt-2">
                                    <span className="text-[10px] font-mono text-slate-500">IEEE_STANDARD: <span className="text-purple-400">754 {precName(precision)}</span> | ENDIANNESS: NATIVE</span>
                                    <div className="mt-2 text-[9px] text-slate-400 flex justify-center gap-6">
                                        <span className="text-red-400">SIGN: 1 BIT</span>
                                        <span className="text-emerald-400">EXPONENT: {ieeeMeta.expBitsCount} BITS</span>
                                        <span className="text-blue-400">FRACTION: {ieeeMeta.fractionBitsCount} BITS</span>
                                    </div>
                                </div>
                            )}

                            {/* Binary Bit Array with Educational Layers */}
                            <div className="w-full flex flex-col items-center mt-2 relative border border-white/5 bg-black/40 p-4 rounded-3xl">
                                
                                <div className="flex gap-4 mb-4">
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/10 border border-red-500/20">
                                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                        <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Sign Bit (1b)</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Exponent ({ieeeMeta.expBitsCount}b)</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                        <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Mantissa/Fraction ({ieeeMeta.fractionBitsCount}b)</span>
                                    </div>
                                </div>

                                {/* Dynamic Interactive Bit Display */}
                                <div className="flex justify-center flex-wrap gap-1 max-w-4xl relative">
                                    {bits.map((b, i) => {
                                        // IEEE Partition Logic Mapping
                                        const isSign = i === 0;
                                        const isExp = i > 0 && i <= ieeeMeta.expBitsCount;
                                        const isFrac = i > ieeeMeta.expBitsCount;

                                        // Apply categorical borders & fills visually!
                                        let catClass = "";
                                        let activeClass = "";
                                        let textClass = "";
                                        let hoverTitle = "";

                                        if (isSign) {
                                            catClass = "border-red-500/30 group-hover:border-red-500/80";
                                            activeClass = b ? "bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.3)]" : "bg-black";
                                            textClass = b ? "text-red-400" : "text-slate-600";
                                            hoverTitle = "SIGN BIT\n0 = Positive (+)\n1 = Negative (-)";
                                        } else if (isExp) {
                                            catClass = "border-emerald-500/30 group-hover:border-emerald-500/80";
                                            activeClass = b ? "bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-black";
                                            textClass = b ? "text-emerald-400" : "text-slate-600";
                                            // Calculate reverse exponent index (e.g., 2^7, 2^6...) based on specific bit
                                            const expIndex = ieeeMeta.expBitsCount - i; 
                                            hoverTitle = `EXPONENT BIT\nPosition: 2^${expIndex}\nContribution: ${b ? Math.pow(2, expIndex) : 0}`;
                                        } else if (isFrac) {
                                            catClass = "border-blue-500/30 group-hover:border-blue-500/80";
                                            activeClass = b ? "bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]" : "bg-black";
                                            textClass = b ? "text-blue-400" : "text-white/10";
                                            const fracIndex = i - ieeeMeta.expBitsCount;
                                            hoverTitle = `MANTISSA BIT\nFraction: 1 / 2^${fracIndex}\nDecimals Added: ${b ? (1 / Math.pow(2, fracIndex)).toPrecision(4) : 0}`;
                                        }
                                        
                                        // Responsive width to handle massive 64 bit lines
                                        const boxSize = precision === 64 ? "w-4 h-6 md:w-5 md:h-8" : "w-6 h-10 md:w-8 md:h-12 border-2";

                                        return (
                                            <div 
                                                key={i} 
                                                className="relative group transition-transform hover:-translate-y-1 cursor-pointer flex flex-col items-center"
                                                onClick={() => toggleBit(i)}
                                                onMouseEnter={() => setHoveredBit({ index: i, title: hoverTitle })}
                                                onMouseLeave={() => setHoveredBit(null)}
                                            >
                                                <div className={`rounded flex items-center justify-center transition-all ${boxSize} ${catClass} ${activeClass}`}>
                                                    <span className={`font-mono font-black ${precision === 64 ? 'text-[8px] md:text-xs' : 'text-sm md:text-lg'} ${textClass}`}>{b}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                {/* Info Panel generated from hover */}
                                <div className="h-20 mt-4 flex items-center justify-center w-full">
                                    {hoveredBit ? (
                                        <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-3 flex flex-col gap-1 items-center min-w-[200px] animate-in fade-in duration-200">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-white/5 pb-1 mb-1">{hoveredBit.title.split('\n')[0]}</span>
                                            <span className="text-[11px] text-white font-mono">{hoveredBit.title.split('\n')[1]}</span>
                                            <span className="text-[11px] text-slate-400 font-mono">{hoveredBit.title.split('\n')[2]}</span>
                                        </div>
                                    ) : (
                                        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center">
                                            Hover over any physical bit to inspect its raw mathematical contribution.
                                        </div>
                                    )}
                                </div>
                            </div>

                         </div>
                     </div>

                    <ComplexityPulse 
                        themeColor="purple"
                        activeComplexity={activeComplexity}
                        operationName="ALU_FPU"
                    />

                    {learningMode === "ADVANCED" && (
                        <LogicTrace 
                            themeColor="purple"
                            activeOperation={activeOperation}
                            codeTemplates={CODE_TEMPLATES}
                            selectedLang={selectedLang}
                            infoText="FPU_CORE_CYCLE"
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

// Utils
const precName = (n) => n===32 ? 'SINGLE PRECISION' : 'DOUBLE PRECISION';

export default FloatManager;
