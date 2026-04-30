import type { PlantRequestInput } from "@/lib/validation/plant";
import type { CallbackInput } from "@/lib/validation/callback";

type NotificationPayload = {
  type: "plant_request" | "callback_request";
  title: string;
  lines: string[];
  data: Record<string, unknown>;
};

async function postTelegram(payload: NotificationPayload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text = [payload.title, ...payload.lines].join("\n");
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });
}

async function postWebhook(payload: NotificationPayload) {
  const url = process.env.SUBMISSION_WEBHOOK_URL;
  if (!url) return;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function notify(payload: NotificationPayload) {
  try {
    await Promise.allSettled([postTelegram(payload), postWebhook(payload)]);
  } catch (err) {
    console.error("[notifications] unexpected error:", err);
  }
}

export async function notifyPlantRequest(data: PlantRequestInput) {
  await notify({
    type: "plant_request",
    title: "New Túbir tree request",
    lines: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "-"}`,
      `Country: ${data.country || "-"}`,
      `Species: ${data.species}`,
      `Quantity: ${data.quantity}`,
      `Locale: ${data.locale}`,
    ],
    data,
  });
}

export async function notifyCallbackRequest(data: CallbackInput) {
  await notify({
    type: "callback_request",
    title: "New Túbir callback request",
    lines: [
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Locale: ${data.locale}`,
      `Source: ${data.source || "-"}`,
    ],
    data,
  });
}
