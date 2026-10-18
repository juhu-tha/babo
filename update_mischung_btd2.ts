import fs from 'fs';
const file = 'src/modules/Mischungsberechnung.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /{activeTab === 'walzkurven' && \(\s*<WalzKurvenSection \/>\s*\)}/,
  `{activeTab === 'grenzwerte' && (
        <GrenzwerteSection />
      )}
      
      {activeTab === 'walzkurven' && (
        <WalzKurvenSection />
      )}`
);

fs.writeFileSync(file, content);
