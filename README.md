# Proyecto RAG — Libro para la Conducción en Chile (Capítulo 1)
 
Sistema RAG (Retrieval-Augmented Generation) construido sobre el **Capítulo 1: "Los siniestros de tránsito"** del *Libro para la Conducción en Chile* (CONASET, 2024). Dada una pregunta, el sistema recupera los pasajes relevantes del documento y responde **citando la sección de origen**.
 
**Grupo:** _completar_
**Ramo:** Módulo 03 — Tarea evaluada (7 puntos)
 
## Qué hace el sistema
 
1. Ingesta el documento y lo divide en fragmentos (**chunking**), respetando su estructura (secciones) y probando distintos tamaños.
2. Convierte cada fragmento en un vector (**embeddings**, `text-embedding-3-large`, 256 dims) y lo indexa en **Qdrant Cloud**.
3. Ante una pregunta, recupera los fragmentos más relevantes y genera una respuesta **solo con esa información**, citando la sección de la que proviene cada dato.
4. Mejora la calidad del retrieval con **re-ranking**: un LLM puntúa la relevancia real de cada fragmento recuperado y descarta los que no superan un umbral, antes de generar la respuesta final.
5. Compara cuantitativa y cualitativamente el pipeline básico vs. el re-ranked en un set de preguntas propio.
## Documento fuente
 
`data/cap1_siniestros_transito.md` — extracto del Capítulo 1 del *Libro para la Conducción en Chile*, Comisión Nacional de Seguridad de Tránsito (CONASET), actualización de julio 2024. Material de acceso público: https://mejoresconductores.conaset.cl
 
## Cómo correrlo
 
### 1. Requisitos
- Python 3.11+ (recomendado; evita problemas de compatibilidad con librerías de datos en Windows)
- Una cuenta de **Qdrant Cloud** (free tier): https://cloud.qdrant.io
- Una **API key de OpenAI**
### 2. Instalar dependencias
```bash
pip install python-dotenv qdrant-client langchain-openai langchain-qdrant langchain-text-splitters pandas
```
 
### 3. Configurar credenciales
Crear un archivo `.env` en la raíz del proyecto (**nunca se sube a GitHub**, ya está en `.gitignore`) con:
```
OPENAI_API_KEY=tu_key_de_openai
QDRANT_URL=tu_url_de_qdrant
QDRANT_API_KEY=tu_key_de_qdrant
```
 
> ⚠️ **Si son varios corriendo el mismo notebook:** la celda de indexación usa `recreate_collection`, que **borra y reconstruye** la colección en Qdrant desde cero. Evitar correr el notebook completo en paralelo — coordinarse para correrlo de a uno, o correr solo desde el Paso 5 en adelante (consultas) sin repetir la celda de indexación.
 
### 4. Abrir y correr
Abrir `Proyecto_RAG.ipynb` en VS Code (extensiones **Python** y **Jupyter** instaladas), seleccionar el kernel de Python, y correr todas las celdas en orden (`Kernel → Restart & Run All`).
 
## Estructura del proyecto
 
```
├── .env                          ← credenciales (no versionado)
├── .gitignore
├── README.md
├── Proyecto_RAG.ipynb            ← notebook principal
└── data/
    └── cap1_siniestros_transito.md
```
 
## Contenido del notebook
 
| Paso | Contenido | Criterio rúbrica |
|---|---|---|
| 0–1 | Setup de entorno y conexión a Qdrant Cloud | — |
| 2 | Carga del documento | — |
| 3 | Chunking justificado (split por headers + recursive, comparación de configs) | #1 |
| 4 | Embeddings + indexación en Qdrant Cloud | #2 |
| 5 | RAG básico con fuentes | #3 |
| 6 | Re-ranking LLM-as-judge + threshold | #4, #5 |
| 7 | Mini-eval comparativa (básico vs re-ranked) | #6 |
| Bonus | Filtrado por metadata, query rewriting, multi-query/HyDE | — |
 
## Decisiones clave (resumen)
 
- **Chunking:** split por headers de Markdown (`##`) + `RecursiveCharacterTextSplitter` dentro de cada sección. Se comparó `chunk_size=400/overlap=60` vs `chunk_size=800/overlap=120`; se eligió la segunda configuración porque mantiene unidades completas (ej. los 4 principios del Sistema Seguro no quedan cortados entre chunks).
- **Vector store:** Qdrant Cloud, distancia coseno, 256 dimensiones.
- **Re-ranking:** top-k amplio → LLM puntúa relevancia (0–1) por pasaje → threshold 0.5 → generación solo con los que superan el umbral.
## Bonus implementados
 
- **Filtrado por metadata:** acota la búsqueda a una sección específica del documento vía `Filter` de Qdrant.
- **Query rewriting:** reescribe preguntas coloquiales/vagas a vocabulario del documento antes de buscar.
- **Multi-query / HyDE:** genera variantes de la pregunta o una respuesta hipotética para mejorar el retrieval.
_(Se intentó también evaluación automática con RAGAS, pero se descartó por un bloqueo de compatibilidad de `pyarrow` con Python 3.13 en Windows, sin impacto en la nota ya que el bonus no es indispensable.)_
 
## Créditos
 
- Documento: Comisión Nacional de Seguridad de Tránsito (CONASET), Chile.
- Pipeline adaptado de los Notebooks 01–04 del curso (Embeddings, Chunking, Vector Stores, Retrieval/Rerank/Eval).