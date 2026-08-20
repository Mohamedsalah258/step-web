# WORKFLOW.md — مرجع الفلو والحالة الحالية

> **اقرأ الملف ده كامل قبل أي تعديل.** هو ذاكرة المشروع: بيقول إيه اتبنى، ليه اتبنى
> كده، وإزاي تضيف أو تعدّل من غير ما تعيد اكتشاف أي حاجة من الأول.
>
> **وبعد أي تعديل — حدّث الملف ده** (القسم المتأثر + سجل التغييرات في الآخر).
> ده مش اختياري: أي تعديل من غير تحديث هنا معناه إن اللي بعدك هيبدأ يفكر من الصفر.

**آخر تحديث:** 2026-08-20 · **الحالة:** 62 شاشة مكتملة · build و typecheck نضاف

---

## 1. الملفات المرجعية — إيه بيقرأ إيه

| الملف | بيجاوب على | امتى تفتحه |
|---|---|---|
| **WORKFLOW.md** (ده) | الفلو · الحالة · قرارات التصميم · خريطة فيجما · بروتوكول التعديل | **الأول دايمًا** |
| `DESIGN_SYSTEM.md` | التوكنز · قواعد RTL بالتفصيل · واجهة (API) كل كومبوننت مشترك | قبل ما تكتب JSX |
| `README.md` | التشغيل · هيكل المجلدات · المسارات | لو انت جديد على المشروع |
| `CLAUDE.md` | مؤشّر مختصر بيوديك هنا | تلقائيًا من بعض الأدوات |
| `docs/original-brief.md` | البريف الأصلي بتاع صاحب المشروع (أرشيف) | للرجوع التاريخي بس |

---

## 2. الفلو الأصلي — إزاي المشروع اتبنى

ده الترتيب اللي اتنفّذ، ومهم تفهمه عشان أي إضافة تمشي بنفس المنطق:

```
1. قراءة فيجما          → get_metadata على الصفحة → قائمة الفريمات (64)
2. استخراج نظام الديزاين → get_design_context على sidebar + top-bar + content-body
                            للداشبورد → التوكنز (ألوان/خطوط/radii/ظلال)
3. تجهيز المشروع        → Vite + React 18 + TS strict + Tailwind 3 + react-router 6
                            التوكنز اتحطّت في tailwind.config.js مش في الكود
4. اللايوت والكومبوننتس  → AdminLayout · Sidebar · TopBar · Page
                            + 16 كومبوننت في components/ui + charts
5. ✅ تحقق بصري مبكر     → build → screenshot للداشبورد → مقارنة بفيجما
                            (هنا اكتشفنا مشكلة RTL — شوف القرار #1)
6. البيانات             → ملف data/<domain>.ts لكل دومين، نصوص فيجما بالحرف
7. الشاشات              → صفحة لكل فريم، بتستورد من data/ ومن components/
8. الراوتر              → router.tsx: مسار لكل فريم، المودالز child routes
9. ✅ تحقق شامل         → typecheck + build + sweep على كل المسارات في متصفح حقيقي
10. التسليم             → D:\Step
```

**المبدأ اللي بيحكم الفلو ده:** تحقق بصري بدري (خطوة 5) قبل ما تتبني 60 شاشة
على أساس غلط. اللي اتكسب من الخطوة دي إننا لقينا الـ RTL مقلوب بعد شاشة واحدة
مش بعد 62.

---

## 3. القرارات المعمارية — ليه الكود كده

> دي أهم فقرة في الملف. كل قرار هنا اتاخد لسبب، ولو غيّرته من غير ما تفهم
> السبب هتكسر حاجة.

### قرار #1 — RTL بالكلاسات الفيزيائية مش المنطقية ⚠️

**المشكلة:** في `dir="rtl"`، كلاسات تايلويند المنطقية بتنعكس:
`text-end` = **يسار** · `justify-end` = **يسار** · `items-end` = **يسار**.
أول نسخة اتبنت بيها فطلعت الشاشة كلها مرآة (سايدبار شمال، أعمدة معكوسة).

**القرار:** للمحاذاة الأفقية بنستخدم **فيزيائي** — `text-right` / `text-left`،
و`justify-start` معناها "ادفع لليمين". `ps-*` / `pe-*` / `ms-*` / `me-*` لسه
مستخدمة عادي للـ padding والـ margin (دي بتشتغل صح).

