import fs from 'fs';
let app = fs.readFileSync('src/App.tsx', 'utf8');

const targetGroupStart = app.indexOf("name: 'Nachhaltigkeit & Digitales',");
const targetGroupEnd = app.indexOf("]", targetGroupStart) + 1;
const groupStr = app.substring(targetGroupStart - 6, targetGroupEnd + 5);

const neueTabs = "    name: 'Nachhaltigkeit & Digitales',\n    tabs: [\n      { id: 'dpp_epd', label: 'DPP & EPD', icon: FileText },\n      { id: 'zertifizierung', label: 'Gebäudezertifizierung', icon: Award },\n      { id: 'kreislaufwirtschaft', label: 'Kreislaufwirtschaft', icon: RefreshCw },\n      { id: 'nachhaltigkeit', label: 'LCA Praxis', icon: Leaf },\n      { id: 'lebensdauern', label: 'Lebensdauern', icon: Clock },\n      { id: 'lcc', label: 'Lebenszykluskosten (LCC)', icon: TrendingUp },\n      { id: 'nawaro', label: 'NaWaRo', icon: Trees },\n      { id: 'preisentwicklung', label: 'Preisentwicklung', icon: TrendingUp },\n      { id: 'ressourcen_emissionen', label: 'Ressourcen & Emissionen', icon: Factory },\n      { id: 'produktsiegel', label: 'Siegel & Zertifikate (Produkte)', icon: Award },\n      { id: 'lca', label: 'Ökobilanzierung (LCA)', icon: Leaf },\n      { id: 'divider_digitales', label: '--- Digitales ---', icon: Monitor as any },\n      { id: 'bim_baustoffe', label: 'BIM für Baustoffe', icon: Monitor },\n      { id: 'materialdatenbanken', label: 'Materialdatenbanken', icon: Box },\n      { id: 'materialpaesse', label: 'Materialpässe (Madaster)', icon: FileText },\n    ]\n  },";

app = app.replace(groupStr, neueTabs);

// fix rendering
const targetRender = "{group.tabs.map((tab) => {\n                        const Icon = tab.icon;";

const newRender = "{group.tabs.map((tab) => {\n                        if (tab.id.startsWith('divider')) {\n                          return (\n                            <div key={tab.id} className=\"my-2 border-t border-home-grau/20 pt-2 px-4 pointer-events-none\">\n                              <span className=\"text-[10px] font-bold text-home-grau uppercase tracking-wider\">{tab.label.replace(/-/g, '').trim()}</span>\n                            </div>\n                          );\n                        }\n                        const Icon = tab.icon;";
app = app.replace(targetRender, newRender);

// Import the new modules: Leichtbeton, MassigeBauteile, Spritzbeton
app = app.replace("import Einheiten", "import Leichtbeton from './modules/Leichtbeton';\nimport MassigeBauteile from './modules/MassigeBauteile';\nimport Spritzbeton from './modules/Spritzbeton';\nimport Einheiten");

// Find Betontechnologie tabs
const bStart = app.indexOf("name: 'Betontechnologie',");
const replacePos = app.indexOf("]", bStart);
app = app.substring(0, replacePos) + 
      "  { id: 'leichtbeton', label: 'Leichtbeton', icon: Layers },\n      { id: 'massige_bauteile', label: 'Massige Bauteile', icon: Layers },\n      { id: 'spritzbeton', label: 'Spritzbeton', icon: Waves },\n    " + 
      app.substring(replacePos);

// add to body
const bodyAnchor = "{activeTab === 'sichtbeton' && <Sichtbeton />}";
app = app.replace(bodyAnchor, bodyAnchor + "\n          {activeTab === 'leichtbeton' && <Leichtbeton />}\n          {activeTab === 'massige_bauteile' && <MassigeBauteile />}\n          {activeTab === 'spritzbeton' && <Spritzbeton />}");

fs.writeFileSync('src/App.tsx', app);
console.log('App modified');