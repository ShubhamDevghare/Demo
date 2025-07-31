"use client"

import { useState, useEffect } from "react"

export default function PhotoTest() {
  const [debugData, setDebugData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDebugData()
  }, [])

  const loadDebugData = async () => {
    try {
      const response = await fetch("/api/debug/photos")
      const data = await response.json()
      setDebugData(data)
    } catch (error) {
      console.error("Debug error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading debug info...</div>

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">Photo Database Debug</h3>
      <pre className="text-xs bg-white p-2 rounded overflow-auto">{JSON.stringify(debugData, null, 2)}</pre>
    </div>
  )
}