**كمان:** في أي `flex-row`، **أول عنصر في الـ DOM يظهر على اليمين**.
كود فيجما مكتوب LTR (أول عنصر = يسار) ⇒ **لازم تعكس الترتيب** لما تحوّل صف.

**استثناء واحد:** الشارتس اللي إحداثياتها SVG (`LineChart` · `VBarChart`)
جواها `dir="ltr"`، فمصفوفاتها بترتيب الشمال→اليمين زي فيجما بالظبط.

### قرار #2 — كلاسين للأرقام: `num` و `mono`

| الكلاس | لإيه | ليه |
|---|---|---|
| `num` | لاتيني/رقمي **صافي**: `2026-05-24` · `INSTA-9923812` · `2.4 MB` | بيجبر LTR عشان ما يتبعترش |
| `mono` | **مخلوط** عربي+رقم: `234 طالب` · `350 ج.م` · `12 فيديو` | نفس الخط بدون فرض اتجاه |

**ما تستخدمش `num` مع نص فيه حروف عربية** — بيقلب ترتيب الكلمة والرقم.

### قرار #3 — الأيقونات من `lucide-react` مش من فيجما

كل أيقونات الديزاين أصلًا Lucide بنفس الأسماء (`graduation-cap` → `GraduationCap`).
فبنستوردها من المكتبة — مفيش SVG منزّل ولا أصول من فيجما (روابط أصول فيجما
بتنتهي بعد 7 أيام أصلًا).

### قرار #4 — كل مودال = child route

كل مودال في فيجما فريم مستقل فوق شاشته. في الكود:
```tsx
{ path: 'terms', element: <Terms />, children: [{ path: 'add', element: <AddTermModal /> }] }
```
`Page` فيه `<Outlet />` في آخره، فالمودال بيترسم فوق الشاشة الأصلية،
و`navigate(-1)` بيقفله ويرجّع القائمة. **ما تعملش state محلي للمودالز.**

### قرار #5 — البيانات منفصلة تمامًا عن الـ JSX

مفيش نص عربي أو رقم مكتوب inline في أي صفحة. كله في `src/data/<domain>.ts`
بنصوص فيجما **بالحرف** (بدون إعادة صياغة). ده اللي بيخلّي ربط الباك إند
لاحقًا يبقى تبديل ملفات `data/` بس.

### قرار #6 — الشارتس SVG/CSS بدون مكتبات

مفيش recharts ولا d3. الأربع شارتس في `components/charts/Charts.tsx`.
القيم متحوّلة من إحداثيات فيجما بالبكسل — **التحويل موثّق في كومنت** جنب كل
مجموعة بيانات (شوف `data/dashboard.ts` → `ORDERS_TREND`، و`data/reports.ts`).

### قرار #7 — الصور بلوكات بديلة

الإيصالات والبنرات ومعاينة الـ PDF: بلوكات بنفس مقاسات الديزاين فيها أيقونة.
محتاجة أصول حقيقية من صاحب المشروع.

---

## 4. الحالة الحالية

```
62 شاشة · 102 ملف · ~10,700 سطر · typecheck نضيف · build نضيف
sweep على 62 مسار في متصفح حقيقي → صفر خطأ runtime
```

| الدومين | شاشات | مجلد الصفحات | ملف البيانات |
|---|---|---|---|
| لوحة التحكم | 1 | `pages/Dashboard.tsx` | `data/dashboard.ts` |
| تسجيل الدخول | 1 | `pages/Auth/` | `data/auth.ts` |
| طلبات الشراء | 6 | `pages/Orders/` | `data/orders.ts` |
| الهيكل الأكاديمي | 12 | `pages/Academic/` | `data/academic.ts` |
| الكورسات | 16 | `pages/Courses/` | `data/courses.ts` |
| الطلاب والأجهزة | 9 | `pages/Students/` | `data/students.ts` |
| طرق الدفع | 3 | `pages/Payments/` | `data/payments.ts` |
| التقارير | 4 | `pages/Reports/` | `data/reports.ts` |
| المحتوى والإعدادات | 7 | `pages/Content/` | `data/content.ts` |
| حالات العرض | 3 | `pages/States/` | — |

