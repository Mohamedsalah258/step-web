# STEP — لوحة تحكم منصة تعليمية

واجهة إدارية عربية (RTL) مبنية بـ **React 18 + Vite + TypeScript + Tailwind CSS 3**،
محوّلة بالكامل من ملف فيجما `Step` (`5tJR1BTN8fFBkm58hKHhsL`) — **62 شاشة**.

## التشغيل

```bash
npm install
npm run dev        # http://localhost:5173
```

أوامر تانية:

```bash
npm run build      # typecheck + build للإنتاج في dist/
npm run preview    # معاينة نسخة الإنتاج
npm run typecheck  # فحص الأنواع بس
```

> الخطوط (Cairo + Spline Sans Mono) بتتحمّل من Google Fonts،
> فمحتاج اتصال إنترنت في أول تشغيل.

## هيكل المشروع

```
src/
├── main.tsx              نقطة الدخول
├── router.tsx            كل المسارات (شاشة لكل فريم في فيجما)
├── index.css             طبقة Tailwind + كلاسات num / mono / skeleton
├── lib/
│   ├── cn.ts             دمج كلاسات
│   ├── format.ts         تنسيق أرقام وتواريخ وعملة
│   └── nav.ts            عناصر السايدبار (12 قسم)
├── data/                 بيانات وهمية — نصوص وأرقام بالحرف من فيجما
│   ├── admin.ts  dashboard.ts  auth.ts  orders.ts
│   ├── academic.ts  courses.ts  students.ts
│   └── payments.ts  reports.ts  content.ts
├── components/
│   ├── layout/           AdminLayout · Sidebar · TopBar · Page
│   ├── ui/               Card · Button · Badge · Table · Field · Switch
│   │                     Modal · Tabs · StatCard · States · Misc
│   └── charts/           LineChart · HBarChart · VBarChart · DonutChart
└── pages/
    ├── Dashboard.tsx
    ├── Auth/             تسجيل الدخول
    ├── Orders/           طلبات الشراء (6 شاشات)
    ├── Academic/         الهيكل الأكاديمي (12 شاشة)
    ├── Courses/          الكورسات (16 شاشة)
    ├── Students/         الطلاب والأجهزة (9 شاشات)
    ├── Payments/         طرق الدفع (3 شاشات)
    ├── Reports/          التقارير (4 شاشات)
    ├── Content/          إشعارات · بنرات · سياسات · صيانة · إعدادات (7)
    └── States/           حالات فارغ / تحميل / خطأ (3)
```

## قبل ما تعدّل — اقرأ `WORKFLOW.md` ثم `DESIGN_SYSTEM.md`

`WORKFLOW.md` هو ذاكرة المشروع: الفلو اللي اتبنى بيه، الحالة الحالية،
القرارات المعمارية وأسبابها، خريطة كل فريم فيجما → ملفه، وبروتوكول التعديل.
**أي تعديل لازم يحدّثه.**

`DESIGN_SYSTEM.md` فيه التوكنز وواجهة كل كومبوننت مشترك.
أهم قاعدة: **في RTL أول عنصر في الـ DOM يظهر على اليمين**،
و`text-end` / `justify-end` معناها **يسار** مش يمين.

## البيانات

كل الشاشات بتقرأ من `src/data/*.ts` — مفيش بيانات مكتوبة جوه الـ JSX.
لربط باك إند حقيقي، استبدل الـ exports في ملفات `data/` بنداءات API
(أو hooks) وسيبان الصفحات زي ما هي.

## المسارات

| القسم | مثال المسار |
|---|---|
| لوحة التحكم | `/` |
| تسجيل الدخول | `/login` |
| طلبات الشراء | `/orders` · `/orders/:id/approve` |
| الهيكل الأكاديمي | `/academic/universities` … `/academic/terms/reset` |
| الكورسات | `/courses` · `/courses/:id/content` · `/courses/:id/exams/:examId` |
| الطلاب والأجهزة | `/students` · `/students/:id` |
| طرق الدفع | `/payments` |
| التقارير | `/reports` · `/reports/students` |
| المحتوى | `/notifications` · `/banners` · `/pages` · `/maintenance` · `/settings` |
| حالات العرض | `/states/empty` · `/states/skeleton` · `/states/error` |

كل مودال في فيجما = child route فوق شاشته (الإغلاق بيعمل `navigate(-1)`).

## ملاحظات

- الأيقونات كلها من `lucide-react` بنفس أسماء فيجما — مفيش أصول SVG منزّلة.
- الشارتس مرسومة SVG/CSS بدون مكتبات خارجية.
- الصور والمعاينات (إيصالات، بنرات، PDF) بلوكات بديلة بنفس مقاسات الديزاين.
