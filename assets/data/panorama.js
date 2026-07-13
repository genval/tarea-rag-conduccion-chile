/* Datos para los widgets de la Sección 7 — Panorama (global window.PANORAMA).
   Se entrega como .js (no .json) para funcionar abriendo el deck vía file://.
   Contenido didáctico, alineado a las tendencias de RAG 2025-2026. Las cifras de
   costo de GraphRAG son ÓRDENES DE MAGNITUD ilustrativos, no benchmarks. Varias
   capacidades cloud son preview/según región: presentar el patrón, no el botón. */
window.PANORAMA = {

  /* ---- W1 · loop de RAG agéntico (stepper) ---- */
  agentic: [
    { ph: "Entrada", stage: "Pregunta del usuario", tech: "",
      desc: "Llega la consulta. En vez de un pipeline fijo, ahora decide un agente.",
      io: '"¿Cómo cambió nuestra exposición a IFRS 9 este trimestre?"' },
    { ph: "Decidir", stage: "¿Hace falta recuperar?", tech: "Router",
      desc: "El agente decide si necesita buscar, qué fuente usar… o si ya puede responder.",
      io: "router → { recuperar: sí, fuente: informes_riesgo }" },
    { ph: "Planificar", stage: "Reformular / descomponer", tech: "Query rewriting · multi-query · HyDE",
      desc: "Reescribe la pregunta vaga o la parte en sub-preguntas para buscar mejor.",
      io: '→ ["exposición IFRS 9 Q4", "provisiones por deterioro Q4 vs Q3"]' },
    { ph: "Recuperar", stage: "Búsqueda híbrida", tech: "Densa + BM25 + RRF",
      desc: "Semántica (embeddings) + léxica (palabras exactas: 'IFRS 9') fusionadas. Hoy es el piso, no un extra.",
      io: "top-k candidatos (vector ∪ keyword) → fusión RRF" },
    { ph: "Evaluar", stage: "¿Los documentos sirven?", tech: "Corrective RAG (grade)",
      desc: "Un grader LLM revisa si lo recuperado es realmente relevante.",
      io: "grade(docs) → { relevantes: 2, dudosos: 3 }" },
    { ph: "Corregir", stage: "Si no: reformula o busca en web", tech: "Corrective RAG", loop: true,
      desc: "Si el contexto es flojo, reescribe la consulta o cae a otra fuente. Vuelve a recuperar.",
      io: "↩ reintenta con nueva consulta / fallback web" },
    { ph: "Generar", stage: "Responder con el contexto", tech: "",
      desc: "El LLM redacta usando solo los pasajes que sobrevivieron.",
      io: '"La exposición subió 7%, impulsada por…" (+ fuentes)' },
    { ph: "Verificar", stage: "¿Está fundamentado?", tech: "Self-RAG", loop: true,
      desc: "El modelo critica su propia respuesta: ¿cada afirmación tiene respaldo? Si alucinó, reintenta.",
      io: "self-check → { fundamentado: sí } · si no ↩" },
    { ph: "Salida", stage: "Respuesta citada", tech: "",
      desc: "Responde con citas trazables. Caro (2-5×): por eso se enruta, no se aplica a todo.",
      io: '"…subió 7% [informe_riesgo_Q4, p.12]."' }
  ],

  /* ---- W2 · ¿vector RAG o GraphRAG? (selector de necesidad) ---- */
  graphNeeds: [
    { need: "Buscar un dato puntual (FAQ, política)", win: "vector",
      why: "Una búsqueda por similitud basta. Barato, sub-segundo." },
    { need: "Pregunta multi-hop (encadenar A→B→C)", win: "graph",
      why: "El grafo recorre relaciones que un chunk aislado no conecta." },
    { need: "Temas globales de todo el corpus", win: "graph",
      why: "Los resúmenes de comunidades responden lo que ningún chunk solo contiene." },
    { need: "Datos muy relacionales (fraude, malla societaria, supply chain)", win: "graph",
      why: "Las relaciones SON la respuesta; el grafo las modela explícitamente." },
    { need: "Respuesta auditable y trazable", win: "graph",
      why: "La ruta del grafo se lee como una frase; un score de coseno, no." },
    { need: "Baja latencia y bajo costo de operar", win: "vector",
      why: "Construir el grafo con un LLM es caro; el vectorial es liviano." },
    { need: "Datos que cambian a cada rato", win: "vector",
      why: "Mantener el grafo al día cuesta; re-embeber un chunk es trivial." }
  ],
  graphCompare: [
    { dim: "Pregunta ideal", vector: "Un salto, dato concreto", graph: "Multi-hop · temas globales" },
    { dim: "Costo de construir", vector: "Bajo", graph: "Alto (LLM lee todo)" },
    { dim: "Explicabilidad", vector: "Score opaco", graph: "Ruta legible · auditable" },
    { dim: "Latencia", vector: "Sub-segundo", graph: "Mayor" }
  ],

  /* ---- W3 · RAG en la nube corporativa ---- */
  clouds: [
    { id: "azure", name: "Microsoft Azure", accent: "#2E75B6",
      stages: [
        { k: "Parsear docs", v: "Azure AI Document Intelligence", note: "OCR + layout + campos (ex-Form Recognizer)" },
        { k: "Indexar + recuperar", v: "Azure AI Search", note: "Vectorial + híbrido (BM25 + vectores, RRF)" },
        { k: "Re-rank", v: "Semantic ranker", note: "Reordena con modelos de lenguaje de Microsoft" },
        { k: "Generar · agentes", v: "Azure AI Foundry", note: "Agentes con grounding (reemplaza 'On Your Data')" }
      ],
      docIntel: "Azure AI Document Intelligence",
      tip: "Si tu identidad y datos ya viven en Microsoft 365 / Entra ID, la gravedad de datos te lleva acá." },
    { id: "aws", name: "AWS", accent: "#E0531F",
      stages: [
        { k: "Parsear docs", v: "Amazon Textract", note: "OCR + tablas + formularios + 'Queries'" },
        { k: "RAG gestionado", v: "Bedrock Knowledge Bases", note: "Ingesta → chunk → embed → índice → retrieve → genera" },
        { k: "Híbrido + re-rank", v: "dentro de Bedrock KB", note: "Vector + BM25 + Cohere Rerank" },
        { k: "Grafo · datos", v: "GraphRAG (Neptune) · NL2SQL", note: "Conecta hechos dispersos / consulta el data warehouse" }
      ],
      docIntel: "Amazon Textract",
      tip: "El portafolio más amplio: RAG clásico + GraphRAG + datos estructurados en una sola familia." },
    { id: "gcp", name: "Google Cloud", accent: "#1D9E75",
      stages: [
        { k: "Parsear docs", v: "Document AI", note: "OCR + Layout Parser (Gemini) + extractores custom" },
        { k: "RAG llave en mano", v: "Vertex AI Search", note: "Ingesta → OCR → chunk → índice → ranking → resumen" },
        { k: "Híbrido + ranking", v: "Vertex Ranking API", note: "Denso + sparse + reordenamiento" },
        { k: "RAG con control", v: "Vertex AI RAG Engine", note: "Chunking / híbrido / rerank afinables" }
      ],
      docIntel: "Google Document AI",
      tip: "Dos niveles: Vertex AI Search (conveniencia) ↔ RAG Engine (control para developers)." }
  ]
};