### الكومبوننتس المشتركة الموجودة

`layout/` → AdminLayout · Sidebar · TopBar · Page
`ui/` → Card/CardHeader/CardBody · Button/ButtonLink/IconButton · Badge/StatusBadge
· DataTable/Truncate/RowActions · SearchField/FilterSelect/DateField/TextField/
SelectField/TextArea/ToggleRow/Checkbox · Switch · Modal/ModalButton/ModalField/
ModalSelect/ModalTextArea/ModalToggleRow/ModalNotice · Tabs/RouteTabs · StatCard/StatRow
· EmptyState/ErrorState/TableSkeleton/CardSkeleton · Breadcrumb/FilterRow/Pagination/
InfoRow/InfoGrid/IconBubble/ProgressBar
`charts/` → LineChart · HBarChart · VBarChart · DonutChart

**قبل ما تكتب أي كومبوننت جديد، دوّر في القايمة دي.** الواجهات الكاملة في `DESIGN_SYSTEM.md`.

### أجزاء خاصة بدومين واحد (مش في `components/`)

`pages/Orders/orders-parts.tsx` · `pages/Courses/courses-parts.tsx` ·
`pages/Academic/AcademicTable.tsx` · `pages/Students/students-parts.tsx` ·
`pages/Payments/payment-parts.tsx` · `pages/Reports/reports-parts.tsx` ·
`pages/Content/content-parts.tsx`

---

## 5. بروتوكول التعديل — اعمل كده

### أ) تعديل شاشة موجودة
1. هات الـ node id بتاعها من **جدول خريطة فيجما** (قسم 6) — مكتوب كمان في كومنت
   فوق كل صفحة.
2. لو محتاج تراجع الديزاين: `get_design_context` على **الـ `content-body` child**
   مش الفريم كامل (الفريم الكامل بيرجع error أو بيغرق الكونتكست).
   **ما تقراش** الـ `sidebar` ولا الـ `top-bar` — دول كومبوننتس مشتركة خلاص.
3. عدّل الصفحة و/أو ملف الـ `data/` بتاعها.
4. `npm run build` → لازم يعدّي نضيف.
5. **حدّث سجل التغييرات في آخر الملف ده.**

### ب) إضافة شاشة جديدة
1. البيانات الأول في `data/<domain>.ts`.
2. الصفحة في `pages/<Domain>/<Name>.tsx` بـ `export default`، وكومنت فوقها فيه
   الـ node id لو جاية من فيجما.
3. المسار في `router.tsx` (المودال = `children` تحت شاشته).
4. لو محتاجة عنصر في السايدبار → `lib/nav.ts`.
5. build + حدّث قسم 4 وقسم 6 وسجل التغييرات.

### ج) تغيير في نظام الديزاين
التوكنز في `tailwind.config.js` بس — **صفر hex في الكومبوننتس**.
لو غيّرت لون أو مقاس، حدّث جدول التوكنز في `DESIGN_SYSTEM.md` كمان.

### د) ربط باك إند
بدّل الـ exports في `data/*.ts` بنداءات API أو hooks بنفس الأسماء والأنواع.
الصفحات ما تتغيرش. الأنواع (`Course`, `PurchaseOrder`, `Student`...) معرّفة
في نفس ملفات الـ data وهي العقد بين الطبقتين.

### هـ) فحوصات لازمة قبل ما تقول "خلصت"
```bash
npm run build                                   # typecheck + build، صفر أخطاء
grep -rE "#[0-9a-fA-F]{6}" src/components src/pages   # المفروض صفر (hex في الكود)
grep -rn "text-end\|justify-end\|items-end" src/      # راجع كل نتيجة — غالبًا غلط
```
> `justify-end` و `items-end` مقبولين **بس** في المحاور الرأسية
> (زي `items-end` جوه `flex-row` = محاذاة تحت). أي استخدام أفقي = غلط.

---

## 6. خريطة فيجما → الكود

`fileKey = 5tJR1BTN8fFBkm58hKHhsL` · الصفحة `7:2` (STEP Dashboard)

