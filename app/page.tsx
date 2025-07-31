import HeroSection from "@/components/home/HeroSection"
import ServicesShowcase from "@/components/home/ServicesShowcase"
import PortfolioShowcase from "@/components/home/PortfolioShowcase"
import Testimonials from "@/components/home/Testimonials"
import ContactForm from "@/components/home/ContactForm"
import Header from "@/components/common/Header"
import Footer from "@/components/common/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <ServicesShowcase />
        <PortfolioShowcase />
        <Testimonials />
        <ContactForm />
      </main>
      <Footer />
    </div>
  )
}
