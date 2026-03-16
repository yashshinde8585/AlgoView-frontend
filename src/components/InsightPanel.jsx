import React from "react"

const InsightPanel = ({ structureName, operation, complexity, whyUsed }) => {
    return (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 w-80 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-blue-400">⚡</span> Insight Panel
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-blue-300">Data Structure</label>
                    <p className="text-lg font-medium">{structureName}</p>
                </div>

                <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-orange-400">Operation</label>
                    <p className="text-lg font-medium">{operation}</p>
                </div>

                <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-green-400">Time Complexity</label>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-300 font-mono">
                            {complexity}
                        </span>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                    <p className="text-sm text-gray-300 leading-relaxed italic">
                        "{whyUsed}"
                    </p>
                </div>
            </div>

            <div className="mt-6 flex justify-center">
                <div className="h-1 w-12 bg-blue-500/50 rounded-full blur-sm animate-pulse"></div>
            </div>
        </div>
    )
}

export default InsightPanel;
