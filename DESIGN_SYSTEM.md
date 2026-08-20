# STEP — مرجع نظام الديزاين (اقرأه قبل أي شغل)

مشروع React 18 + Vite + TypeScript + Tailwind 3، عربي **RTL** بالكامل.
مصدر الحقيقة الوحيد هو ملف فيجما: `fileKey = 5tJR1BTN8fFBkm58hKHhsL`.

---

## ⚠️ قاعدة RTL — أهم حاجة في المشروع

`<html dir="rtl">` مضبوط عالميًا. النتيجة:

| تريد | استخدم | لا تستخدم |
|---|---|---|
| نص متراصّ يمين | `text-right` | ~~`text-end`~~ (= يسار في RTL) |
| نص متراصّ يسار | `text-left` | ~~`text-start`~~ |
| دفع عناصر flex-row لليمين | `justify-start` | ~~`justify-end`~~ |
| دفع عناصر flex-row لليسار | `justify-end` | — |
| محاذاة flex-col لليمين | `items-start` | ~~`items-end`~~ |

**ترتيب الـ DOM:** في أي `flex-row`، **أول عنصر في الـ DOM يظهر على اليمين**.
كود فيجما مكتوب كـ LTR (أول عنصر = يسار)، فلازم **تعكس الترتيب**
لما تحوّل صف من فيجما لكود.

استثناء: الشارتس اللي إحداثياتها SVG (`LineChart`, `VBarChart`) جواها
`dir="ltr"`، فمصفوفاتها بترتيب **الشمال لليمين** زي فيجما بالظبط.

---

## التوكنز (tailwind.config.js)

```
navy         #0b1f66   خلفية السايدبار
brand        #2347e8   اللون الأساسي
brand-tint   #eaeeff   خلفية الأفاتار والبادجات
brand-wash   #f0f4ff   خلفية أيقونات الحالات الفارغة
ink          #0e1116   النص الأساسي
muted        #6b7280   النص الثانوي
line         #e5e9f2   البوردرات والفواصل
surface      #f5f7fb   خلفية الصفحة + هيدر الجداول + تراك الشرايط
success / success-bg   #12b76a / #ecfdf3
warning / warning-bg   #f59e0b / #fff9eb
danger  / danger-bg    #f04438 / #fef3f2
```

**أحجام الخط:** `text-2xs`=11 `text-xs`=12 `text-sm`=13 `text-base`=14
`text-md`=15 `text-lg`=16 `text-xl`=20 `text-2xl`=22 `text-3xl`=24

**الخطوط:** `font-sans` = Cairo (400/500/600/700/800) · `font-mono` = Spline Sans Mono.

| الكلاس | الاستخدام | مثال |
|---|---|---|
| **`num`** | محتوى لاتيني/رقمي **صافي** — يجبر LTR | `2026-05-24 14:32` · `INSTA-9923812` · `2.4 MB` · `01023456789` |
| **`mono`** | نص **مخلوط** عربي + رقم — نفس الخط بدون فرض اتجاه | `234 طالب` · `350 ج.م` · `12 فيديو` · `198 تحميل` |

⚠️ **ما تستخدمش `num` مع نص فيه حروف عربية** — بيقلب ترتيب الكلمة والرقم.

**Radii:** `rounded-badge`=6 `rounded-ctl`=8 `rounded-logo`=10
`rounded-card`=12 `rounded-panel`=16

**ظلال:** `shadow-card` · `shadow-panel` · `shadow-modal`

**مقاسات اللايوت:** سايدبار `w-sidebar`=260 · توب بار `h-topbar`=64
· بادينج المحتوى `p-6` · جاب الأقسام `gap-6` · جاب الكروت `gap-4`

---

## الكومبوننتس الجاهزة — **استخدمها ولا تعيد كتابتها**

### اللايوت
```tsx
import { Page } from '@/components/layout/Page'

<Page title="عنوان الشاشة" actions={<Breadcrumb .../>}>
  {/* المحتوى — Page بيضيف TopBar + p-6 gap-6 تلقائيًا */}
</Page>
```
`Page` بياخد `bare` لو الصفحة عايزة تتحكم في البادينج بنفسها.
`AdminLayout` + `Sidebar` جاهزين — **ما تلمسهمش**.

### الكروت
```tsx
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
<Card>                        {/* radius 16 — كروت الجداول والشارتس */}
<Card variant="card">         {/* radius 12 — كروت KPI */}
<CardHeader title="..." actions={...} />
<CardBody>...</CardBody>
```

### KPI
```tsx
import { StatRow, StatCard, type Stat } from '@/components/ui/StatCard'
const stats: Stat[] = [{ label, value, note, noteTone, trend, icon, mono }]
<StatRow stats={stats} />     {/* أول عنصر = يمين */}
```

### الجداول
```tsx
import { DataTable, Truncate, RowActions, type Column } from '@/components/ui/Table'
// ⚠️ أول عمود في المصفوفة = أول عمود من اليمين
const cols: Column<Row>[] = [
  { key:'name', header:'الاسم', width:180, render: r => r.name },
  { key:'desc', header:'الوصف', flex:true, render: r => <Truncate>{r.desc}</Truncate> },
  { key:'act',  header:'إجراءات', width:140, align:'left',
    render: () => <RowActions><IconButton .../></RowActions> },
]
<DataTable columns={cols} rows={rows} rowKey={r=>r.id} empty={<EmptyState .../>} />
```

