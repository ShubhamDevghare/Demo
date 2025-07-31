"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Camera, Heart, ArrowRight, Baby, Flower2, Users, Briefcase } from "lucide-react"

const ServicesShowcase = () => {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("services-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const handleBookService = () => {
    router.push("/contact")
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
  }

  const services = [
    {
      icon: Heart,
      title: "Pre-Wedding Photography",
      description: "Romantic and intimate photography sessions before your big day to capture your love story.",
      features: [
        "Couple consultation",
        "Location scouting",
        "Romantic poses & candid shots",
        "Multiple outfit changes",
      ],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      icon: Camera,
      title: "Wedding Photography",
      description: "Complete wedding day coverage capturing every precious moment of your special celebration.",
      features: ["Full ceremony coverage", "Reception photography", "Bridal portraits", "Family group photos"],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      icon: Flower2,
      title: "Post-Wedding Photography",
      description: "Beautiful post-wedding sessions to capture your joy as newlyweds in stunning locations.",
      features: [
        "Newlywed couple shoots",
        "Traditional attire photography",
        "Scenic location shoots",
        "Creative compositions",
      ],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      icon: Baby,
      title: "Maternity Shoots",
      description: "Celebrate the beautiful journey of motherhood with elegant and artistic maternity photography.",
      features: [
        "Maternity consultation",
        "Studio & outdoor options",
        "Partner & family inclusion",
        "Wardrobe guidance",
      ],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      icon: Users,
      title: "Baby Shower Photography",
      description: "Capture the joy and excitement of celebrating your upcoming bundle of joy with family and friends.",
      features: ["Event setup photography", "Guest interactions", "Gift opening moments", "Decorations & details"],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      icon: Baby,
      title: "Baby Shoots",
      description: "Precious newborn and baby photography capturing those fleeting early moments of your little one.",
      features: [
        "Newborn safety protocols",
        "Gentle handling techniques",
        "Props & accessories",
        "Family inclusion shots",
      ],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      icon: Camera,
      title: "Event Photography",
      description: "Professional coverage of your special events, parties, and celebrations with artistic flair.",
      features: ["Event timeline planning", "Key moment capture", "Guest photography", "Venue & decoration shots"],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      icon: Briefcase,
      title: "Corporate Photography",
      description: "Professional business photography for corporate events, headshots, and company branding needs.",
      features: ["Corporate headshots", "Business event coverage", "Team photography", "Product photography"],
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  return (
    <section id="services-section" className="py-20 bg-gradient-to-br from-warm-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-px bg-gold-400"></div>
            <span className="text-gold-600 text-sm font-medium tracking-wider uppercase">Our Services</span>
            <div className="w-12 h-px bg-gold-400"></div>
          </div>
          <h2 className="text-4xl sm:text-5xl font-playfair font-bold text-gray-900 mb-6">
            Professional Photography Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From intimate moments to grand celebrations, we specialize in capturing life's most precious memories with
            artistic excellence and professional dedication.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className={`group cursor-pointer transform transition-all duration-500 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Service Icon */}
                  <div className="absolute top-6 left-6">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-playfair font-bold text-gray-900 mb-3 group-hover:text-gold-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed text-sm">{service.description}</p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={handleBookService}
                    className="inline-flex items-center justify-center w-full px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-full transition-all duration-300 hover:border-gold-400 hover:text-gold-600 group-hover:bg-gold-50 text-sm"
                  >
                    <span>Book This Service</span>
                    <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
        <div
          className={`text-center transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 text-white shadow-2xl">
            <h3 className="text-4xl sm:text-5xl font-playfair font-bold mb-6 leading-tight text-white">
              Ready to Capture Your Moments?
            </h3>
            <p className="text-lg sm:text-xl text-emerald-100 max-w-2xl mx-auto mb-8 leading-relaxed">
              Let's discuss your photography needs and create something beautiful together. Get in touch for a
              personalized consultation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <button
                onClick={handleBookService}
                className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-full hover:bg-emerald-50 transition-all duration-200 shadow-lg text-lg"
              >
                Get Free Consultation
              </button>

              <Link
                href="/portfolio"
                className="px-8 py-4 text-white border-2 border-white font-bold rounded-full hover:bg-white/10 transition-all duration-200 text-lg"
              >
                View Our Portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServicesShowcase
