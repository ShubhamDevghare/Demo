"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, X, ImageIcon, Loader2, AlertCircle } from "lucide-react"
import { toast } from "react-hot-toast"

interface PhotoUploadProps {
  onPhotosUploaded: (urls: string[]) => void
  multiple?: boolean
  maxFiles?: number
}

export default function PhotoUpload({ onPhotosUploaded, multiple = false, maxFiles = 10 }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [error, setError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setError("")

    console.log("PhotoUpload: Files selected:", files.length)

    if (!multiple && files.length > 1) {
      setError("Please select only one file")
      toast.error("Please select only one file")
      return
    }

    if (files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      toast.error(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Validate file types
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    const invalidFiles = files.filter((file) => !validTypes.includes(file.type))

    if (invalidFiles.length > 0) {
      setError("Please select only image files (JPEG, PNG, WebP)")
      toast.error("Please select only image files (JPEG, PNG, WebP)")
      return
    }

    // Validate file sizes (max 10MB each)
    const oversizedFiles = files.filter((file) => file.size > 10 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setError("File size should be less than 10MB")
      toast.error("File size should be less than 10MB")
      return
    }

    setSelectedFiles(files)

    // Create preview URLs
    const urls = files.map((file) => URL.createObjectURL(file))
    setPreviewUrls(urls)

    console.log("PhotoUpload: Files validated and previews created")
  }

  const uploadToServer = async (file: File): Promise<string> => {
    console.log("PhotoUpload: Starting upload for file:", file.name)

    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    })

    console.log("PhotoUpload: Upload response status:", response.status)

    const data = await response.json()
    console.log("PhotoUpload: Upload response data:", data)

    if (!response.ok || !data.success) {
      console.error("PhotoUpload: Upload failed:", data)
      throw new Error(data.error || `Upload failed with status ${response.status}`)
    }

    if (!data.url) {
      throw new Error("No URL returned from upload server")
    }

    console.log("PhotoUpload: Upload successful:", data.url)
    return data.url
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select files to upload")
      toast.error("Please select files to upload")
      return
    }

    setUploading(true)
    setError("")

    try {
      console.log("PhotoUpload: Starting upload process for", selectedFiles.length, "files")

      let uploadedUrls: string[]

      if (multiple) {
        // Upload multiple files
        const uploadPromises = selectedFiles.map((file, index) => {
          console.log(`PhotoUpload: Uploading file ${index + 1}/${selectedFiles.length}:`, file.name)
          return uploadToServer(file)
        })

        uploadedUrls = await Promise.all(uploadPromises)
        console.log("PhotoUpload: All files uploaded successfully:", uploadedUrls.length)
      } else {
        // Upload single file
        const url = await uploadToServer(selectedFiles[0])
        uploadedUrls = [url]
        console.log("PhotoUpload: Single file uploaded successfully")
      }

      // Call the callback with uploaded URLs
      onPhotosUploaded(uploadedUrls)

      // Clear selections
      setSelectedFiles([])
      setPreviewUrls([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      toast.success(`${uploadedUrls.length} photo(s) uploaded successfully!`)
      console.log("PhotoUpload: Upload process completed successfully")
    } catch (error) {
      console.error("PhotoUpload: Upload error:", error)
      setError(error.message || "Upload failed")
      toast.error(error.message || "Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newUrls = previewUrls.filter((_, i) => i !== index)

    setSelectedFiles(newFiles)
    setPreviewUrls(newUrls)

    // Revoke the removed URL to free memory
    URL.revokeObjectURL(previewUrls[index])

    console.log("PhotoUpload: File removed, remaining:", newFiles.length)
  }

  const clearAll = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url))
    setSelectedFiles([])
    setPreviewUrls([])
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    console.log("PhotoUpload: All files cleared")
  }

  return (
    <div className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {/* File Input */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gold-400 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          id="photo-upload"
          disabled={uploading}
        />
        <label htmlFor="photo-upload" className={`cursor-pointer ${uploading ? "pointer-events-none opacity-50" : ""}`}>
          <div className="flex flex-col items-center space-y-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gold-600">Click to upload</span> or drag and drop
            </div>
            <div className="text-xs text-gray-500">
              {multiple ? `Up to ${maxFiles} images` : "Single image"} (JPEG, PNG, WebP, max 10MB each)
            </div>
          </div>
        </label>
      </div>

      {/* Preview Grid */}
      {previewUrls.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900">Selected Files ({selectedFiles.length})</h4>
            <button onClick={clearAll} className="text-sm text-red-600 hover:text-red-700" disabled={uploading}>
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {!uploading && (
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-black/50 text-white text-xs px-2 py-1 rounded truncate">
                    {selectedFiles[index].name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4" />
                <span>
                  Upload {selectedFiles.length} Photo{selectedFiles.length !== 1 ? "s" : ""}
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
