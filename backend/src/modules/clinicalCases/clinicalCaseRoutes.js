import { Router } from 'express';
import { ClinicalCaseController } from './clinicalCaseController.js';

const router = Router();

router.get('/', ClinicalCaseController.getAll);
router.get('/:id', ClinicalCaseController.getById);
router.post('/', ClinicalCaseController.create);

export const clinicalCaseRoutes = router;

