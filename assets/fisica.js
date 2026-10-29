/* LabFluids · fórmulas de los laboratorios (unidades SI: m, s, kg, Pa).
   Archivo separado para poder probarlo con Node (pruebas/probar_fisica.js). */
(function (raiz) {
  const G = 9.81;
  const area = d => Math.PI * d * d / 4;

  /* ---------- 1. Vaciado (Torricelli) ---------- */
  // Tiempo hasta que el agua llega al orificio (altura hf)
  function tiempoVaciado({ D, d, h0, hf, Cd, g = G }) {
    return (area(D) / (Cd * area(d))) * Math.sqrt(2 * Math.max(h0 - hf, 0) / g);
  }

  /* ---------- 2. Venturi (Bernoulli + continuidad) ---------- */
  // Diferencia de altura entre el tubo de entrada y el de la garganta, para un caudal Q real
  function venturiDeltaH({ Q, D1, D2, Cv = 1, g = G }) {
    const v2 = Q / area(D2), b4 = Math.pow(D2 / D1, 4);
    return v2 * v2 * (1 - b4) / (2 * g * Cv * Cv);
  }
  // Caudal a partir de la diferencia de alturas medida
  function venturiCaudal({ dh, D1, D2, Cv = 1, g = G }) {
    const b4 = Math.pow(D2 / D1, 4);
    return Cv * area(D2) * Math.sqrt(2 * g * Math.max(dh, 0) / (1 - b4));
  }

  /* ---------- 3. Fricción en tuberías (Darcy–Weisbach) ---------- */
  const reynolds = ({ rho, v, D, mu }) => rho * v * D / mu;
  const fLaminar = Re => 64 / Re;
  const fBlasius = Re => 0.316 / Math.pow(Re, 0.25);            // tubo liso, 4000 < Re < 100 000
  const fHaaland = (Re, eD) => Math.pow(-1.8 * Math.log10(Math.pow(eD / 3.7, 1.11) + 6.9 / Re), -2);
  function regimen(Re) { return Re < 2300 ? 'laminar' : Re < 4000 ? 'transición' : 'turbulento'; }
  // factor de fricción "real" del simulador: laminar, Haaland, y una mezcla suave en la transición
  function fDarcy(Re, eD) {
    if (Re < 2300) return fLaminar(Re);
    if (Re > 4000) return fHaaland(Re, eD);
    const x = (Re - 2300) / 1700, s = x * x * (3 - 2 * x);
    return fLaminar(2300) * (1 - s) + fHaaland(4000, eD) * s;
  }
  // f que se espera según la teoría del curso (laminar 64/Re; turbulento Blasius si es liso, si no Haaland)
  function fTeorico(Re, eD) {
    if (Re < 2300) return fLaminar(Re);
    if (Re < 4000) return NaN;
    return eD < 1e-5 && Re < 1e5 ? fBlasius(Re) : fHaaland(Re, eD);
  }
  function perdidaCarga({ Q, D, L, rho, mu, eps = 0, g = G, f = null }) {
    const v = Q / area(D), Re = reynolds({ rho, v, D, mu });
    const ff = f == null ? fDarcy(Re, eps / D) : f;
    const hL = ff * (L / D) * v * v / (2 * g);
    return { v, Re, f: ff, hL, dp: rho * g * hL, regimen: regimen(Re) };
  }
  // f experimental a partir de la caída de presión medida
  const fExperimental = ({ dp, D, L, rho, v }) => 2 * dp * D / (L * rho * v * v);
  // viscosidad a partir de una medición laminar (Hagen–Poiseuille)
  const viscosidadPoiseuille = ({ dp, D, L, v }) => dp * D * D / (32 * L * v);

  // Propiedades aproximadas a 20 °C (salvo indicación). Fuente: tablas de propiedades de fluidos
  // (Çengel y Cimbala, «Mecánica de fluidos»; CRC Handbook). La leche y el aceite varían según el producto.
  const FLUIDOS = {
    agua:      { nombre: 'Agua (20 °C)',          rho: 998,  mu: 1.002e-3, color: '#5bb4e5' },
    aguaCal:   { nombre: 'Agua caliente (60 °C)', rho: 983,  mu: 0.467e-3, color: '#7cc8ef' },
    leche:     { nombre: 'Leche entera',          rho: 1030, mu: 2.0e-3,   color: '#f4efe3' },
    aceite:    { nombre: 'Aceite de oliva',       rho: 910,  mu: 0.084,    color: '#d8c14a' },
    glicerina: { nombre: 'Glicerina',             rho: 1260, mu: 1.41,     color: '#e9e3f5' },
  };
  // Rugosidad absoluta ε (m). Fuente: Çengel y Cimbala, tabla de rugosidades.
  const MATERIALES = {
    liso:   { nombre: 'PVC o cobre (liso)',  eps: 1.5e-6 },
    acero:  { nombre: 'Acero comercial',     eps: 4.5e-5 },
    galva:  { nombre: 'Hierro galvanizado',  eps: 1.5e-4 },
  };

  /* ---------- 4. Agua en casa ---------- */
  const caudalLmin = (litros, segundos) => segundos > 0 ? litros / segundos * 60 : 0;
  // 1 gota ≈ 0,05 mL (aprox. 20 gotas por mL)
  const litrosPorGoteo = (gotasPorMinuto, minutos) => gotasPorMinuto * minutos * 0.05 / 1000;

  /* ---------- estadística ---------- */
  const media = a => a.reduce((s, x) => s + x, 0) / a.length;
  function desviacion(a) { if (a.length < 2) return 0; const m = media(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); }
  // recta y = m·x + b por mínimos cuadrados, con R²
  function recta(xs, ys) {
    const n = xs.length, mx = media(xs), my = media(ys);
    let sxy = 0, sxx = 0, syy = 0;
    for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; }
    const m = sxy / sxx, b = my - m * mx;
    return { m, b, r2: syy ? (sxy * sxy) / (sxx * syy) : 1 };
  }
  // recta que pasa por el origen y = m·x
  function rectaOrigen(xs, ys) { let sxy = 0, sxx = 0; xs.forEach((x, i) => { sxy += x * ys[i]; sxx += x * x; }); return sxy / sxx; }
  // ruido normal (Box–Muller)
  function gauss() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

  const API = { G, area, tiempoVaciado, venturiDeltaH, venturiCaudal, reynolds, fLaminar, fBlasius, fHaaland, fDarcy, fTeorico,
    regimen, perdidaCarga, fExperimental, viscosidadPoiseuille, FLUIDOS, MATERIALES, caudalLmin, litrosPorGoteo,
    media, desviacion, recta, rectaOrigen, gauss };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else raiz.Fisica = API;
})(this);
