# Túbir — алгоритм связки с Supabase, email-уведомлениями и деплоем

Делается один раз. Дальше всё работает автоматически.

---

## 1. Создание проекта Supabase

1. https://supabase.com → **Sign up** (через GitHub удобнее)
2. **New project** → выбери организацию (или создай Personal)
3. Параметры:
   - **Name**: `tubir-prod` (или `tubir-staging`, если сначала тест)
   - **Database password**: придумай и сохрани в менеджере паролей. Если потеряешь — восстановления нет.
   - **Region**: `Frankfurt (EU Central)` — самый близкий к Казахстану, низкая latency. (`Singapore` тоже подойдёт.)
   - **Pricing**: Free — этого хватит на первые тысячи заявок (500 MB БД, 1 GB Storage).
4. Жди 1–2 минуты, пока проект создаётся.

---

## 2. Получение ключей

1. В созданном проекте → **Settings (шестерёнка) → API**
2. Скопируй два значения:
   - **Project URL** — что-то вроде `https://abcdefghijkl.supabase.co`
   - **anon public** ключ (длинный JWT)
3. Не трогай **service_role** ключ — он секретный, нужен только для админ-функций позже.

---

## 3. Заполнение `.env.local`

Открой файл `.env.local` в корне проекта (он есть, с плейсхолдерами).
Замени значения:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijkl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

Без кавычек. Без пробелов вокруг `=`.

**Перезапусти dev-сервер** после редактирования env:
```bash
npm run dev
```

---

## 4. Прогон миграций

В Supabase Dashboard → **SQL Editor** → **New query**.

### Миграция 1 — основные таблицы

Открой `supabase/migrations/0001_init.sql`, скопируй **всё** содержимое, вставь в SQL Editor → **Run**.

Должно появиться:
- Таблицы `species`, `projects`, `tree_requests`
- RLS включён на всех трёх
- 3 политики (`species_read_active`, `projects_read_active`, `tree_requests_anon_insert`)

### Миграция 2 — callback

Открой `supabase/migrations/0002_callback.sql`, повтори процедуру.

### Сид (стартовые данные)

Открой `supabase/seed.sql`, скопируй, **Run**.

В таблице `species` появится 6 пород, в `projects` — `vko_green` с целью 100 000.

Проверь: **Table Editor → species** должен показать 6 строк.

---

## 5. Проверка ingestion заявок

1. Открой http://localhost:3002/ru/plant
2. Заполни форму своими тестовыми данными
3. Нажми «Отправить заявку» → должен появиться зелёный toast «Заявка принята»
4. В Supabase: **Table Editor → tree_requests** — должна появиться твоя запись с `status='pending'`

Аналогично проверь callback: внизу справа кнопка с телефоном → форма → submit → запись в `callback_requests`.

### Если не записывается

- Проверь, что `.env.local` сохранён (без кавычек, без пробелов)
- Что dev-сервер перезапущен после правки env
- Что миграции прогнаны без ошибок (повторно запусти, если сомневаешься — `IF NOT EXISTS` защищает)
- В DevTools (F12) → Network → найди вызов server action → ответ должен быть 200 с `{ok: true}`

---

## 6. Уведомления о заявках (две опции)

Без них ты не узнаешь о новых заявках. Выбери одну.

### Опция A — Telegram-бот (быстрее, бесплатно)

1. В Telegram: найди `@BotFather` → `/newbot` → дай имя `Túbir notifier`
2. Получи **HTTP API token** (вид: `123456:ABC-DEF...`)
3. Узнай свой `chat_id`: напиши боту `/start`, потом открой `https://api.telegram.org/bot<TOKEN>/getUpdates` — в ответе будет твой `chat.id`
4. В Supabase → **Database → Webhooks → Create a new hook**:
   - Name: `notify-tree-request`
   - Table: `tree_requests`
   - Events: ✅ `INSERT`
   - Type: `HTTP Request`
   - HTTP method: `POST`
   - URL: `https://api.telegram.org/bot<YOUR_TOKEN>/sendMessage`
   - HTTP Headers: `Content-Type: application/json`
   - HTTP Params (Body):
     ```json
     {
       "chat_id": "<YOUR_CHAT_ID>",
       "text": "Новая заявка Túbir!\nИмя: {{record.name}}\nEmail: {{record.email}}\nТелефон: {{record.phone}}\nПорода: {{record.species_code}} × {{record.quantity}}\nСтрана: {{record.country}}\nПосвящение: {{record.dedication}}"
     }
     ```
