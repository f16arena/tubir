# Túbir — чеклист «оживления»

Этот файл — что сделать **сегодня**, чтобы сайт стал живым: реальные брони
сохраняются, ты получаешь уведомления, поисковики индексируют, аналитика
считает. Подробная пошаговая настройка инфраструктуры — в `SETUP.md`.

---

## 1 · Применить миграции в Supabase

Откройте проект в Supabase → **SQL Editor** → **New query**.
Выполните по одной, в этом порядке:

- `supabase/migrations/0001_init.sql` (если ещё не применяли)
- `supabase/migrations/0002_callback.sql`
- `supabase/migrations/0003_security_admin.sql`
- `supabase/migrations/0004_public_stats.sql` — RPC `get_public_stats`
- `supabase/migrations/0005_pledges.sql` — таблица `pledges` + admin поля
- `supabase/migrations/0006_user_self_read.sql` — RLS для `/me`

После каждой запустите query, дождитесь «success». Проверка:

```sql
select get_public_stats();
-- должен вернуть {"bookings_count":0,"pledges_count":0,"planted_count":0}
```

Если /pledge и /me возвращают ошибку — значит миграции ещё не прошли.

---

## 2 · Подключить Telegram-уведомления

Чтобы знать, когда кто-то забронировал место Учредителя или оставил заявку.

1. В Telegram → найди **@BotFather** → `/newbot` → имя `tubir_alerts_bot`
2. Сохрани `TELEGRAM_BOT_TOKEN` (длинная строка)
3. Найди свой `chat_id`:
   - Напиши боту любое сообщение
   - Открой `https://api.telegram.org/bot<TOKEN>/getUpdates`
   - В `result[0].message.chat.id` — твой chat_id
4. В Vercel → **Project Settings → Environment Variables**:
   ```
   TELEGRAM_BOT_TOKEN=12345:AAEhBOT...
   TELEGRAM_CHAT_ID=123456789
   ```
5. Redeploy. На следующую заявку придёт Telegram-сообщение.

Telegram опционален. Если не настроишь — заявки всё равно сохранятся в Supabase,
просто будешь проверять админку вручную.

---

## 3 · Деплой и домен

Если ещё не на Vercel:

1. https://vercel.com → **Import Git Repository** → `f16arena/tubir`
2. Framework preset: **Next.js** (определит сам)
3. Environment Variables — добавь всё из `.env.example` со своими значениями.
   **Обязательно**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL=https://tubir.kz`,
   `ADMIN_EMAILS=твой@email.kz`.
4. Deploy. Через 2-3 минуты получишь `tubir-xxx.vercel.app`.

Привязка домена `tubir.kz`:

1. Купи домен на nic.kz (или там, где зарегистрирован)
2. В Vercel → **Project Settings → Domains** → `Add` → `tubir.kz`
3. Vercel покажет, какие DNS-записи добавить:
   - `A` запись `@` → IP Vercel
   - `CNAME` запись `www` → `cname.vercel-dns.com`
4. Добавь записи в DNS-настройках регистратора. Прогрев ~10 минут.
5. SSL-сертификат Vercel выдаст автоматически.

---

## 4 · Поисковики

Чтобы tubir.kz появлялся в Google и Yandex.

**Google Search Console**:

1. https://search.google.com/search-console
2. **Add property** → **Domain** → `tubir.kz`
3. Подтверди через DNS TXT-запись (Google даст значение)
4. После проверки → **Sitemaps** → добавь `https://tubir.kz/sitemap.xml`

**Yandex Webmaster**:

1. https://webmaster.yandex.ru
2. **Добавить сайт** → `https://tubir.kz`
3. Подтверди через `<meta>`-тег (Yandex даст значение)
   — добавь в `src/app/[locale]/layout.tsx` в `<head>` через `generateMetadata`
4. Sitemap → `https://tubir.kz/sitemap.xml`

Индексация — 3–14 дней.

---

## 5 · Аналитика (опционально)

Чтобы знать, сколько людей заходит, откуда, на какие страницы.

**Plausible Cloud** (платно, $9/мес, 30 дней free trial):

1. https://plausible.io → **Sign up** → **Add a site** → `tubir.kz`
2. В Vercel env:
   ```
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=tubir.kz
   ```
3. Redeploy. Через минуту увидишь первые визиты в Plausible-дашборде.

**Plausible self-host** (бесплатно, нужен VPS):

1. Поднять через `docker-compose` из https://github.com/plausible/community-edition
2. В Vercel env:
   ```
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=tubir.kz
   NEXT_PUBLIC_PLAUSIBLE_SCRIPT=https://analytics.tubir.kz/js/script.js
   ```

Если env пустой — никакого скрипта на сайт не загружается, никакого трекинга.

---

## 6 · Smoke-тест после деплоя

Пройди руками за 5 минут:

- [ ] `https://tubir.kz` открывается, hero виден, нет 500
- [ ] Переключи язык: `/kz`, `/en` — переводы подтянуты
- [ ] `/map` — карта прогрузилась, виден полигон Plot 01
- [ ] `/pledge` — отправь тестовую заявку с своего email
  - В админке `/admin/login` войди (твой email в `ADMIN_EMAILS`)
  - На вкладке «Учредители (pledges)» — должна быть твоя запись
- [ ] `/me/login` — отправь magic link на email из теста выше
  - Перейди по ссылке → попади в `/me` → увидишь свою бронь
- [ ] `/plant` — отправь тестовую заявку
  - Telegram должен пингнуть (если настроен)
- [ ] OG-карточка — поделись `https://tubir.kz` в WhatsApp/Telegram
  - Должна показаться editorial-карточка с слоганом

Если хоть один пункт сломался — пиши, разберёмся.

---

## 7 · Что важно сделать в первые недели

Это уже не код, а раскатка проекта:

1. **Связаться с Halyk Орманы** — `info@halykfund.com` (из `HALYK_CONTACTS.md`)
2. **Холодный заход в акимат ВКО** — скачать `/press/one-pager` как PDF и приложить
3. **Один публичный эндорсер** — эколог ВКГУ или историк Семея
4. **Первые 10 личных приглашений** в Founders Circle: семья, друзья, коллеги
5. **Зарегистрировать ТОО** — параллельно. Без этого онлайн-оплата не подключится.
