/**
 * authErrors.ts
 * Diccionario de mapeo de errores de Supabase Auth a mensajes en español clínico y amigable.
 * Validador RFC 5322 para correos institucionales y personales.
 */

export function mapSupabaseAuthError(errorMessage?: string | null): string {
  if (!errorMessage) {
    return 'Ha ocurrido un error inesperado. Por favor intenta nuevamente.';
  }

  const msg = errorMessage.toLowerCase();

  if (msg.includes('invalid login credentials') || msg.includes('invalid_credentials')) {
    return 'Correo o contraseña incorrectos. Por favor verifica tus credenciales.';
  }

  if (msg.includes('email not confirmed')) {
    return 'Tu correo no ha sido verificado aún. Por favor ingresa el código enviado a tu bandeja de entrada.';
  }

  if (msg.includes('user already registered') || msg.includes('email already in use')) {
    return 'Ya existe una cuenta registrada con este correo electrónico.';
  }

  if (
    msg.includes('token has expired') ||
    msg.includes('token is invalid') ||
    msg.includes('otp_expired') ||
    msg.includes('invalid token')
  ) {
    return 'El código de 6 dígitos es incorrecto o ha caducado. Solicita un nuevo código.';
  }

  if (
    msg.includes('over_email_send_rate_limit') ||
    msg.includes('for security purposes, you can only request this after') ||
    msg.includes('rate limit')
  ) {
    return 'Demasiadas solicitudes en poco tiempo. Por seguridad, espera 60 segundos antes de reenviar.';
  }

  if (msg.includes('password should be at least 6 characters')) {
    return 'La contraseña debe tener un mínimo de 6 caracteres.';
  }

  if (msg.includes('unable to validate email') || msg.includes('invalid format')) {
    return 'El formato del correo electrónico no es válido.';
  }

  if (msg.includes('network request failed')) {
    return 'Error de conexión. Verifica tu acceso a internet.';
  }

  return errorMessage;
}

/**
 * Validador de formato de correo electrónico
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}
