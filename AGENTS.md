# AGENTS.md

Guía operativa canónica para agentes que trabajen en este repositorio.

## 1. Objetivo y prioridad

Prioridades de trabajo, en este orden:

1. Seguridad
2. Exactitud funcional
3. Alcance mínimo necesario
4. Velocidad de ejecución

Regla general: cualquier cambio debe resolver el objetivo solicitado con la menor superficie de riesgo posible.

## 2. Mapa rápido del repo

Áreas principales para ubicar cambios:

- UI pública (bilingüe): `app/[lang]/*`, `components/*`, `app/globals.css`
- Admin/CMS: `app/admin/*`, `data/content-overrides.json`
- APIs: `app/api/*`
- Autenticación y seguridad: `lib/auth.ts`, `lib/request-guard.ts`, `lib/secret-config.ts`, `lib/login-throttle.ts`, `lib/rate-limit.ts`
- Contenido MDX: `content/*`
- Utilidades y dominio: `lib/*`
- Pruebas: `lib/*.test.ts` y cualquier test asociado al módulo tocado

## 3. Reglas de ejecución

- No hacer cambios fuera del alcance solicitado.
- No usar comandos destructivos de git ni reescribir historial sin instrucción explícita.
- No exponer secretos en logs, diffs, issues o PRs.
- No eliminar ni debilitar controles de seguridad para “hacer que funcione”.
- Mantener cambios pequeños, revisables y con justificación clara.

## 4. Workflow obligatorio

1. Entender el contexto mínimo:
   - Objetivo funcional.
   - Archivos afectados.
   - Riesgos (seguridad, regresión, compatibilidad).
2. Implementar en pasos pequeños y verificables.
3. Validar cambios antes de entregar.
4. Reportar resultado con evidencia de checks y riesgos residuales.

## 5. Validación estricta por defecto

Ejecutar por defecto:

```bash
npm run typecheck
npm run lint
npm run test:run
```

Excepción permitida: si el cambio es acotado y existe una suite focal equivalente, se puede ejecutar validación focal en lugar de la suite completa, pero debe documentarse explícitamente en la entrega.

## 6. Guardrails de seguridad

Rutas sensibles:

- `app/api/*`
- `app/admin/*`
- `lib/auth.ts`
- `lib/request-guard.ts`
- `lib/secret-config.ts`
- `lib/login-throttle.ts`
- `lib/rate-limit.ts`
- `lib/sanitize.ts`

Reglas específicas:

- No relajar autenticación, autorización, sanitización o rate-limiting sin justificación explícita.
- Cualquier cambio en rutas sensibles debe incluir evaluación de abuso/regresión.
- Nunca registrar tokens, secretos o datos sensibles en claro.

## 7. Definición de done

Una entrega de agente está “done” cuando incluye:

1. Resumen breve de qué se cambió y por qué.
2. Lista exacta de archivos tocados.
3. Evidencia de validación ejecutada (comandos y estado).
4. Riesgos o limitaciones pendientes (si existen).
5. Siguientes pasos opcionales, solo si aportan valor real.

## Documentación relacionada

- Arquitectura operativa: `docs/agents/architecture-map.md`
- Runbooks de ejecución: `docs/agents/playbook.md`
- Checklists operativas: `docs/agents/checklists.md`
- Plantilla de tareas: `docs/agents/task-template.md`
