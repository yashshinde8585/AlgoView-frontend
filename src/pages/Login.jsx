import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { loginUser } from "../services/api"

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await loginUser(formData.email, formData.password)
            navigate("/")
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || "Login failed - Check if Server is running or if User exists")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="p-8 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center">DSAverse Login</h2>
                {error && <p className="text-red-400 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 bg-gray-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full p-2 bg-gray-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition duration-200">
                        Sign In
                    </button>
                </form>

                <p className="mt-4 text-center text-gray-400">
                    Don't have an account? <Link to="/signup" className="text-blue-400 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    )
}

export default Login;
