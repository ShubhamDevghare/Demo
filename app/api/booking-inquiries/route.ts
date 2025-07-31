import { type NextRequest, NextResponse } from "next/server"
import { getAllBookingInquiries, addBookingInquiry } from "@/lib/database"
import { sendBookingInquiryNotifications } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const inquiry = await addBookingInquiry({
      fullName: body.fullName,
      email: body.email || "",
      phoneNumber: body.phoneNumber,
      location: body.location || "",
      serviceType: body.serviceType,
      preferredDate: body.preferredDate,
      message: body.message || "",
      status: "PENDING",
    })

    // Send email notifications
    const emailResults = await sendBookingInquiryNotifications(inquiry)
    console.log("Email notifications sent:", emailResults)

    console.log("New booking inquiry:", inquiry)

    return NextResponse.json(
      {
        success: true,
        message: "Booking inquiry submitted successfully!",
        inquiry,
        emailResults,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating booking inquiry:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create booking inquiry",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const inquiries = await getAllBookingInquiries()

    const sortedInquiries = inquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      success: true,
      inquiries: sortedInquiries,
      total: inquiries.length,
    })
  } catch (error) {
    console.error("Error fetching booking inquiries:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch booking inquiries",
      },
      { status: 500 },
    )
  }
}
