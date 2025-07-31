import { type NextRequest, NextResponse } from "next/server"
import type { BookingInquiry } from "@/lib/types"

// In-memory storage (replace with database in production)
const bookingInquiries: BookingInquiry[] = []

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const inquiry = bookingInquiries.find((b) => b.id === id)

    if (!inquiry) {
      return NextResponse.json({ error: "Booking inquiry not found" }, { status: 404 })
    }

    return NextResponse.json(inquiry)
  } catch (error) {
    console.error("Error fetching booking inquiry:", error)
    return NextResponse.json({ error: "Failed to fetch booking inquiry" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const inquiryIndex = bookingInquiries.findIndex((b) => b.id === id)

    if (inquiryIndex === -1) {
      return NextResponse.json({ error: "Booking inquiry not found" }, { status: 404 })
    }

    const updatedInquiry = {
      ...bookingInquiries[inquiryIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    bookingInquiries[inquiryIndex] = updatedInquiry

    return NextResponse.json(updatedInquiry)
  } catch (error) {
    console.error("Error updating booking inquiry:", error)
    return NextResponse.json({ error: "Failed to update booking inquiry" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const inquiryIndex = bookingInquiries.findIndex((b) => b.id === id)

    if (inquiryIndex === -1) {
      return NextResponse.json({ error: "Booking inquiry not found" }, { status: 404 })
    }

    bookingInquiries.splice(inquiryIndex, 1)

    return NextResponse.json({ message: "Booking inquiry deleted successfully" })
  } catch (error) {
    console.error("Error deleting booking inquiry:", error)
    return NextResponse.json({ error: "Failed to delete booking inquiry" }, { status: 500 })
  }
}
