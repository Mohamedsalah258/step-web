import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdminLayout } from '@/components/layout/AdminLayout'

import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Auth/Login'

/* طلبات الشراء */
import OrdersList from '@/pages/Orders/OrdersList'
import OrdersFiltered from '@/pages/Orders/OrdersFiltered'
import OrderApproveModal from '@/pages/Orders/OrderApproveModal'
import OrderRejectModal from '@/pages/Orders/OrderRejectModal'
import OrderApproved from '@/pages/Orders/OrderApproved'
import OrderRejected from '@/pages/Orders/OrderRejected'

/* الهيكل الأكاديمي */
import Universities from '@/pages/Academic/Universities'
import Colleges from '@/pages/Academic/Colleges'
import Specializations from '@/pages/Academic/Specializations'
import Stages from '@/pages/Academic/Stages'
import Terms from '@/pages/Academic/Terms'
import TermReset from '@/pages/Academic/TermReset'
import TermResetConfirm from '@/pages/Academic/TermResetConfirm'
import AddUniversityModal from '@/pages/Academic/AddUniversityModal'
import AddCollegeModal from '@/pages/Academic/AddCollegeModal'
import AddSpecializationModal from '@/pages/Academic/AddSpecializationModal'
import AddStageModal from '@/pages/Academic/AddStageModal'
import AddTermModal from '@/pages/Academic/AddTermModal'

/* الكورسات */
import CoursesList from '@/pages/Courses/CoursesList'
import CoursesListEmpty from '@/pages/Courses/CoursesListEmpty'
import CourseContent from '@/pages/Courses/CourseContent'
import CourseContentEmpty from '@/pages/Courses/CourseContentEmpty'
import CourseNotes from '@/pages/Courses/CourseNotes'
import CourseNotesEmpty from '@/pages/Courses/CourseNotesEmpty'
import CourseNotesTab from '@/pages/Courses/CourseNotesTab'
import CourseNotesTabEmpty from '@/pages/Courses/CourseNotesTabEmpty'
import CourseExams from '@/pages/Courses/CourseExams'
import CourseExamsEmpty from '@/pages/Courses/CourseExamsEmpty'
import ExamDetail from '@/pages/Courses/ExamDetail'
import AddCourseModal from '@/pages/Courses/AddCourseModal'
import EditCourseModal from '@/pages/Courses/EditCourseModal'
import EditVideoModal from '@/pages/Courses/EditVideoModal'
import EditNoteModal from '@/pages/Courses/EditNoteModal'
import EditExamModal from '@/pages/Courses/EditExamModal'

/* الطلاب والأجهزة */
import StudentsList from '@/pages/Students/StudentsList'
import StudentsFiltered from '@/pages/Students/StudentsFiltered'
import StudentDetail from '@/pages/Students/StudentDetail'
import StudentDetailAlt from '@/pages/Students/StudentDetailAlt'
import DeviceResetModal from '@/pages/Students/DeviceResetModal'
import CancelSubModal from '@/pages/Students/CancelSubModal'
import OpenCourseModal from '@/pages/Students/OpenCourseModal'
import UnbanModal from '@/pages/Students/UnbanModal'
import ActivityLog from '@/pages/Students/ActivityLog'

/* طرق الدفع */
import PaymentMethods from '@/pages/Payments/PaymentMethods'
import AddWalletModal from '@/pages/Payments/AddWalletModal'
import AddBankModal from '@/pages/Payments/AddBankModal'

/* التقارير */
import ReportsOverview from '@/pages/Reports/ReportsOverview'
import ReportStudents from '@/pages/Reports/ReportStudents'
import ReportOrders from '@/pages/Reports/ReportOrders'
import ReportDevices from '@/pages/Reports/ReportDevices'

/* المحتوى والإعدادات */
import Notifications from '@/pages/Content/Notifications'
import Banners from '@/pages/Content/Banners'
import PagesPolicies from '@/pages/Content/PagesPolicies'
import PolicyRefund from '@/pages/Content/PolicyRefund'
import PolicyTerms from '@/pages/Content/PolicyTerms'
import Maintenance from '@/pages/Content/Maintenance'
import Settings from '@/pages/Content/Settings'

/* حالات العرض */
import StateEmpty from '@/pages/States/StateEmpty'
import StateSkeleton from '@/pages/States/StateSkeleton'
import StateError from '@/pages/States/StateError'

/**
 * كل فريم في فيجما = مسار مستقل.
 * المودالز بتتركّب فوق شاشتها الأصلية (الشاشة element والمودال children)،
 * فالإغلاق (navigate(-1)) بيرجع للقائمة.
 */
