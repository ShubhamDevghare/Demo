import { type NextRequest, NextResponse } from "next/server"
import type { GalleryImage } from "@/lib/types"
import { getAllPhotos, initializeSampleData } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    // Initialize sample data if needed
    await initializeSampleData()

    const photos = await getAllPhotos()

    // Sort by creation date (newest first)
    const sortedPhotos = photos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      content: sortedPhotos,
      totalPages: 1,
      totalElements: sortedPhotos.length,
      last: true,
    })
  } catch (error) {
    console.error("Error fetching gallery images:", error)
    return NextResponse.json({ error: "Failed to fetch gallery images" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const image: GalleryImage = {
      id: Date.now(),
      title: body.title,
      imageUrl: body.imageUrl,
      category: body.category || "",
      isActive: body.isActive !== undefined ? body.isActive : true,
      uploadedAt: new Date().toISOString(),
    }

    // This would normally save to database
    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error("Error creating gallery image:", error)
    return NextResponse.json({ error: "Failed to create gallery image" }, { status: 500 })
  }
}
