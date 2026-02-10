import httpx
import logging
import os
from .models import ConsultationRequest

logger = logging.getLogger("deli_bag_backend")

async def send_telegram_notification(data: ConsultationRequest):
    bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")

    if not bot_token or not chat_id:
        logger.error("Telegram credentials not set. Skipping notification.")
        return False

    message = (
        f"<b>Новая заявка на тест-драйв!</b>\n"
        f"👤 Имя: {data.name}\n"
        f"📞 Телефон: {data.phone}\n"
        f"📧 Email: {data.email}\n"
        f"🏙 Город: {data.city}\n"
        f"📝 Сообщение: {data.message or 'Не указано'}"
    )

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "HTML"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            logger.info("Telegram notification sent successfully.")
            return True
        except httpx.HTTPError as e:
            logger.error(f"Failed to send Telegram notification: {e}")
            return False
