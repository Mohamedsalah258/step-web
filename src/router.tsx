import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { RequireAuth } from '@/components/layout/RequireAuth'

import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Auth/Login'
import PolicyView from '@/pages/Public/PolicyView'

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
import EditUniversityModal from '@/pages/Academic/EditUniversityModal'
import DeleteUniversityModal from '@/pages/Academic/DeleteUniversityModal'
import EditCollegeModal from '@/pages/Academic/EditCollegeModal'
import DeleteCollegeModal from '@/pages/Academic/DeleteCollegeModal'
import EditSpecializationModal from '@/pages/Academic/EditSpecializationModal'
import DeleteSpecializationModal from '@/pages/Academic/DeleteSpecializationModal'
import EditStageModal from '@/pages/Academic/EditStageModal'
import DeleteStageModal from '@/pages/Academic/DeleteStageModal'
import EditTermModal from '@/pages/Academic/EditTermModal'
import DeleteTermModal from '@/pages/Academic/DeleteTermModal'

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
import CourseStatsModal from '@/pages/Courses/CourseStatsModal'
import EditVideoModal from '@/pages/Courses/EditVideoModal'
import EditNoteModal from '@/pages/Courses/EditNoteModal'
import EditSummaryModal from '@/pages/Courses/EditSummaryModal'
import EditExamModal from '@/pages/Courses/EditExamModal'
import { CourseDetailLayout } from '@/pages/Courses/courses-parts'

/* الطلاب والأجهزة */
import StudentsList from '@/pages/Students/StudentsList'
import StudentsFiltered from '@/pages/Students/StudentsFiltered'
import StudentDetail from '@/pages/Students/StudentDetail'
import StudentDetailAlt from '@/pages/Students/StudentDetailAlt'
import DeviceResetModal from '@/pages/Students/DeviceResetModal'
import CancelSubModal from '@/pages/Students/CancelSubModal'
import ReactivateSubModal from '@/pages/Students/ReactivateSubModal'
import OpenCourseModal from '@/pages/Students/OpenCourseModal'
import UnbanModal from '@/pages/Students/UnbanModal'
import ActivityLog from '@/pages/Students/ActivityLog'

/* طرق الدفع */
import PaymentMethods from '@/pages/Payments/PaymentMethods'
import AddWalletModal from '@/pages/Payments/AddWalletModal'
import AddBankModal from '@/pages/Payments/AddBankModal'
import EditMethodModal from '@/pages/Payments/EditMethodModal'
import DeletePaymentMethodModal from '@/pages/Payments/DeletePaymentMethodModal'

/* التقارير */
import ReportsOverview from '@/pages/Reports/ReportsOverview'
import ReportStudents from '@/pages/Reports/ReportStudents'
import ReportOrders from '@/pages/Reports/ReportOrders'
import ReportDevices from '@/pages/Reports/ReportDevices'

/* تذاكر الدعم */
import Tickets from '@/pages/Support/Tickets'
import TicketDetail from '@/pages/Support/TicketDetail'

