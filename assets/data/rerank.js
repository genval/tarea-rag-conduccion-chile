/* Datos ilustrativos para el widget de re-ranking de la sección
   "Retrieval · Re-ranking · Evaluación".
   Se entrega como .js (global window.RERANK) para funcionar con file://
   (un fetch() de .json local lo bloquea el navegador).

   Escenario didáctico: una consulta y 8 pasajes recuperados por el
   retriever (bi-encoder / similitud coseno). Cada pasaje trae:
     - cos : score del retriever (similitud coseno, 0..1) — RÁPIDO pero RUIDOSO
     - rel : relevancia REAL para responder la pregunta (0..1) — la emite
             un re-ranker (cross-encoder) o un LLM-as-judge

   La gracia es que el orden por `cos` NO coincide con el orden por `rel`:
   hay pasajes que el coseno pone arriba por parecido superficial pero que
   no responden la pregunta (ruido), y pasajes muy relevantes que el coseno
   subestima. Valores plausibles, fijados con fines de demostración. */
window.RERANK = {
  consulta: "¿Cómo afectó el teletrabajo a la productividad en 2024?",

  /* umbral por defecto del slider (relevancia mínima para pasar a generación) */
  umbralDefault: 0.55,

  pasajes: [
    {
      id: "P1",
      texto: "Glosario corporativo: definición de “teletrabajo”, “híbrido” y “productividad”.",
      cos: 0.91, rel: 0.22,
      nota: "Coincide en palabras clave pero es un glosario — no responde la pregunta."
    },
    {
      id: "P2",
      texto: "Estudio 2024: la productividad por empleado subió 7% con esquema híbrido.",
      cos: 0.74, rel: 0.95,
      nota: "Dato directo y fechado — esto SÍ responde la pregunta."
    },
    {
      id: "P3",
      texto: "Política interna de teletrabajo: días permitidos y solicitud de equipos.",
      cos: 0.83, rel: 0.30,
      nota: "Muy parecido léxicamente, pero es un procedimiento administrativo."
    },
    {
      id: "P4",
      texto: "Encuesta de clima 2024: satisfacción y productividad percibida del equipo remoto.",
      cos: 0.69, rel: 0.82,
      nota: "Relevante: liga teletrabajo ↔ productividad con datos de 2024."
    },
    {
      id: "P5",
      texto: "Historia de la empresa y apertura de oficinas regionales (2009–2018).",
      cos: 0.58, rel: 0.08,
      nota: "Entró por contexto general; ruido puro para esta pregunta."
    },
    {
      id: "P6",
      texto: "Informe trimestral: horas trabajadas vs. entregables, comparativa 2023–2024.",
      cos: 0.61, rel: 0.71,
      nota: "Aporta evidencia cuantitativa del cambio de productividad."
    },
    {
      id: "P7",
      texto: "Nota de prensa: la competencia anunció su regreso total a oficinas.",
      cos: 0.66, rel: 0.18,
      nota: "Tema vecino, pero es de otra empresa — no responde lo preguntado."
    },
    {
      id: "P8",
      texto: "Acta de directorio 2024: se aprueba mantener el modelo híbrido por sus resultados.",
      cos: 0.55, rel: 0.63,
      nota: "Decisión respaldada en resultados de 2024 — útil como contexto."
    }
  ]
};
