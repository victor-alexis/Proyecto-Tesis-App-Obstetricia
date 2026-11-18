/**
 * LoginFooter.tsx
 * Pie de página de ClinicalCase según Image 1 y code.html.
 * Aviso de conexión clínica cifrada con candado dorado y créditos oficiales de autoría de la tesis.
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export const LoginFooter: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* ── Aviso de Seguridad y Cifrado Clínico con Candado Dorado ── */}
      <View style={styles.securityRow}>
        <Svg width={13} height={13} viewBox="0 0 20 20">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
            fill="#FBBF24"
          />
        </Svg>
        <Text style={styles.securityText}>Conexión clínica cifrada y segura</Text>
      </View>

      {/* ── Créditos Oficiales de Autores de Tesis ── */}
      <Text style={styles.creditsText}>
        Design by Victor Gonzalez & Benjamin Torres
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 8,
    width: '100%',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  securityText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  creditsText: {
    fontSize: 10,
    color: '#8E7D9E',
    fontWeight: '500',
    letterSpacing: 0.2,
    fontFamily: 'PlusJakartaSans-Regular',
  },
});
