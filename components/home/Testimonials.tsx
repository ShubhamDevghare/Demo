"use client"

import { useState, useEffect } from "react"
import { Star, Quote, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([])
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTestimonials()

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("testimonials-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (testimonials.length > 0) {
      // Auto-advance testimonials
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
      }, 6000)

      return () => clearInterval(interval)
    }
  }, [testimonials.length])

  const loadTestimonials = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/content/testimonials")
      const data = await response.json()

      if (data.success) {
        console.log("Loaded testimonials:", data.testimonials.length)
        setTestimonials(data.testimonials)
      } else {
        console.error("Failed to load testimonials:", data.error)
      }
    } catch (error) {
      console.error("Error loading testimonials:", error)
    } finally {
      setLoading(false)
    }
  }

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  if (loading) {
    return (
      <section id="testimonials-section" className="py-20 bg-gradient-to-br from-warm-50 to-gold-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto mb-4" />
              <p className="text-gray-600">Loading testimonials...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return null // Don't show section if no testimonials
  }

  return (
    <section id="testimonials-section" className="py-20 bg-gradient-to-br from-warm-50 to-gold-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-px bg-gold-400"></div>
            <span className="text-gold-600 text-sm font-medium tracking-wider uppercase">Client Stories</span>
            <div className="w-12 h-px bg-gold-400"></div>
          </div>
          <h2 className="text-4xl sm:text-5xl font-playfair font-bold text-gray-900 mb-6">What Our Clients Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients have to say about their experience with
            Sharp Images Photography.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div
            className={`p-8 lg:p-12 transform transition-all duration-1000 bg-white rounded-xl shadow-lg ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="text-center">
              {/* Quote Icon */}
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Quote className="w-8 h-8 text-gold-600" />
              </div>

              {/* Rating */}
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial]?.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-gold-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8 italic">
                "{testimonials[currentTestimonial]?.text}"
              </blockquote>

              {/* Client Info */}
              <div className="flex items-center justify-center space-x-4">
                <img
                  src={testimonials[currentTestimonial]?.image || "/placeholder.svg"}
                  alt={testimonials[currentTestimonial]?.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-gold-200"
                />
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 text-lg">{testimonials[currentTestimonial]?.name}</h4>
                  <p className="text-gray-600">{testimonials[currentTestimonial]?.role}</p>
                  <p className="text-gold-600 text-sm font-medium">{testimonials[currentTestimonial]?.event}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-gold-600 hover:shadow-xl transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-gold-600 hover:shadow-xl transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Testimonial Indicators */}
        {testimonials.length > 1 && (
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? "bg-gold-500 scale-125" : "bg-gray-300 hover:bg-gold-300"
                }`}
              />
            ))}
          </div>
        )}

        {/* Stats Section */}
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          {[
            { number: "500+", label: "Happy Clients" },
            { number: "1000+", label: "Events Captured" },
            { number: "10+", label: "Years Experience" },
            { number: "50+", label: "Awards Won" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-gold-600 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
