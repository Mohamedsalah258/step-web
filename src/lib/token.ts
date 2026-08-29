/**
 * تخزين توكن الأدمن (JWT) — طبقة معزولة عشان أي تعديل مستقبلي
 * (مثلاً التحويل لـ httpOnly cookie) يتم في مكان واحد بس.
 */
const TOKEN_KEY = 'step_admin_token'

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // localStorage ممكن يكون متقفل (وضع خاص مثلاً) — تجاهل بأمان
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // نفس الشيء
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null
}
