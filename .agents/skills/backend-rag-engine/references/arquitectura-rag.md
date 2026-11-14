# Arquitectura del Pipeline RAG Perinatal

Este documento describe el flujo de Ingesta, Vectorización y Recuperación Aumentada para la asistencia en consultas de obstetricia.

---

## 1. Fuentes de Datos Clínicos
* Guías Clínicas de Atención Perinatal (MINSAL / ACOG).
* Protocolos de Emergencias Obstétricas (Hemorragia postparto, Código rojo, Preeclampsia severa).
* Casos clínicos de simulación para estudiantes de obstetricia.

---

## 2. Pipeline de Procesamiento (Chunking & Embeddings)
1. **Extracción y Limpieza:** Extracción de texto de documentos PDF/Markdown omitiendo bibliografías repetitivas.
2. **Chunking Estratégico:** Fragmentos de 400 a 600 tokens con overlap de 100 tokens. Cada chunk debe conservar metadata: `titulo_guia`, `seccion`, `tema_clinico`, `version`.
3. **Generación de Embeddings:** Uso de modelo estándar compatible con Supabase `pgvector` (vector de 1536 o 768 dimensiones).

---

## 3. Recuperación y Síntesis Asistida
1. La consulta del profesional/estudiante se vectoriza.
2. Búsqueda por similitud coseno en la base de datos `supabase` (`match_documents` RPC).
3. **Prompt de Síntesis:** El agente genera la respuesta citando expresamente la guía y sección recuperada, indicando explícitamente:
   > *"Esta sugerencia clínica está basada en [Nombre de Guía, Sección]. No reemplaza el juicio clínico presencial."*

