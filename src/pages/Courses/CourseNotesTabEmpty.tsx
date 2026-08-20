import { COURSE_TAB_COUNTS_EMPTY } from '@/data/courses'
import { CourseNotesTabShell } from './CourseNotesTab'

/** فيجما frame: v3-course-notes-tab-empty (node 2009:5258) */
export default function CourseNotesTabEmpty() {
  return (
    <CourseNotesTabShell summaries={[]} counts={COURSE_TAB_COUNTS_EMPTY} />
  )
}
