"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"

const PortfolioShowcase = () => {
  const [portfolioImages, setPortfolioImages] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )
    const element = document.getElementById("portfolio-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    loadPortfolioImages()
  }, [selectedCategory])

  const loadPortfolioImages = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Loading portfolio images for category:", selectedCategory)

      const response = await fetch("/api/gallery/active")
      console.log("Portfolio API response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Portfolio API response data:", data)

        // Filter by category if not "all"
        let filteredPhotos = data
        if (selectedCategory !== "all") {
          filteredPhotos = data.filter((photo) => photo.category === selectedCategory)
          console.log(`Filtered photos for ${selectedCategory}:`, filteredPhotos.length)
        }

        // Show only first 8 images for home page
        const limitedPhotos = filteredPhotos.slice(0, 8)
        setPortfolioImages(limitedPhotos)
        console.log("Final portfolio images:", limitedPhotos.length)
      } else {
        throw new Error(`API responded with status: ${response.status}`)
      }
    } catch (error) {
      console.error("Error loading portfolio images:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
    return false
  }

  return (
    <section id="portfolio-section" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-px bg-gold-400"></div>
            <span className="text-gold-600 text-sm font-medium tracking-wider uppercase">Our Portfolio</span>
            <div className="w-12 h-px bg-gold-400"></div>
          </div>
          <h2 className="text-4xl sm:text-5xl font-playfair font-bold text-gray-900 mb-6">Moments We've Captured</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every photograph tells a story. Browse through our collection of captured moments that showcase our passion
            for preserving life's most beautiful memories.
          </p>
        </div>

        <div
          className={`flex flex-wrap justify-center gap-3 mb-12 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto mb-4" />
              <p className="text-gray-600">Loading portfolio...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <button
                onClick={loadPortfolioImages}
                className="px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {portfolioImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`group overflow-hidden transform transition-all duration-500 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={image.imageUrl || "/placeholder.svg"}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 select-none"
                      onContextMenu={handleContextMenu}
                      draggable={false}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-gold-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {categoryLabels[image.category] || image.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-gold-600 transition-colors duration-300">
                      {image.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {portfolioImages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {selectedCategory === "all"
                    ? "No photos available yet."
                    : `No photos available in ${categories.find((c) => c.id === selectedCategory)?.name} category.`}
                </p>
                <p className="text-gray-400">Check back soon for new additions to our portfolio.</p>
              </div>
            )}
          </>
        )}

        <div
          className={`text-center transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-medium rounded-full transition-all duration-300 hover:from-gold-600 hover:to-gold-700 hover:scale-105"
          >
            View Complete Portfolio
          </Link>
        </div>
      </div>
    </section>
  )
}

export default PortfolioShowcase
