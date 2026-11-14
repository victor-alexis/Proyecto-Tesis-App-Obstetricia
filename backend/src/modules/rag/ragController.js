import { RagService } from './ragService.js';

export class RagController {
  static async query(req, res, next) {
    try {
      const { query } = req.body;

      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'El campo "query" es requerido para consultar las guías clínicas.',
        });
      }

      const result = await RagService.queryClinicalGuideline(query.trim());

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

