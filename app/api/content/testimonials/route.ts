import { NextResponse } from "next/server"

export async function GET() {
  try {
    let testimonials = []

    // Try to get testimonials from KV
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { kv } = await import("@vercel/kv")
        testimonials = (await kv.get<any[]>("testimonials")) || []
      }
    } catch (kvError) {
      console.log("KV not available for testimonials")
    }

    // If no testimonials, create sample data
    if (testimonials.length === 0) {
      const sampleTestimonials = [
        {
          id: 1,
          name: "Priya & Rahul",
          role: "Wedding Couple",
          image: "/placeholder.svg?height=80&width=80",
          rating: 5,
          text: "Sharp Images Photography made our wedding day absolutely magical! Every moment was captured with such artistry and emotion. The team was professional, creative, and made us feel so comfortable. Our photos are beyond our dreams!",
          event: "Wedding Photography",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Anita Sharma",
          role: "Birthday Celebration",
          image: "/placeholder.svg?height=80&width=80",
          rating: 5,
          text: "The birthday party photography was exceptional! They captured all the joy, laughter, and precious moments with my family. The candid shots are absolutely beautiful, and the quality is outstanding. Highly recommended!",
          event: "Birthday Photography",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          name: "Vikram Singh",
          role: "Model & Actor",
          image: "/placeholder.svg?height=80&width=80",
          rating: 5,
          text: "Professional portfolio shoot that exceeded all expectations! The photographer understood my vision perfectly and created stunning images that have helped advance my career. The attention to detail and creative direction was remarkable.",
          event: "Portfolio Shoot",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 4,
          name: "Tech Solutions Pvt Ltd",
          role: "Corporate Client",
          image: "/placeholder.svg?height=80&width=80",
          rating: 5,
          text: "Outstanding corporate event photography! They captured our product launch perfectly, from the keynote presentations to networking moments. Professional, punctual, and delivered high-quality images that we're proud to use in our marketing.",
          event: "Corporate Event",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ]

      // Save sample testimonials
      try {
        if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
          const { kv } = await import("@vercel/kv")
          await kv.set("testimonials", sampleTestimonials)
        }
      } catch (saveError) {
        console.log("Could not save sample testimonials")
      }

      testimonials = sampleTestimonials
    }

    // Filter active testimonials
    const activeTestimonials = testimonials.filter((t) => t.isActive)

    return NextResponse.json({
      success: true,
      testimonials: activeTestimonials,
    })
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch testimonials" }, { status: 500 })
  }
}
