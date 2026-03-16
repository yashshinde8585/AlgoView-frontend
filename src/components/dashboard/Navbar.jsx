import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/api";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

export const Navbar = ({ user }) => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    return (
        <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center max-w-7xl mx-auto py-4 px-2 sm:px-8"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 rotate-3 group hover:rotate-6 transition-transform">
                    <span className="text-xl font-black italic text-white shadow-sm">D</span>
                </div>
                <div>
                    <h1 className="text-xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent tracking-tighter uppercase font-outfit">
                        DSAVERSE
                    </h1>
                    <p className="text-blue-300 text-[8px] font-bold uppercase tracking-[0.4em] opacity-80">Hierarchy Interface</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden sm:flex flex-col items-end">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Operator</p>
                    <p className="text-blue-400 text-xs font-bold uppercase tracking-wider">{user?.name || "Guest"}</p>
                </div>
                <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 px-4 py-2 border border-red-500/20 rounded-lg text-[10px] font-black text-red-500 hover:bg-red-500/10 hover:border-red-500/50 transition-all uppercase tracking-widest"
                >
                    <LogOut size={14} /> Log_out
                </button>
            </div>
        </motion.header>
    );
};
