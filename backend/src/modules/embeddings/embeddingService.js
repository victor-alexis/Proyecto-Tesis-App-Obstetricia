import { config } from '../../config/index.js';

export class EmbeddingService {
  /**
   * Divide un texto en fragmentos (chunks) con solapamiento (overlap)
   * según las directivas de la skill backend-rag-engine (400-600 caracteres/tokens, overlap 100)
   */
  static chunkText(text, chunkSize = 500, overlap = 100) {
    if (!text || text.length <= chunkSize) {
      return [text];
    }

    const chunks = [];
    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      const chunk = text.slice(start, end).trim();
      if (chunk.length > 0) {
        chunks.push(chunk);
      }
      start += chunkSize - overlap;
    }

    return chunks;
  }

  /**
   * Genera el embedding numérico para un texto.
   * Si la API Key de Gemini o proveedor no está presente, genera un vector
   * normalizado determinista para pruebas de desarrollo local sin costo.
   */
  static async generateEmbedding(text) {
    if (!text) return [];

    // Si hay API Key de Gemini configurada, se puede conectar con Google Generative AI
    if (config.ai.geminiApiKey) {
      // Implementación real con SDK de IA cuando se configure la API Key
    }

    // Vector de respaldo local (128 dimensiones) para pruebas sin necesidad de clave externa
    return this.createMockEmbedding(text, 128);
  }

  static createMockEmbedding(text, dimensions = 128) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }

    const vector = new Array(dimensions).fill(0).map((_, idx) => {
      const val = Math.sin(hash + idx);
      return parseFloat(val.toFixed(6));
    });

    // Normalizar vector (magnitud 1)
    const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
    return vector.map((v) => parseFloat((v / magnitude).toFixed(6)));
  }

  /**
   * Calcula la similitud coseno entre dos vectores
   */
  static cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

