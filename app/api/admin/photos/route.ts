import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    let photos = []

    // Try to use Vercel KV if available
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { kv } = await import("@vercel/kv")
        photos = (await kv.get<any[]>("photos")) || []
        console.log("Using KV for admin photos, found:", photos.length)
      }
    } catch (kvError) {
      console.log("KV not available for admin photos")
      photos = []
    }

    // Sort by creation date (newest first)
    const sortedPhotos = photos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ success: true, photos: sortedPhotos })
  } catch (error) {
    console.error("Error fetching admin photos:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch photos",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const photoData = await request.json()

    let photos = []

    // Try to get existing photos
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { kv } = await import("@vercel/kv")
        photos = (await kv.get<any[]>("photos")) || []
      }
    } catch (kvError) {
      photos = []
    }

    const newPhoto = {
      id: `photo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title: photoData.title,
      category: photoData.category,
      imageUrl: photoData.imageUrl,
      cloudinaryPublicId: photoData.cloudinaryPublicId,
      isActive: photoData.isActive !== undefined ? photoData.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedPhotos = [...photos, newPhoto]

    // Try to save to KV
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { kv } = await import("@vercel/kv")
        await kv.set("photos", updatedPhotos)
        console.log("Photo saved to KV")
      }
    } catch (saveError) {
      console.log("Failed to save to KV:", saveError.message)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to save photo to database",
        },
        { status: 500 },
      )
    }

    console.log("New photo added:", newPhoto)
    return NextResponse.json({ success: true, photo: newPhoto }, { status: 201 })
  } catch (error) {
    console.error("Error adding photo:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to add photo",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...photoData } = await request.json()

    let photos = []

    // Try to get existing photos
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { kv } = await import("@vercel/kv")
        photos = (await kv.get<any[]>("photos")) || []
      }
    } catch (kvError) {
      photos = []
    }

    const photoIndex = photos.findIndex((p) => p.id === id)

    if (photoIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Photo not found",
        },
        { status: 404 },
      )
    }

    const updatedPhoto = {
      ...photos[photoIndex],
      ...photoData,
      updatedAt: new Date().toISOString(),
    }

    photos[photoIndex] = updatedPhoto

    // Try to save to KV
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { kv } = await import("@vercel/kv")
        await kv.set("photos", photos)
        console.log("Photo updated in KV")
      }
    } catch (saveError) {
      console.log("Failed to save to KV:", saveError.message)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update photo in database",
        },
        { status: 500 },
      )
    }

    console.log("Photo updated:", updatedPhoto)
    return NextResponse.json({ success: true, photo: updatedPhoto })
  } catch (error) {
    console.error("Error updating photo:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update photo",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    let photos = []

    // Try to get existing photos
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { kv } = await import("@vercel/kv")
        photos = (await kv.get<any[]>("photos")) || []
      }
    } catch (kvError) {
      photos = []
    }

    const filteredPhotos = photos.filter((p) => p.id !== id)

    if (filteredPhotos.length === photos.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Photo not found",
        },
        { status: 404 },
      )
    }

    // Try to save to KV
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { kv } = await import("@vercel/kv")
        await kv.set("photos", filteredPhotos)
        console.log("Photo deleted from KV")
      }
    } catch (saveError) {
      console.log("Failed to save to KV:", saveError.message)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to delete photo from database",
        },
        { status: 500 },
      )
    }

    console.log("Photo deleted, ID:", id)
    return NextResponse.json({
      success: true,
      message: "Photo deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting photo:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete photo",
      },
      { status: 500 },
    )
  }
}
