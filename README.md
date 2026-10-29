# LabFluids · Laboratorios virtuales de fluidos

Cuatro laboratorios virtuales de mecánica de fluidos que funcionan en el navegador de cualquier celular o computador, sin instalar nada.
Proyecto de Innovación Tecnológica, Universidad Mayor. Equipo **Los KAMIKAZES**. Simulador original del vaciado: Matías Alvayay.

**Página publicada (versión 4.0):** https://mmedinacode.github.io/LabFluids/

La portada pregunta para qué se va a usar (colegio, U o instituto, o casa), recomienda un laboratorio y deja ver los demás.

## Los cuatro laboratorios

| Laboratorio | Archivo | Público principal | Qué se descubre | Guía |
|---|---|---|---|---|
| Vaciado de un estanque | `vaciado.html` | 3° y 4° medio | Coeficiente de descarga C_d (ley de Torricelli) | [guia-vaciado.pdf](docs/guia-vaciado.pdf) |
| Tubo de Venturi | `venturi.html` | 1° año de educación superior | Coeficiente de velocidad C_v (Bernoulli y continuidad) | [guia-venturi.pdf](docs/guia-venturi.pdf) |
| Fricción en tuberías | `friccion.html` | 1° año de educación superior | Régimen de flujo (Reynolds), factor de fricción y viscosidad de un fluido misterioso | [guia-friccion.pdf](docs/guia-friccion.pdf) |
| Agua en casa | `agua.html` | Público general | Caudal de una llave, litros y pesos al mes, ahorro y goteras | [guia-agua.pdf](docs/guia-agua.pdf) |

Cada laboratorio tiene tres pasos (configurar o medir, medir o uso, resultados), explica su fundamento con las ecuaciones y guarda un valor escondido que el estudiante descubre con sus datos. Los datos de los laboratorios virtuales son **simulados** y así se indica en los CSV que se descargan.

### Vaciado de un estanque (v3.1 del simulador, con el diseño nuevo)

Las alturas se miden desde la base. El orificio y el sensor de contacto están a h_f = 2 cm; cuando el agua llega ahí deja de salir y termina el ensayo. Modelo: t = (A / (C_d·a))·√(2·(h₀ − h_f)/g). Modos: laboratorio virtual, video de una botella real, acelerómetro del celular para medir g, Arduino HC-SR04 por USB e importación de CSV.

### Tubo de Venturi

Entrada D₁ = 26 mm y garganta de 10, 13 o 16 mm. Tres piezómetros (regla de 1 mm) y un caudalímetro (±1 %). Modelo: Q = C_v·A₂·√(2gΔh / (1 − (D₂/D₁)⁴)), con C_v escondido entre 0,955 y 0,99.

### Fricción en tuberías

Agua, agua caliente, leche, aceite de oliva, glicerina y un fluido misterioso; tubos de 8 a 20 mm, de 1 a 5 m, lisos o rugosos. Darcy–Weisbach con f = 64/Re (laminar), Blasius o Haaland (turbulento) y una transición suave entre Re 2300 y 4000. La tinta muestra el experimento de Reynolds. Propiedades de los fluidos: valores aproximados a 20 °C (Çengel y Cimbala; CRC Handbook).

### Agua en casa

Se mide el caudal con un envase y un cronómetro (3 repeticiones). El costo se calcula con la boleta de cada persona (total ÷ m³, o el precio variable por m³), porque las tarifas cambian según la empresa sanitaria, la zona y la época del año: la app no trae precios fijos.

## Estructura

```
index.html            Portada con perfiles y recomendación
vaciado.html          Vaciado de un estanque (Torricelli)
venturi.html          Tubo de Venturi
friccion.html         Fricción en tuberías
agua.html             Agua en casa
simulador.html        Simulador clásico v1.1
assets/labfluids.css  Estilos compartidos (paleta y componentes)
assets/fisica.js      Fórmulas de los cuatro laboratorios (se puede probar con Node)
assets/comun.js       Utilidades compartidas: pasos, formato de números, CSV, gráficos
pruebas/              Pruebas de las fórmulas: node pruebas/probar_fisica.js
arduino/labfluids/    Programa del Arduino (también para simular en Tinkercad)
docs/                 Guías en PDF, diagramas y capturas
datos/                CSV y un video sintético de prueba (marcados como simulados)
```

## Verificación

- `node pruebas/probar_fisica.js`: 17 pruebas de las fórmulas (Torricelli, Venturi, Darcy–Weisbach, Hagen–Poiseuille, caudal y goteo), todas pasan.
- Vaciado (29/09/2026): 30 intentos virtuales con error máximo 3,3 % y C_d = 0,616 ± 0,007 (oculto: 0,615). Video sintético: C_d = 0,618 (real 0,62).
- Venturi (28/10/2026, datos simulados): 6 caudales de 3 a 13 L/min → C_v = 0,979 (escondido 0,978), R² = 0,9997.
- Fricción (28/10/2026, datos simulados): agua con error medio de f de 0,5 % y viscosidad calculada de 1,00 mPa·s; fluido misterioso con 0,6 % de diferencia.
- Agua en casa (28/10/2026): ejemplo de 1,5 L en 9 s → 10 L/min; cálculos de litros, pesos y goteo revisados a mano.
- Sin desplazamiento horizontal en una pantalla de 375 px; sin errores en la consola.
