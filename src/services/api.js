import axios from "axios"

export const api = axios.create({
    baseURL: "http://localhost:5000/api",
})

// Add token to every request from localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Auth helper methods
export const loginUser = async (email, password) => {
    const response = await api.post("/auth/login", { email, password })
    if (response.data.token) {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data))
    }
    return response.data
}

export const registerUser = async (name, email, password) => {
    const response = await api.post("/auth/register", { name, email, password })
    if (response.data.token) {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data))
    }
    return response.data
}

export const logoutUser = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
}