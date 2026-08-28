/**
 * تخزين توكن الأدمن (JWT) — نفس المفتاح مستخدم بين هنا وبين `api/client.ts`
 * اللي بيرفق الهيدر `Authorization: Bearer` تلقائيًا في كل ريكوست.
 */
const TOKEN_KEY = 'step_admin_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return getToken() !== null
}
