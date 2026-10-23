// Ausgelagert aus index.html (CSP ohne 'unsafe-inline', Phase 1 AP 1.9)
      (function() {
        var handler = function(e) {
          var msg = (e && (e.message || (e.reason && (e.reason.message || String(e.reason))) || '')) + '';
          var file = (e && (e.filename || (e.reason && e.reason.stack) || '')) + '';
          if (
            msg.indexOf('WebSocket') !== -1 ||
            msg.indexOf('@vite/client') !== -1 ||
            msg.indexOf('createWebSocketModuleRunnerTransport') !== -1 ||
            file.indexOf('@vite/client') !== -1
          ) {
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            if (e.preventDefault) e.preventDefault();
            return true;
          }
        };
        window.addEventListener('error', handler, true);
        window.addEventListener('unhandledrejection', handler, true);
      })();
