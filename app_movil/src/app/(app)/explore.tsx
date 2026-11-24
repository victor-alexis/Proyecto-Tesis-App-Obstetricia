// Pantalla de Exploración (RAG - Retrieval-Augmented Generation) para consultas clínicas

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IOS_EMPTY_ACCESSORY_ID } from '@/components/ui';

export default function ClinicalQueryScreen() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);

    // Simulación de respuesta RAG mientras se conecta con el backend desplegado
    setTimeout(() => {
      setResponse({
        guia: 'Guía Perinatal MINSAL',
        seccion: 'Control Prenatal y Trastornos Hipertensivos',
        respuesta:
          'En pacientes con sospecha de hipertensión gestacional o preeclampsia (PA >= 140/90 mmHg), se recomienda confirmación en reposo, proteinuria en orina de 24 horas o índice proteinuria/creatininuria y evaluación de signos premonitorios (cefalea, escotomas, epigastralgia).',
        cita: 'MINSAL 2022, Sección 4.2 - Manejo de la Hipertensión en el Embarazo.',
      });
      setLoading(false);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.badge}>MÓDULO RAG</Text>
          <Text style={styles.title}>Consultas Clínicas</Text>
          <Text style={styles.subtitle}>
            Búsqueda asistida en normativas y guías perinatales oficiales.
          </Text>
        </View>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            placeholder="Ej: Criterios de hospitalización en preeclampsia..."
            placeholderTextColor="#A0AEC0"
            value={query}
            onChangeText={setQuery}
            inputAccessoryViewID={IOS_EMPTY_ACCESSORY_ID}
            autoComplete="off"
            textContentType="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.searchButtonText}>Consultar Guía</Text>
            )}
          </TouchableOpacity>
        </View>

        {response && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultGuide}>{response.guia}</Text>
              <Text style={styles.resultSection}>{response.seccion}</Text>
            </View>
            <Text style={styles.resultText}>{response.respuesta}</Text>
            <View style={styles.citationBox}>
              <Text style={styles.citationText}>📖 {response.cita}</Text>
            </View>
          </View>
        )}

        <View style={styles.infoFooter}>
          <Text style={styles.infoFooterText}>
            Nota: Este sistema busca directamente en literatura médica y guías de práctica clínica validadas para apoyar al profesional de obstetricia.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2B6CB0',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A202C',
  },
  subtitle: {
    fontSize: 13,
    color: '#718096',
    marginTop: 4,
  },
  searchBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    marginBottom: 20,
  },
  input: {
    fontSize: 14,
    color: '#2D3748',
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 12,
  },
  searchButton: {
    backgroundColor: '#2B6CB0',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#BEE3F8',
    marginBottom: 16,
  },
  resultHeader: {
    marginBottom: 10,
  },
  resultGuide: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2B6CB0',
  },
  resultSection: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  resultText: {
    fontSize: 14,
    color: '#2D3748',
    lineHeight: 21,
  },
  citationBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
  },
  citationText: {
    fontSize: 11,
    color: '#4A5568',
    fontStyle: 'italic',
  },
  infoFooter: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#EDF2F7',
    borderRadius: 10,
  },
  infoFooterText: {
    fontSize: 11,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 16,
  },
});
