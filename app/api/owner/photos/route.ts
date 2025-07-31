import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("=== OWNER API: Fetching all photos ===")

    let photos = []

    // Try to get photos from KV database
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { kv } = await import("@vercel/kv")
        photos = (await kv.get<any[]>("photos")) || []
        console.log("OWNER API: Found photos in KV:", photos.length)
      } else {
        console.log("OWNER API: KV not available - missing environment variables")
        photos = []
      }
    } catch (kvError) {
      console.error("OWNER API: KV error:", kvError)
      photos = []
    }

    // Sort by creation date (newest first)
    const sortedPhotos = photos.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.uploadedAt || 0).getTime()
      const dateB = new Date(b.createdAt || b.uploadedAt || 0).getTime()
      return dateB - dateA
    })

    console.log("OWNER API: Returning photos:", sortedPhotos.length)
    return NextResponse.json({ success: true, photos: sortedPhotos })
  } catch (error) {
    console.error("OWNER API: Error fetching photos:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch photos",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== OWNER API: Adding new photo ===")

    const photoData = await request.json()
    console.log("OWNER API: Photo data received:", {
      title: photoData.title,
      category: photoData.category,
      hasImageUrl: !!photoData.imageUrl,
      hasCloudinaryId: !!photoData.cloudinaryPublicId,
    })

    // Validate required fields
    if (!photoData.title || !photoData.category || !photoData.imageUrl) {
      console.error("OWNER API: Missing required fields")
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title, category, and imageUrl are required",
        },
        { status: 400 },
      )
    }

    // Check KV availability
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.error("OWNER API: KV environment variables missing")
      return NextResponse.json(
        {
          success: false,
          error: "Database not configured. Please check KV environment variables.",
        },
        { status: 500 },
      )
    }

    let photos = []

    // Get existing photos
    try {
      const { kv } = await import("@vercel/kv")
      photos = (await kv.get<any[]>("photos")) || []
      console.log("OWNER API: Current photos in database:", photos.length)
    } catch (kvError) {
      console.error("OWNER API: Error getting existing photos:", kvError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to connect to database",
          details: kvError.message,
        },
        { status: 500 },
      )
    }

    // Create new photo object
    const newPhoto = {
      id: `photo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title: photoData.title.trim(),
      category: photoData.category,
      imageUrl: photoData.imageUrl,
      cloudinaryPublicId: photoData.cloudinaryPublicId || "",
      isActive: photoData.isActive !== undefined ? photoData.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log("OWNER API: New photo object created:", {
      id: newPhoto.id,
      title: newPhoto.title,
      category: newPhoto.category,
    })

    // Add to photos array
    const updatedPhotos = [...photos, newPhoto]

    // Save to KV
    try {
      const { kv } = await import("@vercel/kv")
      await kv.set("photos", updatedPhotos)
      console.log("OWNER API: Photo saved to KV successfully. Total photos:", updatedPhotos.length)
    } catch (saveError) {
      console.error("OWNER API: Failed to save photo:", saveError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to save photo to database",
          details: saveError.message,
        },
        { status: 500 },
      )
    }

    console.log("OWNER API: Photo added successfully:", newPhoto.id)
    return NextResponse.json({ success: true, photo: newPhoto }, { status: 201 })
  } catch (error) {
    console.error("OWNER API: Error adding photo:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to add photo",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("=== OWNER API: Updating photo ===")

    const { id, ...photoData } = await request.json()
    console.log("OWNER API: Updating photo ID:", id)

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Photo ID is required",
        },
        { status: 400 },
      )
    }

    let photos = []

    // Get existing photos
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { kv } = await import("@vercel/kv")
        photos = (await kv.get<any[]>("photos")) || []
      } else {
        return NextResponse.json(
          {
            success: false,
            error: "Database not available",
          },
          { status: 500 },
        )
      }
    } catch (kvError) {
      console.error("OWNER API: Error getting photos for update:", kvError)
      return NextResponse.json(
        {
          success: false,
          error: "Database error",
          details: kvError.message,
        },
        { status: 500 },
      )
    }

    // Find and update photo
    const photoIndex = photos.findIndex((p) => p.id === id)
    if (photoIndex === -1) {
      console.error("OWNER API: Photo not found:", id)
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

    // Save to KV
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { kv } = await import("@vercel/kv")
        await kv.set("photos", photos)
        console.log("OWNER API: Photo updated in KV successfully")
      } else {
        throw new Error("KV not available")
      }
    } catch (saveError) {
      console.error("OWNER API: Failed to update photo:", saveError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update photo in database",
          details: saveError.message,
        },
        { status: 500 },
      )
    }

    console.log("OWNER API: Photo updated successfully:", id)
    return NextResponse.json({ success: true, photo: updatedPhoto })
  } catch (error) {
    console.error("OWNER API: Error updating photo:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update photo",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("=== OWNER API: Deleting photo ===")

    const { id } = await request.json()
    console.log("OWNER API: Deleting photo ID:", id)

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Photo ID is required",
        },
        { status: 400 },
      )
    }

    let photos = []

    // Get existing photos
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { kv } = await import("@vercel/kv")
        photos = (await kv.get<any[]>("photos")) || []
      } else {
        return NextResponse.json(
          {
            success: false,
            error: "Database not available",
          },
          { status: 500 },
        )
      }
    } catch (kvError) {
      console.error("OWNER API: Error getting photos for deletion:", kvError)
      return NextResponse.json(
        {
          success: false,
          error: "Database error",
          details: kvError.message,
        },
        { status: 500 },
      )
    }

    // Filter out the photo to delete
    const filteredPhotos = photos.filter((p) => p.id !== id)

    if (filteredPhotos.length === photos.length) {
      console.error("OWNER API: Photo not found for deletion:", id)
      return NextResponse.json(
        {
          success: false,
          error: "Photo not found",
        },
        { status: 404 },
      )
    }

    // Save to KV
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { kv } = await import("@vercel/kv")
        await kv.set("photos", filteredPhotos)
        console.log("OWNER API: Photo deleted from KV successfully")
      } else {
        throw new Error("KV not available")
      }
    } catch (saveError) {
      console.error("OWNER API: Failed to delete photo:", saveError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to delete photo from database",
          details: saveError.message,
        },
        { status: 500 },
      )
    }

    console.log("OWNER API: Photo deleted successfully:", id)
    return NextResponse.json({ success: true, message: "Photo deleted successfully" })
  } catch (error) {
    console.error("OWNER API: Error deleting photo:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete photo",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
