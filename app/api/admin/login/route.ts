import { type NextRequest, NextResponse } from "next/server"

// Fallback in-memory storage for development
let fallbackAdmins = []

export async function POST(request: NextRequest) {
  try {
    console.log("Admin login attempt started...")

    // Import bcrypt dynamically to avoid build issues
    const bcrypt = await import("bcryptjs")

    const { email, password } = await request.json()
    console.log("Login attempt for email:", email)

    let admins = []

    // Try to use Vercel KV if available, otherwise use fallback
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { kv } = await import("@vercel/kv")
        admins = (await kv.get<any[]>("admins")) || []
        console.log("Using Vercel KV, found admins:", admins.length)
      } else {
        console.log("KV not available, using fallback storage")
        admins = fallbackAdmins
      }
    } catch (kvError) {
      console.log("KV error, falling back to memory:", kvError.message)
      admins = fallbackAdmins
    }

    // If no admins exist, create the default admin
    if (!admins || admins.length === 0) {
      console.log("Creating default admin...")
      const hashedPassword = await bcrypt.hash("password", 10)

      const defaultAdmin = {
        id: "admin_1",
        name: "Sagar Kajale",
        email: "shubhamkd.a02@gmail.com",
        password: hashedPassword,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Try to save to KV, otherwise save to fallback
      try {
        if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
          const { kv } = await import("@vercel/kv")
          await kv.set("admins", [defaultAdmin])
          console.log("Admin saved to KV")
        } else {
          fallbackAdmins = [defaultAdmin]
          console.log("Admin saved to fallback storage")
        }
      } catch (saveError) {
        console.log("Failed to save to KV, using fallback:", saveError.message)
        fallbackAdmins = [defaultAdmin]
      }

      admins = [defaultAdmin]
      console.log("Default admin created")
    }

    // Find the admin
    const admin = admins.find((a) => a.email === email && a.isActive)

    if (!admin) {
      console.log("Admin not found for email:", email)
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password)
    console.log("Password valid:", isValidPassword)

    if (!isValidPassword) {
      console.log("Invalid password for email:", email)
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    // Send login notification (optional, don't fail if this fails)
    try {
      const { sendAdminLoginNotification } = await import("@/lib/email")
      const loginDetails = {
        email: admin.email,
        timestamp: new Date().toISOString(),
        ip: request.headers.get("x-forwarded-for") || "Unknown",
        userAgent: request.headers.get("user-agent") || "Unknown",
      }
      await sendAdminLoginNotification(loginDetails)
    } catch (emailError) {
      console.error("Email notification failed:", emailError)
      // Continue with login even if email fails
    }

    console.log("Login successful for:", email)
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
    console.error("Error during admin login:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
