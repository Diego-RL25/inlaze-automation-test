# Inlaze Automation Test

## Descripción General

Este proyecto simula un sistema que monitorea el rendimiento de campañas, evalúa métricas con base en umbrales definidos y prepara la información para automatización y análisis mediante inteligencia artificial.

---

## Parte 1 — Integración de API y Lógica de Negocio

### Selección de API

Para este proyecto se utilizó la API pública JSONPlaceholder (https://jsonplaceholder.typicode.com/posts) como fuente de datos simulada.

### Justificación

Dado que no se contaba con acceso a la API real de Google Ads, se eligió una API pública que:

* Proporciona respuestas JSON consistentes
* No requiere autenticación (facilita pruebas)
* Es estable y ampliamente utilizada para prototipos

### Decisión de Diseño

Aunque la API no contiene métricas reales de campañas, se abstrajo la información en un modelo personalizado `CampaignReport`.

Esto permite:

* Desacoplar la fuente de datos de la lógica de negocio
* Simular métricas como CTR/ROAS
* Facilitar el reemplazo por una API real en el futuro

---

## Lógica de Umbrales

* metric < 1.0 → critical
* metric < 2.5 → warning
* metric ≥ 2.5 → ok

---

## Manejo de Errores

* Reintentos con backoff exponencial
* Validación de la estructura de la respuesta
* Manejo seguro de errores para evitar fallos del sistema

---

## Salida

Los datos procesados se almacenan en:

```bash
data/reports.json
```

---

## Cómo Ejecutar

```bash
npm install
npx ts-node src/index.ts
```

---

## Parte 2 — Workflow en N8N

El workflow fue implementado usando una instancia self-hosted de n8n desplegada en Easypanel.

### Flujo

* Un webhook recibe los datos desde el script en TypeScript
* Campañas con estado "ok" se ignoran
* Campañas "critical" envían una alerta (HTTP → Discord)
* Campañas "warning" se procesan con un nodo Edit Fields
* Un Error Trigger captura errores de ejecución

### Decisiones de Diseño

* El webhook funciona como punto de integración entre el script y la automatización
* El flujo es modular y extensible
* El manejo de errores evita fallos silenciosos

---

## Parte 3A — Code Review y Refactorización

### Problemas Detectados

1. Falta de manejo de errores en llamadas API
2. Riesgo de división por cero en cálculo de CTR
3. Procesamiento secuencial ineficiente

### Solución

* Uso de try/catch
* Validación de datos
* Protección contra división por cero
* Concurrencia controlada (máx. 3 requests)

---

## Parte 3B — Consulta con Prisma

### Descripción

Se implementó una consulta que:

* Obtiene campañas agrupadas por operador
* Filtra métricas de los últimos 7 días
* Calcula el ROAS promedio por campaña
* Ordena campañas de menor a mayor rendimiento

### Decisión de Diseño

El cálculo del promedio se realiza en lógica de aplicación para mantener claridad y flexibilidad, evitando complejidad innecesaria en la capa de base de datos.

Se utilizó tipado seguro basado en inferencia (`typeof`) para garantizar consistencia sin depender de tipos manuales.

---

## Parte 4 — Integración con LLM

### Descripción

Se implementó una función en TypeScript que genera un resumen ejecutivo de campañas utilizando un modelo de lenguaje.

### Proveedor

Se utilizó OpenRouter debido a:

* Disponibilidad de capa gratuita
* Flexibilidad para cambiar entre modelos
* Facilidad de integración

### Prompt

El modelo recibe instrucciones para:

* Identificar campañas en estado "critical"
* Resumir campañas en "warning"
* Proponer acciones concretas

### Consideraciones

* Control de costos limitando el tamaño del input
* Manejo de errores con fallback seguro
* Respuesta tipada (sin uso de `any`)
* Prevención de fallos del sistema

---

## Parte 5 — Diseño Conceptual de Agente de IA

El sistema se compone de:

* Capa de datos (base de datos de campañas)
* Agente de IA (toma de decisiones)
* Servicio de orquestación
* Capa de acciones (APIs externas)

El agente evalúa métricas periódicamente y decide acciones combinando reglas y razonamiento con IA.

Para garantizar auditabilidad, se registran:

* Datos de entrada
* Decisión del modelo
* Acción ejecutada

Herramientas disponibles:

* `pauseCampaign(campaignId)`
* `sendAlert(message)`
* `fetchCampaignMetrics()`

Se implementa una capa de validación (guardrails) antes de ejecutar acciones críticas.

Este enfoque asegura automatización controlada, explicable y confiable.
