---
name: backend-rag-engine
description: >-
  Estándares de implementación para el motor RAG (Retrieval-Augmented Generation),
  procesamiento de embeddings, conexión con Supabase pgvector y consultas clínicas obstétricas.
  Activar cuando se trabaje en los módulos de backend/src/modules/rag o embeddings.
---

# Skill: Motor RAG Perinatal (`backend-rag-engine`)

Esta skill guía el desarrollo del motor de recuperación clínica y vectorización en el backend de la tesis.

## Referencias de Arquitectura
* Especificaciones de ingesta y retrieval: [references/arquitectura-rag.md](./references/arquitectura-rag.md)

---

## Directivas de Implementación
1. **Separación Modular:**
   * Ingesta y generación vectorial van en `backend/src/modules/embeddings/`.
   * Búsqueda por similitud y orquestación con LLM van en `backend/src/modules/rag/`.
   * El cliente de persistencia reside en `backend/src/infrastructure/storage/`.

2. **Citas Obligatorias:**
   * Toda respuesta clínica generada por el RAG debe incluir la fuente documental (nombre de guía y página/sección).

