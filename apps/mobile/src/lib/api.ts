import AsyncStorage from "@react-native-async-storage/async-storage";

// Set EXPO_PUBLIC_API_URL to your computer's LAN address when testing on a physical phone.
export const API_URL = (process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000/api/v1").replace(/\/$/, "");
export async function apiRequest<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = Array.isArray(payload.message) ? payload.message.join("; ") : payload.message;
    throw new Error(message || `Yêu cầu thất bại (${response.status})`);
  }
  return payload as T;
}
export { AsyncStorage };