| node | الشاشة | الملف |
|---|---|---|
| `7:6` | v3-dashboard | `pages/Dashboard.tsx` |
| `26:6` | v3-admin-login | `pages/Auth/Login.tsx` |
| `7:257` | v3-purchase-orders | `pages/Orders/OrdersList.tsx` |
| `2002:2274` | v3-purchase-orders (variant) | `pages/Orders/OrdersFiltered.tsx` |
| `2002:2596` | v3-order-approve-modal | `pages/Orders/OrderApproveModal.tsx` |
| `2002:2871` | v3-order-reject-modal | `pages/Orders/OrderRejectModal.tsx` |
| `28:235` | v3-order-approved | `pages/Orders/OrderApproved.tsx` |
| `28:493` | v3-order-rejected | `pages/Orders/OrderRejected.tsx` |
| `29:365` | v3-academic-universities | `pages/Academic/Universities.tsx` |
| `29:490` | v3-academic-colleges | `pages/Academic/Colleges.tsx` |
| `29:631` | v3-academic-specializations | `pages/Academic/Specializations.tsx` |
| `29:772` | v3-academic-stages | `pages/Academic/Stages.tsx` |
| `29:958` | v3-academic-terms | `pages/Academic/Terms.tsx` |
| `26:246` | v3-term-reset | `pages/Academic/TermReset.tsx` |
| `35:6652` | v3-term-reset (confirm) | `pages/Academic/TermResetConfirm.tsx` |
| `2003:3894` | v3-add-university-modal | `pages/Academic/AddUniversityModal.tsx` |
| `2003:3198` | v3-add-college-modal | `pages/Academic/AddCollegeModal.tsx` |
| `2003:3379` | v3-add-specialization-modal | `pages/Academic/AddSpecializationModal.tsx` |
| `2003:3567` | v3-add-stage-modal | `pages/Academic/AddStageModal.tsx` |
| `2003:3727` | v3-add-term-modal | `pages/Academic/AddTermModal.tsx` |
| `13:4` | v3-courses-list | `pages/Courses/CoursesList.tsx` |
| `2009:4914` | v3-courses-list-empty | `pages/Courses/CoursesListEmpty.tsx` |
| `2007:4062` | v3-courses-content | `pages/Courses/CourseContent.tsx` |
| `2009:5023` | v3-courses-content-empty | `pages/Courses/CourseContentEmpty.tsx` |
| `13:316` | v3-course-notes | `pages/Courses/CourseNotes.tsx` |
| `2009:5140` | v3-course-notes-empty | `pages/Courses/CourseNotesEmpty.tsx` |
| `13:506` | v3-course-notes-tab | `pages/Courses/CourseNotesTab.tsx` |
| `2009:5258` | v3-course-notes-tab-empty | `pages/Courses/CourseNotesTabEmpty.tsx` |
| `13:667` | v3-course-exams | `pages/Courses/CourseExams.tsx` |
| `2009:5376` | v3-course-exams-empty | `pages/Courses/CourseExamsEmpty.tsx` |
| `20:26` | v3-exam-detail | `pages/Courses/ExamDetail.tsx` |
| `29:1119` | v3-add-course-modal | `pages/Courses/AddCourseModal.tsx` |
| `2007:4301` | v3-edit-course-modal | `pages/Courses/EditCourseModal.tsx` |
| `2007:4455` | v3-edit-video-modal | `pages/Courses/EditVideoModal.tsx` |
| `2007:4613` | v3-edit-note-modal | `pages/Courses/EditNoteModal.tsx` |
| `2007:4763` | v3-edit-exam-modal | `pages/Courses/EditExamModal.tsx` |
| `7:920` | v3-students-devices | `pages/Students/StudentsList.tsx` |
| `35:6810` | v3-students-devices (variant) | `pages/Students/StudentsFiltered.tsx` |
| `28:750` | v3-student-detail | `pages/Students/StudentDetail.tsx` |
| `35:7124` | v3-student-detail (variant) | `pages/Students/StudentDetailAlt.tsx` |
| `35:7348` | v3-student-device-reset-modal | `pages/Students/DeviceResetModal.tsx` |
| `35:7595` | v3-student-cancel-sub-modal | `pages/Students/CancelSubModal.tsx` |
| `35:7984` | v3-student-open-course-modal | `pages/Students/OpenCourseModal.tsx` |
| `35:8722` | v3-student-unban-modal | `pages/Students/UnbanModal.tsx` |
| `26:36` | v3-activity-log | `pages/Students/ActivityLog.tsx` |
| `7:1825` | v3-payment-methods | `pages/Payments/PaymentMethods.tsx` |
| `35:8979` | v3-payment-add-wallet | `pages/Payments/AddWalletModal.tsx` |
| `41:235` | v3-payment-add-bank | `pages/Payments/AddBankModal.tsx` |
| `37:1035` | v3-reports-full | `pages/Reports/ReportsOverview.tsx` |
| `43:5` | v3-report-students | `pages/Reports/ReportStudents.tsx` |
| `43:287` | v3-report-orders | `pages/Reports/ReportOrders.tsx` |
| `43:777` | v3-report-devices | `pages/Reports/ReportDevices.tsx` |
| `7:2017` | v3-notifications | `pages/Content/Notifications.tsx` |
| `7:2210` | v3-banners | `pages/Content/Banners.tsx` |
| `7:2382` | v3-pages-policies | `pages/Content/PagesPolicies.tsx` |
| `45:5` | v3-policy-refund | `pages/Content/PolicyRefund.tsx` |
| `45:137` | v3-policy-terms | `pages/Content/PolicyTerms.tsx` |
| `7:2510` | v3-maintenance | `pages/Content/Maintenance.tsx` |
| `7:2653` | v3-settings | `pages/Content/Settings.tsx` |
| `29:1510` | v3-state-empty | `pages/States/StateEmpty.tsx` |
| `29:1603` | v3-state-skeleton | `pages/States/StateSkeleton.tsx` |
| `29:1768` | v3-state-error | `pages/States/StateError.tsx` |

