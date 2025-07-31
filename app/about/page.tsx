import Header from "@/components/common/Header"
import Footer from "@/components/common/Footer"
import { Camera, Award, Users, Clock } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold mb-6">About Sharp Images</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Capturing life's precious moments with artistic excellence and professional dedication
            </p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Sharp Images Photography was founded with a passion for capturing life's most precious moments. With
                over 10 years of experience in the photography industry, we have built a reputation for delivering
                exceptional quality and artistic excellence.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our team of professional photographers specializes in wedding photography, birthday celebrations, and
                professional portfolio shoots. We believe that every moment tells a story, and we're here to help you
                preserve those memories forever.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Based in Amravati, Maharashtra, we serve clients across the region, bringing our expertise and creative
                vision to every project we undertake.
              </p>
            </div>
            <div>
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="About Sharp Images"
                className="w-full rounded-xl shadow-lg"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              { icon: Users, number: "500+", label: "Happy Clients" },
              { icon: Camera, number: "1000+", label: "Events Captured" },
              { icon: Clock, number: "10+", label: "Years Experience" },
              { icon: Award, number: "50+", label: "Awards Won" },
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-gold-600" />
                  </div>
                  <div className="text-3xl font-bold text-gold-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              )
            })}
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To capture and preserve life's most precious moments through artistic photography, creating timeless
                memories that our clients will treasure forever. We strive to provide exceptional service and deliver
                photographs that exceed expectations.
              </p>
            </div>
            <div className="bg-gold-50 p-8 rounded-xl">
              <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be the leading photography studio in the region, known for our creativity, professionalism, and
                ability to capture the essence of every moment. We aim to continuously innovate and set new standards in
                the photography industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
