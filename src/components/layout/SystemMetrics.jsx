import React from 'react';

const themes = {
    blue: {
        text: 'text-blue-500',
        bgMarker: 'bg-blue-500',
        activeText: 'text-blue-400',
    },
    green: {
        text: 'text-green-500',
        bgMarker: 'bg-green-500',
        activeText: 'text-green-400',
    },
    orange: {
        text: 'text-orange-500/80',
        bgMarker: 'bg-orange-500',
        activeText: 'text-orange-400',
    },
    purple: {
        text: 'text-purple-500/80',
        bgMarker: 'bg-purple-500',
        activeText: 'text-purple-400',
    },
    emerald: {
        text: 'text-emerald-500/80',
        bgMarker: 'bg-emerald-500',
        activeText: 'text-emerald-400',
    },
    cyan: {
        text: 'text-cyan-500/80',
        bgMarker: 'bg-cyan-500',
        activeText: 'text-cyan-400',
    }
};

const SystemMetrics = ({ 
    themeColor = "blue", 
    title = "SYSTEM_METRICS_ANALYTICS",
    insight,
    timeLabel = "Time",
    efficiencyLabel = "Efficiency",
    activeComplexity,
    systemError
}) => {
    const theme = themes[themeColor];

    return (
        <section className="bg-slate-950 border border-white/10 rounded-2xl p-5 flex flex-col gap-4 relative">
            <h2 className={`text-[10px] font-black ${theme.text} uppercase tracking-[0.2em] flex items-center gap-2`}>
                <span className={`w-1 h-1 ${theme.bgMarker} rounded-full`}></span> {title}
            </h2>
            <div className={`grid ${insight.efficiency ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-center min-h-[55px] flex flex-col justify-between relative">
                    <p className="text-[7.5px] font-black text-slate-600 uppercase tracking-widest leading-none w-full">{timeLabel}</p>
                    <p className={`text-[12px] font-mono font-black ${insight.time.includes('O(1)') ? 'text-green-400' : 'text-green-400'} mt-1`}>{insight.time}</p>
                    {activeComplexity && (
                        <div className={`absolute inset-0 ${theme.bgMarker.replace('bg-', 'bg-').replace('500', '600/20')} backdrop-blur-sm flex items-center justify-center animate-[complexity-pop_0.3s_ease-out] rounded-xl`}>
                            <span className={`text-xl font-black italic ${theme.activeText}`}>{activeComplexity}</span>
                        </div>
                    )}
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-center min-h-[55px] flex flex-col justify-between">
                    <p className="text-[7.5px] font-black text-slate-600 uppercase tracking-widest leading-none w-full">Space</p>
                    <p className="text-[12px] font-mono font-black text-blue-400 mt-1">{insight.space}</p>
                </div>
                {insight.efficiency && (
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-center min-h-[55px] flex flex-col justify-between">
                        <p className="text-[7.5px] font-black text-slate-600 uppercase tracking-widest leading-none w-full">{efficiencyLabel}</p>
                        <p className="text-[12px] font-mono font-black text-purple-400 mt-1">{insight.efficiency}</p>
                    </div>
                )}
            </div>
            {systemError && (
                <div className="mt-2 py-3 px-4 bg-red-500/5 border border-red-500/20 rounded-xl animate-in fade-in slide-in-from-top-1 duration-200">
                    <p className="text-[10px] font-mono text-red-500 font-black tracking-widest uppercase">{systemError}</p>
                </div>
            )}
        </section>
    );
};

export default SystemMetrics;