export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },

  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },

      /* ── طلبات الشراء ── */
      {
        path: 'orders',
        element: <OrdersList />,
        children: [
          { path: ':id/approve', element: <OrderApproveModal /> },
          { path: ':id/reject', element: <OrderRejectModal /> },
        ],
      },
      { path: 'orders/filtered', element: <OrdersFiltered /> },
      { path: 'orders/:id/approved', element: <OrderApproved /> },
      { path: 'orders/:id/rejected', element: <OrderRejected /> },

      /* ── الهيكل الأكاديمي ── */
      {
        path: 'academic',
        children: [
          { index: true, element: <Navigate to="universities" replace /> },
          {
            path: 'universities',
            element: <Universities />,
            children: [{ path: 'add', element: <AddUniversityModal /> }],
          },
          {
            path: 'colleges',
            element: <Colleges />,
            children: [{ path: 'add', element: <AddCollegeModal /> }],
          },
          {
            path: 'specializations',
            element: <Specializations />,
            children: [{ path: 'add', element: <AddSpecializationModal /> }],
          },
          {
            path: 'stages',
            element: <Stages />,
            children: [{ path: 'add', element: <AddStageModal /> }],
          },
          {
            path: 'terms',
            element: <Terms />,
            children: [{ path: 'add', element: <AddTermModal /> }],
          },
          {
            path: 'terms/reset',
            element: <TermReset />,
            children: [{ path: 'confirm', element: <TermResetConfirm /> }],
          },
        ],
      },

      /* ── الكورسات ── */
      {
        path: 'courses',
        element: <CoursesList />,
        children: [{ path: 'add', element: <AddCourseModal /> }],
      },
      { path: 'courses/empty', element: <CoursesListEmpty /> },
      {
        path: 'courses/:id/content',
        element: <CourseContent />,
        children: [{ path: ':videoId/edit', element: <EditVideoModal /> }],
      },
      { path: 'courses/:id/content/empty', element: <CourseContentEmpty /> },
      {
        path: 'courses/:id/notes',
        element: <CourseNotes />,
        children: [{ path: ':noteId/edit', element: <EditNoteModal /> }],
      },
      { path: 'courses/:id/notes/empty', element: <CourseNotesEmpty /> },
      {
        path: 'courses/:id/notes-tab',
        element: <CourseNotesTab />,
        children: [{ path: ':noteId/edit', element: <EditNoteModal /> }],
      },
      {
        path: 'courses/:id/notes-tab/empty',
        element: <CourseNotesTabEmpty />,
      },
      { path: 'courses/:id/exams', element: <CourseExams /> },
      { path: 'courses/:id/exams/empty', element: <CourseExamsEmpty /> },
      {
        path: 'courses/:id/exams/:examId',
        element: <ExamDetail />,
        children: [{ path: 'edit', element: <EditExamModal /> }],
      },
      {
        path: 'courses/:id/edit',
        element: <CoursesList />,
        children: [{ index: true, element: <EditCourseModal /> }],
      },

      /* ── الطلاب والأجهزة ── */
      { path: 'students', element: <StudentsList /> },
      { path: 'students/filtered', element: <StudentsFiltered /> },
      { path: 'students/activity-log', element: <ActivityLog /> },
      {
        path: 'students/:id',
        element: <StudentDetail />,
        children: [
          { path: 'device-reset', element: <DeviceResetModal /> },
          { path: 'cancel-sub', element: <CancelSubModal /> },
          { path: 'open-course', element: <OpenCourseModal /> },
          { path: 'unban', element: <UnbanModal /> },
        ],
      },
      { path: 'students/:id/alt', element: <StudentDetailAlt /> },

      /* ── طرق الدفع ── */
      {
        path: 'payments',
        element: <PaymentMethods />,
        children: [
          { path: 'add-wallet', element: <AddWalletModal /> },
          { path: 'add-bank', element: <AddBankModal /> },
        ],
      },

      /* ── التقارير ── */
      { path: 'reports', element: <ReportsOverview /> },
      { path: 'reports/students', element: <ReportStudents /> },
      { path: 'reports/orders', element: <ReportOrders /> },
      { path: 'reports/devices', element: <ReportDevices /> },

      /* ── المحتوى والإعدادات ── */
      { path: 'notifications', element: <Notifications /> },
      { path: 'banners', element: <Banners /> },
      { path: 'pages', element: <PagesPolicies /> },
      { path: 'pages/refund', element: <PolicyRefund /> },
      { path: 'pages/terms', element: <PolicyTerms /> },
      { path: 'maintenance', element: <Maintenance /> },
      { path: 'settings', element: <Settings /> },

      /* ── حالات العرض (فارغ / تحميل / خطأ) ── */
      { path: 'states/empty', element: <StateEmpty /> },
      { path: 'states/skeleton', element: <StateSkeleton /> },
      { path: 'states/error', element: <StateError /> },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
])
