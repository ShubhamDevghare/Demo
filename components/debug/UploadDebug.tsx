"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export default function UploadDebug() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState(null)

  const runTests = async () => {
    setTesting(true)
    const testResults = {
      kvConnection: null,
      photoCount: null,
      uploadTest: null,
    }

    try {
      // Test KV connection
      console.log("Testing KV connection...")
      const kvResponse = await fetch("/api/debug/kv-connection")
      const kvData = await kvResponse.json()
      testResults.kvConnection = kvData

      // Test photo count
      console.log("Testing photo retrieval...")
      const photosResponse = await fetch("/api/owner/photos")
      const photosData = await photosResponse.json()
      testResults.photoCount = photosData

      setResults(testResults)
    } catch (error) {
      console.error("Debug test error:", error)
      setResults({ error: error.message })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Upload System Debug</h3>
        <button
          onClick={runTests}
          disabled={testing}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          {testing ? (
            <>
              <Loader2 className="w-4 h-4 inline mr-1 animate-spin" />
              Testing...
            </>
          ) : (
            "Run Tests"
          )}
        </button>
      </div>

      {results && (
        <div className="space-y-3">
          {/* KV Connection Test */}
          <div className="flex items-center space-x-2">
            {results.kvConnection?.success ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            <span className="text-sm">KV Database: {results.kvConnection?.success ? "Connected" : "Failed"}</span>
          </div>

          {/* Photo Count Test */}
          <div className="flex items-center space-x-2">
            {results.photoCount?.success ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            <span className="text-sm">
              Photos API:{" "}
              {results.photoCount?.success ? `Working (${results.photoCount.photos?.length || 0} photos)` : "Failed"}
            </span>
          </div>

          {/* Error Details */}
          {(!results.kvConnection?.success || !results.photoCount?.success) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <h4 className="font-medium text-red-800 mb-2">Issues Found:</h4>
              <div className="text-sm text-red-700 space-y-1">
                {!results.kvConnection?.success && <div>• KV Database: {results.kvConnection?.error}</div>}
                {!results.photoCount?.success && <div>• Photos API: {results.photoCount?.error}</div>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
