import { type NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dkqvrmxvh",
  api_key: process.env.CLOUDINARY_API_KEY || "293643239753871",
  api_secret: process.env.CLOUDINARY_API_SECRET || "p7-qvL0AzGnkFBXPUd-Ui_u1H_g",
})

export async function POST(request: NextRequest) {
  try {
    console.log("=== UPLOAD API: Starting image upload ===")

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.error("UPLOAD API: No file provided")
      return NextResponse.json(
        {
          success: false,
          error: "No file provided",
        },
        { status: 400 },
      )
    }

    console.log("UPLOAD API: File received:", {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      console.error("UPLOAD API: Invalid file type:", file.type)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Only JPEG, PNG, and WebP are allowed.",
        },
        { status: 400 },
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      console.error("UPLOAD API: File too large:", file.size)
      return NextResponse.json(
        {
          success: false,
          error: "File too large. Maximum size is 10MB.",
        },
        { status: 400 },
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log("UPLOAD API: File converted to buffer, size:", buffer.length)

    // Upload to Cloudinary
    console.log("UPLOAD API: Starting Cloudinary upload...")
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "sharp-images",
            resource_type: "auto",
            transformation: [
              { quality: "auto" },
              { fetch_format: "auto" },
              { width: 1200, height: 1200, crop: "limit" },
            ],
          },
          (error, result) => {
            if (error) {
              console.error("UPLOAD API: Cloudinary error:", error)
              reject(error)
            } else {
              console.log("UPLOAD API: Cloudinary success:", {
                public_id: result?.public_id,
                secure_url: result?.secure_url,
              })
              resolve(result)
            }
          },
        )
        .end(buffer)
    })

    const uploadResult = result as any

    console.log("UPLOAD API: Upload successful")
    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    })
  } catch (error) {
    console.error("UPLOAD API: Upload failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: `Upload failed: ${error.message}`,
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}
