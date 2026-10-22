import fs from 'fs';

function generateWrapper(filename, components) {
  const imports = components.map(c => `import ${c.name} from './${c.name}';`).join('\n');
  const renders = components.map(c => `
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-text-main">${c.title}</h2>
        </div>
        <${c.name} />
      </section>`).join('\n      <hr className="border-home-grau/20 my-10" />\n');
      
  const content = `import React from 'react';\n${imports}\n\nexport default function ${filename}() {\n  return (\n    <div className="flex flex-col gap-8">\n${renders}\n    </div>\n  );\n}\n`;

  fs.writeFileSync(`src/modules/${filename}.tsx`, content);
}

generateWrapper('OekobilanzLCA', [
  {name: 'LCA', title: 'Ökobilanzierung (LCA) Grundlagen'},
  {name: 'Nachhaltigkeit', title: 'LCA Praxis & Anwendung'}
]);

generateWrapper('ZertifizierungSiegel', [
  {name: 'Zertifizierung', title: 'Gebäudezertifizierungen'},
  {name: 'Produktsiegel', title: 'Produktsiegel & Zertifikate'}
]);

generateWrapper('LebenszyklusKosten', [
  {name: 'Lebensdauern', title: 'Typische Lebensdauern von Bauteilen'},
  {name: 'LCC', title: 'Lebenszykluskosten (LCC)'},
  {name: 'Preisentwicklung', title: 'Preisentwicklung & Baukosten'}
]);

generateWrapper('RessourcenUmwelt', [
  {name: 'RessourcenEmissionen', title: 'Ressourcenverbrauch & Emissionen'},
  {name: 'Nawaro', title: 'Nachwachsende Rohstoffe (NaWaRo)'}
]);

generateWrapper('KreislaufwirtschaftGesamt', [
  {name: 'Kreislaufwirtschaft', title: 'Kreislaufwirtschaft im Bauwesen'},
  {name: 'DppEpd', title: 'Digitaler Produktpass (DPP) & EPD'}
]);

generateWrapper('DigitalesGesamt', [
  {name: 'BimBaustoffe', title: 'BIM für Baustoffe'},
  {name: 'Materialdatenbanken', title: 'Materialdatenbanken'},
  {name: 'Materialpaesse', title: 'Materialpässe (z.B. Madaster)'}
]);
