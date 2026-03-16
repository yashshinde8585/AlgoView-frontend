import React from 'react';

const themes = {
    blue: {
        bg: 'bg-blue-600',
        text: 'text-blue-500',
        textLight: 'text-blue-400',
        borderFocus: 'focus:border-blue-500/50',
        borderHover: 'hover:border-blue-500/50',
        accentBg: 'bg-blue-500',
        accentThumb: 'accent-blue-500'
    },
    green: {
        bg: 'bg-green-600',
        text: 'text-green-500',
        textLight: 'text-green-400',
        borderFocus: 'focus:border-green-500/50',
        borderHover: 'hover:border-green-500/50',
        accentBg: 'bg-green-500',
        accentThumb: 'accent-green-500'
    },
    orange: {
        bg: 'bg-orange-600',
        text: 'text-orange-500',
        textLight: 'text-orange-400',
        borderFocus: 'focus:border-orange-500/50',
        borderHover: 'hover:border-orange-500/50',
        accentBg: 'bg-orange-500',
        accentThumb: 'accent-orange-500'
    },
    purple: {
        bg: 'bg-purple-600',
        text: 'text-purple-500',
        textLight: 'text-purple-400',
        borderFocus: 'focus:border-purple-500/50',
        borderHover: 'hover:border-purple-500/50',
        accentBg: 'bg-purple-500',
        accentThumb: 'accent-purple-500'
    },
    emerald: {
        bg: 'bg-emerald-600',
        text: 'text-emerald-500',
        textLight: 'text-emerald-400',
        borderFocus: 'focus:border-emerald-500/50',
        borderHover: 'hover:border-emerald-500/50',
        accentBg: 'bg-emerald-500',
        accentThumb: 'accent-emerald-500'
    },
    cyan: {
        bg: 'bg-cyan-600',
        text: 'text-cyan-500',
        textLight: 'text-cyan-400',
        borderFocus: 'focus:border-cyan-500/50',
        borderHover: 'hover:border-cyan-500/50',
        accentBg: 'bg-cyan-500',
        accentThumb: 'accent-cyan-500'
    }
};

const Header = ({
    abbr,
    title = "DSA_OS_ENGINE",
    version = "v1.4.0",
    moduleName,
    moduleDesc,
    themeColor = "blue",
    config,
    showHex,
    setShowHex,
    selectedLang,
    setSelectedLang,
    animationSpeed,
    setAnimationSpeed,
    children
}) => {
    const theme = themes[themeColor];

    return (
        <nav className="h-12 shrink-0 border-b border-white/5 bg-slate-950/80 backdrop-blur-md flex items-center px-6 z-50">
            <div className="flex items-center justify-between max-w-[1600px] mx-auto w-full">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 ${theme.bg} rounded-sm flex items-center justify-center text-white font-black text-[10px]`}>
                            {abbr}
                        </div>
                        <span className="font-black text-white text-xs tracking-widest uppercase">{title} {version}</span>
                    </div>
                    <div className="h-3 w-px bg-white/10 mx-1"></div>
                    <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold ${theme.textLight} uppercase tracking-widest`}>{moduleName}</span>
                        <span className="text-[9px] font-medium text-slate-500 uppercase tracking-tighter">{moduleDesc}</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    {config && (
                        <div className="flex items-center gap-3">
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{config.label}:</span>
                            <select
                                value={config.value}
                                onChange={(e) => config.onChange(e.target.value)}
                                className={`bg-slate-900 border border-white/10 rounded px-2 py-0.5 text-[9px] font-black ${theme.textLight} outline-none ${theme.borderFocus} cursor-pointer`}
                            >
                                {config.options.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${!showHex ? theme.textLight : 'text-slate-600'}`}>ID_Ptr</span>
                        <div onClick={() => setShowHex(!showHex)} className="w-6 h-3 bg-slate-900 rounded-full relative flex items-center px-0.5 border border-white/10">
                            <div className={`h-2 w-2 ${theme.accentBg} rounded-full transition-transform duration-300 ${showHex ? 'translate-x-3' : 'translate-x-0'}`}></div>
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${showHex ? theme.textLight : 'text-slate-600'}`}>Hex_Addr</span>
                    </label>
                    {selectedLang !== undefined && (
                        <div className="flex items-center gap-3">
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Language:</span>
                            <select
                                value={selectedLang}
                                onChange={(e) => setSelectedLang(e.target.value)}
                                className="bg-slate-900 border border-white/10 rounded px-2 py-0.5 text-[9px] font-bold text-blue-400 outline-none hover:border-blue-500/50 transition-all cursor-pointer"
                            >
                                <option value="JAVA">JAVA</option>
                                <option value="PYTHON">PYTHON</option>
                                <option value="CPP">C++</option>
                            </select>
                        </div>
                    )}
                    {children}
                    <div className="h-3 w-px bg-white/10 mx-1"></div>
                    <div className="flex items-center gap-3">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Speed</span>
                        <input 
                            type="range" 
                            min="200" 
                            max="2000" 
                            value={2200 - animationSpeed} 
                            onChange={(e) => setAnimationSpeed(2200 - e.target.value)} 
                            className={`w-20 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer ${theme.accentThumb}`} 
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
