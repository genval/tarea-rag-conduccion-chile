/* Datos ilustrativos para los widgets de la sección "Índices / Vector stores".
   Se entrega como .js (global window.VSTORES) para funcionar con file://
   (un fetch() de .json local lo bloquea el navegador).

   Los puntajes de la demo de búsqueda híbrida son DIDÁCTICOS: ilustran cómo
   denso (embeddings) y léxico (BM25) ordenan distinto y cómo la fusión (RRF)
   combina ambos. No provienen de un índice real. */
window.VSTORES = {
  /* ---- Demo: búsqueda híbrida ---- */
  hybrid: {
    consulta: "norma IFRS 9 para provisiones de cartera",
    /* Cada candidato trae:
       dense  → score de similitud semántica (0..1, embeddings)
       lex    → score léxico BM25 normalizado (0..1, palabras exactas)
       Las posiciones (ranks) se calculan en vivo; el híbrido fusiona con RRF. */
    candidatos: [
      { id: "doc-09#c2", texto: "Aplicación de IFRS 9 al cálculo de provisiones por riesgo de crédito.", dense: 0.74, lex: 0.93 },
      { id: "doc-21#c5", texto: "Modelo de pérdida esperada para deterioro de la cartera de colocaciones.", dense: 0.88, lex: 0.18 },
      { id: "doc-12#c3", texto: "Clasificación de instrumentos financieros y etapas de deterioro.", dense: 0.81, lex: 0.30 },
      { id: "doc-04#c1", texto: "Guía interna: constitución de provisiones y castigos contables.", dense: 0.69, lex: 0.61 },
      { id: "doc-33#c7", texto: "Norma IFRS 9 — texto oficial sobre reconocimiento y medición.", dense: 0.58, lex: 0.97 },
      { id: "doc-17#c4", texto: "Indicadores de morosidad y cobertura del portafolio minorista.", dense: 0.66, lex: 0.12 }
    ]
  },

  /* ---- Tabla interactiva de soluciones ---- */
  soluciones: [
    {
      nombre: "Qdrant", tipo: "self-host", curso: true,
      nota: "Open source · self-host o cloud · filtros por payload · muy rápido.",
      detalle: "El vector store del curso. Escrito en Rust, expone una API REST/gRPC y permite filtrar por metadata (payload) durante la búsqueda — clave para combinar similitud con reglas de negocio. Corre local (Docker) o en Qdrant Cloud."
    },
    {
      nombre: "pgvector", tipo: "self-host", curso: false,
      nota: "Extensión de PostgreSQL · vectores junto a tus datos relacionales.",
      detalle: "Añade un tipo de dato vectorial a una base PostgreSQL que ya tienes. Sin infraestructura nueva: tus embeddings viven al lado de tus tablas y haces JOINs con el resto del negocio. Ideal cuando ya operas Postgres."
    },
    {
      nombre: "Pinecone", tipo: "managed", curso: false,
      nota: "Managed / serverless · cero operación · pago por uso.",
      detalle: "Servicio totalmente gestionado y serverless: no administras servidores ni índices a mano, escala solo. Conveniente para llegar rápido a producción; el costo y los datos quedan en manos del proveedor."
    },
    {
      nombre: "Weaviate", tipo: "self-host", curso: false,
      nota: "Open source · híbrido nativo · módulos de vectorización.",
      detalle: "Base vectorial open source con búsqueda híbrida (denso + BM25) integrada y módulos que generan los embeddings por ti. Self-host o cloud gestionado."
    },
    {
      nombre: "Milvus", tipo: "self-host", curso: false,
      nota: "Open source · pensado para escala muy grande (miles de millones).",
      detalle: "Diseñado para colecciones enormes y alto rendimiento, con índices ANN intercambiables. Más piezas que operar; brilla cuando el volumen es masivo."
    },
    {
      nombre: "Chroma", tipo: "self-host", curso: false,
      nota: "Ligero · local / dev · arranca en una línea.",
      detalle: "Pensado para desarrollo y prototipos: se levanta embebido en tu proceso de Python con mínima configuración. Cómodo para aprender; para producción a escala conviene migrar."
    },
    {
      nombre: "FAISS", tipo: "libreria", curso: false,
      nota: "Librería de Meta · en memoria · sin servidor — el fallback local.",
      detalle: "No es una base de datos sino una librería de Meta para búsqueda de vecinos en memoria. Sin servidor ni payload/metadata por sí sola. Es el fallback local de los notebooks cuando no hay Qdrant disponible."
    }
  ]
};
