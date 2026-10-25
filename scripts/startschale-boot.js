// Startseiten-Schale nur zeigen, wo sie dem ersten Bild von React entspricht (Umsetzungsplan Phase 5, AP 5.5 Nachtrag).
// Browser-Skript (kein Node): Das Vite-Plugin scripts/startSchale.ts setzt es beim Build als Inline-Skript an den
// Anfang von <head> – vor jedes Stylesheet, damit es sofort läuft (ein Skript hinter einem Stylesheet wartet auf
// dessen Laden, der Browser zeichnet aber schon vorher). Es setzt die Klasse bb-schale an <html>; nur dann blendet
// das Inline-Stylesheet die Schale ein. server.ts erlaubt das Skript per CSP-Hash.
(function () {
  try {
    var hash = decodeURIComponent(location.hash.slice(1)).trim().toLowerCase();
    var ls = window.localStorage;
    var breite = ls.getItem('baustoffboard_screen_width');
    if ((hash === '' || hash === 'start')
      && !/[?&]poll=/.test(location.search)
      && ls.getItem('baustoffboard_lang') !== 'en'
      && ls.getItem('theme') !== 'dark'
      && (breite === null ? ls.getItem('baustoffboard_fluid_width') === null : breite === 'wide')) {
      document.documentElement.classList.add('bb-schale');
    }
  } catch (e) { /* ohne Schale */ }
})();
