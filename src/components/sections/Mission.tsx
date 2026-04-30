import { useTranslations } from "next-intl";
import { Heart, Wind, Atom } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/Reveal";

const icons = [Heart, Wind, Atom] as const;

export function Mission() {
  const t = useTranslations("mission");
  const items = t.raw("items") as Array<{ title: string; text: string }>;

  return (
    <section className="border-t border-border/60 bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((item, i) => {
            const Icon = icons[i] ?? Heart;
            return (
              <Reveal key={i} delay={i * 100}>
                <Card className="h-full border-border/60 transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {item.text}
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
