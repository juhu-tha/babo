const fs = require('fs');
const path = require('path');

const data = {
  'BpTrockenbau.tsx': {
    hersteller: [
      { name: 'Knauf Gips KG', url: 'https://www.knauf.de/' },
      { name: 'Rigips GmbH (Saint-Gobain)', url: 'https://www.rigips.de/' },
      { name: 'Siniat (Etex)', url: 'https://www.siniat.de/' },
      { name: 'Fermacell (James Hardie)', url: 'https://www.fermacell.de/' },
      { name: 'Protektorwerk (Profile)', url: 'https://www.protektor.com/de/' }
    ],
    normen: [
      { title: 'DIN 18181 (Gipsplatten im Hochbau - Verarbeitung)', url: 'https://www.beuth.de/de/norm/din-18181/100085885' },
      { title: 'DIN EN 14195 (Metallprofile für Gipsplatten)', url: 'https://www.beuth.de/de/norm/din-en-14195/222165013' }
    ],
    lit: ['Karsten, W.: Trockenbau. Handbuch für Planung und Ausführung.']
  },
  'BpMauerwerk.tsx': {
    hersteller: [
      { name: 'Wienerberger (Porotherm, Terca)', url: 'https://www.wienerberger.de/' },
      { name: 'Xella (Ytong, Silka, Multipor)', url: 'https://www.xella.de/' },
      { name: 'Schlagmann Poroton', url: 'https://www.schlagmann.de/' },
      { name: 'KS-Original (Kalksandstein)', url: 'https://www.ks-original.de/' }
    ],
    normen: [
      { title: 'DIN EN 1996 (Eurocode 6: Bemessung und Konstruktion von Mauerwerksbauten)', url: '' },
      { title: 'DIN EN 771 (Festlegungen für Mauersteine)', url: '' }
    ],
    lit: ['Jäger, W. (Hrsg.): Mauerwerk-Kalender.', 'Schubert, P.: Mauerwerk.']
  },
  'BpAbdichtung.tsx': {
    hersteller: [
      { name: 'Sika Deutschland', url: 'https://www.sika.com/de/industrie.html' },
      { name: 'Bauder (Bitumen, Kunststoff, PU)', url: 'https://www.bauder.de/' },
      { name: 'Remmers (Bauwerksabdichtung, PMBC)', url: 'https://www.remmers.com/de/' },
      { name: 'Soprema', url: 'https://www.soprema.de/' },
      { name: 'Dörken (Delta Folien)', url: 'https://www.doerken.com/de/' }
    ],
    normen: [
      { title: 'DIN 18533 (Abdichtung von erdberührten Bauteilen)', url: '' },
      { title: 'DIN 18534 (Innenraumabdichtung)', url: '' }
    ],
    lit: ['Oswald, R.: Bauwerksabdichtung.', 'Cziesielski, E.: Lufdichtheit und Tauwasserschutz.']
  },
  'BpDaemmung.tsx': {
    hersteller: [
      { name: 'Rockwool (Steinwolle)', url: 'https://www.rockwool.com/de/' },
      { name: 'Isover (Glaswolle, Saint-Gobain)', url: 'https://www.isover.de/' },
      { name: 'Sto (WDVS)', url: 'https://www.sto.de/' },
      { name: 'Steico (Holzfaser)', url: 'https://www.steico.com/de/' },
      { name: 'Kingspan (PIR, VIP)', url: 'https://www.kingspan.com/de/' },
      { name: 'Foamglas (Schaumglas)', url: 'https://www.foamglas.com/de-de/' }
    ],
    normen: [
      { title: 'DIN 4108 (Wärmeschutz und Energie-Einsparung)', url: '' }
    ],
    lit: ['Minke, G.: Handbuch Naturbaustoffe.', 'Willems, W.: Bauphysik.']
  },
  'BpPutzEstrich.tsx': {
    hersteller: [
      { name: 'Baumit', url: 'https://baumit.de/' },
      { name: 'Maxit', url: 'https://www.maxit.de/' },
      { name: 'Knauf (Putze und Fließestriche)', url: 'https://www.knauf.de/' },
      { name: 'Weber (Saint-Gobain)', url: 'https://www.de.weber/' },
      { name: 'Uzin Utz (Bodenaufbau, Kleber)', url: 'https://de.uzin.com/' }
    ],
    normen: [
      { title: 'DIN EN 13914-1 (Planung, Zubereitung und Ausführung von Außen- und Innenputzen)', url: '' },
      { title: 'DIN 18560 (Estriche im Bauwesen)', url: '' }
    ],
    lit: ['Probst, M.: Handbuch Putz und Estrich.']
  },
  'BpHolzprodukte.tsx': {
    hersteller: [
      { name: 'Binderholz (BSH, BSP)', url: 'https://www.binderholz.com/' },
      { name: 'Hasslacher Norica Timber', url: 'https://www.hasslacher.com/' },
      { name: 'Pfleiderer (Holzwerkstoffe, Spanplatten)', url: 'https://www.pfleiderer.com/' },
      { name: 'Egger (Holzwerkstoffe)', url: 'https://www.egger.com/' },
      { name: 'STEICO (LVL, Furnierschichtholz)', url: 'https://www.steico.com/' }
    ],
    normen: [
      { title: 'DIN EN 1995 (Eurocode 5: Bemessung und Konstruktion von Holzbauten)', url: '' },
      { title: 'DIN EN 14080 (Holzbauwerke - Brettschichtholz)', url: '' }
    ],
    lit: ['Götz, K.-H. et al.: Holzbau Atlas.', 'Kaufmann, H. et al.: Building with Timber.']
  },
  'BpDachFassade.tsx': {
    hersteller: [
      { name: 'Braas (Dachpfannen, BMI Group)', url: 'https://www.bmigroup.com/de/' },
      { name: 'Creaton (Tondachziegel)', url: 'https://www.creaton.de/' },
      { name: 'Eternit / Swisspearl (Faserzement)', url: 'https://www.swisspearl.com/de-de' },
      { name: 'Rheinzink (Titanzink-Fassaden)', url: 'https://www.rheinzink.de/' },
      { name: 'Kalzip (Aluminium-Stehfalz)', url: 'https://www.kalzip.com/' },
      { name: 'Trespa (HPL-Platten)', url: 'https://www.trespa.com/de/' }
    ],
    normen: [
      { title: 'Hinweise für die Ausführung von Metalldächern (Klempnerfachregeln)', url: '' },
      { title: 'ZVDH (Zentralverband des Deutschen Dachdeckerhandwerks) - Fachregeln', url: '' }
    ],
    lit: ['Schirmbeck, E. et al.: Architektur der Fassade.']
  },
  'BpBefestigung.tsx': {
    hersteller: [
      { name: 'fischer', url: 'https://www.fischer.de/' },
      { name: 'Hilti', url: 'https://www.hilti.de/' },
      { name: 'Würth', url: 'https://www.wuerth.de/' },
      { name: 'SPAX', url: 'https://www.spax.com/' },
      { name: 'HALFEN (Leviats)', url: 'https://www.halfen.com/de/' }
    ],
    normen: [
      { title: 'TR 020 (Evaluierung von Verbunddübeln)', url: '' },
      { title: 'DIN EN 1992-4 (Eurocode 2: Bemessung der Verankerung in Beton)', url: '' }
    ],
    lit: ['Mahrenholtz, C.: Befestigungstechnik im Betonbau.', 'Eligehausen, R.: Verankerungen in Beton und Mauerwerk.']
  },
  'BpKunststoffe.tsx': {
    hersteller: [
      { name: 'Rehau (Rohrsysteme, Fensterprofile)', url: 'https://www.rehau.com/de-de' },
      { name: 'Geberit (Sanitärtechnik, PE-Rohre)', url: 'https://www.geberit.de/' },
      { name: 'Schüco (PVC- und Aluprofile)', url: 'https://www.schueco.com/de' },
      { name: 'Röhm (Plexiglas)', url: 'https://www.plexiglas.de/' }
    ],
    normen: [
      { title: 'DIN EN ISO 1043-1 (Kunststoffe - Kennbuchstaben)', url: '' }
    ],
    lit: ['Domininghaus, H.: Kunststoffe: Eigenschaften und Anwendungen.']
  },
  'BpKlebstoffe.tsx': {
    hersteller: [
      { name: 'Bostik', url: 'https://www.bostik.com/germany/de/' },
      { name: 'Henkel (Ceresit, Pattex)', url: 'https://www.henkel.de/' },
      { name: 'Sika (Sikaflex PU-Dichtstoffe)', url: 'https://www.sika.com/de/' },
      { name: 'MAPEI', url: 'https://www.mapei.com/de/' },
      { name: 'Otto Chemie (Silikon)', url: 'https://www.otto-chemie.de/' }
    ],
    normen: [
      { title: 'DIN EN 15651 (Fugendichtstoffe für nicht tragende Anwendungen)', url: '' }
    ],
    lit: ['Habibi, F. et al.: Adhesives in Building Construction.']
  },
  'BpMineralisch.tsx': {
    hersteller: [
      { name: 'Holcim', url: 'https://www.holcim.de/' },
      { name: 'Heidelberg Materials', url: 'https://www.heidelbergmaterials.de/' },
      { name: 'Schwenk', url: 'https://www.schwenk.de/' },
      { name: 'Ytong (Xella)', url: 'https://www.xella.de/' },
      { name: 'Starken', url: '' }
    ],
    normen: [
      { title: 'DIN EN 206 (Beton)', url: '' },
      { title: 'DIN EN 197-1 (Zement)', url: '' }
    ],
    lit: ['Zement-Taschenbuch.']
  },
  'BpMetallisch.tsx': {
    hersteller: [
      { name: 'Salzgitter AG', url: 'https://www.salzgitter-ag.com/' },
      { name: 'Thyssenkrupp', url: 'https://www.thyssenkrupp.com/' },
      { name: 'SSAB (Ruukki)', url: 'https://www.ssab.com/' },
      { name: 'ArcelorMittal', url: 'https://germany.arcelormittal.com/' },
      { name: 'Feralpi (Bewehrungsstahl)', url: 'https://www.feralpi.de/' }
    ],
    normen: [
      { title: 'DIN EN 10025 (Warmgewalzte Erzeugnisse aus Baustählen)', url: '' },
      { title: 'DIN EN 1090 (Ausführung von Stahltragwerken)', url: '' },
      { title: 'DIN 488 (Betonstahl - Sorten)', url: '' }
    ],
    lit: ['Wagenknecht, G.: Stahlbau-Praxis.', 'Rubin, H.: Stahlbau.']
  }
};

