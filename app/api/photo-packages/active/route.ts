import { NextResponse } from "next/server"
import { type PhotoPackage, ServiceType } from "@/lib/types"

// In-memory storage (replace with database in production)
const photoPackages: PhotoPackage[] = [
  {
    id: 1,
    title: "Premium Wedding Package",
    description: "Complete wedding photography coverage with pre-wedding, ceremony, and reception shots.",
    price: 50000,
    serviceCategory: ServiceType.WEDDING,
    imageUrl: "/placeholder.svg?height=400&width=600",
    features:
      "Pre-wedding consultation, Engagement shoot, Full ceremony coverage, Reception photography, Bridal portraits, Family group photos, Online gallery delivery, High-resolution images",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Birthday Celebration Package",
    description: "Capture all the joy and excitement of your special birthday celebration.",
    price: 15000,
    serviceCategory: ServiceType.BIRTHDAY,
    imageUrl: "/placeholder.svg?height=400&width=600",
    features:
      "Party setup photography, Candid moment capture, Cake cutting ceremony, Group photos with guests, Individual portraits, Decoration photography, Same-day preview, Digital photo delivery",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Professional Portfolio Package",
    description: "Professional headshots and portfolio photography for your career advancement.",
    price: 8000,
    serviceCategory: ServiceType.PORTFOLIO,
    imageUrl: "/placeholder.svg?height=400&width=600",
    features:
      "Professional consultation, Multiple outfit changes, Studio & outdoor options, Professional lighting, Retouching included, Multiple poses & angles, Quick turnaround, Print-ready files",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    const activePackages = photoPackages
      .filter((pkg) => pkg.isActive)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json(activePackages)
  } catch (error) {
    console.error("Error fetching active photo packages:", error)
    return NextResponse.json({ error: "Failed to fetch active photo packages" }, { status: 500 })
  }
}
