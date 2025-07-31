import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dkqvrmxvh",
  api_key: "293643239753871",
  api_secret: "p7-qvL0AzGnkFBXPUd-Ui_u1H_g",
})

export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataURI = `data:${file.type};base64,${base64}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "sharp-images",
      resource_type: "auto",
      transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
    })

    return result.secure_url
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    throw new Error("Upload failed")
  }
}

export const uploadMultipleToCloudinary = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadToCloudinary(file))
  return Promise.all(uploadPromises)
}

export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result.result === "ok"
  } catch (error) {
    console.error("Cloudinary delete error:", error)
    return false
  }
}
