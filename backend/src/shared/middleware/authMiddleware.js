import { getSupabaseClient } from '../../infrastructure/storage/supabaseClient.js';

/**
 * Middleware para validar que la petición provenga de un usuario autenticado
 * con Supabase Auth (Google OAuth institucional o personal).
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado: Token de autenticación ausente o inválido.',
      });
    }

    const token = authHeader.split(' ')[1];
    const supabase = getSupabaseClient();

    if (!supabase) {
      console.warn('[AuthMiddleware] Supabase no configurado; permitiendo paso en modo desarrollo.');
      req.user = { id: 'dev-user', email: 'dev@obstetricia.local', role: 'developer' };
      return next();
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Token de sesión expirado o no válido.',
      });
    }

    // Inyectar datos del usuario autenticado en el request
    req.user = {
      id: user.id,
      email: user.email,
      provider: user.app_metadata?.provider || 'google',
      isInstitutional: user.email?.endsWith('.edu') || user.email?.endsWith('.cl'),
      metadata: user.user_metadata,
    };

    next();
  } catch (error) {
    next(error);
  }
}

