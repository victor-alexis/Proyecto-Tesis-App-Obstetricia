/**
 * LoginBrand.tsx
 * Encabezado de identidad gráfica para ClinicalCase exactamente como en Image 1 y code.html.
 * Botón conmutador flotante (icono de luna), destellos sutiles (✦), título estilizado "ClinicalCase"
 * y subtítulo clínico perinatal.
 */

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Moon } from 'lucide-react-native';

interface LoginBrandProps {
  onToggleTheme?: () => void;
  isDarkMode?: boolean;
}

export const LoginBrand: React.FC<LoginBrandProps> = ({ onToggleTheme, isDarkMode = false }) => {
  return (
    <View style={styles.container}>
      {/* ── Botón Conmutador Superior Derecho (Theme Toggle) ── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.themeToggleBtn}
          onPress={onToggleTheme}
          activeOpacity={0.8}
          accessibilityLabel="Cambiar tema visual"
        >
          <Moon size={16} color="#2563EB" fill="#2563EB" />
        </TouchableOpacity>
      </View>

      {/* ── Título Principal con Destellos ── */}
      <View style={styles.titleContainer}>
        {/* Destello sutil superior derecho */}
        <Text style={styles.sparkleTopRight}>✦</Text>
        {/* Destello sutil inferior izquierdo */}
        <Text style={styles.sparkleBottomLeft}>✦</Text>

        <Text style={styles.brandTitle}>ClinicalCase</Text>
      </View>

      {/* ── Subtítulo Institucional ── */}
      <Text style={styles.brandSubtitle}>
        Sistema de Soporte a la Decisión Clínica y Seguimiento Perinatal
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
    paddingHorizontal: 16,
    position: 'relative',
    width: '100%',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },
  themeToggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8E4F2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  titleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 4,
  },
  sparkleTopRight: {
    position: 'absolute',
    top: -4,
    right: -16,
    fontSize: 12,
    color: '#FBBF24',
  },
  sparkleBottomLeft: {
    position: 'absolute',
    bottom: 2,
    left: -14,
    fontSize: 10,
    color: '#FDA4AF',
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#1E40AF',
    fontFamily: 'serif',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: 12.5,
    color: '#526581',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
    fontWeight: '500',
    fontFamily: 'PlusJakartaSans-Medium',
  },
});
