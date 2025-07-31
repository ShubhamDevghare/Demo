import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20 sm:mt-24 lg:mt-32">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 lg:gap-20">
          {/* Brand */}
          <div className="space-y-6 lg:space-y-8">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/sharp-images-logo.png"
                alt="Sharp Images Photography and Films"
                width={280}
                height={100}
                className="h-20 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-400 text-base leading-relaxed max-w-xs pr-4">
              Capturing life's precious moments with artistic excellence and professional dedication.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-gold-400 transition-colors duration-300 p-3 rounded-full hover:bg-gray-800"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gold-400 transition-colors duration-300 p-3 rounded-full hover:bg-gray-800"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gold-400 transition-colors duration-300 p-3 rounded-full hover:bg-gray-800"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6 lg:space-y-8">
            <h3 className="text-lg font-semibold text-gold-400 mb-4">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { name: "Home", path: "/" },
                { name: "Services", path: "/services" },
                { name: "Portfolio", path: "/portfolio" },
                { name: "About", path: "/about" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-gray-400 hover:text-gold-400 transition-colors duration-300 text-base py-2 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6 lg:space-y-8">
            <h3 className="text-lg font-semibold text-gold-400 mb-4">Services</h3>
            <ul className="space-y-4">
              {[
                "Pre-Wedding Photography",
                "Wedding Photography",
                "Post-Wedding Photography",
                "Maternity Shoots",
                "Baby Shower Photography",
                "Baby Shoots",
                "Event Photography",
                "Corporate Photography",
              ].map((service) => (
                <li key={service}>
                  <span className="text-gray-400 text-base py-2 block hover:text-gold-400 transition-colors duration-300 cursor-pointer">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 lg:space-y-8">
            <h3 className="text-lg font-semibold text-gold-400 mb-4">Contact Info</h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Phone className="w-5 h-5 text-gold-400 shrink-0" />
                <span className="text-gray-400 text-base">7030707953</span>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="w-5 h-5 text-gold-400 shrink-0" />
                <span className="text-gray-400 text-base">shubhamkd.a02@gmail.com</span>
              </div>
              <div className="flex items-start space-x-4">
                <MapPin className="w-5 h-5 text-gold-400 mt-1 shrink-0" />
                <span className="text-gray-400 text-base leading-relaxed">
                  Sharp Images Photography & Films <br />
                  Jaipur Wala Complex,
                  <br />
                  Near Ambagate,
                  <br />
                  Gandhi Chowk,
                  <br />
                  Amravati, Maharashtra <br />
                  444601
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 lg:mt-16 pt-8 lg:pt-12 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <p className="text-gray-400 text-base text-center md:text-left">
            © {new Date().getFullYear()} Sharp Images Photography and Films. All rights reserved.
          </p>
          <div className="flex space-x-8">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-gold-400 text-base transition-colors duration-300 py-2"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-gold-400 text-base transition-colors duration-300 py-2"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
