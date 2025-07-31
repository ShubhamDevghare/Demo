"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, Play, Star } from "lucide-react"

const HeroSection = () => {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    // Auto-advance frames
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % 3)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const frames = [
    {
      id: 1,
      title: "Capturing Life's Precious Moments",
      subtitle: "Professional Photography Services",
      description: "Transform your special occasions into timeless memories with our artistic photography expertise.",
      cta: "Explore Our Work",
      background: "/placeholder.svg?height=800&width=1200",
      overlay: "bg-black/40",
    },
    {
      id: 2,
      title: "Wedding Photography Excellence",
      subtitle: "Your Love Story, Beautifully Told",
      description:
        "From intimate ceremonies to grand celebrations, we capture every emotion and detail of your special day.",
      cta: "View Wedding Gallery",
      background: "/placeholder.svg?height=800&width=1200",
      overlay: "bg-black/50",
    },
    {
      id: 3,
      title: "Professional Portfolio Shoots",
      subtitle: "Showcase Your Best Self",
      description: "Professional headshots and portfolio photography that makes you stand out in your industry.",
      cta: "Book Your Session",
      background: "/placeholder.svg?height=800&width=1200",
      overlay: "bg-black/45",
    },
  ]

  const currentFrameData = frames[currentFrame]

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{
          backgroundImage: `url(${currentFrameData.background})`,
          transform: "scale(1.1)",
        }}
      />
      <div className={`absolute inset-0 ${currentFrameData.overlay} transition-all duration-1000`} />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* Frame Content */}
            <div
              className={`transform transition-all duration-1000 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              {/* Subtitle */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-12 h-px bg-gold-400"></div>
                <span className="text-gold-400 text-sm font-medium tracking-wider uppercase">
                  {currentFrameData.subtitle}
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-playfair font-bold text-white mb-6 leading-tight">
                {currentFrameData.title}
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
                {currentFrameData.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-8 mb-8">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-gold-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-white text-sm">500+ Happy Clients</span>
                </div>
                <div className="text-white text-sm">
                  <span className="text-gold-400 font-bold text-lg">10+</span> Years Experience
                </div>
                <div className="text-white text-sm">
                  <span className="text-gold-400 font-bold text-lg">1000+</span> Events Captured
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/portfolio"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-medium rounded-full transition-all duration-300 hover:from-gold-600 hover:to-gold-700 hover:scale-105 group"
                >
                  <span>{currentFrameData.cta}</span>
                  <Play className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gold-600 border-2 border-gold-600 font-medium rounded-full transition-all duration-300 hover:bg-gold-50"
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frame Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-3">
          {frames.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentFrame(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentFrame ? "bg-gold-400 scale-125" : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-20 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/70" />
      </div>
    </section>
  )
}

export default HeroSection
