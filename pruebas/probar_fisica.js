// Pruebas de las fórmulas de LabFluids. Uso: node pruebas/probar_fisica.js
const F = require('../assets/fisica.js');
let fallas = 0;
function ok(nombre, cond, detalle = '') { console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (detalle ? '  → ' + detalle : '')); if (!cond) fallas++; }
const cerca = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);

// 1. Vaciado: mismos tiempos de la guía v1.0 (D 8 cm, hf 2 cm, Cd 0,61)
const t = (d, h) => F.tiempoVaciado({ D: 0.08, d: d / 1000, h0: h / 100, hf: 0.02, Cd: 0.61 });
ok('vaciado 4 mm, 16 cm ≈ 110,8 s', cerca(t(4, 16), 110.8, 0.002), t(4, 16).toFixed(2));
ok('vaciado 5 mm, 8 cm ≈ 46,4 s', cerca(t(5, 8), 46.4, 0.002), t(5, 8).toFixed(2));
ok('razón 4 mm / 5 mm = 1,5625', cerca(t(4, 12) / t(5, 12), 1.5625, 1e-9));

// 2. Venturi: ida y vuelta Q → Δh → Q, y valor razonable
const V = { D1: 0.026, D2: 0.013, Cv: 0.98 };
const Q = 10 / 60000;                                   // 10 L/min
const dh = F.venturiDeltaH({ Q, ...V });
ok('Venturi Δh(10 L/min, garganta 13 mm) entre 5 y 10 cm', dh > 0.05 && dh < 0.10, (dh * 100).toFixed(2) + ' cm');
ok('Venturi Q recuperado desde Δh', cerca(F.venturiCaudal({ dh, ...V }), Q, 1e-9));
ok('Venturi: Δh crece con Q² (doble caudal → 4 veces Δh)', cerca(F.venturiDeltaH({ Q: 2 * Q, ...V }) / dh, 4, 1e-9));

// 3. Fricción
const agua = F.FLUIDOS.agua, glic = F.FLUIDOS.glicerina;
const lam = F.perdidaCarga({ Q: 1 / 60000, D: 0.01, L: 1, rho: glic.rho, mu: glic.mu, eps: 1.5e-6 });
ok('glicerina a 1 L/min en 10 mm es laminar', lam.regimen === 'laminar', 'Re = ' + lam.Re.toFixed(2));
// Hagen–Poiseuille: Δp = 32 μ L v / D²
ok('laminar: Δp = 32μLv/D²', cerca(lam.dp, 32 * glic.mu * 1 * lam.v / 0.0001, 1e-9));
ok('se recupera la viscosidad con Poiseuille', cerca(F.viscosidadPoiseuille({ dp: lam.dp, D: 0.01, L: 1, v: lam.v }), glic.mu, 1e-9));
const tur = F.perdidaCarga({ Q: 5 / 60000, D: 0.01, L: 1, rho: agua.rho, mu: agua.mu, eps: 1.5e-6 });
ok('agua a 5 L/min en 10 mm es turbulenta', tur.regimen === 'turbulento', 'Re = ' + Math.round(tur.Re));
ok('Blasius y Haaland (liso) difieren < 6 % en 5 000–80 000', [5e3, 1e4, 3e4, 8e4].every(Re => cerca(F.fBlasius(Re), F.fHaaland(Re, 1.5e-6 / 0.01), 0.06)),
  [5e3, 1e4, 3e4, 8e4].map(Re => (100 * (F.fBlasius(Re) / F.fHaaland(Re, 1.5e-4) - 1)).toFixed(1) + '%').join(' '));
ok('f experimental desde Δp devuelve f', cerca(F.fExperimental({ dp: tur.dp, D: 0.01, L: 1, rho: agua.rho, v: tur.v }), tur.f, 1e-9));
ok('transición continua en Re = 2300 y 4000', cerca(F.fDarcy(2300.0001, 1e-4), 64 / 2300, 1e-3) && cerca(F.fDarcy(3999.999, 1e-4), F.fHaaland(4000, 1e-4), 1e-3));
ok('tubo rugoso pierde más que uno liso', F.fDarcy(5e4, 0.015) > F.fDarcy(5e4, 1.5e-4));

// 4. Agua en casa
ok('1 L en 6 s = 10 L/min', cerca(F.caudalLmin(1, 6), 10, 1e-12));
ok('60 gotas/min durante un día ≈ 4,3 L', cerca(F.litrosPorGoteo(60, 1440), 4.32, 1e-9));

// estadística
const r = F.recta([1, 2, 3, 4], [3, 5, 7, 9]);
ok('recta exacta m=2 b=1', cerca(r.m, 2, 1e-12) && cerca(r.b, 1, 1e-12) && cerca(r.r2, 1, 1e-12));

console.log(fallas ? `\n${fallas} prueba(s) fallaron` : '\nTodas las pruebas pasaron');
process.exit(fallas ? 1 : 0);
