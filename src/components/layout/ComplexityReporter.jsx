import React from 'react';

const themes = {
    blue: {
        text: 'text-blue-500',
        bgMarker: 'bg-blue-500',
    },
    green: {
        text: 'text-green-500',
        bgMarker: 'bg-green-500',
    },
    orange: {
        text: 'text-orange-500',
        bgMarker: 'bg-orange-500',
    },
    purple: {
        text: 'text-purple-500',
        bgMarker: 'bg-purple-500',
    },
    emerald: {
        text: 'text-emerald-500',
        bgMarker: 'bg-emerald-500',
    },
    cyan: {
        text: 'text-cyan-500',
        bgMarker: 'bg-cyan-500',
    }
};

const ComplexityReporter = ({ themeColor = "blue", stats = [] }) => {
    const theme = themes[themeColor];

    return (
        <section className="bg-slate-950 border border-white/10 rounded-2xl p-5 flex flex-col gap-4 relative transition-all duration-500">
            <h2 className={`text-[10px] font-black ${theme.text} uppercase tracking-[0.2em] flex items-center gap-2`}>
                <span className={`w-1 h-1 ${theme.bgMarker} rounded-full animate-pulse`}></span> COMPLEXITY_REPORTER
            </h2>
            <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, idx) => (
                    <div key={idx} className={`bg-white/[0.02] border border-white/5 rounded-xl p-3 flex flex-col justify-between ${stats.length <= 2 ? 'min-h-[50px]' : 'min-h-[58px]'}`}>
                        <p className="text-[7.5px] font-black text-slate-600 uppercase tracking-widest leading-none">{stat.label}</p>
                        <p className="text-[14px] font-mono font-black text-white leading-none mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ComplexityReporter;
