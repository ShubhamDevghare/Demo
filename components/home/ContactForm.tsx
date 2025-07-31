"use client"

import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Send, Twitter } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/booking-inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success("Your inquiry has been submitted successfully! We'll get back to you soon.")
        reset()
      } else {
        throw new Error("Failed to submit inquiry")
      }
    } catch (error) {
      toast.error("Failed to submit inquiry. Please try again.")
      console.error("Error submitting inquiry:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-80" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-16 h-px bg-gold-400"></div>
            <span className="text-gold-400 text-sm font-medium tracking-wider uppercase">Get In Touch</span>
            <div className="w-16 h-px bg-gold-400"></div>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold text-white mb-8">
            Let's Create Something Beautiful
          </h2>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Ready to capture your special moments? Get in touch with us to discuss your photography needs and let's
            create memories that will last a lifetime.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20">
          {/* Contact Form */}
          <div className="p-8 sm:p-10 lg:p-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
            <h3 className="text-2xl sm:text-3xl font-playfair font-bold text-white mb-8 sm:mb-10">Send Us a Message</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-3">
                  <label className="block text-white text-base font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    {...register("fullName", { required: "Full name is required" })}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 text-base"
                    placeholder="Your full name"
                  />
                  {errors.fullName && <p className="text-red-400 text-sm mt-2">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-3">
                  <label className="block text-white text-base font-medium mb-2">Email Address (optional)</label>
                  <input
                    type="email"
                    {...register("email", {
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 text-base"
                    placeholder="your@email.com (optional)"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-3">
                  <label className="block text-white text-base font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    {...register("phoneNumber", { required: "Phone number is required" })}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 text-base"
                    placeholder="+91 98765 43210"
                  />
                  {errors.phoneNumber && <p className="text-red-400 text-sm mt-2">{errors.phoneNumber.message}</p>}
                </div>

                <div className="space-y-3">
                  <label className="block text-white text-base font-medium mb-2">Service Type *</label>
                  <select
                    {...register("serviceType", { required: "Service type is required" })}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 text-base"
                  >
                    <option value="" className="text-gray-900">
                      Select service
                    </option>
                    <option value="PRE_WEDDING" className="text-gray-900">
                      Pre-Wedding Photography
                    </option>
                    <option value="WEDDING" className="text-gray-900">
                      Wedding Photography
                    </option>
                    <option value="POST_WEDDING" className="text-gray-900">
                      Post-Wedding Photography
                    </option>
                    <option value="MATERNITY" className="text-gray-900">
                      Maternity Shoots
                    </option>
                    <option value="BABY_SHOWER" className="text-gray-900">
                      Baby Shower Photography
                    </option>
                    <option value="BABY_SHOOTS" className="text-gray-900">
                      Baby Shoots
                    </option>
                    <option value="EVENT" className="text-gray-900">
                      Event Photography
                    </option>
                    <option value="CORPORATE" className="text-gray-900">
                      Corporate Photography
                    </option>
                  </select>
                  {errors.serviceType && <p className="text-red-400 text-sm mt-2">{errors.serviceType.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-3">
                  <label className="block text-white text-base font-medium mb-2">Preferred Date *</label>
                  <input
                    type="date"
                    {...register("preferredDate", { required: "Preferred date is required" })}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 text-base"
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {errors.preferredDate && <p className="text-red-400 text-sm mt-2">{errors.preferredDate.message}</p>}
                </div>

                <div className="space-y-3">
                  <label className="block text-white text-base font-medium mb-2">Location</label>
                  <input
                    type="text"
                    {...register("location")}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 text-base"
                    placeholder="Event location"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-white text-base font-medium mb-2">Additional Message (optional)</label>
                <textarea
                  {...register("message")}
                  rows={5}
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none transition-all duration-200 text-base"
                  placeholder="Tell us more about your photography needs... (optional)"
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-lg bg-gradient-to-r from-gold-500 to-gold-600 text-white font-medium rounded-full transition-all duration-300 hover:from-gold-600 hover:to-gold-700 focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8">
            <div className="p-6 sm:p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-xl mb-2">Call Us</h4>
                  <p className="text-gray-300 text-lg mb-1">7030707953</p>
                  <p className="text-gray-400 text-sm">Available 9 AM - 8 PM</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-xl mb-2">Email Us</h4>
                  <p className="text-gray-300 text-lg mb-1">info@sharpimages.com</p>
                  <p className="text-gray-400 text-sm">We'll respond within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-xl mb-2">Visit Our Studio</h4>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Sharp Images Photography & Films
                    <br />
                    Jaipur Wala Complex,
                    <br />
                    Near Ambagate,
                    <br />
                    Gandhi Chowk,
                    <br />
                    Amravati, Maharashtra
                    <br />
                    444601
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-xl mb-2">Working Hours</h4>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Monday - Saturday: 9:00 AM - 8:00 PM
                    <br />
                    Sunday: 10:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Follow Us Section */}
            <div className="p-6 sm:p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
              <h4 className="text-white font-semibold text-xl mb-4">Follow Us</h4>
              <p className="text-gray-300 text-base mb-6 leading-relaxed">
                Stay connected with us on social media for the latest updates, behind-the-scenes content, and featured
                work.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center text-gold-600 hover:bg-gold-500 hover:text-white transition-colors duration-300"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center text-gold-600 hover:bg-gold-500 hover:text-white transition-colors duration-300"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center text-gold-600 hover:bg-gold-500 hover:text-white transition-colors duration-300"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactForm
