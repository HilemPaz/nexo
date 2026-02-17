# 🎮 Nexo

Jogo baseado em palavras com embeddings semânticos usando FastText.

Este projeto roda localmente com Python e pode ser publicado via Docker + Google Cloud Run.

---

# 📦 Requisitos

* Python 3.10+
* pip
* Git
* (Opcional) Docker

---

# 🚀 Rodando o projeto localmente

## 1️⃣ Gerar embeddings (script local)

> Esse passo só precisa ser feito quando quiser gerar novos embeddings.

O script usa FastText para gerar o arquivo:

```
app/resources/embeddings.npz
```

### 📌 Baixar modelo FastText

Baixe manualmente o modelo:

[https://fasttext.cc/docs/en/crawl-vectors.html](https://fasttext.cc/docs/en/crawl-vectors.html)

Coloque em:

```
app/models/cc.pt.300.bin
```

---

## 2️⃣ Criar ambiente virtual (venv)

### Windows

```bash
python -m venv .venv
.venv\\Scripts\\activate
```

### Linux / Mac

```bash
python3 -m venv .venv
source .venv/bin/activate
```

---

## 3️⃣ Instalar dependências

```bash
pip install -r requirements.txt
```

---

## 4️⃣ Gerar embeddings

```bash
python script/build_embeddings.py
```
OU 

```bash
python -m scripts.build_embeddings
```

Saída esperada:

```
app/resources/embeddings.npz
```

> ⚠️ O script não é necessário em produção.
> Apenas o arquivo `.npz` precisa estar presente.

---

## ▶️ Rodar o servidor local

```bash
uvicorn app.main:app --reload
```

Abrir no navegador:

```
http://localhost:8000
```

---

# 🐳 Rodando com Docker

## Build da imagem

```bash
docker build -t nexo .
```

## Rodar container

```bash
docker run -p 8000:8000 nexo
```

Abrir:

```
http://localhost:8000
```

---

# ☁️ Deploy no Google Cloud Run

## Build + Push

```bash
gcloud builds submit --tag gcr.io/SEU_PROJETO/nexo
```

## Deploy

```bash
gcloud run deploy nexo \
  --image gcr.io/SEU_PROJETO/nexo \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

# 📁 Estrutura do projeto

```
app/
 ├── main.py
 ├── models/
 ├── resources/
 │    └── embeddings.npz
 └── ...

script/
 └── build_embeddings.py  # uso local
```

---

# ⚠️ Observações importantes

* A pasta `script/` não precisa ir para produção
* Apenas o arquivo `.npz` é necessário em runtime
* O modelo FastText NÃO deve ser commitado (arquivo grande)

---

# 🧠 Tecnologias

* FastAPI
* FastText
* NumPy
* Docker
* Google Cloud Run

---

# 📜 Licença

Uso pessoal / experimental.
