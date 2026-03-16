import React from 'react';

const themes = {
    blue: {
        borderGlow: 'border-blue-500/40',
        shadowGlow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]',
        pulseClass: 'animate-[tc-pulse-blue_2s_infinite]',
        text: 'text-blue-500',
        bgMarker: 'bg-blue-500',
    },
    green: {
        borderGlow: 'border-green-500/40',
        shadowGlow: 'shadow-[0_0_30px_rgba(34,197,94,0.15)]',
        pulseClass: 'animate-[tc-pulse-green_2s_infinite]',
        text: 'text-green-500',
        bgMarker: 'bg-green-500',
    },
    orange: {
        borderGlow: 'border-orange-500/40',
        shadowGlow: 'shadow-[0_0_30px_rgba(249,115,22,0.15)]',
        pulseClass: 'animate-[tc-pulse-orange_2s_infinite]',
        text: 'text-orange-500',
        bgMarker: 'bg-orange-500',
    },
    purple: {
        borderGlow: 'border-purple-500/40',
        shadowGlow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]',
        pulseClass: 'animate-[tc-pulse-purple_2s_infinite]',
        text: 'text-purple-500',
        bgMarker: 'bg-purple-500',
    },
    emerald: {
        borderGlow: 'border-emerald-500/40',
        shadowGlow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]',
        pulseClass: 'animate-[tc-pulse-emerald_2s_infinite]',
        text: 'text-emerald-500',
        bgMarker: 'bg-emerald-500',
    },
    cyan: {
        borderGlow: 'border-cyan-500/40',
        shadowGlow: 'shadow-[0_0_30px_rgba(6,182,212,0.15)]',
        pulseClass: 'animate-[tc-pulse-cyan_2s_infinite]',
        text: 'text-cyan-500',
        bgMarker: 'bg-cyan-500',
    }
};

const ComplexityPulse = ({ 
    activeComplexity, 
    operationName = "EXECUTING_OP", 
    themeColor = "blue",
    position = "bottom-8 right-8"
}) => {
    if (!activeComplexity) return null;
    
    const theme = themes[themeColor];

    return (
        <div className={`absolute ${position} z-[100] animate-in slide-in-from-bottom-4 fade-in duration-500 pointer-events-none`}>
            <style>{`
                @keyframes tc-pulse-blue { 
                    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); } 
                    70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); } 
                    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); } 
                }
                @keyframes tc-pulse-green { 
                    0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); } 
                    70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); } 
                    100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } 
                }
                @keyframes tc-pulse-orange { 
                    0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); } 
                    70% { box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); } 
                    100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); } 
                }
                @keyframes tc-pulse-purple { 
                    0% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.4); } 
                    70% { box-shadow: 0 0 0 10px rgba(168, 85, 247, 0); } 
                    100% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0); } 
                }
                @keyframes tc-pulse-emerald { 
                    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 
                    70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 
                    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } 
                }
                @keyframes tc-pulse-cyan { 
                    0% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.4); } 
                    70% { box-shadow: 0 0 0 10px rgba(6, 182, 212, 0); } 
                    100% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0); } 
                }
            `}</style>
            <div className={`bg-slate-950/90 backdrop-blur-xl border ${theme.borderGlow} rounded-full px-8 py-3 ${theme.shadowGlow} flex items-center gap-4 ${theme.pulseClass}`}>
                <div className="flex flex-col">
                    <span className={`text-[8px] font-black ${theme.text} uppercase tracking-[0.2em] leading-none mb-1`}>Time_Complexity</span>
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${theme.bgMarker} animate-pulse`}></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{operationName}</span>
                    </div>
                </div>
                <div className="h-8 w-px bg-white/10"></div>
                <span className={`text-3xl font-black italic text-white tracking-tighter ${themeColor === 'green' ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]' : ''}`}>{activeComplexity}</span>
            </div>
        </div>
    );
};

export default ComplexityPulse;
