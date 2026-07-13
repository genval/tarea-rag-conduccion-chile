# 00 · Instalación y primer arranque

Guía completa para pasar de **cero** a **correr los notebooks** en tu máquina.
Sigue los pasos en orden. Al final tienes una tabla de problemas comunes.

> **Resumen (TL;DR):**
> ```bash
> brew install uv                 # o el instalador curl (ver §1)
> git clone <URL-del-repo> && cd uejecutivos-diplomado
> uv sync                         # crea .venv e instala todo
> cp .env.example .env            # pega tu OPENAI_API_KEY (guía 01)
> uv run jupyter lab              # abre los notebooks en contenido/
> ```

---

## Prerrequisitos

- **Terminal** (macOS/Linux: Terminal/zsh; Windows: PowerShell).
- **git** (`git --version`). En macOS suele venir con las *Command Line Tools*.
- **Una API key de OpenAI** — único requisito de servicio → [guía 01](01-openai-api-key.md).
- *(Opcional)* **Docker Desktop** — solo si quieres correr Langfuse en local → [guía 03](03-langfuse-local.md).
- *(Opcional)* Cuenta de **Qdrant** → [guía 02](02-qdrant-cuenta-y-datos.md). Sin ella, los notebooks usan FAISS local.

No necesitas instalar Python a mano: **uv** lo gestiona (paso 1 y 3).

---

## 1. Instalar uv