**عناصر مشتركة في فيجما (مبنية مرة واحدة):**
`7:199` sidebar → `components/layout/Sidebar.tsx` ·
`7:8` top-bar → `components/layout/TopBar.tsx` ·
`2003:4036` modal-card → `components/ui/Modal.tsx` ·
`29:1552` empty-state → `components/ui/States.tsx` ·
`7:21` kpi-card → `components/ui/StatCard.tsx`

---

## 7. ديون تقنية معروفة

حاجات مقصودة أو ناقصة — عالجها لما تحتاجها، وما تعتبرهاش باجّات جديدة:

1. **الصور** — إيصالات التحويل والبنرات ومعاينة PDF بلوكات بديلة. محتاجة أصول حقيقية.
2. **الفلاتر والتابس والبحث** شكلية (UI بس) — مفيش منطق تصفية حقيقي. البيانات ثابتة.
3. **الفورمات** غير مربوطة — مفيش validation ولا submit ولا حالة (uncontrolled inputs).
4. **`Pagination`** بيعرض «إجمالي N عنصر»، بينما فيجما في بعض الشاشات بيقول
   «عرض 8 من إجمالي 1,247 طالب». اتاخد الكومبوننت المشترك عن قصد للاتساق.
5. **تابس التقارير** بتستخدم `RouteTabs` المشترك — الفرق البصري عن فيجما في
   نصف قطر الحبّة وارتفاعها بس.
6. **`VBarChart`** بيرسم عناوين الفئات بس، مش قيمة كل عمود فوقه زي بعض شاشات
   التقارير. نفس الأرقام موجودة في الجداول تحتها.
7. **مفيش responsive** — الديزاين 1440px ثابت والكود متبعه.
8. **مفيش tailwind-merge** — `lib/cn.ts` دمج بسيط. لو كلاسين بيتعارضوا، رتّبهم يدوي.

---

## 8. سجل التغييرات

> **ضيف سطر هنا مع كل تعديل.** الأحدث فوق.
> الصيغة: `التاريخ — إيه اتغير — الملفات المتأثرة`

| التاريخ | التغيير | الملفات |
|---|---|---|
| 2026-08-20 | إضافة `WORKFLOW.md` وتحديث `CLAUDE.md` ليوديله؛ أرشفة البريف الأصلي | `WORKFLOW.md` · `CLAUDE.md` · `docs/original-brief.md` |
| 2026-08-20 | التسليم الأول: 62 شاشة من فيجما، نظام ديزاين كامل، راوتر، بيانات وهمية | المشروع كله |
