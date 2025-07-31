"use client"

import { useRouter } from "next/navigation"
import Header from "@/components/common/Header"
import Footer from "@/components/common/Footer"
import { Camera, Heart, Baby, Flower2, Users, Briefcase } from "lucide-react"

export default function ServicesPage() {
  const router = useRouter()

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
        "Professional editing",
        "High-resolution images",
      ],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      icon: Camera,
      title: "Wedding Photography",
      description: "Complete wedding day coverage capturing every precious moment of your special celebration.",
      features: [
        "Full ceremony coverage",
        "Reception photography",
        "Bridal portraits",
        "Family group photos",
        "Candid moments",
        "Online gallery delivery",
      ],
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
        "Professional retouching",
        "Print-ready files",
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
        "Artistic compositions",
        "Gentle posing techniques",
      ],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      icon: Users,
      title: "Baby Shower Photography",
      description: "Capture the joy and excitement of celebrating your upcoming bundle of joy with family and friends.",
      features: [
        "Event setup photography",
        "Guest interactions",
        "Gift opening moments",
        "Decorations & details",
        "Group photos",
        "Candid celebrations",
      ],
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
        "Multiple poses",
        "Soft, natural lighting",
      ],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      icon: Camera,
      title: "Event Photography",
      description: "Professional coverage of your special events, parties, and celebrations with artistic flair.",
      features: [
        "Event timeline planning",
        "Key moment capture",
        "Guest photography",
        "Venue & decoration shots",
        "Candid & posed photos",
        "Quick turnaround",
      ],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      icon: Briefcase,
      title: "Corporate Photography",
      description: "Professional business photography for corporate events, headshots, and company branding needs.",
      features: [
        "Corporate headshots",
        "Business event coverage",
        "Team photography",
        "Product photography",
        "Office environment shots",
        "Professional editing",
      ],
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold mb-6">Our Photography Services</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Professional photography services tailored to capture your most precious moments
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-playfair font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{service.description}</p>

                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-gray-700">
                          <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={handleBookService}
                      className="w-full bg-gold-500 text-white py-3 rounded-full font-medium hover:bg-gold-600 transition-colors text-center block"
                    >
                      Book This Service
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
