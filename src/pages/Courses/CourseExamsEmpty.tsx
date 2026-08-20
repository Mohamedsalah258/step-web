import { COURSE_TAB_COUNTS_EMPTY } from '@/data/courses'
import { CourseExamsShell } from './CourseExams'

/** فيجما frame: v3-course-exams-empty (node 2009:5376) */
export default function CourseExamsEmpty() {
  return <CourseExamsShell exams={[]} counts={COURSE_TAB_COUNTS_EMPTY} />
}
