# 03 · Langfuse en local (trazabilidad / observabilidad)

[Langfuse](https://langfuse.com/) es la herramienta de **observabilidad** del
curso: cada corrida de un agente o pipeline (del **Notebook 04 en adelante**)
queda como un *trace* navegable — árbol de pasos (LLM, tools, retrievers) con
prompts, tokens, latencia y costo. Es la forma de **mostrar en vivo** qué hace
el sistema y de depurarlo.

> ⚪ **Es opcional y degradante.** Sin claves de Langfuse (o sin el paquete
> `langfuse`), los notebooks corren **igual**, solo que sin trazas. La
> integración usa **Langfuse v4** con el `CallbackHandler` de LangChain.

Esta guía monta Langfuse **self-hosted en tu máquina** con Docker Compose (no
necesitas cuenta en la nube). Si prefieres la nube, ve al final.

## Requisitos

- `git`
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (incluye
  `docker compose`). Déjalo abierto/corriendo.

## Pasos

1. **Clona el repo de Langfuse** (en una carpeta *fuera* de este proyecto):
   ```bash
   git clone https://github.com/langfuse/langfuse.git
   cd langfuse
   ```

2. **Levanta los contenedores:**
   ```bash
   docker compose up
   ```
   La primera vez baja varias imágenes (Postgres, ClickHouse, etc.) y tarda unos
   minutos. Cuando el contenedor `langfuse-web-1` registre **`Ready`**
   (≈ 2–3 min), ya está arriba. Déjalo corriendo en esa terminal.

3. **Abre la UI:** <http://localhost:3000>.

4. **Crea tu cuenta local.** En la primera pantalla regístrate (los datos viven
   solo en tu Docker, en tu máquina). Luego crea una **Organización** y dentro
   un **Proyecto** (p. ej. `diplomado-rag`).

5. **Genera las API keys.** Dentro del proyecto:
   **Settings → API Keys → Create new API key**. Te da dos:
   - **Public Key** → empieza con `pk-lf-...`
   - **Secret Key** → empieza con `sk-lf-...` (se muestra una sola vez, cópiala)

6. **Pégalas en el `.env` de *este* proyecto** (el del diplomado, no el de
   Langfuse), apuntando a tu instancia local:
   ```bash
   LANGFUSE_PUBLIC_KEY=pk-lf-tu_public_key
   LANGFUSE_SECRET_KEY=sk-lf-tu_secret_key
   LANGFUSE_BASE_URL=http://localhost:3000
   ```

7. **Corre un notebook con trazas.** Abre, por ejemplo, el
   **[Notebook 04](../../contenido/modulo%2003/clases/)** y ejecútalo. La celda de
   Langfuse valida las claves con `get_client().auth_check()` y debería imprimir:
   ```
   ✅ Langfuse activo → http://localhost:3000  ·  abre la pestaña Traces
   ```
   Vuelve a <http://localhost:3000> → pestaña **Traces** y verás la corrida.

## Apagar / reiniciar

- Detener: `Ctrl+C` en la terminal, o desde la carpeta `langfuse/`:
  ```bash
  docker compose down       # detiene; CONSERVA los datos (volúmenes)
  docker compose up         # vuelve a levantar con tus proyectos y claves
  ```
- Borrar todo (datos incluidos): `docker compose down -v`.

## Alternativa — Langfuse Cloud (sin Docker)

Si no quieres correr Docker, crea un proyecto gratis en la nube y usa esas
claves en vez de las locales:

- **EU:** <https://cloud.langfuse.com> → `LANGFUSE_BASE_URL=https://cloud.langfuse.com`
- **US:** <https://us.cloud.langfuse.com> → `LANGFUSE_BASE_URL=https://us.cloud.langfuse.com`

Las keys (`pk-lf-...` / `sk-lf-...`) se obtienen igual: **Settings → API Keys**.

## Notas

- La única diferencia local vs. nube es `LANGFUSE_BASE_URL`. Las keys y el flujo
  de los notebooks son idénticos.
- Más detalle de variables: [`.env.example`](../../.env.example).
- Referencia oficial del despliegue local:
  <https://langfuse.com/self-hosting/deployment/docker-compose>.
