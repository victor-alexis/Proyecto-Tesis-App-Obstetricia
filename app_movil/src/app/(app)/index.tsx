// Pantalla principal (Home) de la App Móvil

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const { user, signOut, isInstitutional, session } = useAuth();

  // Si no hay sesión, asegurar redirección al Login
  React.useEffect(() => {
    if (!session) {
      router.replace('/login');
    }
  }, [session]);

  if (!session) {
    return null;
  }

  const userEmail = user?.email || 'profesional@obstetricia.cl';
  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    userEmail.split('@')[0];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cabecera del Usuario */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>Bienvenido/a,</Text>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>
            <View
              style={[
                styles.badge,
                isInstitutional ? styles.badgeInstitutional : styles.badgePersonal,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  isInstitutional
                    ? styles.badgeTextInstitutional
                    : styles.badgeTextPersonal,
                ]}
              >
                {isInstitutional ? 'Cuenta Institucional' : 'Cuenta Personal'}
              </Text>
            </View>
          </View>
        </View>

        {/* Panel de Estado de la Tesis */}
        <View style={styles.statusBox}>
          <Text style={styles.statusTitle}>Estado del Proyecto</Text>
          <Text style={styles.statusDescription}>
            Fase 2 Activa: Conexión Supabase, Autenticación y Motor RAG Perinatal.
          </Text>
        </View>

        {/* Módulos Perinatales de Partida */}
        <Text style={styles.sectionTitle}>Módulos Clínicos Disponibles</Text>

        <TouchableOpacity style={styles.moduleCard} activeOpacity={0.8}>
          <View style={[styles.moduleIcon, { backgroundColor: '#EBF8FF' }]}>
            <Text style={styles.moduleEmoji}>📋</Text>
          </View>
          <View style={styles.moduleInfo}>
            <Text style={styles.moduleName}>Ficha y Controles Perinatales</Text>
            <Text style={styles.moduleDesc}>
              Registro de parámetros clínicos, control prenatal y factores de riesgo materno.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moduleCard} activeOpacity={0.8}>
          <View style={[styles.moduleIcon, { backgroundColor: '#E6FFFA' }]}>
            <Text style={styles.moduleEmoji}>🧠</Text>
          </View>
          <View style={styles.moduleInfo}>
            <Text style={styles.moduleName}>Asistente RAG Obstétrico</Text>
            <Text style={styles.moduleDesc}>
              Consultas semánticas a Guías Clínicas Oficiales (MINSAL) con recuperación vectorial.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moduleCard} activeOpacity={0.8}>
          <View style={[styles.moduleIcon, { backgroundColor: '#FAF5FF' }]}>
            <Text style={styles.moduleEmoji}>🩺</Text>
          </View>
          <View style={styles.moduleInfo}>
            <Text style={styles.moduleName}>Simulación de Casos Clínicos</Text>
            <Text style={styles.moduleDesc}>
              Casos perinatales interactivos para validación y docencia clínica.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Botón de Cierre de Sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={signOut} activeOpacity={0.8}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollContent: {
    padding: 20,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2B6CB0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '500',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  userEmail: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
  badgeInstitutional: {
    backgroundColor: '#EBF8FF',
  },
  badgePersonal: {
    backgroundColor: '#EDF2F7',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  badgeTextInstitutional: {
    color: '#2B6CB0',
  },
  badgeTextPersonal: {
    color: '#4A5568',
  },
  statusBox: {
    backgroundColor: '#EBF8FF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BEE3F8',
    marginBottom: 20,
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2B6CB0',
    marginBottom: 2,
  },
  statusDescription: {
    fontSize: 12,
    color: '#2C5282',
    lineHeight: 17,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  moduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  moduleIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  moduleEmoji: {
    fontSize: 22,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 3,
  },
  moduleDesc: {
    fontSize: 12,
    color: '#718096',
    lineHeight: 16,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FEB2B2',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#C53030',
    fontSize: 14,
    fontWeight: '600',
  },
});
