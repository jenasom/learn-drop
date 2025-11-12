import { sendTransactionalEmail } from "@/lib/mailerlite"

// Test function to verify email sending
export async function testMailerLite(recipientEmail: string) {
  console.log("Testing MailerLite integration...")
  
  try {
    const result = await sendTransactionalEmail({
      to: recipientEmail,
      subject: "Welcome to Learn Drop - Test Email",
      html: `
        <h1>Welcome to Learn Drop!</h1>
        <p>This is a test email to verify our MailerLite integration.</p>
        <p>If you received this, everything is working correctly!</p>
      `,
      debug: true // Enable detailed logging
    })

    if (result.error) {
      console.error("❌ Test failed:", result.error)
      return { success: false, error: result.error }
    }

    console.log("✅ Test successful! Check your email.")
    return { success: true, data: result.data }
  } catch (error) {
    console.error("❌ Test failed with exception:", error)
    return { success: false, error: String(error) }
  }
}