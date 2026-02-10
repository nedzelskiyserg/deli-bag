FROM python:3.11-slim

WORKDIR /app

# Prevent Python from writing pyc files to disc
ENV PYTHONDONTWRITEBYTECODE 1
# Prevent Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED 1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend folder into /app/backend
COPY . /app/backend

# Create a non-root user for security (optional but good practice)
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Expose the port
EXPOSE 8000

# Run the application
# Note: we run from /app, so the module is backend.main
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
