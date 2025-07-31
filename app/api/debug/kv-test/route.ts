import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("=== KV TEST: Starting ===")

    const testData = {
      timestamp: new Date().toISOString(),
      test: "KV connection test",
    }

    // Check environment variables
    const kvUrl = process.env.KV_REST_API_URL
    const kvToken = process.env.KV_REST_API_TOKEN

    console.log("KV TEST: Environment check:", {
      hasUrl: !!kvUrl,
      hasToken: !!kvToken,
      urlPrefix: kvUrl ? kvUrl.substring(0, 20) + "..." : "missing",
    })

    if (!kvUrl || !kvToken) {
      return NextResponse.json({
        success: false,
        error: "KV environment variables not set",
        hasUrl: !!kvUrl,
        hasToken: !!kvToken,
      })
    }

    // Try to use KV
    const { kv } = await import("@vercel/kv")

    // Test write
    await kv.set("test_key", testData)
    console.log("KV TEST: Write successful")

    // Test read
    const readData = await kv.get("test_key")
    console.log("KV TEST: Read successful")

    // Clean up
    await kv.del("test_key")
    console.log("KV TEST: Cleanup successful")

    return NextResponse.json({
      success: true,
      message: "KV is working correctly",
      testData: readData,
    })
  } catch (error) {
    console.error("KV TEST: Error:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.toString(),
    })
  }
}
