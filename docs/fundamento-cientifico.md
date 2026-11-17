# Fundamento científico de LabFluids

## Vaciado de un estanque (ley de Torricelli)

Un estanque abierto de diámetro D tiene un orificio de diámetro d cerca de la base. El agua sale por el orificio con una velocidad que depende de la altura del agua sobre él:

    v = Cd · √(2 · g · (h − h_f))

- h: altura del agua medida desde la base del estanque.
- h_f = 2 cm: altura del borde inferior del orificio (ahí el agua deja de salir).
- Cd ≈ 0,61: coeficiente de descarga. Corrige que el chorro se angosta al salir y que hay pérdidas por roce.

Si A es el área del estanque y a la del orificio, el tiempo que tarda en vaciarse desde h₀ hasta h_f es:

    t = (A / (Cd · a)) · √(2 · (h₀ − h_f) / g)

**Linealización.** Si se grafica √(h − h_f) contra t, los datos quedan en una línea recta. Con su pendiente se calcula Cd, que es el valor que el estudiante "descubre" en la app.

## Hipótesis que se pone a prueba

- El tiempo crece con √(h₀ − h_f), no con h₀. Por eso, con el doble de altura no se demora el doble.
- El tiempo es inversamente proporcional al área del orificio. Con un orificio de 4 mm debería tardar (5/4)² ≈ 1,56 veces lo que tarda con uno de 5 mm.

## Variables del experimento

| Tipo | Variable | Valores |
|---|---|---|
| Independientes | Altura inicial h₀ | 8, 12 y 16 cm |
| | Diámetro del orificio d | 4 y 5 mm |
| Dependiente | Tiempo de vaciado t | se mide en s |
| Controladas | Diámetro del estanque D | 8 cm |
| | Altura final h_f | 2 cm |
| | Gravedad g | 9,81 m/s² |

## Otros laboratorios

- **Tubo de Venturi (Bernoulli y continuidad):** Q = Cv · A₂ · √(2 · g · Δh / (1 − (D₂/D₁)⁴)). Si el modelo es correcto, Q contra √Δh es una recta por el origen y su pendiente da Cv.
- **Fricción en tuberías (Darcy–Weisbach):** Δp = f · (L/D) · (ρ · v² / 2). En flujo laminar f = 64/Re. Con los puntos laminares se calcula la viscosidad del fluido (Hagen–Poiseuille).
- **Agua en casa:** caudal Q = V / t, con 3 repeticiones.

## Validación (con datos simulados)

En los 30 ensayos del vaciado (2 orificios × 3 alturas × 5 repeticiones), el error máximo contra Torricelli fue 3,3 % y el Cd obtenido fue 0,616 ± 0,007 contra 0,615 escondido. Falta repetirlo con una botella real (Gate 5).
