"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { contacts } from "@/lib/data/contacts";
import { WhatsAppIcon, TelegramIcon } from "./SocialIcons";
import { CallbackModal } from "@/components/CallbackModal";

export function FloatingChat() {
  const t = useTranslations("chat");
  const tCb = useTranslations("callback");
  const [callbackOpen, setCallbackOpen] = useState(false);

  return (
    <>
      <div data-floating-chat className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2 print-hide sm:bottom-6 sm:right-6">
        <button
          type="button"
          onClick={() => setCallbackOpen(true)}
          aria-label={tCb("trigger")}
          title={tCb("trigger")}
          className="group inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl"
        >
          <Phone className="h-5 w-5" />
        </button>
        <a
          href={contacts.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("whatsapp")}
          title={t("whatsapp")}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/25 transition-all hover:scale-105 hover:shadow-xl"
        >
          <WhatsAppIcon className="h-6 w-6" />
        </a>
        <a
          href={contacts.telegram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("telegram")}
          title={t("telegram")}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#229ED9] text-white shadow-lg shadow-[#229ED9]/25 transition-all hover:scale-105 hover:shadow-xl"
        >
          <TelegramIcon className="h-5 w-5" />
        </a>
      </div>

      <CallbackModal open={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </>
  );
}
