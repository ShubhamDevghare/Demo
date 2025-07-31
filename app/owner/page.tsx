"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, User } from "lucide-react"
import { toast } from "react-hot-toast"
import Image from "next/image"

export default function OwnerLogin() {
  const [credentials, setCredentials] = useState({ email: "shubhamkd.a02@gmail.com", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server error occurred")
      }

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("ownerToken", "authenticated")
        toast.success("Login successful!")
        router.push("/owner/CommandCenter")
      } else {
        setError(data.message || "Login failed")
        toast.error(data.message || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Login failed. Please try again.")
      toast.error("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-6">
            <Image
              src="/images/sharp-images-logo.png"
              alt="Sharp Images Photography and Films"
              width={200}
              height={80}
              className="h-16 w-auto object-contain mx-auto"
              priority
            />
          </div>
          <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-playfair font-bold text-gray-900">Owner Access</h1>
          <p className="text-gray-600 mt-2">Command Center Login</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold-500 text-white py-3 rounded-lg font-medium hover:bg-gold-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Access Command Center"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">Sharp Images Photography & Films - Admin Portal</p>
        </div>
      </div>
    </div>
  )
}
