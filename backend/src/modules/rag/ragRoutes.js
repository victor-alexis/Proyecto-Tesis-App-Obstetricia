import { Router } from 'express';
import { RagController } from './ragController.js';

const router = Router();

// Endpoint de consulta clínica RAG
router.post('/query', RagController.query);

export const ragRoutes = router;

