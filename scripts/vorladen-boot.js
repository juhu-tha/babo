// Modul-Chunks anhand der Adresse (/modul/<id>, alt #<id>) sofort vorladen (Umsetzungsplan Phase 5, AP 5.5).
// Browser-Skript (kein Node): Das Vite-Plugin scripts/modulVorladen.ts setzt es beim Build als Inline-Skript
// hinter die Karte (<script type="application/json" id="modul-vorladen">) in dist/index.html – inline, damit
// das Vorladen ohne weiteren Abruf direkt nach dem HTML beginnt. server.ts erlaubt es per CSP-Hash.
(function () {
  try {
    var el = document.getElementById('modul-vorladen');
    if (!el) return;
    var k = JSON.parse(el.textContent || '{}');
    // Modul aus dem Pfad /modul/<id>, auf der Startseite aus einem alten Hash-Link /#<id> (Z52, src/routing/pfad.ts)
    var m = /^\/modul\/([^/]+?)(?:\.html)?\/?$/.exec(location.pathname);
    var tab = (m ? decodeURIComponent(m[1]) : decodeURIComponent(location.hash.slice(1))).trim().toLowerCase() || 'start';
    var hat = function (o, s) { return Object.prototype.hasOwnProperty.call(o, s); };
    var c = hat(k.t, tab) ? k.t[tab] : undefined;
    if (c === undefined) for (var i = 0; i < k.p.length; i++) if (tab.indexOf(k.p[i][0]) === 0) { c = k.p[i][1]; break; }
    if (c === undefined) return; // unbekannte ID/Alias: App lädt wie gewohnt (main.tsx)
    var alle = k.i.concat(tab === 'start' ? [] : k.k, k.c[c], hat(k.h, tab) ? [k.h[tab]] : []);
    var gesehen = {};
    for (var j = 0; j < alle.length; j++) {
      var f = k.d[alle[j]];
      if (gesehen[f]) continue;
      gesehen[f] = 1;
      var href = k.b + f;
      if (document.querySelector('link[href="' + href + '"]')) continue;
      var l = document.createElement('link');
      if (/\.css$/.test(f)) { l.rel = 'preload'; l.as = 'style'; } else { l.rel = 'modulepreload'; }
      l.href = href;
      document.head.appendChild(l);
    }
  } catch (e) { /* Vorladen ist nur eine Beschleunigung */ }
})();
