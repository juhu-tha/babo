// Startseiten- bzw. Modulseiten-Schale nur zeigen, wo sie dem ersten Bild von React entspricht (Umsetzungsplan
// Phase 5, AP 5.5 Nachtrag; Modulseiten Z52). Browser-Skript (kein Node): Das Vite-Plugin scripts/startSchale.ts
// setzt es beim Build als Inline-Skript an den Anfang von <head> – vor jedes Stylesheet, damit es sofort läuft (ein
// Skript hinter einem Stylesheet wartet auf dessen Laden, der Browser zeichnet aber schon vorher). Es setzt die
// Klasse bb-schale an <html>; nur dann blendet das Inline-Stylesheet die Schale ein. server.ts erlaubt das Skript
// per CSP-Hash. Welche Seite die Datei enthält, steht in <meta name="bb-vorgerendert"> davor (Modulseiten aus
// scripts/vorrendern.ts; fehlt = Startseite). Pfadregel wie src/routing/pfad.ts.
// Dunkelmodus (02.11.2026): Die Schale steht auch dunkel, weil ihr Markup hell und dunkel gleich ist (Farben über
// die Klasse dark, vor dem ersten Bild gesetzt). Modulseiten, deren Markup dunkel abweicht, tragen data-nur-hell
// am <meta> (scripts/vorrendern.ts) und bleiben dunkel ohne Schale.
(function () {
  var ls = null;
  try { ls = window.localStorage; ls.getItem('theme'); } catch (e) { ls = null; }
  var dunkel = false;
  try {
    // Dunkelmodus wie src/contexts/TabContext.tsx: eigene Wahl vor Systemeinstellung; früh setzen gegen Aufblitzen
    var wahl = ls ? ls.getItem('theme') : null;
    dunkel = wahl === 'dark' || (wahl !== 'light' && !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dunkel) document.documentElement.classList.add('dark');
  } catch (e) { /* hell */ }
  try {
    var meta = document.querySelector('meta[name="bb-vorgerendert"]');
    var seite = meta ? meta.getAttribute('content') : 'start';
    var pfad = location.pathname;
    var m = /^\/modul\/([^/]+?)(?:\.html)?\/?$/.exec(pfad);
    var hash = decodeURIComponent(location.hash.slice(1)).trim().toLowerCase();
    var adresse = m ? decodeURIComponent(m[1]).trim().toLowerCase()
      : (pfad === '/' || pfad === '/index.html') && (hash === '' || hash === 'start') ? 'start' : '';
    var breite = ls.getItem('baustoffboard_screen_width');
    if (adresse === seite
      && !/[?&]poll=/.test(location.search)
      && ls.getItem('baustoffboard_lang') !== 'en'
      && !(dunkel && meta && meta.hasAttribute('data-nur-hell'))
      && (breite === null ? ls.getItem('baustoffboard_fluid_width') === null : breite === 'wide')) {
      document.documentElement.classList.add('bb-schale');
    }
  } catch (e) { /* ohne Schale */ }
})();
