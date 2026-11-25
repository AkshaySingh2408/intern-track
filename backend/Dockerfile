FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (build tools & curl for healthcheck)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    curl \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Set environment
ENV PYTHONPATH=/app
ENV PORT=8000

EXPOSE 8000

# Run migrations and start server
CMD ["sh", "-c", "alembic upgrade head && python -m app.seed && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
