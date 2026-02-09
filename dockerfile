# =========================
# Base
# =========================
FROM python:3.11-slim

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/nexo
WORKDIR /nexo

# =========================
# Dependências do sistema (fastText)
# =========================
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    python3-dev \
    cmake \
    wget \
    && rm -rf /var/lib/apt/lists/*

# =========================
# Dependências Python
# =========================
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir \
       fastapi==0.104.1 \
       uvicorn[standard]==0.24.0 \
       jinja2==3.1.2 \
       numpy==1.24.3 \
       torch

# =========================
# Código da aplicação
# =========================
COPY . .

# =========================
# Modelo fastText
# =========================
# ⚡ NÃO coloque dentro da imagem final se for produção
# COPY app/models/cc.pt.300.bin app/models/
# Em DEV local, monte via volume docker-compose:
# volumes:
#   - ./models:/models
ENV FASTTEXT_MODEL=/models/cc.pt.300.bin


# =========================
# Comando padrão
# =========================
# ⚠️ Cloud Run exige porta 8080
CMD ["uvicorn", "app.web.app:app", "--host", "0.0.0.0", "--port", "8080"]
