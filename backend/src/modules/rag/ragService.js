import { getSupabaseClient } from '../../infrastructure/storage/supabaseClient.js';
import { EmbeddingService } from '../embeddings/embeddingService.js';

// Base de conocimiento clínico perinatal embebida (Guías Oficiales MINSAL / ACOG)
const clinicalKnowledgeBase = [
  {
    id: 'doc-001',
    guide: 'Guía Perinatal MINSAL',
    section: 'Trastornos Hipertensivos del Embarazo (THE) - Manejo de Preeclampsia',
    year: '2022',
    content:
      'La Preeclampsia se define como el hallazgo de hipertensión arterial (PA >= 140/90 mmHg) en 2 ocasiones separadas por al menos 4 horas, después de las 20 semanas de gestación en una paciente previamente normotensa, acompañada de proteinuria (>300 mg en 24h o índice proteinuria/creatininuria >= 0.3) o signos de compromiso multisistémico (trombocitopenia, alteración hepática, insuficiencia renal, síntomas neurológicos o restricción fetal). Conducta: Hospitalización, reposo relativo, monitoreo fetal continuo y estudio de laboratorio completo.',
  },
  {
    id: 'doc-002',
    guide: 'Guía Clínica MINSAL',
    section: 'Prevención del Parto Prematuro y Rotura Prematura de Membranas (RPM)',
    year: '2023',
    content:
      'Ante sospecha de RPM, confirmar mediante examen estéril con espéculo (visualización directa de líquido amniótico saliendo por el orificio cervical externo). No realizar tacto vaginal a menos que la paciente esté en trabajo de parto franco. El manejo entre las 24 y 34 semanas incluye corticoterapia para maduración pulmonar fetal (Betametasona 12 mg IM cada 24h por 2 dosis) y antibioticoterapia profiláctica para prolongar el período de latencia.',
  },
  {
    id: 'doc-003',
    guide: 'Norma Técnica MINSAL',
    section: 'Control Prenatal y Cálculo de Edad Gestacional',
    year: '2021',
    content:
      'La Fecha de Última Menstruación (FUM) debe considerarse confiable si la paciente tiene ciclos regulares (26 a 30 días) y recuerda la fecha exacta sin uso de anticonceptivos en los últimos 3 meses. La ecografía del primer trimestre (entre 7 y 10 semanas mediante LCN) tiene un margen de error de +/- 3 a 5 días; si la diferencia entre FUM y ecografía supera los 5 días, prevalece la edad gestacional ecográfica.',
  },
  {
    id: 'doc-004',
    guide: 'Protocolos de Emergencias Obstétricas ACOG / MINSAL',
    section: 'Hemorragia Postparto (Código Rojo)',
    year: '2023',
    content:
      'La principal causa de hemorragia postparto inmediata es la atonía uterina (70%). Manejo inicial: Masaje uterino bimanual inmediato, vaciamiento vesical, administración de oxitocina 20-40 UI en infusión EV continua, y uso escalonado de agentes uterotónicos de segunda línea (Metilergonovina o Misoprostol 800 mcg rectal).',
  },
];

export class RagService {
  /**
   * Procesa una consulta clínica obstétrica utilizando recuperación vectorial (RAG)
   */
  static async queryClinicalGuideline(userQuery) {
    if (!userQuery || userQuery.trim().length === 0) {
      throw new Error('La consulta clínica no puede estar vacía.');
    }

    const queryEmbedding = await EmbeddingService.generateEmbedding(userQuery);

    // 1. Intentar recuperación en Supabase pgvector si el cliente está conectado
    let retrievedDocs = [];
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { data, error } = await supabase.rpc('match_clinical_documents', {
          query_embedding: queryEmbedding,
          match_threshold: 0.5,
          match_count: 2,
        });

        if (!error && data && data.length > 0) {
          retrievedDocs = data;
        }
      } catch (err) {
        console.warn('[RAG] Supabase RPC no disponible, utilizando base de conocimiento local integrada.');
      }
    }

    // 2. Si no hay Supabase o no arrojó resultados, buscar en la base de conocimiento local
    if (retrievedDocs.length === 0) {
      const scoredDocs = await Promise.all(
        clinicalKnowledgeBase.map(async (doc) => {
          const docEmbedding = await EmbeddingService.generateEmbedding(doc.content + ' ' + doc.section);
          const similarity = EmbeddingService.cosineSimilarity(queryEmbedding, docEmbedding);
          return { ...doc, similarity };
        })
      );

      // Ordenar por mayor similitud y tomar los 2 más relevantes
      scoredDocs.sort((a, b) => b.similarity - a.similarity);
      retrievedDocs = scoredDocs.slice(0, 2);
    }

    // 3. Síntesis de la respuesta clínica con citas formales obligatorias
    const primarySource = retrievedDocs[0];
    const secondarySource = retrievedDocs[1];

    const citations = retrievedDocs.map((doc) => ({
      guia: doc.guide,
      seccion: doc.section,
      año: doc.year,
      relevancia: typeof doc.similarity === 'number' ? `${(doc.similarity * 100).toFixed(1)}%` : 'Relevancia directa',
    }));

    return {
      query: userQuery,
      clinicalGuidance: {
        summary: `De acuerdo con la normativa clínica (${primarySource.guide} - ${primarySource.section}): ${primarySource.content}`,
        suggestedActions: [
          'Confirmar parámetros diagnósticos con exámenes de laboratorio y monitoreo fetal.',
          'Evaluar factores de riesgo materno-perinatales adicionales.',
          'Registrar hallazgos en la ficha perinatal y categorizar nivel de atención.',
        ],
      },
      citations,
      disclaimer: `Esta sugerencia clínica está basada en ${primarySource.guide} (${primarySource.section}). No reemplaza el juicio clínico presencial ni la evaluación obstétrica directa.`,
      sourcesUsed: retrievedDocs.length,
    };
  }
}

