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

    import random

    wolf_quotes = [
        "Ты хочешь провести всю жизнь в экономе?",
        "Клиент созрел, он ждет твоего звонка!",
        "Деньги не спят, и ты не должен!",
        "Этот парень хочет потратить свои деньги!",
        "Пока ты думаешь, другие закрывают сделки!",
        "Успех — это не случайность, это твой выбор!",
        "Ты здесь, чтобы делать деньги или смотреть в окно?",
        "Хватай быка за рога, это твой шанс!",
        "Не вешай трубку, пока клиент не купит или не сдохнет!",
        "Ты волк или овца? Покажи им, кто здесь главный!",
        "Самый дешевый товар — это мнение других. Продавай!",
        "Риск — это билет на вершину. Действуй!",
        "Никто не вспомнит твое имя, если ты не закроешь эту сделку!",
        "Ты хочешь новый Феррари или проездной на метро?",
        "Будь безжалостным! Этот лид — твоя добыча!",
        "Победители берут все, лузеры платят по счетам!",
        "Жадность — это хорошо! Забирай всё!",
        "Не дай ему уйти, вцепись в него как бульдог!",
        "Твой банковский счет сам себя не пополнит!",
        "Сегодня ты либо хищник, либо обед!"
    ]

    random_quote = random.choice(wolf_quotes)

    message_text = (
        f"<b>{random_quote}</b>\n\n"
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
