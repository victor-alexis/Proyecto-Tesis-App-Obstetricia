import { ClinicalCaseService } from './clinicalCaseService.js';

export class ClinicalCaseController {
  static async getAll(req, res, next) {
    try {
      const cases = await ClinicalCaseService.getAll();
      res.json({
        success: true,
        count: cases.length,
        data: cases,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const clinicalCase = await ClinicalCaseService.getById(id);
      if (!clinicalCase) {
        return res.status(404).json({
          success: false,
          message: `Caso clínico con ID '${id}' no encontrado.`,
        });
      }
      res.json({
        success: true,
        data: clinicalCase,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { patientCode, chiefComplaint, vitalSigns, gestationalAge } = req.body;
      if (!patientCode || !chiefComplaint) {
        return res.status(400).json({
          success: false,
          message: 'Los campos patientCode y chiefComplaint son requeridos.',
        });
      }
      const newCase = await ClinicalCaseService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Caso clínico registrado correctamente.',
        data: newCase,
      });
    } catch (error) {
      next(error);
    }
  }
}

