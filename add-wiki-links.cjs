const fs = require('fs');
const path = require('path');

const dir = 'src/modules';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const specificMappings = {
  'Asphalt.tsx': [{ title: 'Asphalt', url: 'https://de.wikipedia.org/wiki/Asphalt' }],
  'Bauchemie.tsx': [{ title: 'Bauchemie', url: 'https://de.wikipedia.org/wiki/Bauchemie' }],
  'Bauphysik.tsx': [{ title: 'Bauphysik', url: 'https://de.wikipedia.org/wiki/Bauphysik' }],
  'Baustatik.tsx': [{ title: 'Baustatik', url: 'https://de.wikipedia.org/wiki/Baustatik' }],
  'Bodenmechanik.tsx': [{ title: 'Bodenmechanik', url: 'https://de.wikipedia.org/wiki/Bodenmechanik' }],
  'Brandschutz.tsx': [{ title: 'Brandschutz', url: 'https://de.wikipedia.org/wiki/Brandschutz' }],
  'Bruchmechanik.tsx': [{ title: 'Bruchmechanik', url: 'https://de.wikipedia.org/wiki/Bruchmechanik' }],
  'Carbonbeton.tsx': [{ title: 'Carbonbeton', url: 'https://de.wikipedia.org/wiki/Carbonbeton' }],
  'Durchstanzen.tsx': [{ title: 'Durchstanzen', url: 'https://de.wikipedia.org/wiki/Durchstanzen' }],
  'Erdbau.tsx': [{ title: 'Erdbau', url: 'https://de.wikipedia.org/wiki/Erdbau' }],
  'Faserverbund.tsx': [{ title: 'Faserverbundwerkstoff', url: 'https://de.wikipedia.org/wiki/Faserverbundwerkstoff' }],
  'Festbeton.tsx': [{ title: 'Beton', url: 'https://de.wikipedia.org/wiki/Beton' }],
  'Gesteine.tsx': [{ title: 'Gestein', url: 'https://de.wikipedia.org/wiki/Gestein' }],
  'Glas.tsx': [{ title: 'Glas', url: 'https://de.wikipedia.org/wiki/Glas' }],
  'Holz.tsx': [{ title: 'Holz', url: 'https://de.wikipedia.org/wiki/Holz' }],
  'Kunststoffe.tsx': [{ title: 'Kunststoff', url: 'https://de.wikipedia.org/wiki/Kunststoff' }],
  'Lehmbau.tsx': [{ title: 'Lehmbau', url: 'https://de.wikipedia.org/wiki/Lehmbau' }],
  'Mauerwerk.tsx': [{ title: 'Mauerwerk', url: 'https://de.wikipedia.org/wiki/Mauerwerk' }],
  'Metalle.tsx': [{ title: 'Metall', url: 'https://de.wikipedia.org/wiki/Metall' }],
  'Nachhaltigkeit.tsx': [{ title: 'Nachhaltigkeit', url: 'https://de.wikipedia.org/wiki/Nachhaltigkeit' }],
  'Recyclingbeton.tsx': [{ title: 'Recyclingbeton', url: 'https://de.wikipedia.org/wiki/Recyclingbeton' }],
  'Schallschutz.tsx': [{ title: 'Schallschutz', url: 'https://de.wikipedia.org/wiki/Schallschutz' }],
  'Spannbeton.tsx': [{ title: 'Spannbeton', url: 'https://de.wikipedia.org/wiki/Spannbeton' }],
  'Stahlbau.tsx': [{ title: 'Stahlbau', url: 'https://de.wikipedia.org/wiki/Stahlbau' }],
  'WUBauwerke.tsx': [{ title: 'Weiße Wanne', url: 'https://de.wikipedia.org/wiki/Wei%C3%9Fe_Wanne' }],
  'Zementchemie.tsx': [{ title: 'Zement', url: 'https://de.wikipedia.org/wiki/Zement' }],
  'KriechenSchwinden.tsx': [{ title: 'Kriechen (Werkstoffe)', url: 'https://de.wikipedia.org/wiki/Kriechen_(Werkstoffe)'}, {title: 'Schwinden (Beton)', url: 'https://de.wikipedia.org/wiki/Schwinden_(Beton)'}],
  'Korrosion.tsx': [{ title: 'Korrosion', url: 'https://de.wikipedia.org/wiki/Korrosion' }],
  'Mischungsberechnung.tsx': [{title: 'Beton', url: 'https://de.wikipedia.org/wiki/Beton'}],
  'Querkraftbemessung.tsx': [{title: 'Querkraft', url: 'https://de.wikipedia.org/wiki/Querkraft'}],
  'Biegebemessung.tsx': [{title: 'Biegung (Mechanik)', url: 'https://de.wikipedia.org/wiki/Biegung_(Mechanik)'}],
  'Dauerhaftigkeit.tsx': [{title: 'Dauerhaftigkeit', url: 'https://de.wikipedia.org/wiki/Dauerhaftigkeit'}]
};

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (content.includes('<ModuleFooter')) {
    // Determine the links to inject
    let links = specificMappings[file];
    if (!links) {
        // Automatically make a link based on file name
        const titleName = file.replace('.tsx', '');
        links = [{ title: titleName, url: 'https://de.wikipedia.org/wiki/' + encodeURIComponent(titleName) }];
    }
    
    const wikiString = 'wikipedia={[\n' + links.map(l => `                { title: '${l.title}', url: '${l.url}' }`).join(',\n') + '\n              ]}\n              ';
    
    // Check if wikipedia= already present
    if (!content.includes('wikipedia={[')) {
      // Find the position of <ModuleFooter or <ModuleFooter \n and inject right after
      content = content.replace(/(<ModuleFooter\s+)/g, '$1' + wikiString);
      fs.writeFileSync(filePath, content, 'utf-8');
    }
  }
}

console.log('Wikipedia links injected.');
