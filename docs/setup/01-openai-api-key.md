# 01 · Obtener una API key de OpenAI

Es el **único requisito obligatorio** del curso: los notebooks usan modelos de
OpenAI tanto para generación (`gpt-5.4-mini` por defecto) como para *embeddings*
(`text-embedding-3-large`).

> ⚠️ La **API** de OpenAI es de pago y se cobra **por uso**. Es una cuenta
> distinta de ChatGPT / ChatGPT Plus — tener Plus **no** te da créditos de API.
> Para este curso el gasto es bajo (centavos por notebook con los modelos
> `mini`/`nano`), pero necesitas un método de pago o créditos cargados.

## Pasos

1. **Crea una cuenta** en <https://platform.openai.com/signup> (o inicia sesión
   en <https://platform.openai.com/>).

2. **Carga saldo / agrega método de pago.** Ve a
   **Settings → Billing** (<https://platform.openai.com/settings/organization/billing/overview>)
   y agrega una tarjeta o compra créditos prepago. Sin saldo, las llamadas
   fallan con `429 insufficient_quota`.

3. **(Recomendado) Pon un límite de gasto.** En **Billing → Limits** define un
   *monthly budget* (p. ej. USD 5–10) para no llevarte sorpresas.

4. **Crea la API key.** Ve a <https://platform.openai.com/api-keys> →
   **Create new secret key**. Ponle un nombre (p. ej. `diplomado-rag`) y créala.

5. **Cópiala YA.** La clave (empieza con `sk-...`) se muestra **una sola vez**.
   Si la pierdes, no se puede recuperar — borra esa y crea otra.

6. **Pégala en tu `.env`** (en la raíz del repo):
   ```bash
   OPENAI_API_KEY=sk-tu_clave_real_aqui
   ```

## Verificación

```bash
uv run python -c "from openai import OpenAI; print(OpenAI().models.list().data[0].id)"
```

Si imprime un id de modelo, la clave funciona. Si ves `AuthenticationError`,
revisa que la copiaste completa; si ves `insufficient_quota`, te falta saldo
(paso 2).

## Notas

- **Modelos del curso (v5.2026):** `gpt-5.5` (calidad/CodeAct), `gpt-5.4-mini`
  (por defecto) y `gpt-5.4-nano` (lotes baratos); *embeddings*
  `text-embedding-3-large` con `dimensions=256`. Son **modelos de razonamiento**:
  no pases `temperature` (devuelve HTTP 400) — controla costo/latencia con
  `reasoning_effort`. El nombre del modelo está fijado en cada notebook; en
  `.env` solo necesitas `OPENAI_API_KEY`.
- **Seguridad:** la clave es secreta y personal. No la pegues en chats, no la
  subas a git (`.env` ya está en `.gitignore`), no la compartas con compañeros.
- Más detalle de variables: [`.env.example`](../../.env.example).
