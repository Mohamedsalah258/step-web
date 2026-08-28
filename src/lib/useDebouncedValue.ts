import { useEffect, useState } from 'react'

/** بيرجّع نسخة متأخرة من value بعد ما المستخدم يوقف عن الكتابة — لتقليل نداءات البحث */
export function useDebouncedValue<T>(value: T, delayMs = 400): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}
