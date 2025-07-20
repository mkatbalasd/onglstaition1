# مشروع Node.js مع قاعدة بيانات MariaDB

يوفر هذا المشروع خادماً مبسطاً باستخدام **Express** لإدارة بطاقات السائقين وكروت التشغيل. يعتمد التطبيق على قاعدة بيانات **MariaDB** ويستخدم قوالب **EJS** لعرض الصفحات.
تمت إضافة واجهة أمامية مبنية على **Vue 3** و **Tailwind CSS** داخل مجلد `frontend/` ويمكن تشغيلها كـ SPA مع الاحتفاظ بجميع مسارات الخادم الحالية.

## المتطلبات

- Node.js
- MariaDB أو MySQL

## خطوات الإعداد

1. تثبيت الاعتمادات:
   ```bash
   npm install
   ```
2. نسخ ملف البيئة وتعديل بيانات الاتصال:
   ```bash
   cp .env.example .env
   ```
3. تعديل بيانات الاتصال في `.env` إذا لزم، وتشمل المتغيرات التالية:
   - `DB_HOST`: عنوان خادم قاعدة البيانات.
   - `DB_USER`: اسم المستخدم.
   - `DB_PASSWORD`: كلمة المرور.
   - `DB_NAME`: اسم قاعدة البيانات.
   - `PORT`: المنفذ الذي سيستمع له الخادم (3002 افتراضيًا).
5. تشغيل الخادم:
   ```bash
   npm start
   ```

بعد التشغيل يمكنك زيارة:
- `/nagl/driver-cards` لإدارة بطاقات السائقين.
- `/nagl/cards` لإدارة كروت التشغيل.
- `/nagl/facilities` لمشاهدة المنشآت.
- `/nagl/drivers` لعرض السائقين.
- `/nagl/vehicles` لعرض المركبات.
عند اختيار "إضافة بطاقة سائق" سيمر المستخدم بثلاث خطوات متتالية: تحديد المنشأة ثم السائق ثم إدخال بيانات البطاقة.

تستخدم النماذج التاريخ الهجري عبر مكتبة [bootstrap-hijri-datepicker](https://github.com/balbarak/bootstrap-hijri-datepicker.git).

## تشغيل واجهة Vue

1. الدخول إلى مجلد `frontend/`:
   ```bash
   cd frontend
   ```
2. تثبيت الحزم ثم بناء المشروع:
   ```bash
   npm install
   npm run build
   ```
3. بعد البناء يتم تقديم الملفات المجمعة تلقائيًا من المسار `/nagl/app`.
   تم ضبط `vite.config.js` على `base: '/nagl/app/'` حتى تعمل الواجهة بشكل صحيح
   عند تقديمها من هذا المسار الفرعي.

للوصول إلى التطبيق من مسار فرعي عبر خادم ويب مثل **Nginx** يمكن استخدام الإعداد التالي:

```nginx
location /nagl/ {
    proxy_pass http://127.0.0.1:3002/nagl/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## تشغيل الاختبارات

بعد تثبيت الحزم يمكنك تشغيل مجموعة الاختبارات البسيطة عبر الأمر:

```bash
npm test
```
