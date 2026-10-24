// Ausgelagert aus index.html (CSP ohne 'unsafe-inline', Phase 1 AP 1.9)
      (function() {
        window.validateJSONLD = function() {
          const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
          if (!jsonLdScript) {
            console.error("❌ Schema.org JSON-LD fehlt oder konnte nicht geladen werden.");
            return { success: false, errors: ["No JSON-LD script found"], warnings: [], results: [] };
          }
          try {
            const data = JSON.parse(jsonLdScript.textContent);
            const parts = data.hasPart || [];
            const results = [];
            const errors = [];
            const warnings = [];

            parts.forEach(part => {
              const url = part.url || "";
              const hashIdx = url.indexOf('#');
              if (hashIdx === -1) {
                errors.push(`Modul "${part.name}" hat keine ID/Anker-URL oder Hash: ${url}`);
                results.push({ name: part.name, url, status: "ERR: Kein Hash" });
                return;
              }
              const hash = url.substring(hashIdx + 1);
              // Pruefe ob fallback-seo-artikel existiert (z. B. hash + "_seo") im HTML-Body
              const fallbackExists = document.getElementById(`${hash}_seo`) !== null;
              
              if (!fallbackExists) {
                // Auch checken ob der nackte hasPart-Anchor als Fallback oder ID existiert
                const directExists = document.getElementById(hash) !== null;
                if (!directExists) {
                  warnings.push(`Modul "${part.name}" (#${hash}) hat keinen entsprechenden Fallback-Bereich (<article id="${hash}_seo">) im HTML-Body.`);
                  results.push({ name: part.name, url, status: "WARN: Fallback fehlt" });
                } else {
                  results.push({ name: part.name, url, status: "OK (Direkte ID)" });
                }
              } else {
                results.push({ name: part.name, url, status: "OK (SEO Fallback)" });
              }
            });

            console.group("🏷️ Schema.org JSON-LD Webmaster-Validierung");
            console.log("%cValidierung des strukturierten WebApplication-Markups nach Schema.org:", "font-weight: bold; color: #92003B;");
            console.table(results);
            if (errors.length > 0) {
              console.error("❌ JSON-LD Fehler gefunden:", errors);
            }
            if (warnings.length > 0) {
              console.warn("⚠️ JSON-LD Warnungen (Verbesserungspotenzial):", warnings);
            }
            if (errors.length === 0 && warnings.length === 0) {
              console.log("%c✔ JSON-LD Schema.org Markup ist 100% valide und vollständig!", "color: #047857; font-weight: bold;");
            }
            console.log("🔗 Webmaster-Tools zur Live-Prüfung des Schema-Markups:");
            console.log("   - Google Rich Results Test: %chttps://search.google.com/test/rich-results", "color: #2563eb; text-decoration: underline; font-weight: bold;");
            console.log("   - Schema Markup Validator: %chttps://validator.schema.org/", "color: #2563eb; text-decoration: underline; font-weight: bold;");
            console.groupEnd();

            return {
              success: errors.length === 0,
              errors,
              warnings,
              results
            };
          } catch (e) {
            console.error("❌ Fehler beim Parsen des JSON-LD Markups:", e);
            return { success: false, errors: [e.message], warnings: [], results: [] };
          }
        };
        
        // Nur auf Anforderung ausführen (?seo-check), damit die Konsole im Normalbetrieb ruhig bleibt
        if (location.search.indexOf('seo-check') !== -1) {
          window.addEventListener('DOMContentLoaded', function() {
            setTimeout(window.validateJSONLD, 500);
          });
        }
      })();
