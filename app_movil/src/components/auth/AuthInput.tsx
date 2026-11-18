/**
 * AuthInput.tsx
 * Campo de texto para autenticación según el diseño de Image 1 y code.html.
 * Fondo #F8FAFC, bordes #E2E8F0, iconos #64748B y enlace "¿Olvidaste tu contraseña?" en azul #2563EB.
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';

interface AuthInputProps extends TextInputProps {
  label: string;
  iconType: 'mail' | 'lock';
  rightLinkText?: string;
  onRightLinkPress?: () => void;
  isPassword?: boolean;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  iconType,
  rightLinkText,
  onRightLinkPress,
  isPassword = false,
  value,
  onChangeText,
  placeholder,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {/* ── Fila de Etiqueta y Enlace Secundario ── */}
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {rightLinkText && onRightLinkPress && (
          <TouchableOpacity onPress={onRightLinkPress} activeOpacity={0.7}>
            <Text style={styles.rightLink}>{rightLinkText}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Contenedor del Input con Iconos ── */}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
        ]}
      >
        {/* Icono Izquierdo */}
        {iconType === 'mail' ? (
          <Mail size={16} color={isFocused ? '#2563EB' : '#64748B'} style={styles.leftIcon} />
        ) : (
          <Lock size={16} color={isFocused ? '#2563EB' : '#64748B'} style={styles.leftIcon} />
        )}

        {/* Input Nativo */}
        <TextInput
          style={[styles.input, isPassword && styles.inputWithEye]}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          secureTextEntry={isPassword && !showPassword}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />

        {/* Botón de Visibilidad de Contraseña */}
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {showPassword ? (
              <EyeOff size={16} color="#64748B" />
            ) : (
              <Eye size={16} color="#64748B" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 13,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  rightLink: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#2563EB',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 46,
    paddingHorizontal: 12,
  },
  inputWrapperFocused: {
    borderColor: '#2563EB',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  leftIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    fontFamily: 'PlusJakartaSans-Regular',
    paddingVertical: 0,
    height: '100%',
  },
  inputWithEye: {
    paddingRight: 28,
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
