import { useEffect } from 'react'

/** يمنع سكرول الصفحة اللي وراها لما أوفرلاي (سايدبار موبايل / درج) يكون مفتوح */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [locked])
}
