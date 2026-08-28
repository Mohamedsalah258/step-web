import CoursesList from './CoursesList'

/**
 * فيجما frame: v3-courses-list-empty (node 2009:4914) — بقت نفس الصفحة
 * الحقيقية بالحرف (زي StudentsFiltered/StudentsList) لأنها دلوقتي بتاخد
 * بياناتها من الـ API وبتعرض EmptyState تلقائي لو فعلاً مفيش كورسات.
 */
export default function CoursesListEmpty() {
  return <CoursesList />
}
