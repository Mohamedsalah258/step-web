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
>
> ⚠️ **فخ سهل تفوته:** `items-end` جوه `flex-col` بيبان "شغال" لو الكونتينر
> `shrink-0` (بياخد بالظبط عرض المحتوى، فمفيش فرق مرئي). لكن لو الكونتينر
> `flex-1` أو `w-full` (بياخد مساحة أكبر من محتواه)، `items-end` بيدفع
> العناصر **شمال** (عكس المتوقع في RTL) ويسيب فراغ غريب يمين — استخدم
> `items-start` دايمًا في `flex-col` لو الهدف محاذاة يمين.

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
7. **~~مفيش responsive~~ (تم حله)** — الديزاين أصبح متجاوباً بالكامل من الموبايل وحتى شاشات 1440px،
   شامل دومين الهيكل الأكاديمي اللي كان فات في أول جولة (شوف سجل التغييرات 2026-08-21).
8. **مفيش tailwind-merge** — `lib/cn.ts` دمج بسيط. لو كلاسين بيتعارضوا، رتّبهم يدوي.

> ⚠️ **قاعدة لأي جدول جديد:** `DataTable` بيلف نفسه في `overflow-x-auto`، لكن ده
> مش كافي لوحده — لازم تمرّر `className="min-w-[Npx]"` (أو `tableClassName` لو
> بتستخدم `AcademicListScreen`) بقيمة تقريبية = مجموع أعمدة الـ `width` الثابتة
> + ~250px للعمود المرن (`flex: true`). من غيرها، الأعمدة المرنة بتتزنق بدل ما
> الجدول يعمل scroll أفقي على الموبايل (قاعدة 5 في `CLAUDE.md`).

---

## 8. سجل التغييرات

> **ضيف سطر هنا مع كل تعديل.** الأحدث فوق.
> الصيغة: `التاريخ — إيه اتغير — الملفات المتأثرة`

