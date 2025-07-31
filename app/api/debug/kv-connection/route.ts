import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("=== KV CONNECTION TEST ===")

    // Check environment variables
    const kvUrl = process.env.KV_REST_API_URL
    const kvToken = process.env.KV_REST_API_TOKEN

    console.log("Environment variables:", {
      hasUrl: !!kvUrl,
      hasToken: !!kvToken,
      urlPrefix: kvUrl ? kvUrl.substring(0, 30) + "..." : "missing",
      tokenPrefix: kvToken ? kvToken.substring(0, 10) + "..." : "missing",
    })

    if (!kvUrl || !kvToken) {
      return NextResponse.json({
        success: false,
        error: "KV environment variables not configured",
        hasUrl: !!kvUrl,
        hasToken: !!kvToken,
        message: "Please add KV_REST_API_URL and KV_REST_API_TOKEN to your environment variables",
      })
    }

    // Test KV connection
    const { kv } = await import("@vercel/kv")

    // Test write
    const testKey = `test_${Date.now()}`
    const testData = { test: true, timestamp: new Date().toISOString() }

    await kv.set(testKey, testData)
    console.log("KV write test successful")

    // Test read
    const readData = await kv.get(testKey)
    console.log("KV read test successful")

    // Test delete
    await kv.del(testKey)
    console.log("KV delete test successful")

    // Get current photos count
    const photos = (await kv.get<any[]>("photos")) || []

    return NextResponse.json({
      success: true,
      message: "KV connection is working properly",
      currentPhotosCount: photos.length,
      testData: readData,
    })
  } catch (error) {
    console.error("KV connection test failed:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.toString(),
    })
  }
}
