"use client"

import { useState, useEffect } from "react"
import Header from "@/components/common/Header"
import Footer from "@/components/common/Footer"
import { Eye, X, Loader2 } from "lucide-react"

export default function PortfolioPage() {
  const [portfolioImages, setPortfolioImages] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedImage, setSelectedImage] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categories = [
    { id: "all", name: "All Work" },
    { id: "pre-wedding", name: "Pre-Wedding Photography" },
    { id: "wedding", name: "Wedding Photography" },
    { id: "post-wedding", name: "Post-Wedding Photography" },
    { id: "maternity", name: "Maternity Shoots" },
    { id: "baby-shower", name: "Baby Shower Photography" },
    { id: "baby-shoots", name: "Baby Shoots" },
    { id: "event", name: "Event Photography" },
    { id: "corporate", name: "Corporate Photography" },
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
    loadPortfolioImages()
  }, [selectedCategory])

  const loadPortfolioImages = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/gallery/active")

      if (response.ok) {
        const data = await response.json()

        // Filter by category if not "all"
        let filteredPhotos = data
        if (selectedCategory !== "all") {
          filteredPhotos = data.filter((photo) => photo.category === selectedCategory)
        }

        setPortfolioImages(filteredPhotos)
      } else {
        throw new Error("Failed to load photos")
      }
    } catch (error) {
      console.error("Error loading portfolio images:", error)
      setError("Failed to load portfolio. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const openModal = (image) => {
    setSelectedImage(image)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedImage(null)
    setShowModal(false)
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
    return false
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold mb-6">Our Portfolio</h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Browse through our collection of captured moments and artistic photography
              </p>
            </div>
          </div>
        </section>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadPortfolioImages}
              className="px-6 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold mb-6">Our Portfolio</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Browse through our collection of captured moments and artistic photography
            </p>
          </div>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                disabled={loading}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 text-sm disabled:opacity-50 ${
                  selectedCategory === category.id
                    ? "bg-gold-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gold-100 hover:text-gold-700"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto mb-4" />
                <p className="text-gray-600">Loading portfolio...</p>
              </div>
            </div>
          )}

          {/* Portfolio Grid */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {portfolioImages.map((image) => (
                <div
                  key={image.id}
                  className="group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                  onClick={() => openModal(image)}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={image.imageUrl || "/placeholder.svg"}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 select-none"
                      onContextMenu={handleContextMenu}
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-gold-500 text-white text-xs px-2 py-1 rounded-full">
                        {categoryLabels[image.category] || image.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-semibold text-gray-900">{image.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Photos Message */}
          {!loading && portfolioImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {selectedCategory === "all"
                  ? "No photos available yet."
                  : `No photos available in ${categories.find((c) => c.id === selectedCategory)?.name} category.`}
              </p>
              <p className="text-gray-400">Check back soon for new additions to our portfolio.</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {showModal && selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage.imageUrl || "/placeholder.svg"}
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain select-none"
              onContextMenu={handleContextMenu}
              draggable={false}
            />
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold">{selectedImage.title}</h3>
              <p className="text-sm text-gray-300">
                {categoryLabels[selectedImage.category] || selectedImage.category}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
