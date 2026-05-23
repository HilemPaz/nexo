# =========================
# Base
# =========================
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/nexo
WORKDIR /nexo

# =========================
# Dependências do sistema (para fasttext, se necessário)
# =========================
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    cmake \
    && rm -rf /var/lib/apt/lists/*

# =========================
# Dependências Python
# =========================
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir gunicorn uvicorn

# =========================
# Código da aplicação
# =========================
COPY app ./app

# =========================
# Embeddings pré-gerados
# =========================
COPY app/resources/embeddings.npz ./app/resources/embeddings.npz

# =========================
# Variáveis de ambiente
# =========================
ENV EMBEDDINGS_PATH=/nexo/app/resources/embeddings.npz
ENV PORT=8080

# =========================
# Servidor de produção
# =========================
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-b", ":8080", "app.web.app:app"]