const dir = path.join(__dirname, 'src', 'modules');

Object.keys(data).forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.log("Missing " + file);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf-8');

  // Add hersteller block
  if (!content.includes('Relevante Hersteller')) {
    const herstellerList = data[file].hersteller.map(h => {
      if (h.url) {
        return `                <li><a href="${h.url}" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline">${h.name}</a></li>`;
      }
      return `                <li><strong>${h.name}</strong></li>`;
    }).join('\n');

    const injection = `
          <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-sm mt-8">
            <h3 className="font-bold text-home-prim text-lg mb-4 flex items-center gap-2">Hersteller & Unternehmen (Auswahl)</h3>
            <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
${herstellerList}
            </ul>
          </div>
        </div>
      </div>
`;
    // Replace the end of the container div with the injection
    content = content.replace(/<\/div>\s*<\/div>\s*<ModuleFooter/g, injection + '      <ModuleFooter');
  }

  // Update ModuleFooter
  const normStr = data[file].normen.map(n => `{ title: '${n.title}', url: '${n.url}' }`).join(', ');
  const litStr = data[file].lit.map(l => `'${l}'`).join(', ');

  // Naive replacement for empty properties
  content = content.replace(/regelwerke=\{\[\]\}/g, `regelwerke={[ ${normStr} ]}`);
  content = content.replace(/literatur=\{\[\]\}/g, `literatur={[ ${litStr} ]}`);

  fs.writeFileSync(filePath, content);
  console.log("Processed " + file);
});
