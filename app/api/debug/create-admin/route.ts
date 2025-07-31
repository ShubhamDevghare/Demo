import { NextResponse } from "next/server"

// Fallback in-memory storage for development
let fallbackAdmins = []

export async function POST() {
  try {
    const bcrypt = await import("bcryptjs")

    console.log("Force creating admin...")
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

    console.log("Admin force created successfully")

    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
    })
  } catch (error) {
    console.error("Error creating admin:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
