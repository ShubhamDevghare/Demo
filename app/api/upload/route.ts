import { type NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dkqvrmxvh",
  api_key: "293643239753871",
  api_secret: "p7-qvL0AzGnkFBXPUd-Ui_u1H_g",
})

export async function POST(request: NextRequest) {
  try {
    const { image, folder = "sharp-images" } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: folder,
      resource_type: "auto",
      transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    })
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { public_id } = await request.json()

    if (!public_id) {
      return NextResponse.json({ error: "No public_id provided" }, { status: 400 })
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id)

    return NextResponse.json({
      success: true,
      result: result,
    })
  } catch (error) {
    console.error("Cloudinary delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
