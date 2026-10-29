/* LabFluids · utilidades compartidas: atajos del DOM, formato de números en español, pasos, CSV y gráficos. */
(function () {
  const $ = id => document.getElementById(id);
  // número con coma decimal (estilo Chile)
  const num = (x, dec = 2) => Number.isFinite(x) ? x.toLocaleString('es-CL', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : '—';
  const entero = x => Number.isFinite(x) ? Math.round(x).toLocaleString('es-CL') : '—';
  const css = v => getComputedStyle(document.body).getPropertyValue(v).trim();

  // navegación entre pasos: botones con data-ir="paso-x" y secciones .paso
  function iniciarPasos(alCambiar) {
    const botones = [...document.querySelectorAll('nav.pasos button')];
    function ir(id) {
      document.querySelectorAll('.paso').forEach(s => s.classList.toggle('activo', s.id === id));
      botones.forEach(b => { if (b.dataset.ir === id) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (alCambiar) alCambiar(id);
    }
    botones.forEach(b => b.addEventListener('click', () => ir(b.dataset.ir)));
    document.querySelectorAll('[data-ir]:not(nav.pasos button)').forEach(b => b.addEventListener('click', () => ir(b.dataset.ir)));
    return ir;
  }

  // descarga un CSV (separador ; y coma decimal, para que Excel en español lo abra bien)
  function descargarCSV(nombre, filas) {
    const txt = filas.map(f => f.map(c => typeof c === 'number' ? String(c).replace('.', ',') : `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\r\n');
    const blob = new Blob(['﻿' + txt], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nombre; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  // perfil elegido en la portada (se guarda solo en este navegador)
  const perfil = {
    leer() { try { return localStorage.getItem('labfluids-perfil'); } catch (e) { return null; } },
    guardar(p) { try { localStorage.setItem('labfluids-perfil', p); } catch (e) { /* sin almacenamiento: no pasa nada */ } },
  };

  // estilo común de los gráficos de Chart.js
  function estiloGraficos() {
    if (!window.Chart) return;
    Chart.defaults.font.family = "'Nunito','Segoe UI',Arial,sans-serif";
    Chart.defaults.font.size = 12.5;
    Chart.defaults.color = '#5b7286';
    Chart.defaults.borderColor = 'rgba(29,53,80,.10)';
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.maintainAspectRatio = false;
    Chart.defaults.animation.duration = 250;
  }

  // ajusta un canvas a su ancho en pantalla (nítido en celulares) y devuelve el contexto escalado
  function prepararLienzo(canvas, proporcion) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const ancho = canvas.clientWidth || canvas.parentElement.clientWidth;
    const alto = Math.round(ancho * proporcion);
    if (canvas.width !== Math.round(ancho * dpr) || canvas.height !== Math.round(alto * dpr)) {
      canvas.width = Math.round(ancho * dpr); canvas.height = Math.round(alto * dpr);
    }
    canvas.style.height = alto + 'px';
    const ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w: ancho, h: alto };
  }

  window.LF = { $, num, entero, css, iniciarPasos, descargarCSV, perfil, estiloGraficos, prepararLienzo };
})();
