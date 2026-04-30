from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime
import re


class ConsultationRequest(BaseModel):
    name: str = Field(..., description="Имя пользователя")
    phone: str = Field(..., description="Телефон пользователя")
    email: EmailStr = Field(..., description="Email пользователя")
    city: str = Field(..., description="Город пользователя")
    message: Optional[str] = Field(None, description="Дополнительная информация")
    consent: bool = Field(..., description="Согласие на обработку персональных данных (152-ФЗ)")
    consent_text: Optional[str] = Field(None, description="Текст, под которым пользователь подписался")
    consent_ts: Optional[datetime] = Field(None, description="Метка времени проставления согласия (ISO-8601)")

    @field_validator('phone')
    def validate_phone(cls, v):
        # Strict format check: +7 (XXX) XXX-XX-XX
        pattern = r"^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$"
        if not re.match(pattern, v):
            raise ValueError('Phone number must be in format +7 (XXX) XXX-XX-XX')
        return v

    @field_validator('consent')
    def validate_consent(cls, v):
        if v is not True:
            raise ValueError('Consent for personal data processing is required (152-FZ).')
        return v
