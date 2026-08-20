import { COURSE_TAB_COUNTS_EMPTY } from '@/data/courses'
import { CourseNotesShell } from './CourseNotes'

/** فيجما frame: v3-course-notes-empty (node 2009:5140) */
export default function CourseNotesEmpty() {
  return <CourseNotesShell notes={[]} counts={COURSE_TAB_COUNTS_EMPTY} />
}
