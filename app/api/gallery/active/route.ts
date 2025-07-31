import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("Fetching active photos for public gallery...")

    let photos = []

    // Try to get photos from KV database
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { kv } = await import("@vercel/kv")
        photos = (await kv.get<any[]>("photos")) || []
        console.log("Found photos in KV:", photos.length)
      } else {
        console.log("KV not available, using fallback data")
        // Fallback sample data if KV is not available
        photos = [
          {
            id: "photo_1",
            title: "Pre-Wedding Romance",
            category: "pre-wedding",
            imageUrl: "/placeholder.svg?height=300&width=300&text=Pre-Wedding+Photo",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "photo_2",
            title: "Wedding Ceremony",
            category: "wedding",
            imageUrl: "/placeholder.svg?height=300&width=300&text=Wedding+Photo",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "photo_3",
            title: "Post-Wedding Bliss",
            category: "post-wedding",
            imageUrl: "/placeholder.svg?height=300&width=300&text=Post-Wedding+Photo",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "photo_4",
            title: "Maternity Glow",
            category: "maternity",
            imageUrl: "/placeholder.svg?height=300&width=300&text=Maternity+Photo",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "photo_5",
            title: "Baby Shower Joy",
            category: "baby-shower",
            imageUrl: "/placeholder.svg?height=300&width=300&text=Baby+Shower+Photo",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "photo_6",
            title: "Newborn Baby",
            category: "baby-shoots",
            imageUrl: "/placeholder.svg?height=300&width=300&text=Baby+Photo",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "photo_7",
            title: "Special Event",
            category: "event",
            imageUrl: "/placeholder.svg?height=300&width=300&text=Event+Photo",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "photo_8",
            title: "Corporate Meeting",
            category: "corporate",
            imageUrl: "/placeholder.svg?height=300&width=300&text=Corporate+Photo",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]
      }
    } catch (kvError) {
      console.error("KV error:", kvError)
      photos = []
    }

    // Filter only active photos
    const activePhotos = photos.filter((photo) => photo.isActive === true)
    console.log("Active photos found:", activePhotos.length)

    // Sort by creation date (newest first)
    const sortedPhotos = activePhotos.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.uploadedAt || 0).getTime()
      const dateB = new Date(b.createdAt || b.uploadedAt || 0).getTime()
      return dateB - dateA
    })

    console.log("Returning sorted active photos:", sortedPhotos.length)
    return NextResponse.json(sortedPhotos)
  } catch (error) {
    console.error("Error fetching active gallery images:", error)
    return NextResponse.json({ error: "Failed to fetch active gallery images" }, { status: 500 })
  }
}
