"use client"

import { useState } from "react"
import { Copy, ExternalLink, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "react-hot-toast"

export default function KVSetupGuide() {
  const [step, setStep] = useState(1)
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  const testConnection = async () => {
    setTesting(true)
    try {
      const response = await fetch("/api/debug/kv-connection")
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ success: false, error: error.message })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Vercel KV Database Setup Guide</h2>

      <div className="space-y-8">
        {/* Step 1: Create KV Database */}
        <div className={`p-4 rounded-lg border-2 ${step >= 1 ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Step 1: Create Vercel KV Database</h3>
            <button
              onClick={() => setStep(1)}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              View
            </button>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Go to your Vercel Dashboard</li>
                <li>Navigate to your project</li>
                <li>Click on the "Storage" tab</li>
                <li>Click "Create Database"</li>
                <li>Select "KV" (Key-Value Database)</li>
                <li>Choose a name like "sharp-images-db"</li>
                <li>Click "Create"</li>
              </ol>

              <div className="flex items-center space-x-2 mt-4">
                <ExternalLink className="w-4 h-4" />
                <a
                  href="https://vercel.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Open Vercel Dashboard
                </a>
              </div>

              <button
                onClick={() => setStep(2)}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Next: Get Environment Variables
              </button>
            </div>
          )}
        </div>

        {/* Step 2: Get Environment Variables */}
        <div className={`p-4 rounded-lg border-2 ${step >= 2 ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Step 2: Get KV Environment Variables</h3>
            <button
              onClick={() => setStep(2)}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              View
            </button>
          </div>

          {step === 2 && (
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>In your KV database page, click on the ".env.local" tab</li>
                <li>Copy the environment variables shown</li>
                <li>You should see three variables:</li>
              </ol>

              <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>KV_URL="..."</span>
                    <button onClick={() => copyToClipboard('KV_URL=""')} className="p-1 hover:bg-gray-200 rounded">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>KV_REST_API_URL="..."</span>
                    <button
                      onClick={() => copyToClipboard('KV_REST_API_URL=""')}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>KV_REST_API_TOKEN="..."</span>
                    <button
                      onClick={() => copyToClipboard('KV_REST_API_TOKEN=""')}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(3)}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Next: Add to Environment
              </button>
            </div>
          )}
        </div>

        {/* Step 3: Add to Environment */}
        <div className={`p-4 rounded-lg border-2 ${step >= 3 ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Step 3: Add Environment Variables</h3>
            <button
              onClick={() => setStep(3)}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              View
            </button>
          </div>

          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">For Local Development:</h4>
                <ol className="list-decimal list-inside space-y-1 text-yellow-700">
                  <li>
                    Open your <code>.env.local</code> file in your project root
                  </li>
                  <li>Replace the KV variables with the ones from Vercel</li>
                  <li>Save the file</li>
                  <li>
                    Restart your development server (<code>npm run dev</code>)
                  </li>
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">For Production (Vercel):</h4>
                <ol className="list-decimal list-inside space-y-1 text-blue-700">
                  <li>Go to your Vercel project settings</li>
                  <li>Click on "Environment Variables"</li>
                  <li>Add each KV variable (they should auto-populate when you connect the database)</li>
                  <li>Redeploy your application</li>
                </ol>
              </div>

              <button
                onClick={() => setStep(4)}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Next: Test Connection
              </button>
            </div>
          )}
        </div>

        {/* Step 4: Test Connection */}
        <div className={`p-4 rounded-lg border-2 ${step >= 4 ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Step 4: Test KV Connection</h3>
            <button
              onClick={() => setStep(4)}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              View
            </button>
          </div>

          {step === 4 && (
            <div className="space-y-4">
              <p className="text-gray-700">
                Click the button below to test if your KV database is properly configured:
              </p>

              <button
                onClick={testConnection}
                disabled={testing}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {testing ? "Testing..." : "Test KV Connection"}
              </button>

              {testResult && (
                <div
                  className={`p-4 rounded-lg border ${
                    testResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {testResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`font-semibold ${testResult.success ? "text-green-800" : "text-red-800"}`}>
                      {testResult.success ? "Connection Successful!" : "Connection Failed"}
                    </span>
                  </div>

                  {testResult.success ? (
                    <div className="text-green-700">
                      <p>✅ KV database is properly configured</p>
                      <p>✅ Current photos in database: {testResult.currentPhotosCount || 0}</p>
                      <p className="mt-2 font-semibold">You can now upload photos!</p>
                    </div>
                  ) : (
                    <div className="text-red-700">
                      <p>
                        <strong>Error:</strong> {testResult.error}
                      </p>
                      {testResult.hasUrl === false && <p>❌ KV_REST_API_URL is missing</p>}
                      {testResult.hasToken === false && <p>❌ KV_REST_API_TOKEN is missing</p>}
                      <p className="mt-2">Please complete the steps above to fix this issue.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Reference */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Quick Reference - Required Environment Variables:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <code className="bg-gray-200 px-2 py-1 rounded">KV_URL</code>
            <p className="text-gray-600 mt-1">Main KV connection URL</p>
          </div>
          <div>
            <code className="bg-gray-200 px-2 py-1 rounded">KV_REST_API_URL</code>
            <p className="text-gray-600 mt-1">REST API endpoint</p>
          </div>
          <div>
            <code className="bg-gray-200 px-2 py-1 rounded">KV_REST_API_TOKEN</code>
            <p className="text-gray-600 mt-1">Authentication token</p>
          </div>
        </div>
      </div>
    </div>
  )
}
