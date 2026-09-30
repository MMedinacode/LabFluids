# LabFluids · Laboratorio virtual del vaciado de un estanque

Laboratorio virtual con sensores para estudiar el **vaciado libre de un estanque abierto** con la ley de Torricelli.
Funciona en el navegador de cualquier celular o computador. Proyecto de Innovación Tecnológica, Universidad Mayor. Equipo **Los KAMIKAZES**.
Simulador original: Matías Alvayay.

**Página publicada (versión 3.1):** https://mmedinacode.github.io/LabFluids/
Simulador original de Matías Alvayay: https://limatsio.github.io/FlujoAgua/

## Cómo se mide

Las alturas se miden desde la base del estanque. El borde inferior del orificio y el sensor de contacto están a la misma altura, h_f = 2 cm: cuando el agua llega ahí deja de salir, el sensor se seca, se enciende el LED y termina el ensayo. El modelo es t = (A / (C_d·a))·√(2·(h₀ − h_f)/g).

## Modos de medición (`index.html`, v3.1)

| Modo | Qué usa | Dónde funciona |
|---|---|---|
| **Laboratorio virtual** (recomendado) | Estanque simulado con sensor ultrasónico y sensor de contacto virtuales (ruido real, C_d oculto) | Cualquier celular o computador |
| **Video de tu botella** | Cámara del celular: se calibra con una cinta métrica y se marca el nivel cada Δt | Cualquier celular o computador |
| **Acelerómetro** (paso 1) | Mide g con el celular quieto sobre la mesa | Celulares (en iPhone pide permiso) |
| **Arduino** (opcional) | HC-SR04 por USB (Web Serial) | Computador con Chrome o Edge |
| **Importar CSV** | Datos grabados antes | Cualquiera |

Los intentos quedan etiquetados como «virtual», «video», «Arduino» o «CSV», también al exportar.

## Estructura

```
index.html            Web app LabFluids v3.1
simulador.html        Simulador clásico v1.1
arduino/labfluids/    Programa del Arduino (también para simular en Tinkercad)
docs/                 Diagramas y capturas
datos/                CSV y un video sintético de prueba (marcados como simulados)
```

## Verificación (29/09/2026)

- 30 intentos virtuales: todos terminaron con el sensor de contacto al llegar el agua al orificio; error máximo 3,3 %, CV máximo 2,4 %, C_d = 0,616 ± 0,007 (valor oculto: 0,615).
- Video sintético con C_d = 0,62 (el agua deja de salir a los 69,8 s): la app midió C_d = 0,618 y t = 70,0 s.
- Sin desplazamiento horizontal en una pantalla de 390 px.
- Pendiente: probar en celulares Android e iPhone reales.
