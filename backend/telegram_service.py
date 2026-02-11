import httpx
import logging
import os
from .models import ConsultationRequest

logger = logging.getLogger("deli_bag_backend")

async def send_telegram_notification(data: ConsultationRequest):
    bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_ids_str = os.getenv("TELEGRAM_CHAT_ID", "")
    
    if not bot_token or not chat_ids_str:
        logger.error("Telegram credentials not set (bot_token or chat_id missing). Skipping notification.")
        return False

    # Split chat_ids by comma and strip whitespace
    chat_ids = [cid.strip() for cid in chat_ids_str.split(",") if cid.strip()]

    if not chat_ids:
        logger.error("No valid chat IDs found in TELEGRAM_CHAT_ID.")
        return False

    message_text = (
        f"<b>Новая заявка на тест-драйв!</b>\n"
        f"👤 Имя: {data.name}\n"
        f"📞 Телефон: {data.phone}\n"
        f"📧 Email: {data.email}\n"
        f"🏙 Город: {data.city}\n"
        f"📝 Сообщение: {data.message or 'Не указано'}"
    )

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    
    async with httpx.AsyncClient() as client:
        success_count = 0
        for chat_id in chat_ids:
            payload = {
                "chat_id": chat_id,
                "text": message_text,
                "parse_mode": "HTML"
            }
            try:
                response = await client.post(url, json=payload)
                response.raise_for_status()
                logger.info(f"Telegram notification sent successfully to {chat_id}.")
                success_count += 1
            except httpx.HTTPError as e:
                logger.error(f"Failed to send Telegram notification to {chat_id}: {e}")
        
        return success_count > 0