[uv](https://docs.astral.sh/uv/) es el gestor de dependencias y de versiones de
Python del proyecto (reemplaza a `pip` + `venv` + `pyenv`).

- **macOS (Homebrew):**
  ```bash
  brew install uv
  ```
- **macOS / Linux (instalador oficial):**
  ```bash
  curl -LsSf https://astral.sh/uv/install.sh | sh
  ```
- **Windows (PowerShell):**
  ```powershell
  powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
  ```

Verifica:
```bash
uv --version
```

---

## 2. Clonar el repositorio

```bash
git clone <URL-del-repo>
cd uejecutivos-diplomado
```

Si ya lo tienes clonado, actualízalo: `git pull`.

---

## 3. Instalar Python 3.12 + dependencias

uv lee `.python-version` (**3.12**) y `pyproject.toml` / `uv.lock`. Un solo comando
crea el entorno virtual (`.venv/`) e instala **exactamente** las versiones del lock:

```bash
uv sync
```

- Si falta el intérprete 3.12, instálalo y reintenta:
  ```bash
  uv python install 3.12
  uv sync
  ```
- **Tras cada `git pull`, vuelve a correr `uv sync`** — el lock puede haber cambiado.

> No existe `requirements.txt`: la fuente de verdad es `pyproject.toml` + `uv.lock`.

---

## 4. Configurar las claves (`.env`)

```bash
cp .env.example .env
```

Edita `.env` y completa según lo que vayas a usar:

| Variable | ¿Obligatoria? | Guía |
|----------|---------------|------|
| `OPENAI_API_KEY` | ✅ Sí | [01](01-openai-api-key.md) |
| `QDRANT_URL` / `QDRANT_API_KEY` | ⚪ Opcional (si no, FAISS local) | [02](02-qdrant-cuenta-y-datos.md) |
| `LANGFUSE_PUBLIC_KEY` / `LANGFUSE_SECRET_KEY` / `LANGFUSE_BASE_URL` | ⚪ Opcional (trazas) | [03](03-langfuse-local.md) |
| `TAVILY_API_KEY` | ⚪ Opcional (web search del agente) | — |

> **Nunca subas `.env`** — ya está en `.gitignore`. Las claves son secretas.

---

## 5. Abrir los notebooks

```bash
uv run jupyter lab
```

Se abre JupyterLab en el navegador. Navega a `contenido/` y abre los notebooks.

- Si Jupyter pide elegir kernel, usa el del proyecto (el de `.venv`). Lanzarlo con
  `uv run` ya garantiza que use el entorno correcto.
- ¿Prefieres no usar `uv run` cada vez? Activa el entorno una vez por terminal:
  ```bash
  source .venv/bin/activate     # Windows: .venv\Scripts\activate
  jupyter lab
  ```

---

## 6. Orden de ejecución — Módulo 03

Córrelos en orden; cada notebook construye sobre el anterior. **No hay test
runner**: valida cada uno con **Kernel → Restart & Run All**.

1. `Notebook_01_Embeddings.ipynb`
2. `Notebook_02_Chunking.ipynb`
3. **`Notebook_03_Index_&_Vector_Stores.ipynb` — indexa el corpus en Qdrant
   (colección `rag_avanzado_2025`).** ⚠️ Córrelo **antes** que NB05/NB06 o el
   retrieval/agente devuelve vacío. (Sin Qdrant configurado, indexa en FAISS local.)
4. `Notebook_04_Retrieval_Rerank_Eval.ipynb`
5. `Notebook_05_Agentic_RAG.ipynb`
6. `Notebook_06_Multi_RAG_Agent.py` — es un **script**, no un notebook (ver §7).

---

## 7. Correr los scripts `.py` (ojo con el directorio)

Los scripts leen los datos por **ruta relativa** (`../synthetic_data/`), así que
debes lanzarlos **desde su carpeta `clases/`**:

- **Agente Multi-RAG (M03):**
  ```bash
  cd "contenido/modulo 03/clases"
  uv run python Notebook_06_Multi_RAG_Agent.py                 # interactivo
  uv run python Notebook_06_Multi_RAG_Agent.py --no-interactive  # corrida no-TTY
  ```
  Requiere haber indexado Qdrant en el Notebook 03 (misma colección y `dimensions=256`).

- **Pipeline de seguridad / re-ranking (M04):** toma argumentos CLI — mira primero
  la ayuda:
  ```bash
  cd "contenido/modulo 04/clases"
  uv run python Notebook_01_Ejercicio_Seguridad_Resultado.py --help
  ```

---

## 8. Verificar la instalación

```bash
# (a) ¿se cargan las claves del .env?
uv run python -c "import os; from dotenv import load_dotenv; load_dotenv(); print('OPENAI:', bool(os.getenv('OPENAI_API_KEY'))); print('QDRANT:', bool(os.getenv('QDRANT_URL'))); print('LANGFUSE:', bool(os.getenv('LANGFUSE_PUBLIC_KEY')))"

# (b) smoke test de librerías (pandas + matplotlib cargan y grafican)
uv run python python-test.py
```

`OPENAI: True` es lo único imprescindible. O directamente: corre el
`Notebook_01_Embeddings.ipynb` de punta a punta.

---

## Problemas comunes (troubleshooting)

| Síntoma | Causa / arreglo |
|---------|-----------------|
| `Falta OPENAI_API_KEY` o el script termina pidiéndola | No creaste `.env` o no pegaste la clave → §4 / [guía 01](01-openai-api-key.md). |
| `insufficient_quota` / HTTP 429 | Tu cuenta OpenAI no tiene saldo → agrega billing ([guía 01](01-openai-api-key.md)). |
| El retrieval o el agente **no devuelve nada** | La colección Qdrant está vacía → corre **Notebook 03** primero. Verifica que las dimensiones coincidan (`dimensions=256` en indexado y consulta). |
| `400` al llamar al modelo / mención a `temperature` | Los modelos `gpt-5.x` son de **razonamiento**: **no** pases `temperature` (devuelve HTTP 400). Controla costo/latencia con `reasoning_effort`. |
| `ModuleNotFoundError` o versiones raras | Corre `uv sync` (sobre todo después de `git pull`). Usa `uv run …` o activa `.venv`. |
| Jupyter no encuentra las librerías | El kernel debe ser el `.venv` del proyecto → lanza con `uv run jupyter lab`. |
| El script no encuentra `synthetic_data/` | Lánzalo **desde su carpeta de módulo** (`clases/`), no desde otra ruta (§7). |
| Langfuse no muestra trazas | Es opcional; revisa claves/instancia ([guía 03](03-langfuse-local.md)) — el notebook corre igual sin ellas. |
| `uv: command not found` | uv no quedó en el `PATH` → reabre la terminal o sigue el mensaje del instalador (§1). |

---

**Siguiente:** obtén tus claves → [01 · OpenAI](01-openai-api-key.md) ·
[02 · Qdrant](02-qdrant-cuenta-y-datos.md) · [03 · Langfuse local](03-langfuse-local.md).
Variables de entorno: [`.env.example`](../../.env.example) · visión general: [README raíz](../../README.md).
