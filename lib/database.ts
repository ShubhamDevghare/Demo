// ==========================================
// DATABASE STRUCTURE DOCUMENTATION
// ==========================================

/*
VERCEL KV DATABASE STRUCTURE:

1. PHOTOS COLLECTION (Key: "photos")
   - Type: Array<Photo>
   - Structure: {
       id: string (e.g., "photo_1", "photo_2")
       title: string
       category: string (pre-wedding, wedding, post-wedding, maternity, baby-shower, baby-shoots, event, corporate)
       imageUrl: string (Cloudinary URL)
       cloudinaryPublicId: string (for deletion)
       isActive: boolean
       createdAt: string (ISO date)
       updatedAt: string (ISO date)
     }

2. ADMINS COLLECTION (Key: "admins")
   - Type: Array<Admin>
   - Structure: {
       id: string (e.g., "admin_1")
       name: string
       email: string
       password: string (bcrypt hashed)
       isActive: boolean
       createdAt: string (ISO date)
       updatedAt: string (ISO date)
     }

3. SYSTEM SETTINGS (Key: "system_settings")
   - Type: Object
   - Structure: {
       initialized: boolean
       version: string
       lastBackup: string
     }
*/

// Types for our data structures
export interface Photo {
  id: string
  title: string
  category: string
  imageUrl: string
  cloudinaryPublicId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Admin {
  id: string
  name: string
  email: string
  password: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface BookingInquiry {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  location: string
  serviceType: string
  preferredDate: string
  message: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface SystemSettings {
  initialized: boolean
  version: string
  lastBackup: string
}

// In-memory fallback storage
let fallbackPhotos: Photo[] = [
  {
    id: "photo_1",
    title: "Pre-Wedding Romance",
    category: "pre-wedding",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Pre-Wedding+Photo",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "photo_2",
    title: "Wedding Ceremony",
    category: "wedding",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Wedding+Photo",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "photo_3",
    title: "Post-Wedding Bliss",
    category: "post-wedding",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Post-Wedding+Photo",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "photo_4",
    title: "Maternity Glow",
    category: "maternity",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Maternity+Photo",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "photo_5",
    title: "Baby Shower Joy",
    category: "baby-shower",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Baby+Shower+Photo",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "photo_6",
    title: "Newborn Baby",
    category: "baby-shoots",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Baby+Photo",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "photo_7",
    title: "Special Event",
    category: "event",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Event+Photo",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "photo_8",
    title: "Corporate Meeting",
    category: "corporate",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Corporate+Photo",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

let fallbackAdmins: Admin[] = []
let fallbackBookingInquiries: BookingInquiry[] = []
let fallbackSystemSettings: SystemSettings = {
  initialized: true,
  version: "1.0.0",
  lastBackup: new Date().toISOString(),
}

// Database keys
const KEYS = {
  PHOTOS: "photos",
  ADMINS: "admins",
  BOOKING_INQUIRIES: "booking_inquiries",
  SYSTEM_SETTINGS: "system_settings",
}

// Check if KV is available
function isKVAvailable(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

// Get KV instance safely
async function getKV() {
  if (!isKVAvailable()) {
    throw new Error("KV not available")
  }
  const { kv } = await import("@vercel/kv")
  return kv
}

// Generate unique ID
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// Photo operations
export async function getAllPhotos(): Promise<Photo[]> {
  try {
    if (isKVAvailable()) {
      const kv = await getKV()
      const photos = await kv.get<Photo[]>(KEYS.PHOTOS)
      return photos || fallbackPhotos
    }
    return fallbackPhotos
  } catch (error) {
    console.error("Error getting photos, using fallback:", error.message)
    return fallbackPhotos
  }
}

export async function getActivePhotos(): Promise<Photo[]> {
  try {
    const photos = await getAllPhotos()
    return photos.filter((photo) => photo.isActive)
  } catch (error) {
    console.error("Error getting active photos:", error)
    return fallbackPhotos.filter((photo) => photo.isActive)
  }
}

export async function addPhoto(photoData: Omit<Photo, "id" | "createdAt" | "updatedAt">): Promise<Photo> {
  try {
    const photos = await getAllPhotos()

    const newPhoto: Photo = {
      ...photoData,
      id: generateId("photo"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedPhotos = [...photos, newPhoto]

    if (isKVAvailable()) {
      const kv = await getKV()
      await kv.set(KEYS.PHOTOS, updatedPhotos)
    } else {
      fallbackPhotos = updatedPhotos
    }

    return newPhoto
  } catch (error) {
    console.error("Error adding photo:", error)
    // Add to fallback storage
    const newPhoto: Photo = {
      ...photoData,
      id: generateId("photo"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    fallbackPhotos = [...fallbackPhotos, newPhoto]
    return newPhoto
  }
}

export async function updatePhoto(id: string, photoData: Partial<Photo>): Promise<Photo | null> {
  try {
    const photos = await getAllPhotos()
    const photoIndex = photos.findIndex((p) => p.id === id)

    if (photoIndex === -1) {
      return null
    }

    const updatedPhoto = {
      ...photos[photoIndex],
      ...photoData,
      updatedAt: new Date().toISOString(),
    }

    photos[photoIndex] = updatedPhoto

    if (isKVAvailable()) {
      const kv = await getKV()
      await kv.set(KEYS.PHOTOS, photos)
    } else {
      fallbackPhotos = photos
    }

    return updatedPhoto
  } catch (error) {
    console.error("Error updating photo:", error)
    throw error
  }
}

export async function deletePhoto(id: string): Promise<boolean> {
  try {
    const photos = await getAllPhotos()
    const filteredPhotos = photos.filter((p) => p.id !== id)

    if (filteredPhotos.length === photos.length) {
      return false // Photo not found
    }

    if (isKVAvailable()) {
      const kv = await getKV()
      await kv.set(KEYS.PHOTOS, filteredPhotos)
    } else {
      fallbackPhotos = filteredPhotos
    }

    return true
  } catch (error) {
    console.error("Error deleting photo:", error)
    throw error
  }
}

// Admin operations
export async function getAdminByEmail(email: string): Promise<Admin | null> {
  try {
    console.log("Getting admin by email:", email)

    let admins: Admin[] = []

    if (isKVAvailable()) {
      const kv = await getKV()
      admins = (await kv.get<Admin[]>(KEYS.ADMINS)) || []
    } else {
      admins = fallbackAdmins
    }

    console.log("All admins in database:", admins.length)

    const admin = admins.find((admin) => admin.email === email && admin.isActive)
    console.log("Found admin:", admin ? "Yes" : "No")

    return admin || null
  } catch (error) {
    console.error("Error getting admin:", error)
    return null
  }
}

export async function initializeAdmin(): Promise<void> {
  try {
    console.log("Initializing admin...")

    let existingAdmins: Admin[] = []

    if (isKVAvailable()) {
      const kv = await getKV()
      existingAdmins = (await kv.get<Admin[]>(KEYS.ADMINS)) || []
    } else {
      existingAdmins = fallbackAdmins
    }

    console.log("Existing admins:", existingAdmins.length)

    if (existingAdmins.length === 0) {
      console.log("Creating default admin...")
      const bcrypt = require("bcryptjs")
      const hashedPassword = await bcrypt.hash("password", 10)
      console.log("Password hashed successfully")

      const defaultAdmin: Admin = {
        id: "admin_1",
        name: "Sagar Kajale",
        email: "shubhamkd.a02@gmail.com",
        password: hashedPassword,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      if (isKVAvailable()) {
        const kv = await getKV()
        await kv.set(KEYS.ADMINS, [defaultAdmin])
      } else {
        fallbackAdmins = [defaultAdmin]
      }

      console.log("Default admin created successfully")
    } else {
      console.log("Admin already exists, skipping creation")
    }
  } catch (error) {
    console.error("Error initializing admin:", error)
    throw error
  }
}

// Booking inquiry operations
export async function getAllBookingInquiries(): Promise<BookingInquiry[]> {
  try {
    if (isKVAvailable()) {
      const kv = await getKV()
      const inquiries = await kv.get<BookingInquiry[]>(KEYS.BOOKING_INQUIRIES)
      return inquiries || fallbackBookingInquiries
    }
    return fallbackBookingInquiries
  } catch (error) {
    console.error("Error getting booking inquiries:", error)
    return fallbackBookingInquiries
  }
}

export async function addBookingInquiry(
  inquiryData: Omit<BookingInquiry, "id" | "createdAt" | "updatedAt">,
): Promise<BookingInquiry> {
  try {
    const inquiries = await getAllBookingInquiries()

    const newInquiry: BookingInquiry = {
      ...inquiryData,
      id: generateId("inquiry"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedInquiries = [...inquiries, newInquiry]

    if (isKVAvailable()) {
      const kv = await getKV()
      await kv.set(KEYS.BOOKING_INQUIRIES, updatedInquiries)
    } else {
      fallbackBookingInquiries = updatedInquiries
    }

    return newInquiry
  } catch (error) {
    console.error("Error adding booking inquiry:", error)
    // Add to fallback storage
    const newInquiry: BookingInquiry = {
      ...inquiryData,
      id: generateId("inquiry"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    fallbackBookingInquiries = [...fallbackBookingInquiries, newInquiry]
    return newInquiry
  }
}

// System settings
export async function getSystemSettings(): Promise<SystemSettings> {
  try {
    if (isKVAvailable()) {
      const kv = await getKV()
      const settings = await kv.get<SystemSettings>(KEYS.SYSTEM_SETTINGS)
      return settings || fallbackSystemSettings
    }
    return fallbackSystemSettings
  } catch (error) {
    console.error("Error getting system settings:", error)
    return fallbackSystemSettings
  }
}

export async function updateSystemSettings(settings: Partial<SystemSettings>): Promise<void> {
  try {
    const currentSettings = await getSystemSettings()
    const updatedSettings = { ...currentSettings, ...settings }

    if (isKVAvailable()) {
      const kv = await getKV()
      await kv.set(KEYS.SYSTEM_SETTINGS, updatedSettings)
    } else {
      fallbackSystemSettings = updatedSettings
    }
  } catch (error) {
    console.error("Error updating system settings:", error)
  }
}

// Initialize sample data
export async function initializeSampleData(): Promise<void> {
  try {
    const settings = await getSystemSettings()

    if (!settings.initialized) {
      console.log("Sample data already initialized")
      return
    }

    console.log("Sample data initialized successfully")
  } catch (error) {
    console.error("Error initializing sample data:", error)
  }
}

// Database backup function
export async function createDatabaseBackup(): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const backup = {
      photos: await getAllPhotos(),
      admins: fallbackAdmins, // Don't expose admin data in backup
      bookingInquiries: await getAllBookingInquiries(),
      systemSettings: await getSystemSettings(),
      timestamp: new Date().toISOString(),
    }

    await updateSystemSettings({ lastBackup: backup.timestamp })

    return { success: true, data: backup }
  } catch (error) {
    console.error("Error creating database backup:", error)
    return { success: false, error: error.message }
  }
}

// Force admin creation (for debugging)
export async function forceCreateAdmin(): Promise<void> {
  try {
    console.log("Force creating admin...")
    const bcrypt = require("bcryptjs")
    const hashedPassword = await bcrypt.hash("password", 10)

    const defaultAdmin: Admin = {
      id: "admin_1",
      name: "Sagar Kajale",
      email: "shubhamkd.a02@gmail.com",
      password: hashedPassword,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (isKVAvailable()) {
      const kv = await getKV()
      await kv.set(KEYS.ADMINS, [defaultAdmin])
    } else {
      fallbackAdmins = [defaultAdmin]
    }

    console.log("Admin force created successfully")
  } catch (error) {
    console.error("Error force creating admin:", error)
    throw error
  }
}
