// Auth helper functions
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("authToken")
}

export const setAuthToken = (token: string): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("authToken", token)
}

export const clearAuthToken = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem("authToken")
}

export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null
}