/* المحتوى والإعدادات */
import Notifications from '@/pages/Content/Notifications'
import Banners from '@/pages/Content/Banners'
import EditBannerModal from '@/pages/Content/EditBannerModal'
import PagesPolicies from '@/pages/Content/PagesPolicies'
import PolicyRefund from '@/pages/Content/PolicyRefund'
import PolicyTerms from '@/pages/Content/PolicyTerms'
import PolicyDeletion from '@/pages/Content/PolicyDeletion'
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
  /* صفحات قانونية عامة — خارج RequireAuth عمدًا، زائر مش مسجّل دخول يقدر يفتحها
     مباشرة من شاشة اللوجين (شوف LOGIN_POLICIES في data/auth.ts) */
  { path: '/legal/:slug', element: <PolicyView /> },

  {
    path: '/',
    element: <RequireAuth />,
    children: [
      {
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
      {
        path: 'orders/filtered',
        element: <OrdersFiltered />,
        children: [
          { path: ':id/approve', element: <OrderApproveModal /> },
          { path: ':id/reject', element: <OrderRejectModal /> },
        ],
      },
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
            children: [
              { path: 'add', element: <AddUniversityModal /> },
              { path: ':id/edit', element: <EditUniversityModal /> },
              { path: ':id/delete', element: <DeleteUniversityModal /> },
            ],
          },
          {
            path: 'colleges',
            element: <Colleges />,
            children: [
              { path: 'add', element: <AddCollegeModal /> },
              { path: ':id/edit', element: <EditCollegeModal /> },
              { path: ':id/delete', element: <DeleteCollegeModal /> },
            ],
          },
          {
            path: 'specializations',
            element: <Specializations />,
            children: [
              { path: 'add', element: <AddSpecializationModal /> },
              { path: ':id/edit', element: <EditSpecializationModal /> },
              { path: ':id/delete', element: <DeleteSpecializationModal /> },
            ],
          },
          {
            path: 'stages',
            element: <Stages />,
            children: [
              { path: 'add', element: <AddStageModal /> },
              { path: ':id/edit', element: <EditStageModal /> },
              { path: ':id/delete', element: <DeleteStageModal /> },
            ],
          },
          {
            path: 'terms',
            element: <Terms />,
            children: [
              { path: 'add', element: <AddTermModal /> },
              { path: ':id/edit', element: <EditTermModal /> },
              { path: ':id/delete', element: <DeleteTermModal /> },
            ],
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
        children: [
          { path: 'add', element: <AddCourseModal /> },
          { path: ':id/stats', element: <CourseStatsModal /> },
        ],
      },
      { path: 'courses/empty', element: <CoursesListEmpty /> },
      {
        /*
         * غلاف مشترك للتابس الأربعة (محتوى/مذكرات/ملاحظات/امتحانات) —
         * parent route واحد بيفضل mounted وانت بتنقّل بينهم، فبيانات الكورس
         * (الهيدر) متجابة مرة واحدة بس مش بتتحمّل من الأول مع كل تبديل تاب
         * (شوف CourseDetailLayout في courses-parts.tsx).
         */
        path: 'courses/:id',
        element: <CourseDetailLayout />,
        children: [
          {
            path: 'content',
            element: <CourseContent />,
            children: [
              { path: 'edit', element: <EditCourseModal /> },
              { path: ':videoId/edit', element: <EditVideoModal /> },
            ],
          },
          {
            path: 'notes',
            element: <CourseNotes />,
            children: [
              { path: 'edit', element: <EditCourseModal /> },
              { path: ':noteId/edit', element: <EditNoteModal /> },
            ],
          },
          {
            path: 'notes-tab',
            element: <CourseNotesTab />,
            children: [
              { path: 'edit', element: <EditCourseModal /> },
              { path: ':noteId/edit', element: <EditSummaryModal /> },
            ],
          },
          {
            path: 'exams',
            element: <CourseExams />,
            children: [{ path: 'edit', element: <EditCourseModal /> }],
          },
        ],
      },
      { path: 'courses/:id/content/empty', element: <CourseContentEmpty /> },
      { path: 'courses/:id/notes/empty', element: <CourseNotesEmpty /> },
      {
        path: 'courses/:id/notes-tab/empty',
        element: <CourseNotesTabEmpty />,
      },
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
          { path: 'subscriptions/:subId/cancel', element: <CancelSubModal /> },
          { path: 'subscriptions/:subId/reactivate', element: <ReactivateSubModal /> },
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
          { path: ':id/edit', element: <EditMethodModal /> },
          { path: ':id/delete', element: <DeletePaymentMethodModal /> },
        ],
      },

      /* ── التقارير ── */
      { path: 'reports', element: <ReportsOverview /> },
      { path: 'reports/students', element: <ReportStudents /> },
      { path: 'reports/orders', element: <ReportOrders /> },
      { path: 'reports/devices', element: <ReportDevices /> },

      /* ── تذاكر الدعم ── */
      { path: 'tickets', element: <Tickets /> },
      { path: 'tickets/:id', element: <TicketDetail /> },

      /* ── المحتوى والإعدادات ── */
      { path: 'notifications', element: <Notifications /> },
      {
        path: 'banners',
        element: <Banners />,
        children: [{ path: ':id/edit', element: <EditBannerModal /> }],
      },
      { path: 'pages', element: <PagesPolicies /> },
      { path: 'pages/refund', element: <PolicyRefund /> },
      { path: 'pages/terms', element: <PolicyTerms /> },
      { path: 'pages/deletion', element: <PolicyDeletion /> },
      { path: 'maintenance', element: <Maintenance /> },
      { path: 'settings', element: <Settings /> },

      /* ── حالات العرض (فارغ / تحميل / خطأ) ── */
      { path: 'states/empty', element: <StateEmpty /> },
      { path: 'states/skeleton', element: <StateSkeleton /> },
      { path: 'states/error', element: <StateError /> },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
])
