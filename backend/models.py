from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
import re

class ConsultationRequest(BaseModel):
    name: str = Field(..., description="Имя пользователя")
    phone: str = Field(..., description="Телефон пользователя")
    email: EmailStr = Field(..., description="Email пользователя")
    city: str = Field(..., description="Город пользователя")
    message: Optional[str] = Field(None, description="Дополнительная информация")

    @field_validator('phone')
    def validate_phone(cls, v):
        # Strict format check: +7 (XXX) XXX-XX-XX
        pattern = r"^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$"
        if not re.match(pattern, v):
            raise ValueError('Phone number must be in format +7 (XXX) XXX-XX-XX')
        return v
