import { COURSES_LIST_TABS_EMPTY } from '@/data/courses'
import { CoursesListShell } from './CoursesList'

/** فيجما frame: v3-courses-list-empty (node 2009:4914) */
export default function CoursesListEmpty() {
  return <CoursesListShell tabs={COURSES_LIST_TABS_EMPTY} rows={[]} empty />
}
