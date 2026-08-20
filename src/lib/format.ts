/** تنسيق أرقام وتواريخ وعملة — كل الأرقام لاتينية زي الديزاين */

export const formatNumber = (n: number) => n.toLocaleString('en-US')

export const formatEGP = (n: number) => `${n.toLocaleString('en-US')} ج.م`

export const formatDateTime = (iso: string) => iso.replace('T', ' ').slice(0, 16)

export const formatDate = (iso: string) => iso.slice(0, 10)

/** "منذ 3 ساعات" وهكذا */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'الآن'
  if (m < 60) return `منذ ${m} دقيقة`
  const h = Math.floor(m / 60)
  if (h < 24) return `منذ ${h} ساعة`
  const d = Math.floor(h / 24)
  if (d < 30) return `منذ ${d} يوم`
  return `منذ ${Math.floor(d / 30)} شهر`
}
