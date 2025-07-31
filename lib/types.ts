export enum ServiceType {
  WEDDING = "WEDDING",
  BIRTHDAY = "BIRTHDAY",
  PORTFOLIO = "PORTFOLIO",
}

export enum InquiryStatus {
  PENDING = "PENDING",
  SEEN = "SEEN",
  REPLIED = "REPLIED",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface BookingInquiry {
  id: number
  fullName: string
  email: string
  phoneNumber: string
  location: string
  serviceType: ServiceType
  preferredDate: string
  message: string
  status: InquiryStatus
  createdAt: string
  updatedAt: string
}

export interface GalleryImage {
  id: number
  title: string
  imageUrl: string
  category: string
  isActive: boolean
  uploadedAt: string
}

export interface PhotoPackage {
  id: number
  title: string
  description: string
  price: number
  serviceCategory: ServiceType
  imageUrl: string
  features: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Admin {
  id: number
  name: string
  email: string
  password: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
