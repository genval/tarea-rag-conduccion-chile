/* Datos para el widget comparativo de la sección "¿Qué es RAG y por qué?".
   Se entrega como .js (global window.RAG_ENFOQUES) para funcionar con file://
   (un fetch() de .json local lo bloquea el navegador).

   Cuatro enfoques para llevar tu conocimiento/contexto a un LLM, evaluados
   sobre criterios comparables. `score` ∈ {0,1,2} → 0 mal · 1 parcial · 2 bien
   (se mapea a un glifo en la matriz). Valores didácticos, no benchmark. */
window.RAG_ENFOQUES = {
  /* criterios (filas de la matriz) */
  criterios: [
    { id: "hechos",   label: "Conocimiento nuevo de hechos" },
    { id: "frescos",  label: "Datos frescos / actualizables" },
    { id: "privado",  label: "Datos privados de tu org" },
    { id: "costo",    label: "Costo bajo de operar" },
    { id: "manten",   label: "Mantención sencilla" },
    { id: "citable",  label: "Citable / auditable" }
  ],

  /* enfoques (columnas de la matriz) */
  enfoques: [
    {
      id: "pretrain",
      nombre: "Entrenar desde cero",
      sub: "pre-training",
      familia: "param",
      scores: { hechos: 2, frescos: 0, privado: 1, costo: 0, manten: 0, citable: 0 },
      veredicto: "Meses de cómputo, equipos especializados y millones de US$ — y reentrenar para cada actualización. Solo para grandes labs: no es tu caso.",
      cuando: "Construir un modelo base nuevo, en una organización con GPUs masivas."
    },
    {
      id: "finetune",
      nombre: "Fine-tuning",
      sub: "afinar pesos",
      familia: "param",
      scores: { hechos: 0, frescos: 0, privado: 1, costo: 1, manten: 0, citable: 0 },
      veredicto: "Enseña formato, estilo y tarea — NO hechos nuevos: no garantiza que conteste con tu info, ni la actualizas al día. El malentendido más común.",
      cuando: "Fijar un tono, un formato de salida o una tarea repetitiva muy específica."
    },
    {
      id: "incontext",
      nombre: "In-context",
      sub: "prompt stuffing",
      familia: "contexto",
      scores: { hechos: 2, frescos: 2, privado: 2, costo: 0, manten: 2, citable: 1 },
      veredicto: "Pegar todo en el prompt es simple, pero la ventana es finita, cuesta por token y sufre lost in the middle.",
      cuando: "Pocos documentos, cortos y que cambian poco. Prototipos rápidos."
    },
    {
      id: "rag",
      nombre: "RAG",
      sub: "recuperar + inyectar",
      destacado: true,
      familia: "contexto",
      scores: { hechos: 2, frescos: 2, privado: 2, costo: 2, manten: 2, citable: 2 },
      veredicto: "Recupera SOLO lo relevante y lo inyecta al responder. Conocimiento fresco y privado, sin reentrenar, con citas.",
      cuando: "Tu caso: base de conocimiento grande, que cambia, privada, y necesitas respuestas trazables."
    }
  ],

  /* familias: agrupan las columnas en los dos caminos de fondo */
  familias: {
    param:    { label: "Modificar el modelo",               sub: "paramétrico · toca los pesos" },
    contexto: { label: "Traer el conocimiento al contexto", sub: "en cada call · no toca el modelo" }
  },

  /* atajos "necesidad → mejor enfoque" para el modo guiado */
  necesidades: [
    { crit: "hechos",  texto: "Responder con hechos que el modelo no aprendió", best: "rag",     alt: "incontext" },
    { crit: "frescos", texto: "Datos que cambian cada semana",                    best: "rag",     alt: "incontext" },
    { crit: "privado", texto: "Documentos internos que no pueden filtrarse",       best: "rag",     alt: "finetune"  },
    { crit: "manten",  texto: "Actualizar el conocimiento sin reentrenar",         best: "rag",     alt: "incontext" },
    { crit: "citable", texto: "Citar la fuente de cada respuesta",                 best: "rag",     alt: null        }
  ]
};
