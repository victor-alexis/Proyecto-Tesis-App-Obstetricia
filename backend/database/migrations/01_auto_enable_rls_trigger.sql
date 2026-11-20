-- ==============================================================================
-- Migración 01: Activación Automática de Row Level Security (RLS) en Nuevas Tablas
-- Proyecto: Tesis App Obstetricia (ClinicalCase)
-- Fecha: 2026-11-20
-- ==============================================================================
-- Propósito: Garantizar que cualquier tabla clínica creada en el esquema 'public'
-- nazca con RLS activado por defecto (cumplimiento Ley 20.584 de confidencialidad).
-- ==============================================================================

-- 1. Función que ejecuta el ALTER TABLE para habilitar RLS al detectar un CREATE TABLE
CREATE OR REPLACE FUNCTION public.auto_enable_rls_for_future_tables()
RETURNS event_trigger AS $$
DECLARE
    tbl record;
BEGIN
    FOR tbl IN SELECT * FROM pg_event_trigger_ddl_commands() WHERE command_tag = 'CREATE TABLE'
    LOOP
        -- Se aplica exclusivamente a tablas creadas en el schema 'public'
        IF tbl.schema_name = 'public' THEN
            EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY;', tbl.schema_name, tbl.relname);
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 2. Disparador de eventos en PostgreSQL que se activa al finalizar cualquier CREATE TABLE
DROP EVENT TRIGGER IF EXISTS trigger_auto_rls_on_create;

CREATE EVENT TRIGGER trigger_auto_rls_on_create
ON ddl_command_end
WHEN TAG IN ('CREATE TABLE')
EXECUTE FUNCTION public.auto_enable_rls_for_future_tables();

-- ==============================================================================
-- Fin de Migración 01
-- ==============================================================================
