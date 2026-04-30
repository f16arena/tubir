# Túbir

> **Артыңда ағаш қалсын** · **Посади дерево, которое останется после тебя** · **Plant a tree that will outlive you**

Реальная посадка деревьев в Восточном Казахстане. Платишь — мы сажаем, снимаем видео, ухаживаем 3 года, присылаем сертификат с GPS.

Стартап на этапе подготовки. На момент написания — нулевой счётчик посадок и честный блок «мы ещё ничего не посадили». Готовим участок, договоры с питомниками, регистрацию ТОО.

---

## Стек

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript 5**
- **Tailwind CSS 4** + **shadcn/ui** (на `@base-ui/react`)
- **next-intl 4** — локали `ru` (default), `kz`, `en` (`localePrefix: always`)
- **Supabase** (`@supabase/ssr`) — Postgres, Auth, Storage, RLS
- **Spectral** (заголовки) + **Inter** (текст) + **Geist Mono** (моно), все с `cyrillic-ext`
- **react-hook-form** + **zod** для форм
- **Lucide-react** для иконок (бренд-иконки соц-сетей нарисованы вручную в `SocialIcons.tsx` — lucide 1.x их выпилил)
- **Sonner** для toast-ов

## Структура

```
src/
├── app/[locale]/          # все страницы трилингвальные
│   ├── page.tsx           # главная
│   ├── trees/             # каталог пород
│   ├── how/               # как работает
│   ├── about/             # о проекте
│   ├── plant/             # форма заявки
│   ├── gift/              # подарить дерево
│   ├── certificate/       # превью сертификата
│   ├── roadmap/           # дорожная карта
│   ├── business/          # B2B-лендинг
│   ├── diaspora/          # для диаспоры
│   ├── products/          # спец-предложения
│   ├── projects/
│   │   ├── polygon/       # Atonement Forest полигона
│   │   └── atameken/      # лес фамилий
│   └── legal/[type]/      # offer / privacy / refund
├── components/
│   ├── layout/            # Header, Footer, Logo, FloatingChat, MobileMenu, LocaleSwitcher
│   ├── sections/          # Hero, Mission, Honest, Future, HowItWorks, Process, Flagship, ...
│   ├── ui/                # shadcn-сгенерированные
│   ├── CallbackModal.tsx
│   ├── CookiesBanner.tsx
│   ├── Reveal.tsx         # IntersectionObserver fade-up
│   └── SampleCertificate.tsx
├── i18n/                  # routing, request, navigation
├── lib/
│   ├── data/              # contacts, gallery, species
│   ├── db/types.ts        # TypeScript-типы для Supabase
│   ├── supabase/          # client / server
│   ├── validation/        # zod-схемы
│   └── actions/           # server actions
├── proxy.ts               # next-intl middleware (Next 16 переименовало → proxy)
└── app/globals.css        # OKLCH-палитра + tw-animate-css

messages/
├── ru.json                # 500+ строк переводов
├── kz.json
└── en.json

supabase/
├── migrations/
│   ├── 0001_init.sql      # species, projects, tree_requests + RLS
│   └── 0002_callback.sql  # callback_requests
└── seed.sql               # 6 пород + проект `vko_green`
```

## Запуск локально

```bash
npm install
cp .env.example .env.local       # затем заполнить Supabase ключами
npm run dev
```

Откроется на `http://localhost:3000` (или 3001/3002, если порт занят).

## Деплой и связка с Supabase

→ Полный пошаговый гайд в **[SETUP.md](./SETUP.md)** (создание Supabase проекта, миграции, уведомления через Telegram/Resend, деплой на Vercel, домен `tubir.kz`).

## Контент

- Цены пород деревьев — плейсхолдеры в `src/lib/data/species.ts` (5 000–7 000 ₸). Заменить на реальные после расчёта себестоимости.
- Фотографии — Unsplash-плейсхолдеры в `src/lib/data/gallery.ts`. Заменить на свои после первой посадки.
- Контакты (email, WhatsApp, Telegram) — плейсхолдеры в `src/lib/data/contacts.ts`. Заменить перед запуском.

## Лицензия

All Rights Reserved. Túbir.
