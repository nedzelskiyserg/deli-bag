from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class ConsultationRequest(BaseModel):
    name: str = Field(..., description="Имя пользователя")
    phone: str = Field(..., description="Телефон пользователя")
    email: EmailStr = Field(..., description="Email пользователя")
    city: str = Field(..., description="Город пользователя")
    message: Optional[str] = Field(None, description="Дополнительная информация")
