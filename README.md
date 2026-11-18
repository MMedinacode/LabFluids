# Hardware de LabFluids (Arduino)

El hardware es **opcional**: la app funciona sola con sensores virtuales. El Arduino sirve para medir el vaciado real de una botella y mandar los datos a la app por cable USB (Web Serial, en Chrome o Edge).

> Estado: el programa `labfluids/labfluids.ino` es la versión 0.2 y **todavía no se prueba en el montaje físico**.

## Materiales

- Arduino Uno y cable USB.
- Sensor ultrasónico HC-SR04: mide la altura del agua desde arriba.
- Sensor de contacto sumergible: detecta cuando el agua deja de salir.
- LED con resistencia de 220 Ω: se enciende cuando termina el ensayo.
- Botella o estanque con un orificio de 4 o 5 mm cerca de la base.

## Conexiones

| Componente | Pin del Arduino |
|---|---|
| HC-SR04 · TRIG | 9 |
| HC-SR04 · ECHO | 8 |
| HC-SR04 · VCC / GND | 5V / GND |
| Sensor de contacto | A0 |
| LED (con resistencia de 220 Ω) | 7 |

El diagrama completo está en [docs/cableado.png](../docs/cableado.png).

## Qué envía el Arduino

Diez veces por segundo (10 Hz) manda una línea por el puerto serie a 115200 baudios:

    t_ms;h_mm;contacto;a0

- `t_ms`: milisegundos desde que se encendió la placa.
- `h_mm`: altura del agua desde la base, en mm (−1 si no llegó el eco).
- `contacto`: 1 si el sensor está mojado, 0 cuando queda seco.
- `a0`: lectura analógica del sensor de contacto (sirve para calibrar).

## Calibración antes de medir

1. Medir con una regla la distancia del sensor a la base del estanque y escribirla en `L0_MM` (por defecto 220 mm).
2. Leer `a0` con el sensor seco y con el sensor mojado, y poner el punto medio en `UMBRAL_CONTACTO` (por defecto 300).
3. Ajustar `TEMP_C` a la temperatura de la sala (corrige la velocidad del sonido).
