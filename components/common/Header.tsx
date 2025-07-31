"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ]

  const handleNavigation = (path) => {
    router.push(path)
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
    setIsMenuOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black shadow-lg" : "bg-black"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 shrink-0" onClick={() => handleNavigation("/")}>
            <div className="relative">
              <Image
                src="/images/sharp-images-logo.png"
                alt="Sharp Images Photography and Films"
                width={240}
                height={80}
                className="h-16 w-auto object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className="text-sm font-semibold uppercase tracking-wide transition duration-200 px-3 py-2 rounded-md text-white hover:text-gold-400 hover:bg-white/5"
              >
                {item.name}
              </button>
            ))}

            <button
              onClick={() => handleNavigation("/contact")}
              className="bg-gradient-to-r from-gold-500 to-gold-400 text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform ml-6"
            >
              Book Now
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-3 rounded-md hover:bg-white/10 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black px-4 sm:px-6 pb-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className="block w-full text-left text-base font-medium py-3 px-4 rounded-md transition-colors text-white hover:text-gold-400 hover:bg-white/5"
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => handleNavigation("/contact")}
              className="block w-full bg-gradient-to-r from-gold-500 to-gold-400 text-black text-center px-6 py-3 rounded-full font-bold mt-4"
            >
              Book Now
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
