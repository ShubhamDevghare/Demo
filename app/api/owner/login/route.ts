import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getAdminByEmail, initializeAdmin } from "@/lib/database"
import { sendAdminLoginNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    // Initialize admin if needed
    await initializeAdmin()

    const { email, password } = await request.json()

    const admin = await getAdminByEmail(email)

    if (!admin) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 })
    }

    const isValidPassword = await bcrypt.compare(password, admin.password)

    if (!isValidPassword) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 })
    }

    // Send login notification email
    const loginDetails = {
      email: admin.email,
      timestamp: new Date().toISOString(),
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Unknown",
      userAgent: request.headers.get("user-agent") || "Unknown",
    }

    const emailResult = await sendAdminLoginNotification(loginDetails)
    console.log("Owner login notification sent:", emailResult)

    return NextResponse.json({
      success: true,
      message: "Login successful",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    })
  } catch (error) {
    console.error("Error during owner login:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
