/**
 * biometrics.ts
 * Servicio para autenticación biométrica de grado clínico (Face ID / Huella Dactilar).
 * Utiliza expo-local-authentication y expo-secure-store.
 */

import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const BIOMETRICS_KEY = 'clinicalcase_biometrics_enabled';

export class BiometricsService {
  /**
   * Verifica si el dispositivo soporta y tiene biometría configurada.
   */
  static async isAvailable(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch {
      return false;
    }
  }

  /**
   * Obtiene el nombre amigable del sensor biométrico del dispositivo (Face ID, Huella, etc).
   */
  static async getBiometryTypeName(): Promise<string> {
    if (Platform.OS === 'web') return 'Biometría';
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        return 'Face ID';
      }
      if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        return Platform.OS === 'ios' ? 'Touch ID' : 'Huella dactilar';
      }
      return 'Biometría';
    } catch {
      return 'Biometría';
    }
  }

  /**
   * Solicita al sistema operativo la autenticación biométrica del profesional.
   */
  static async authenticate(prompt = 'Confirma tu identidad para acceder'): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: prompt,
        cancelLabel: 'Cancelar',
        disableDeviceFallback: false,
      });
      return result.success;
    } catch {
      return false;
    }
  }

  /**
   * Guarda la preferencia del usuario sobre el uso de biometría.
   */
  static async setEnabled(enabled: boolean): Promise<void> {
    if (Platform.OS === 'web') return;
    try {
      await SecureStore.setItemAsync(BIOMETRICS_KEY, enabled ? 'true' : 'false');
    } catch {}
  }

  /**
   * Comprueba si el usuario tiene activado el acceso biométrico.
   */
  static async isEnabled(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    try {
      const val = await SecureStore.getItemAsync(BIOMETRICS_KEY);
      return val === 'true';
    } catch {
      return false;
    }
  }
}
