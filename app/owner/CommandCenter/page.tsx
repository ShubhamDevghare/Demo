"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, LogOut, Upload, X, AlertCircle, ExternalLink } from "lucide-react"
import { toast } from "react-hot-toast"
import PhotoUpload from "@/components/admin/PhotoUpload"
import Image from "next/image"
import UploadDebug from "@/components/debug/UploadDebug"

export default function CommandCenter() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [kvStatus, setKvStatus] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState(null)
  const [newPhoto, setNewPhoto] = useState({ title: "", category: "", imageUrl: "", cloudinaryPublicId: "" })
  const [bulkUploadData, setBulkUploadData] = useState({ category: "", titles: [] })
  const router = useRouter()

  const categories = [
    "pre-wedding",
    "wedding",
    "post-wedding",
    "maternity",
    "baby-shower",
    "baby-shoots",
    "event",
    "corporate",
  ]

  const categoryLabels = {
    "pre-wedding": "Pre-Wedding Photography",
    wedding: "Wedding Photography",
    "post-wedding": "Post-Wedding Photography",
    maternity: "Maternity Shoots",
    "baby-shower": "Baby Shower Photography",
    "baby-shoots": "Baby Shoots",
    event: "Event Photography",
    corporate: "Corporate Photography",
  }

  useEffect(() => {
    // Check if owner is authenticated
    const token = localStorage.getItem("ownerToken")
    if (!token) {
      router.push("/owner")
      return
    }

    checkKVStatus()
    loadPhotos()
  }, [])

  const checkKVStatus = async () => {
    try {
      const response = await fetch("/api/debug/kv-connection")
      const data = await response.json()
      setKvStatus(data)
    } catch (error) {
      setKvStatus({ success: false, error: error.message })
    }
  }

  const loadPhotos = async () => {
    try {
      setLoading(true)
      console.log("Loading photos for Command Center...")

      const response = await fetch("/api/owner/photos")
      console.log("Owner photos API response status:", response.status)

      const data = await response.json()
      console.log("Owner photos API response data:", data)

      if (data.success) {
        setPhotos(data.photos)
        console.log("Command Center photos loaded:", data.photos.length)
      } else {
        console.error("Failed to load photos:", data.error)
        toast.error("Failed to load photos")
      }
    } catch (error) {
      console.error("Error loading photos:", error)
      toast.error("Failed to load photos")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("ownerToken")
    router.push("/owner")
    toast.success("Logged out successfully")
  }

  const handleSinglePhotoUploaded = (urls: string[]) => {
    if (urls.length > 0) {
      // Extract Cloudinary public ID from URL
      const url = urls[0]
      const publicId = url.split("/").pop()?.split(".")[0] || ""

      setNewPhoto({
        ...newPhoto,
        imageUrl: url,
        cloudinaryPublicId: publicId,
      })
    }
  }

  const handleBulkPhotosUploaded = async (urls: string[]) => {
    if (!bulkUploadData.category) {
      toast.error("Please select a category first")
      return
    }

    try {
      const uploadPromises = urls.map(async (url, index) => {
        const publicId = url.split("/").pop()?.split(".")[0] || ""

        return fetch("/api/owner/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: bulkUploadData.titles[index] || `Photo ${index + 1}`,
            category: bulkUploadData.category,
            imageUrl: url,
            cloudinaryPublicId: publicId,
            isActive: true,
          }),
        })
      })

      await Promise.all(uploadPromises)

      setBulkUploadData({ category: "", titles: [] })
      setShowBulkUploadModal(false)
      await loadPhotos()
      toast.success(`${urls.length} photos added successfully!`)
    } catch (error) {
      console.error("Error adding bulk photos:", error)
      toast.error("Failed to add photos")
    }
  }

  const handleAddPhoto = async () => {
    if (!newPhoto.title || !newPhoto.category || !newPhoto.imageUrl) {
      toast.error("Please fill all fields and upload an image")
      return
    }

    try {
      console.log("Command Center: Adding photo with data:", {
        title: newPhoto.title,
        category: newPhoto.category,
        hasImageUrl: !!newPhoto.imageUrl,
      })

      const response = await fetch("/api/owner/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPhoto),
      })

      console.log("Command Center: Add photo response status:", response.status)

      const data = await response.json()
      console.log("Command Center: Add photo response data:", data)

      if (data.success) {
        setNewPhoto({ title: "", category: "", imageUrl: "", cloudinaryPublicId: "" })
        setShowAddModal(false)
        await loadPhotos()
        toast.success("Photo added successfully!")
      } else {
        console.error("Command Center: Failed to add photo:", data.error)
        toast.error(data.error || "Failed to add photo")
      }
    } catch (error) {
      console.error("Command Center: Error adding photo:", error)
      toast.error("Network error. Please check your connection and try again.")
    }
  }

  const handleEditPhoto = (photo) => {
    setEditingPhoto(photo)
    setNewPhoto({ ...photo })
    setShowAddModal(true)
  }

  const handleUpdatePhoto = async () => {
    if (!newPhoto.title || !newPhoto.category || !newPhoto.imageUrl) {
      toast.error("Please fill all fields")
      return
    }

    try {
      const response = await fetch("/api/owner/photos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingPhoto.id, ...newPhoto }),
      })

      const data = await response.json()

      if (data.success) {
        setEditingPhoto(null)
        setNewPhoto({ title: "", category: "", imageUrl: "", cloudinaryPublicId: "" })
        setShowAddModal(false)
        await loadPhotos()
        toast.success("Photo updated successfully!")
      } else {
        toast.error("Failed to update photo")
      }
    } catch (error) {
      console.error("Error updating photo:", error)
      toast.error("Failed to update photo")
    }
  }

  const handleDeletePhoto = async (id) => {
    if (!confirm("Are you sure you want to delete this photo?")) {
      return
    }

    try {
      const response = await fetch("/api/owner/photos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      const data = await response.json()

      if (data.success) {
        await loadPhotos()
        toast.success("Photo deleted successfully!")
      } else {
        toast.error("Failed to delete photo")
      }
    } catch (error) {
      console.error("Error deleting photo:", error)
      toast.error("Failed to delete photo")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading photos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/sharp-images-logo.png"
                alt="Sharp Images Photography and Films"
                width={200}
                height={80}
                className="h-16 w-auto object-contain"
                priority
              />
              <h1 className="text-2xl font-playfair font-bold text-gray-900">Command Center</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* KV Status Alert */}
      {kvStatus && !kvStatus.success && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Database Not Configured</h3>
                <p className="text-sm text-red-700 mt-1">
                  Your Vercel KV database is not properly configured. Photo uploads will not work.
                </p>
              </div>
              <a
                href="/setup"
                target="_blank"
                className="flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                rel="noreferrer"
              >
                <span>Setup Guide</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Debug Section - Remove this in production */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <UploadDebug />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Photo Gallery Management ({photos.length} photos)</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowBulkUploadModal(true)}
              disabled={!kvStatus?.success}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              <span>Bulk Upload</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              disabled={!kvStatus?.success}
              className="flex items-center space-x-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Add Single Photo</span>
            </button>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={photo.imageUrl || "/placeholder.svg"}
                  alt={photo.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEditPhoto(photo)}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {!photo.isActive && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Inactive</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">{photo.title}</h3>
                <span className="inline-block px-2 py-1 bg-gold-100 text-gold-800 text-xs rounded-full">
                  {categoryLabels[photo.category] || photo.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {photos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No photos uploaded yet.</p>
            <p className="text-gray-400">
              {kvStatus?.success
                ? 'Click "Add Single Photo" or "Bulk Upload" to get started.'
                : "Please configure your database first using the setup guide above."}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Single Photo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">{editingPhoto ? "Edit Photo" : "Add New Photo"}</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={newPhoto.title}
                  onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="Photo title"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Category</label>
                <select
                  value={newPhoto.category}
                  onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {categoryLabels[cat]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Photo Upload</label>
                {newPhoto.imageUrl ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={newPhoto.imageUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setNewPhoto({ ...newPhoto, imageUrl: "", cloudinaryPublicId: "" })}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <PhotoUpload onPhotosUploaded={handleSinglePhotoUploaded} multiple={false} />
                )}
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingPhoto(null)
                  setNewPhoto({ title: "", category: "", imageUrl: "", cloudinaryPublicId: "" })
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingPhoto ? handleUpdatePhoto : handleAddPhoto}
                className="flex-1 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
              >
                {editingPhoto ? "Update" : "Add"} Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Bulk Photo Upload</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Category for All Photos</label>
                <select
                  value={bulkUploadData.category}
                  onChange={(e) => setBulkUploadData({ ...bulkUploadData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {categoryLabels[cat]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Upload Multiple Photos</label>
                <PhotoUpload onPhotosUploaded={handleBulkPhotosUploaded} multiple={true} maxFiles={20} />
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowBulkUploadModal(false)
                  setBulkUploadData({ category: "", titles: [] })
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