| التاريخ | التغيير | الملفات |
|---|---|---|
| 2026-08-21 | **إضافة Auth كاملة** — كان كل endpoint في الباك اند مفتوح من غير حماية (ديون تقنية كانت موثقة في `step-backend/README.md`). دلوقتي: `Admin` entity جديد (بريد + باسورد مشفّر bcrypt)، `POST /auth/register` محمي بـ `ADMIN_INVITE_CODE` سري (عشان محدش يعمل حساب أدمن لنفسه من برّه)، `POST /auth/login` بيرجّع JWT، وأهم حاجة: **`JwtAuthGuard` مسجّل globally** (`APP_GUARD` في `app.module.ts`) فكل endpoint في المشروع — حاليًا وأي حاجة تتضاف لاحقًا — محمي تلقائيًا من غير ما حد ينسى يحطّله guard يدوي، ما عدا `/auth/login` و`/auth/register` المتعلّمين صراحةً بـ `@Public()`. حساب أدمن افتراضي بيتعمل تلقائي بالـ seed (`admin@step-edu.com` / `Step@2026` — غيّر الباسورد ده على أي بيئة حقيقية). هنا في الفرونت: شاشة `Login.tsx` بقت متصلة فعليًا (كانت شكلية بالكامل)، التوكن بيتخزن في localStorage وبيتبعت تلقائي في كل طلب (`api/client.ts`)، `AdminLayout` بقى بيحوّل لـ `/login` لو مفيش جلسة صالحة، وضفت زرار تسجيل خروج في `TopBar` (ماكانش موجود خالص قبل كده) مع عرض اسم الأدمن الحقيقي بدل البيانات الثابتة. تصدير CSV في `ActivityLog` اتغيّر من `window.open` (مش بيبعت التوكن) لـ fetch مع `Authorization` header + تنزيل blob محلي، عشان الـ endpoint بقى محمي هو كمان | **باك اند** (`D:\Step-Backend`): `src/database/entities/admin.entity.ts` (جديد) · `src/auth/*` (جديد بالكامل) · `app.module.ts` · `main.ts` (Swagger Bearer) · `.env`/`.env.example` · `database/seed.ts` · `students/dashboard/activity-log controllers` (`@ApiBearerAuth`) — **فرونت**: `src/lib/token.ts` · `src/lib/auth-store.ts` · `src/lib/useAuth.ts` · `src/api/auth.ts` (كلهم جداد) · `api/client.ts` · `api/activity-log.ts` · `pages/Auth/Login.tsx` · `components/layout/AdminLayout.tsx` · `components/layout/TopBar.tsx` · `pages/Students/ActivityLog.tsx` |
| 2026-08-21 | ضفت فيلد «ترتيب الفيديو» (رقم) في فورم «إضافة فيديو جديد» بمحتوى الكورس — نفس نمط فيلد «ترتيب الكورس» اللي اتضاف قبل كده لمودال إضافة كورس | `data/courses.ts` · `pages/Courses/CourseContent.tsx` |
| 2026-08-21 | **ربط أول دومين حقيقي بالباك اند** (Dashboard + Students + سجل العمليات): اتبنى باك اند كامل منفصل (NestJS + TypeORM + PostgreSQL — Prisma كانت الخطة الأصلية بس بيئة السحابة منعت تحميل الـ engines فاتحوّل لـ TypeORM، شوف `step-backend/README.md`) في ريبو جديد `D:\Step-Backend`، فيه بحث/فلاتر/صفحات حقيقية وإجراءات (حظر/فك حظر/ريست جهاز بحد أقصى 3/إلغاء اشتراك/فتح كورس يدوي) كلها بتتسجل في سجل عمليات موحّد. هنا في الفرونت: `data/dashboard.ts` و`data/students.ts` اتفصلوا لنصوص UI ثابتة بس (البيانات الديناميكية بقت في `src/api/*.ts`)، الصفحات بقت async مع loading/error states حقيقية (`useAsync`, `useDebouncedValue`)، `SearchField`/`FilterSelect`/`DateField`/`Pagination` بقوا قابلين للتحكم (controlled) بعد ما كانوا شكليين تمامًا (ديون تقنية رقم 2 القديمة اتحلت جزئيًا لدومين Students). راوت `cancel-sub` اتغيّر لـ `subscriptions/:subId/cancel` عشان نعرف نلغي أي اشتراك بالظبط (كان الراوت القديم مايحملش subId خالص). ⚠️ باقي الدومينات (Orders, Academic, Courses, Payments, Reports, Content) لسه بيانات وهمية — نفس النمط بالظبط جاهز يتكرر عليهم | `src/api/*` (جديد) · `src/lib/useAsync.ts` · `src/lib/useDebouncedValue.ts` (جديدين) · `data/dashboard.ts` · `data/students.ts` · `pages/Dashboard.tsx` · `pages/Students/*` · `components/ui/Field.tsx` · `components/ui/Misc.tsx` · `components/ui/Modal.tsx` · `router.tsx` |
| 2026-08-21 | بعد ما المستخدم بعت فيجما الأصلي مباشرة (node v3-courses-content): هيكل هيدر الكورس كان غلط بنيويًا — زرار «تعديل الكورس» وشارة «مدفوع» والسعر كانوا متقسّمين في عمود منفصل جنب النص، بينما الديزاين الحقيقي بيحطهم التلاتة في **صف واحد تحت الوصف مباشرة** (مش عمود جانبي)، وشارة «مدفوع» أصلًا مش جنب العنوان. أعدت بناء `CourseHeader` بالكامل ليطابق البنية الصح: عمود واحد (بريدكرمب ← عنوان ← وصف ← صف واحد فيه السعر+الشارة+زرار التعديل) جنب الغلاف | `pages/Courses/courses-parts.tsx` |
| 2026-08-21 | لقيت السبب الحقيقي وراء الفراغ الغريب في هيدر الكورس (وأماكن تانية): `items-end` جوه `flex-col` في RTL بيدفع العناصر **شمال** مش يمين (عكس المتوقع)، وده كان مستخبي لإن أغلب استخداماته في المشروع على كونتينرات `shrink-0` (مفيش مساحة زيادة تتبان فيها المشكلة). ظهرت بس لما الكونتينر `flex-1`/`w-full`. صلّحت كل الحالات المتأثرة فعليًا (`items-end` → `items-start`): هيدر الكورس، `FilePlate` (مودالز التعديل)، `SummaryCard` (تاب الملاحظات)، وليبل صورة الغلاف في مودال إضافة كورس. ضفت تحذير دائم في قسم 5 عشان الفخ ده ميتكررش | `pages/Courses/courses-parts.tsx` · `pages/Courses/CourseNotesTab.tsx` · `pages/Courses/AddCourseModal.tsx` |
| 2026-08-21 | مقارنة الديزاين المرجعي بشاشة `/courses/:id/content` كشفت فرقين: (1) ترتيب صف الفيديو (`VideoRow`) كان بالمقلوب — أيقونة الفيديو وزرار السحب (drag) في مكان تشغيل العنوان، وأزرار التعديل/الحذف يمين بدل شمال؛ اتصلح الترتيب ليطابق التصميم (أيقونة ▶ + العنوان يمين، المدة والتاريخ في النص، تعديل/حذف شمال) وشيلت زرار السحب اللي مكانش في التصميم أصلًا. (2) هيدر الكورس ماكانش فيه غلاف الكورس (thumbnail) خالص — اتضاف بلوك بديل بمقاس 140×104 (قرار #7، لحد ما يتوفر غلاف حقيقي) | `pages/Courses/CourseContent.tsx` · `pages/Courses/courses-parts.tsx` |
| 2026-08-21 | جدول الطلاب (`/students`) كل أعمدته كانت `width` ثابت بدون أي عمود `flex: true` — فعلى الشاشات الواسعة الأعمدة كلها بتتلزّق يمين (RTL) ويفضل فراغ فاضي كبير يسار الكارت. ضفت `flex: true` لعمود «الاسم» (زي باقي جداول المشروع). فحصت كل تعريفات `Column<T>[]` في المشروع ولقيت نفس الغلط في `StateSkeleton.tsx` (عمود «اسم الكورس») وصلحته كمان | `pages/Students/students-parts.tsx` · `pages/States/StateSkeleton.tsx` |
| 2026-08-21 | نفس نمط «مودال مفتوح افتراضيًا» (اتصلح قبل كده في Orders/Students-list) لقيته تالت مرة في `/students/:id`: `StudentDetail` كان بيمرر `banOpen` = true افتراضيًا فمودال «حظر الطالب» يفتح من أول تحميل الصفحة. اتشال الـ prop خالص (بقى مقفول افتراضيًا، ويفتح بس بالضغط على «حظر الطالب») | `pages/Students/StudentDetail.tsx` |
| 2026-08-21 | إصلاح تنقّل صفحة الطلاب: (1) اسم الطالب في الجدول كان مجرد نص من غير أي رابط رغم إن صفحة تفاصيل كاملة (`StudentDetail.tsx`) موجودة أصلًا وماكانتش وصلة إليها غير بالصدفة عن طريق فلو الريست — بقى الاسم Link لـ `/students/:id`. (2) زرار «ريست الجهاز» جوّه الـ quick-view drawer كان `ButtonLink` بيعمل route لمودال متلحّق أصلًا بصفحة التفاصيل الكاملة بس (`students/:id/device-reset`)، فكان بيفتح صفحة التفاصيل كاملة وراه بدل ما يفضل على نفس شاشة القائمة — استخرجت محتوى المودال لكومبوننت مشترك (`DeviceResetModalContent`) قابل للفتح كـ state محلي (زرار عادي) من الدروار، وكـ route عادي من صفحة التفاصيل، من غير أي تكرار كود | `pages/Students/students-parts.tsx` · `pages/Students/DeviceResetModal.tsx` |
| 2026-08-21 | إصلاحات تفاعل واكتشافات إضافية بعد المراجعة: (1) صف كروت الداشبورد كان بيتزنق في العرض النصفي لإن `items-start` كان شغال طول الوقت بدل ما يتفعّل بس مع `lg:flex-row` — نفس الغلط اتصلح في 15+ مكان (Dashboard/Banners/Maintenance/Settings/Notifications/PaymentMethods/AcademicTable/reports-parts/students-parts/CourseContent/CourseExams/CourseNotes/CourseNotesTab)، (2) `ExamDetail.tsx` كان متنسي تمامًا من الـ Responsive (هيدر وعمود معلومات بعرض ثابت 340px)، (3) `StatRow` بقى `flex-wrap` بدل `grid` بعدد أعمدة ثابت عشان لو عدد الكروت (زي 6 في الداشبورد) مش قابل للقسمة على عدد الأعمدة يفضل يملأ الصف بالكامل، (4) دروار تفاصيل الطلب في `/orders` والطالب في `/students` كانوا بيفتحوا تلقائي من أول تحميل الصفحة (نسخ حرفي لفريم فيجما فيه الدروار مفتوح) — بقوا مقفولين افتراضيًا وبيفتحوا بالضغط على «عرض التفاصيل» زي ما المفروض | `components/ui/StatCard.tsx` · `pages/Orders/OrdersList.tsx` · `pages/Students/StudentsList.tsx` · `pages/Courses/ExamDetail.tsx` · باقي الملفات المذكورة فوق |
| 2026-08-21 | رفيو ومعالجة فجوات جولة الـ Responsive: (1) إضافة `min-w` ناقصة لـ 15 جدول (كانت بتتزنق بدل ما تعمل scroll)، (2) تغطية دومين الهيكل الأكاديمي اللي كان فات بالكامل (5 شاشات + AcademicHeader المشترك)، (3) قفل سكرول الصفحة لما overlay السايدبار أو درج الطالب يفتحوا على الموبايل (`useBodyScrollLock` جديد)، (4) تحسينات صغيرة (a11y على backdrop الدرج، تعليق توضيحي في `Modal.tsx`) | `pages/Academic/*` · `pages/Reports/*` · `pages/Students/ActivityLog.tsx` · `students-parts.tsx` · `pages/Content/Maintenance.tsx` · `pages/States/StateSkeleton.tsx` · `pages/Courses/CourseExams.tsx` · `CourseNotes.tsx` · `components/layout/Sidebar.tsx` · `components/ui/Modal.tsx` · `lib/useBodyScrollLock.ts` (جديد) |
| 2026-08-20 | إضافة دعم Responsive Design لكافة المكونات والصفحات (الموبايل والتابلت) وتحديثات الـ Scroll | معظم مكونات الصفحات، الـ Layout، و `components/ui/` |
| 2026-08-20 | إضافة `WORKFLOW.md` وتحديث `CLAUDE.md` ليوديله؛ أرشفة البريف الأصلي | `WORKFLOW.md` · `CLAUDE.md` · `docs/original-brief.md` |
| 2026-08-20 | التسليم الأول: 62 شاشة من فيجما، نظام ديزاين كامل، راوتر، بيانات وهمية | المشروع كله |
