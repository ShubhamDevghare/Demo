import nodemailer from "nodemailer"
import { emailConfig, appConfig } from "./config"

// Create transporter
const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: emailConfig.auth,
})

// Email templates
export const emailTemplates = {
  bookingInquiry: {
    admin: (inquiry: any) => ({
      subject: `New Booking Inquiry - ${inquiry.serviceType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #d97706, #f59e0b); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Booking Inquiry</h1>
            <p style="color: white; margin: 5px 0;">Sharp Images Photography and Films</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Client Details</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold; color: #555;">Name:</td>
                <td style="padding: 10px; color: #333;">${inquiry.fullName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold; color: #555;">Phone:</td>
                <td style="padding: 10px; color: #333;">${inquiry.phoneNumber}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 10px; color: #333;">${inquiry.email || "Not provided"}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold; color: #555;">Service:</td>
                <td style="padding: 10px; color: #333;">${inquiry.serviceType}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold; color: #555;">Preferred Date:</td>
                <td style="padding: 10px; color: #333;">${inquiry.preferredDate}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold; color: #555;">Location:</td>
                <td style="padding: 10px; color: #333;">${inquiry.location || "Not specified"}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #555; vertical-align: top;">Message:</td>
                <td style="padding: 10px; color: #333;">${inquiry.message || "No additional message"}</td>
              </tr>
            </table>
            
            <div style="margin-top: 30px; padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #d97706;">
              <p style="margin: 0; color: #666;">
                <strong>Inquiry ID:</strong> ${inquiry.id}<br>
                <strong>Submitted:</strong> ${new Date(inquiry.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">Sharp Images Photography and Films</p>
            <p style="margin: 5px 0;">Contact: ${appConfig.studioPhone}</p>
          </div>
        </div>
      `,
    }),

    client: (inquiry: any) => ({
      subject: `Thank you for your inquiry - Sharp Images Photography and Films`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #d97706, #f59e0b); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Thank You!</h1>
            <p style="color: white; margin: 5px 0;">Sharp Images Photography and Films</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Dear ${inquiry.fullName},</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Thank you for your interest in our photography services! We have received your inquiry for 
              <strong>${inquiry.serviceType}</strong> and will get back to you within 24 hours.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d97706;">
              <h3 style="color: #333; margin-top: 0;">Your Inquiry Details:</h3>
              <p style="color: #666; margin: 5px 0;"><strong>Service:</strong> ${inquiry.serviceType}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Preferred Date:</strong> ${inquiry.preferredDate}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Location:</strong> ${inquiry.location || "To be discussed"}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Inquiry ID:</strong> ${inquiry.id}</p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              In the meantime, feel free to browse our portfolio and learn more about our services. 
              If you have any urgent questions, please call us at <strong>${appConfig.studioPhone}</strong>.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${appConfig.websiteUrl}/portfolio" 
                 style="background: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Our Portfolio
              </a>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;"><strong>Sharp Images Photography and Films</strong></p>
            <p style="margin: 5px 0;">Photographer: ${appConfig.photographerName}</p>
            <p style="margin: 5px 0;">Phone: ${appConfig.studioPhone}</p>
            <p style="margin: 5px 0;">Email: ${appConfig.adminEmail}</p>
          </div>
        </div>
      `,
    }),
  },

  adminLogin: {
    admin: (loginDetails: any) => ({
      subject: `Owner Login Alert - Sharp Images Photography`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc2626, #ef4444); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🔐 Owner Login Alert</h1>
            <p style="color: white; margin: 5px 0;">Sharp Images Photography and Films</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Command Center Access</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626;">
              <p style="color: #666; margin: 5px 0;"><strong>Login Time:</strong> ${new Date(loginDetails.timestamp).toLocaleString()}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Email:</strong> ${loginDetails.email}</p>
              <p style="color: #666; margin: 5px 0;"><strong>IP Address:</strong> ${loginDetails.ip || "Unknown"}</p>
              <p style="color: #666; margin: 5px 0;"><strong>User Agent:</strong> ${loginDetails.userAgent || "Unknown"}</p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-top: 20px;">
              If this login was not authorized by you, please secure your account immediately.
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">Sharp Images Photography and Films - Security Alert</p>
          </div>
        </div>
      `,
    }),
  },
}

// Send email function
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: `"${appConfig.studioName}" <${emailConfig.auth.user}>`,
      to,
      subject,
      html,
    })

    console.log("Email sent successfully:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: error.message }
  }
}

// Send booking inquiry notifications
export async function sendBookingInquiryNotifications(inquiry: any) {
  try {
    const results = []

    // Send notification to admin
    const adminTemplate = emailTemplates.bookingInquiry.admin(inquiry)
    const adminResult = await sendEmail(appConfig.adminEmail, adminTemplate.subject, adminTemplate.html)
    results.push({ type: "admin", ...adminResult })

    // Send confirmation to client (if email provided)
    if (inquiry.email) {
      const clientTemplate = emailTemplates.bookingInquiry.client(inquiry)
      const clientResult = await sendEmail(inquiry.email, clientTemplate.subject, clientTemplate.html)
      results.push({ type: "client", ...clientResult })
    }

    return results
  } catch (error) {
    console.error("Error sending booking inquiry notifications:", error)
    return [{ type: "error", success: false, error: error.message }]
  }
}

// Send admin login notification
export async function sendAdminLoginNotification(loginDetails: any) {
  try {
    const template = emailTemplates.adminLogin.admin(loginDetails)
    return await sendEmail(appConfig.adminEmail, template.subject, template.html)
  } catch (error) {
    console.error("Error sending admin login notification:", error)
    return { success: false, error: error.message }
  }
}
