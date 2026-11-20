/**
 * LoginBackground.tsx
 * Fondo ambiental clínico fiel al diseño de referencia (Image 1 y code.html).
 * Atmósfera limpia (#F3F7FC) con suaves orbes bioluminiscentes difusos (rosa perinatal y lavanda clínica).
 * 100% seguro y consistente en iOS, Android y Web.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

export const LoginBackground: React.FC = () => {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
      {/* ── Lienzo Base Clínico Níveo ── */}
      <View style={styles.baseCanvas} />

      {/* ── Orbe Superior Izquierdo: Warm Rose Glow ── */}
      <View style={styles.orbTopLeft} />

      {/* ── Orbe Lateral Derecho: Soft Periwinkle / Violet Glow ── */}
      <View style={styles.orbTopRight} />

      {/* ── Orbe Inferior: Delicate Perinatal Tint ── */}
      <View style={styles.orbBottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  baseCanvas: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#F3F7FC',
  },
  orbTopLeft: {
    position: 'absolute',
    top: -60,
    left: -50,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(244, 114, 182, 0.18)',
    transform: [{ scaleX: 1.2 }],
  },
  orbTopRight: {
    position: 'absolute',
    top: 60,
    right: -70,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(165, 180, 252, 0.22)',
    transform: [{ scaleY: 1.1 }],
  },
  orbBottom: {
    position: 'absolute',
    bottom: -50,
    left: '20%',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(251, 113, 133, 0.10)',
  },
});
