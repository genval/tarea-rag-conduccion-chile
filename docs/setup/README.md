# Guías de configuración (setup)

Todo lo necesario para pasar de **cero** a **correr los notebooks**. Si es tu
primera vez, **empieza por la guía 00** — te lleva de punta a punta.

| # | Guía | Qué cubre |
|---|------|-----------|
| **[00](00-instalacion-local.md)** | **Instalación y primer arranque** ← empieza aquí | uv, Python 3.12, `uv sync`, `.env`, JupyterLab, orden de notebooks, scripts, verificación, troubleshooting |
| [01](01-openai-api-key.md) | **OpenAI API key** — ✅ obligatorio | crear cuenta + billing + clave `sk-…` → `OPENAI_API_KEY` |
| [02](02-qdrant-cuenta-y-datos.md) | **Qdrant** — ⚪ opcional (si no, FAISS local) | Cloud free tier o Docker local → `QDRANT_URL`, `QDRANT_API_KEY` |
| [03](03-langfuse-local.md) | **Langfuse local** — ⚪ opcional (si no, sin trazas) | self-host con Docker → `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, `LANGFUSE_BASE_URL` |

> **Regla práctica:** con solo `OPENAI_API_KEY` ya corres todos los notebooks de
> principio a fin. Qdrant y Langfuse son **degradantes**: si faltan, el código no
> falla — usa FAISS local u omite las trazas.

## Arranque exprés

```bash
brew install uv                 # o instalador curl (ver guía 00)
git clone <URL-del-repo> && cd uejecutivos-diplomado
uv sync                         # crea .venv e instala todo
cp .env.example .env            # pega tu OPENAI_API_KEY (guía 01)
uv run jupyter lab              # abre los notebooks en contenido/
```

Detalles, opciones por SO y problemas comunes: **[guía 00](00-instalacion-local.md)**.

## Orden de los notebooks (Módulo 03)

`01 Embeddings` → `02 Chunking` → **`03 Index & Vector Stores`** (indexa Qdrant —
córrelo antes de NB05/06) → `04 Retrieval/Rerank/Eval` → `05 Agentic RAG` →
`06 Multi-RAG Agent` (script `.py`, se corre desde `clases/`). Valida cada uno con
**Kernel → Restart & Run All**.

## Verificación rápida

```bash
uv run python -c "import os; from dotenv import load_dotenv; load_dotenv(); print('OPENAI:', bool(os.getenv('OPENAI_API_KEY'))); print('QDRANT:', bool(os.getenv('QDRANT_URL'))); print('LANGFUSE:', bool(os.getenv('LANGFUSE_PUBLIC_KEY')))"
```

Debe imprimir `OPENAI: True` (los otros dos pueden ser `False` si los omitiste).
Nunca subas `.env` — ya está en `.gitignore`.
