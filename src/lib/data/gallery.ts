// Центральный реестр всех изображений на сайте.
// Сейчас все ссылки — иллюстративные плейсхолдеры с Unsplash.
// После первой реальной посадки заменяй URL на свои фото
// (можно положить в /public/images/ и указать локальный путь).

import type { SpeciesCode } from "@/lib/db/types";

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export const photos = {
  // Главный hero — атмосферный лес
  hero: u("1441974231531-c6227db76b6e", 2000),

  // Flagship «Зелёные лёгкие региона» — лес сверху
  flagship: u("1502082553048-f009c37129b9", 1400),

  // Future «Если мы не возьмёмся» — лес с лучами света
  future: u("1473773508845-188df298d2d1", 1800),

  // О проекте — пейзаж
  about: u("1469474968028-56623f02e42e", 1400),

  // Галерея «Как мы это делаем» (4 шага процесса)
  process: [
    {
      src: u("1518837695005-2083093ee35b", 1000),
      labelKey: "sapling",
    },
    {
      src: u("1466692476868-aef1dfb1e735", 1000),
      labelKey: "planting",
    },
    {
      src: u("1473773508845-188df298d2d1", 1000),
      labelKey: "growing",
    },
    {
      src: u("1542273917363-3b1817f69a2d", 1000),
      labelKey: "forest",
    },
  ],
} as const;

export const speciesPhotos: Record<SpeciesCode, string> = {
  pine:    u("1518173946687-a4c8892bbd9f", 800),
  birch:   u("1500076656116-558758c991c1", 800),
  spruce:  u("1444090542259-0af8fa96557e", 800),
  oak:     u("1414235077428-338989a2e8c0", 800),
  apple:   u("1567306226416-28f0efdc88ce", 800),
  apricot: u("1547036967-23d11aacaee0",   800),
};
