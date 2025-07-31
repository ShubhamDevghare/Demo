import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("=== DEBUG: Checking photo database ===")

    let photos = []
    let kvStatus = "Not Available"

    // Check KV availability
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      kvStatus = "Available"
      try {
        const { kv } = await import("@vercel/kv")
        photos = (await kv.get<any[]>("photos")) || []
        console.log("DEBUG: KV photos found:", photos.length)
      } catch (kvError) {
        kvStatus = `Error: ${kvError.message}`
        console.error("DEBUG: KV Error:", kvError)
      }
    }

    const debugInfo = {
      kvStatus,
      totalPhotos: photos.length,
      activePhotos: photos.filter((p) => p.isActive).length,
      categories: {},
      photos: photos.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        isActive: p.isActive,
        hasImageUrl: !!p.imageUrl,
        createdAt: p.createdAt,
      })),
    }

    // Count photos by category
    photos.forEach((photo) => {
      if (photo.category) {
        debugInfo.categories[photo.category] = (debugInfo.categories[photo.category] || 0) + 1
      }
    })

    console.log("DEBUG: Categories breakdown:", debugInfo.categories)

    return NextResponse.json(debugInfo)
  } catch (error) {
    console.error("DEBUG: Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
