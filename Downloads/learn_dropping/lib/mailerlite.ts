// MailerLite v3 API Types
interface MailerLiteResponse {
  success: boolean
  data?: any
  message?: string
  status: number
}

interface SubscriberFields {
  name?: string
  [key: string]: any
}

interface SubscriberData {
  email: string
  fields?: SubscriberFields
  status?: 'active' | 'unsubscribed' | 'bounced' | 'junk' | 'unconfirmed'
}

// MailerLite API Configuration
const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY
const MAILERLITE_API_BASE = "https://connect.mailerlite.com/api"

export async function mailerliteRequest(
  endpoint: string,
  method: string,
  data?: any,
  debug: boolean = false
): Promise<MailerLiteResponse> {
  if (!MAILERLITE_API_KEY) {
    console.error("❌ MailerLite API key not configured")
    return { success: false, message: "API key not configured", status: 500 }
  }

  try {
    if (debug) {
      console.log(`🔄 MailerLite ${method} ${endpoint}`, { data })
    }

    const response = await fetch(`${MAILERLITE_API_BASE}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${MAILERLITE_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    })

    const responseData = await response.json()

    if (debug) {
      console.log(`📝 MailerLite response (${response.status}):`, responseData)
    }

    if (!response.ok) {
      console.error("❌ MailerLite API Error:", responseData)
      return { 
        success: false, 
        message: responseData.error?.message || "Request failed",
        status: response.status,
        data: responseData
      }
    }

    return { 
      success: true, 
      data: responseData, 
      status: response.status 
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error(`❌ MailerLite network error (${endpoint}):`, message)
    return { 
      success: false, 
      message, 
      status: 500 
    }
  }
}

// ✅ 1. Add or update a subscriber in a MailerLite group (v3 endpoint)
export async function addToGroup(options: {
  groupId: string
  email: string
  name?: string
  fields?: SubscriberFields
  debug?: boolean
}): Promise<MailerLiteResponse> {
  if (!options.email || !options.email.includes('@')) {
    return {
      success: false,
      message: "Invalid email address",
      status: 400
    }
  }

  const subscriberData: SubscriberData = {
    email: options.email,
    fields: {
      name: options.name || "",
      ...(options.fields || {})
    },
    status: 'active'
  }

  if (options.debug) {
    console.log("📨 Adding subscriber to group:", {
      groupId: options.groupId,
      ...subscriberData
    })
  }

  const response = await mailerliteRequest(
    `/groups/${options.groupId}/subscribers`,
    "POST",
    subscriberData,
    options.debug
  )

  if (!response.success) {
    console.error(`❌ Failed to sync ${options.email} to group ${options.groupId}`, {
      status: response.status,
      message: response.message
    })
  } else if (options.debug) {
    console.log(`✅ Successfully added ${options.email} to group ${options.groupId}`)
  }

  return response
}

// ✅ 2. Send a transactional email using MailerLite v3
export async function sendTransactionalEmail(options: {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
  debug?: boolean
}) {
  const emailData = {
    to: options.to,
    subject: options.subject,
    from: options.from || "Learn Drop <noreply@learndrop.com>",
    html: options.html,
    text: options.text || "",
  }

  if (options.debug) console.log("📧 Sending transactional email:", emailData)

  return mailerliteRequest("/emails/send", "POST", emailData, options.debug)
}

// ✅ 3. Create and send a campaign (v3 endpoint)
export async function sendCampaign(options: {
  subject: string
  groupId: string
  html: string
  fromName?: string
  fromEmail?: string
  debug?: boolean
}) {
  const campaignData = {
    subject: options.subject,
    from_name: options.fromName || "Learn Drop",
    from_email: options.fromEmail || "noreply@learndrop.com",
    groups: [options.groupId],
    type: "regular",
    html: options.html,
  }

  if (options.debug) console.log("🚀 Creating MailerLite campaign:", campaignData)

  return mailerliteRequest("/campaigns", "POST", campaignData, options.debug)
}



// Add this function to your mailerlite.ts
export async function listGroups(debug: boolean = false): Promise<MailerLiteResponse> {
  if (debug) console.log("🔍 GET /groups");
  return mailerliteRequest("/groups", "GET", undefined, debug);
}