### الشارات
```tsx
import { Badge, StatusBadge } from '@/components/ui/Badge'
<StatusBadge status="مقبول" />          {/* بيختار اللون تلقائيًا */}
<Badge tone="brand">نص</Badge>          {/* success|warning|danger|brand|neutral */}
```

### الأزرار
```tsx
import { Button, ButtonLink, IconButton } from '@/components/ui/Button'
<Button variant="primary" icon={Plus}>إضافة كورس جديد</Button>
<ButtonLink to="/courses/1" variant="secondary" size="sm">تفاصيل</ButtonLink>
<IconButton icon={Trash2} label="حذف" tone="danger" />
```

### الحقول والفلاتر
```tsx
import { SearchField, FilterSelect, DateField, TextField,
         SelectField, TextArea, ToggleRow, Checkbox } from '@/components/ui/Field'
import { Switch } from '@/components/ui/Switch'
import { FilterRow } from '@/components/ui/Misc'

<FilterRow action={<Button icon={Plus}>إضافة</Button>}>
  <FilterSelect label="تصفية بالحالة" options={['نشط','معطّل']} width={128} />
  <SearchField placeholder="بحث بالاسم أو الكود..." width={260} />
</FilterRow>
```

### التابس
```tsx
import { Tabs, RouteTabs } from '@/components/ui/Tabs'
<Tabs items={[{label:'الكل',count:23},{label:'قيد المراجعة',count:14}]} />
<RouteTabs items={[{label:'الفيديوهات',to:'/courses/1/content'}]} />
```

### المودالز
```tsx
import { Modal, ModalButton, ModalField, ModalSelect,
         ModalTextArea, ModalToggleRow, ModalNotice } from '@/components/ui/Modal'

// كل مودال = صفحة route مستقلة. الإغلاق بيعمل navigate(-1) تلقائيًا.
<Modal title="إضافة جامعة جديدة" width={520}
  actions={<>
    <ModalButton variant="cancel">إلغاء</ModalButton>
    <ModalButton>إضافة الجامعة</ModalButton>
  </>}>
  <ModalField label="اسم الجامعة" placeholder="مثال: جامعة المنصورة" />
  <ModalToggleRow label="الحالة" value="نشط" />
</Modal>
```
عرض المودال الافتراضي 520px. لو الديزاين أعرض، مرّر `width`.
مرّر الأزرار بترتيب (إلغاء ثم تأكيد) — الكومبوننت بيرتّبهم صح (إلغاء شمال، تأكيد يمين).
`Page` فيه `<Outlet />` في الآخر، فالمودالز بتشتغل كـ child routes فوق شاشتها.

### الحالات
```tsx
import { EmptyState, ErrorState, TableSkeleton, CardSkeleton } from '@/components/ui/States'
<EmptyState icon={Inbox} title="لا توجد طلبات شراء حالياً"
  description="ستظهر طلبات الشراء هنا بمجرد..." action={<Button>إضافة</Button>} />
```

### الشارتس
```tsx
import { LineChart, HBarChart, VBarChart, DonutChart } from '@/components/charts/Charts'
<LineChart points={[17,49,31,72,58,88]} labels={['يونيو',...,'يناير']} />  // ترتيب شمال→يمين
<HBarChart items={[{label:'أساسيات التشريح', value:340}]} />               // ترتيب علوي→سفلي
<VBarChart items={[{label:'يناير', value:40}]} />                          // ترتيب شمال→يمين
<DonutChart segments={[{label:'مقبول',value:60,color:'#12b76a'}]} centerValue="892" />
```

### متنوعة
```tsx
import { Breadcrumb, FilterRow, Pagination, InfoRow, InfoGrid,
         IconBubble, ProgressBar } from '@/components/ui/Misc'
```

### مساعدات
```tsx
import { cn } from '@/lib/cn'
import { formatNumber, formatEGP, formatDateTime, timeAgo } from '@/lib/format'
import { ADMIN, BRAND } from '@/data/admin'
```

---

## الأيقونات

كل أيقونات فيجما من **Lucide**، فاستخدم `lucide-react` مباشرة بنفس الاسم
(`graduation-cap` → `GraduationCap`). **ما تنزّلش SVG من فيجما**
ولا ترسم أيقونات بنفسك. المقاسات المستخدمة في الديزاين: 12 / 14 / 16 / 18 / 20 / 24 / 44.

---

## قواعد الشغل

1. **اقرأ فيجما قبل الكود.** لكل فريم: `get_design_context` على الـ node
   (ولو رجع كبير، نزّل لأبناء الـ `content-body`). استعمل الـ screenshot للتحقق.
2. **بيانات وهمية** في `src/data/<domain>.ts` بنفس أرقام وأسماء فيجما بالحرف.
   الصفحات بتستورد منها — ما تحطش بيانات inline في JSX.
3. **صفحة واحدة لكل فريم** في `src/pages/<Domain>/<Name>.tsx`، `export default`.
4. **ما تعدّلش** `src/router.tsx` ولا أي حاجة في `components/` أو `lib/`
   أو `tailwind.config.js` — لو محتاج كومبوننت جديد مشترك، اعمله جوه فولدر
   الدومين بتاعك.
5. **TypeScript strict** + `noUnusedLocals`. تأكد `npx tsc --noEmit` نضيف قبل ما تسلّم.
6. النصوص العربية كلها بالحرف زي فيجما — بدون إعادة صياغة.
