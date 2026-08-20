/** دمج كلاسات مشروطة بدون تبعيات خارجية */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
