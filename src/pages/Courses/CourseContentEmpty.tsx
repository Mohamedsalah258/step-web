import { COURSE_TAB_COUNTS_EMPTY } from '@/data/courses'
import { CourseContentShell } from './CourseContent'

/** فيجما frame: v3-courses-content-empty (node 2009:5023) */
export default function CourseContentEmpty() {
  return <CourseContentShell videos={[]} counts={COURSE_TAB_COUNTS_EMPTY} />
}
