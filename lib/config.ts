// Cloudinary Configuration
export const cloudinaryConfig = {
  cloud_name: "dkqvrmxvh",
  api_key: "293643239753871",
  api_secret: "p7-qvL0AzGnkFBXPUd-Ui_u1H_g",
  upload_preset: "sharp_images_preset",
}

// Email Configuration
export const emailConfig = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "shubhamkd.a02@gmail.com",
    pass: "bxqg pojv rslm ybgs", // App password
  },
}

// Application Configuration
export const appConfig = {
  adminEmail: "shubhamkd.a02@gmail.com",
  studioName: "Sharp Images Photography and Films",
  studioPhone: "7030707953",
  photographerName: "Sagar Kajale",
  websiteUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
  routes: {
    admin: {
      login: "/owner",
      dashboard: "/admin/CommandCenter",
    },
  },
}
