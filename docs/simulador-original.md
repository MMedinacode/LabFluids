# Simulador original del vaciado

El laboratorio de vaciado de LabFluids parte del simulador **«Laboratorio Virtual · Vaciado de un Estanque (Ley de Torricelli)»**, la primera versión del proyecto.

## Qué hacía el simulador original

- Simulaba el vaciado de un estanque con la ley de Torricelli.
- Permitía cambiar la altura inicial y el diámetro del orificio.
- Mostraba cómo baja la altura del agua en el tiempo y entregaba el tiempo de vaciado.

## Cómo evolucionó dentro de LabFluids

| Versión | Fecha | Cambio |
|---|---|---|
| Simulador original | antes de la v3 | Primera simulación del vaciado (Torricelli). |
| v3.1 | 29-09-2026 | Laboratorio virtual con sensores virtuales (ultrasónico con ruido, sensor de contacto), cronómetro, gráficos y CSV. |
| v4.0 | 28-10-2026 | El vaciado pasa a ser uno de cuatro laboratorios, con portada por perfiles. |

## Motor de datos

- El sensor ultrasónico virtual entrega la altura cada 0,1 s, con ruido simulado (σ = 1,2 mm).
- El motor aplica la mediana de 5 lecturas para descartar ecos falsos.
- Al terminar cada intento, ajusta la recta √(h − h_f) contra t y calcula Cd.
- Los datos se pueden descargar en CSV (columnas t y h), marcados como **simulados**.
