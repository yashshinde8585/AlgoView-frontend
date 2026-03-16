import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const themes = {
    blue: {
        bgMarker: 'bg-blue-500',
        textLight: 'text-blue-300/60',
    },
    green: {
        bgMarker: 'bg-green-500',
        textLight: 'text-green-300/60',
    },
    orange: {
        bgMarker: 'bg-orange-500',
        textLight: 'text-orange-300/60',
    },
    purple: {
        bgMarker: 'bg-purple-500',
        textLight: 'text-purple-300/60',
    },
    emerald: {
        bgMarker: 'bg-emerald-500',
        textLight: 'text-emerald-300/60',
    },
    cyan: {
        bgMarker: 'bg-cyan-500',
        textLight: 'text-cyan-300/60',
    }
};

const LogicTrace = ({
    themeColor = "blue",
    activeOperation,
    codeTemplates,
    selectedLang,
    infoText
}) => {
    const theme = themes[themeColor];
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={`transition-all duration-300 bg-slate-950 border border-white/10 rounded-3xl p-4 overflow-hidden flex flex-col gap-3 ${isCollapsed ? 'h-auto' : 'h-48'}`}>
            <div 
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div className="flex items-center gap-2">
                    <h3 className="text-[9px] font-black text-slate-500 group-hover:text-slate-400 uppercase tracking-[0.2em] transition-colors">
                        LOGIC_TRACE: {activeOperation || 'IDLE_STATUS'}
                    </h3>
                    {isCollapsed ? (
                        <ChevronDown size={12} className="text-slate-500 group-hover:text-slate-400 transition-colors" />
                    ) : (
                        <ChevronUp size={12} className="text-slate-500 group-hover:text-slate-400 transition-colors" />
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[8px] font-bold text-slate-600">{infoText}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${activeOperation ? `${theme.bgMarker} animate-pulse` : 'bg-slate-700'}`}></div>
                </div>
            </div>
            
            {!isCollapsed && (
                <div className={`flex-1 bg-black/40 rounded-xl p-3 font-mono text-[10px] ${theme.textLight} overflow-y-auto no-scrollbar border border-white/5`}>
                    <pre>{codeTemplates[activeOperation || 'IDLE_STRUCTURE']?.[selectedLang] || '// No template available'}</pre>
                </div>
            )}
        </div>
    );
};

export default LogicTrace;
