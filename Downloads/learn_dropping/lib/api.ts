// API helper functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export const apiCall = async <T,>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "An error occurred",
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    }
  }
}
