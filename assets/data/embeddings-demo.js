/* Datos ilustrativos para los widgets de la sección Embeddings.
   Se entrega como .js (global window.EMB_DEMO) para funcionar con file://
   (un fetch() de .json local lo bloquea el navegador).

   Valores plausibles y precargados con fines didácticos. Para regenerarlos
   con vectores REALES de text-embedding-3 (256 dims), corre:
     uv run python scripts/precompute_embeddings.py
   que sobreescribe este archivo. */
window.EMB_DEMO = {
  /* proyección 2D ilustrativa (espacio 0..100) agrupada por significado */
  scatter: {
    clusters: [
      { id: "animales", label: "Animales", color: "#1D9E75" },
      { id: "comida",   label: "Comida y bebida", color: "#E0531F" },
      { id: "tech",     label: "Tecnología / IA", color: "#0B3C7A" },
      { id: "lugares",  label: "Lugares", color: "#9A4DB8" }
    ],
    points: [
      { t: "perro",      x: 20, y: 74, c: "animales" },
      { t: "gato",       x: 27, y: 80, c: "animales" },
      { t: "caballo",    x: 14, y: 65, c: "animales" },
      { t: "conejo",     x: 30, y: 69, c: "animales" },
      { t: "pan",        x: 75, y: 21, c: "comida" },
      { t: "café",       x: 81, y: 28, c: "comida" },
      { t: "vino",       x: 70, y: 15, c: "comida" },
      { t: "manzana",    x: 84, y: 24, c: "comida" },
      { t: "modelo",     x: 45, y: 54, c: "tech" },
      { t: "vector",     x: 51, y: 49, c: "tech" },
      { t: "token",      x: 56, y: 46, c: "tech" },
      { t: "índice",     x: 48, y: 43, c: "tech" },
      { t: "Santiago",   x: 78, y: 78, c: "lugares" },
      { t: "cordillera", x: 72, y: 85, c: "lugares" },
      { t: "playa",      x: 85, y: 72, c: "lugares" }
    ]
  },

  /* matriz de similitud coseno (simétrica, diagonal = 1) */
  cosine: {
    frases: [
      "Me encanta mi perro",
      "Adoro a mi mascota",
      "Tengo un gato en casa",
      "El auto está descompuesto",
      "Mañana llueve en Santiago",
      "¿Cómo entreno un modelo de IA?"
    ],
    matriz: [
      [1.00, 0.86, 0.55, 0.12, 0.09, 0.07],
      [0.86, 1.00, 0.58, 0.14, 0.10, 0.08],
      [0.55, 0.58, 1.00, 0.16, 0.13, 0.09],
      [0.12, 0.14, 0.16, 1.00, 0.21, 0.15],
      [0.09, 0.10, 0.13, 0.21, 1.00, 0.11],
      [0.07, 0.08, 0.09, 0.15, 0.11, 1.00]
    ]
  },

  /* Matryoshka: cómo cambia el coseno al truncar dimensiones.
     Partimos del vector completo de text-embedding-3-large (3072). */
  matryoshka: {
    dims: [3072, 1024, 512, 256, 64, 32],
    pares: [
      { a: "perro", b: "gato", rel: "similares", cos: [0.83, 0.83, 0.82, 0.82, 0.78, 0.70] },
      { a: "café",  b: "vino", rel: "relacionadas", cos: [0.75, 0.75, 0.74, 0.73, 0.66, 0.58] },
      { a: "perro", b: "auto", rel: "distintas", cos: [0.14, 0.14, 0.15, 0.16, 0.22, 0.31] }
    ]
  }
};