5. Save → проверь, отправив тестовую заявку через сайт. Должно прилететь сообщение в Telegram.

Аналогично сделай второй webhook на `callback_requests` со своим текстом.

### Опция B — Email через Resend

1. Регистрируйся на https://resend.com (бесплатно — 3 000 писем/мес)
2. **API Keys → Create** → скопируй ключ
3. Добавь в `.env.local`:
   ```env
   RESEND_API_KEY=re_xxxxx
   ```
4. **Domains → Add Domain** → `tubir.kz` → добавь DNS-записи у регистратора домена. Без подтверждённого домена можно отправлять только с `onboarding@resend.dev` для тестов.
5. Аналогично шагу A создай webhook в Supabase, но URL = `https://api.resend.com/emails`, Headers = `Authorization: Bearer <RESEND_KEY>`, body = JSON шаблон с `from`, `to`, `subject`, `html`.

**Совет**: начни с Telegram — настройка 5 минут, бесплатно, моментально. Resend подключи когда уже захочешь форматные письма клиентам.

---

## 7. Деплой на Vercel

1. Загрузи код на GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial Túbir site"
   # создай пустой репо на github.com/new
   git remote add origin https://github.com/<ты>/tubir.git
   git push -u origin main
   ```
2. https://vercel.com → **Add New → Project** → импортируй репо
3. На странице Configure:
   - Framework: Next.js (определится автоматически)
   - Root Directory: оставь пустым
   - Build Command: по умолчанию
4. Раздел **Environment Variables** — добавь:
   - `NEXT_PUBLIC_SUPABASE_URL` = твой Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = твой anon key
5. **Deploy**

Через 1–2 минуты сайт будет на `https://tubir.vercel.app` (или похожем поддомене).

### Подключение домена `tubir.kz`

1. Зарегистрируй `tubir.kz` на `ps.kz` или `hostiq.kz` (если ещё не зарегистрировал)
2. В Vercel: **Settings → Domains → Add** → введи `tubir.kz`
3. Vercel покажет, какие DNS-записи добавить (`A` или `CNAME`)
4. У регистратора домена (ps.kz): Управление доменом → DNS-записи → добавь
5. Жди 5–30 минут — домен подцепится

---

## 8. Проверочный чек-лист

После шагов 1–7 пройдись по списку:

- [ ] `.env.local` заполнен реальными ключами Supabase
- [ ] Все 3 миграции прогнаны без ошибок (`0001_init.sql`, `0002_callback.sql`, `seed.sql`)
- [ ] В Table Editor видны 6 пород и 1 проект `vko_green`
- [ ] Тестовая заявка через `/plant` попадает в `tree_requests`
- [ ] Тестовый callback (плавающая кнопка с телефоном) попадает в `callback_requests`
- [ ] Уведомление о заявке прилетает в Telegram (или Email)
- [ ] Сайт задеплоен на Vercel
- [ ] Env-переменные проброшены в Vercel (Settings → Environment Variables)
- [ ] Домен `tubir.kz` подцеплен и SSL включён (Vercel сам выдаёт Let's Encrypt)
- [ ] На `tubir.kz` оставил заявку — пришла в БД и в Telegram

Когда все галочки — сайт готов принимать первые реальные заявки.

---

## 9. Что после первой посадки (Stage 2)

Когда у тебя появятся реально посаженные деревья — добавляем:

- **Auth** (`Authentication → Providers` в Supabase): включить Email (magic link) и Google. У клиентов появляется личный кабинет.
- **Миграция `0003_users.sql`**: добавляем таблицы `profiles`, `orders`, `order_items`, `trees`, `nominations` (этот SQL я тебе напишу, когда понадобится).
- **Vercel Blob или Supabase Storage** для хранения видео-отчётов.
- **PDF-генератор** (например, через `@react-pdf/renderer` или внешний сервис) — настоящий PDF-сертификат с QR-кодом.
- **Halyk ePay** интеграция после открытия ТОО.
- **Stripe** для диаспоры.
- **Карта посадок** через Leaflet — таблица `trees` имеет `gps_lat`, `gps_lng`, рисуем все точки.

Это всё **после** того, как пойдут первые клиенты.

---

## Полезные ссылки

- Supabase Docs: https://supabase.com/docs
- Next.js + Supabase guide: https://supabase.com/docs/guides/auth/server-side/nextjs
- Vercel Env Vars: https://vercel.com/docs/projects/environment-variables
- Resend Docs: https://resend.com/docs
- Telegram Bot API: https://core.telegram.org/bots/api
