import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { getSupabaseClient } from './infrastructure/storage/supabaseClient.js';
import { errorHandler } from './shared/middleware/errorHandler.js';
import { requireAuth } from './shared/middleware/authMiddleware.js';
import { clinicalCaseRoutes } from './modules/clinicalCases/clinicalCaseRoutes.js';
import { ragRoutes } from './modules/rag/ragRoutes.js';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Verificación de estado del servidor (Health Check)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Backend Obstetricia & RAG',
    version: '1.0.0',
  });
});

// Rutas modulares
app.use('/api/cases', requireAuth, clinicalCaseRoutes);
app.use('/api/rag', ragRoutes);

// Inicialización de conexión a base de datos (advertencia preventiva si falta .env)
getSupabaseClient();

// Manejo global de errores
app.use(errorHandler);

// Inicio del servidor
const server = app.listen(config.port, () => {
  console.log(`🚀 Servidor de Obstetricia escuchando en http://localhost:${config.port}`);
  console.log(`🩺 Health check disponible en http://localhost:${config.port}/api/health`);
  console.log(`📋 Módulo Casos Clínicos: http://localhost:${config.port}/api/cases`);
  console.log(`🧠 Módulo RAG Obstétrico: http://localhost:${config.port}/api/rag/query`);
});

export { app, server };
export default app;

