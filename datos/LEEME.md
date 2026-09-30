# Datos de los ensayos

Un archivo CSV por ensayo real, con el nombre `d<orificio>mm_h<altura>cm_rep<n>.csv` (por ejemplo `d5mm_h16cm_rep1.csv`).

Formato de cada línea, tal como lo envía el Arduino:

```
t_ms;h_mm;contacto;a0
```

La web app usa las tres primeras columnas (la cuarta solo sirve para calibrar el sensor de contacto).
`h_mm` es la altura del agua medida desde la base. El borde inferior del orificio y el sensor de contacto están en h_f = 2 cm: cuando el agua llega ahí deja de salir y `contacto` pasa a 0.

`video_ejemplo_sintetico.mp4` es un video **sintético** (dice «VIDEO SINTETICO» arriba) con C_d = 0,62, para probar el modo video: la cinta parte en 0 en la base y el agua deja de salir a los 69,8 s de retirar la cinta.

`ejemplo_simulado_d5mm_h16cm.csv` es un ensayo **simulado** (su primera línea lo indica) para probar la importación y verificar el software. La web lo etiqueta como «simulado». No es una medición: no debe usarse como dato experimental.

No borrar datos anómalos: se analizan y, si se descartan, se anota el motivo aquí.
