import { getSupabaseClient } from '../../infrastructure/storage/supabaseClient.js';

// Memoria local de respaldo para desarrollo inicial o si Supabase aún no tiene la tabla
const mockCases = [
  {
    id: 'caso-001',
    patientCode: 'PAC-4821',
    age: 26,
    gestationalAge: '32 semanas y 4 días',
    gestationalWeeks: 32.5,
    gravidity: 2,
    parity: 1,
    chiefComplaint: 'Cefalea intensa y fosfenos de 4 horas de evolución',
    vitalSigns: {
      bloodPressure: '145/95 mmHg',
      heartRate: 82,
      fetalHeartRate: 144,
      temperature: 36.6,
    },
    riskCategory: 'Alto Riesgo',
    diagnoses: ['Sospecha de Preeclampsia con criterios de severidad'],
    suggestedConduct: 'Hospitalización inmediata, perfil de preeclampsia, monitoreo materno-fetal',
    status: 'en_evaluacion',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'caso-002',
    patientCode: 'PAC-3109',
    age: 22,
    gestationalAge: '18 semanas y 1 día',
    gestationalWeeks: 18.1,
    gravidity: 1,
    parity: 0,
    chiefComplaint: 'Control prenatal rutinario de segundo trimestre',
    vitalSigns: {
      bloodPressure: '110/70 mmHg',
      heartRate: 74,
      fetalHeartRate: 150,
      temperature: 36.4,
    },
    riskCategory: 'Bajo Riesgo',
    diagnoses: ['Embarazo fisiológico de curso normal'],
    suggestedConduct: 'Continuar controles según norma técnica, ecografía morfológica entre 20-24 sem',
    status: 'activo',
    createdAt: new Date().toISOString(),
  },
];

export class ClinicalCaseService {
  static async getAll() {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from('clinical_cases').select('*');
      if (!error && data && data.length > 0) {
        return data;
      }
    }
    // Retorna mock local si Supabase no está conectado o la tabla no existe aún
    return mockCases;
  }

  static async getById(id) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from('clinical_cases').select('*').eq('id', id).single();
      if (!error && data) {
        return data;
      }
    }
    return mockCases.find((c) => c.id === id) || null;
  }

  static async create(caseData) {
    const newCase = {
      id: `caso-${Date.now()}`,
      ...caseData,
      createdAt: new Date().toISOString(),
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from('clinical_cases').insert(newCase).select().single();
      if (!error && data) {
        return data;
      }
    }

    mockCases.unshift(newCase);
    return newCase;
  }
}

