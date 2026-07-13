# 02 · Cuenta y datos de Qdrant

[Qdrant](https://qdrant.tech/) es el **vector store** del curso: guarda los
*embeddings* de los documentos y resuelve la búsqueda por similitud (el paso
*retrieval* del RAG).

> ⚪ **Es opcional.** Si no configuras Qdrant, los notebooks caen
> automáticamente a **FAISS** (índice vectorial local, en memoria). Funciona
> para aprender; Qdrant agrega persistencia y una UI para inspeccionar la
> colección. Tienes dos caminos: **Qdrant Cloud** (gratis, sin instalar nada) o
> **Qdrant local con Docker**.

---

## Opción A — Qdrant Cloud (recomendada, free tier)

1. **Crea una cuenta** en <https://cloud.qdrant.io/>.

2. **Crea un cluster gratuito.** *Clusters → Create* → elige el plan **Free**
   (1 GB, suficiente para el curso). Espera ~1–2 min a que quede *Healthy*.

3. **Copia la URL del endpoint.** En el cluster verás algo como:
   ```
   https://xxxxxxxx-xxxx-xxxx.aws.cloud.qdrant.io:6333
   ```
   Incluye el puerto `:6333`.

4. **Genera una API key.** *Data Access Control* (o *API Keys*) →
   **Create** → cópiala (se muestra una sola vez).

5. **Pégalas en tu `.env`:**
   ```bash
   QDRANT_URL=https://xxxxxxxx-xxxx-xxxx.aws.cloud.qdrant.io:6333
   QDRANT_API_KEY=tu_api_key_de_qdrant
   ```

---

## Opción B — Qdrant local con Docker

Sin cuenta ni internet. Necesitas [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
docker run -p 6333:6333 -p 6334:6334 -v "$(pwd)/qdrant_storage:/qdrant/storage" qdrant/qdrant
```

Luego en `.env` (sin API key):
```bash
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=
```

UI del dashboard: <http://localhost:6333/dashboard>.

---

## Cargar los datos (poblar la colección)

Tener Qdrant conectado **no** basta: está vacío. Los datos los carga el
**[Notebook 03 · Index & Vector Stores](../../contenido/modulo%2003/clases/Notebook_03_Index_&_Vector_Stores.ipynb)**,
que indexa el corpus «Grupo Andes» en la colección **`rag_avanzado_2025`**.

> 🔗 **Acoplamiento importante:** el agente Multi-RAG
> ([Notebook 06](../../contenido/modulo%2003/clases/Notebook_06_Multi_RAG_Agent.py))
> lee de la colección `rag_avanzado_2025` con `OpenAIEmbeddings(dimensions=256)`.
> Debes correr **primero** el Notebook 03 (indexar) usando el **mismo modelo y
> las mismas dimensiones**; si no, el retrieval no devuelve nada. Los nombres de
> colección y dimensión están fijados en el código — en `.env` solo van la URL y
> la API key.

## Verificación

```bash
uv run python -c "from qdrant_client import QdrantClient; import os; from dotenv import load_dotenv; load_dotenv(); c=QdrantClient(url=os.getenv('QDRANT_URL'), api_key=os.getenv('QDRANT_API_KEY') or None); print([x.name for x in c.get_collections().collections])"
```

Lista las colecciones. Vacío `[]` es normal **antes** de correr el Notebook 03;
después debería aparecer `rag_avanzado_2025`.

## Notas

- Más detalle de variables: [`.env.example`](../../.env.example).
- Si dejas `QDRANT_URL` vacío, los notebooks usan FAISS local sin avisar — útil
  si solo quieres avanzar sin montar Qdrant.
