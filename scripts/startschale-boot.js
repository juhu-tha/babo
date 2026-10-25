// Startseiten-Schale nur zeigen, wo sie dem ersten Bild von React entspricht (Umsetzungsplan Phase 5, AP 5.5 Nachtrag).
// Browser-Skript (kein Node): Das Vite-Plugin scripts/startSchale.ts setzt es beim Build als Inline-Skript direkt
// hinter <div id="root"> (mit der Schale aus scripts/startschale.html). server.ts erlaubt es per CSP-Hash.
// Die Schale ist nicht bedienbar (inert); React ersetzt sie beim ersten Rendern vollständig.
(function () {
  var root = document.getElementById('root');
  if (!root || !root.firstElementChild) return;
  var behalten = false;
  try {
    var hash = decodeURIComponent(location.hash.slice(1)).trim().toLowerCase();
    var ls = window.localStorage;
    var breite = ls.getItem('baustoffboard_screen_width');
    behalten = (hash === '' || hash === 'start')
      && !/[?&]poll=/.test(location.search)
      && ls.getItem('baustoffboard_lang') !== 'en'
      && ls.getItem('theme') !== 'dark'
      && (breite === null ? ls.getItem('baustoffboard_fluid_width') === null : breite === 'wide');
  } catch (e) { behalten = false; }
  if (behalten) root.firstElementChild.setAttribute('inert', '');
  else root.textContent = '';
})();
