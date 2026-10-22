const fs = require("fs");
let code = fs.readFileSync("src/App.tsx", "utf8");
const returnStart = code.search(/return \(\n\s*<div className="min-h-screen/);
const suspenseMatch = code.match(/<React\.Suspense[\s\S]*?<\/React\.Suspense>/);
if (!suspenseMatch) process.exit(1);
let firstPart = code.substring(0, returnStart);
if (!firstPart.includes("mobileMenuOpen")) {
  firstPart = firstPart.replace(
    "const [openDropdown, setOpenDropdown] = useState<string | null>(null);",
    "const [openDropdown, setOpenDropdown] = useState<string | null>(null);\n  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);"
  );
}
if (!firstPart.includes("Menu, X")) {
  firstPart = firstPart.replace(
    /, Factory } from 'lucide-react';/,
    ", Factory, Menu, X } from 'lucide-react';"
  );
}
const switchCases = suspenseMatch[0];
const newLayout = `return (
  <div className="min-h-screen bg-off-white flex font-sans">
    {mobileMenuOpen && (
      <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
    )}
    <aside className={"fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-home-grau/30 flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out " + (mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0")}>
      <div className="p-4 border-b border-home-grau/20 flex flex-col gap-4 bg-white z-10 sticky top-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-shiraz rounded-lg flex items-center justify-center text-white flex-shrink-0">
              <GraduationCap size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-text-main leading-tight">BaustoffBoard</h1>
            </div>
          </div>
          <button className="md:hidden text-home-grau p-1 hover:bg-home-grau/10 rounded" onClick={() => setMobileMenuOpen(false)}> 
            <X size={20} />
          </button>
        </div>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-home-grau" />
          </div>
          <input type="text" placeholder="Suchen..." className="w-full pl-9 pr-3 py-2 border border-home-grau/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-shiraz focus:border-transparent" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-1 custom-scrollbar pb-12">
        {tabGroups.filter(group => {
          if (!searchQuery) return true;
          return group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 group.tabs.some((t: any) => t.label && t.label.toLowerCase().includes(searchQuery.toLowerCase()));
        }).map((group) => {
          if ((group.tabs.length) === 1) {
            const tab = group.tabs[0];
            const isActive = activeTab === tab.id;
            return (
              <button key={group.name} onClick={() => { setActiveTab(tab.id as any); setMobileMenuOpen(false); }} className={"text-xs font-semibold uppercase tracking-wider px-2 py-2 text-left rounded transition-colors w-full flex items-center gap-2 " + (isActive ? "bg-shiraz text-white shadow-sm" : "text-text-main/70 hover:bg-home-grau/10 hover:text-text-main")}>
                <tab.icon size={16} className={isActive ? "text-white" : "text-text-main/50"} />
                {group.name}
              </button>
            );
          }
          const isGroupOpen = openDropdown === group.name || searchQuery !== "";
          return (
            <div key={group.name} className="flex flex-col mb-1">
              <button onClick={() => setOpenDropdown(isGroupOpen ? null : group.name)} className={"text-xs font-bold uppercase tracking-wider px-2 py-2 text-left mb-1 flex justify-between items-center rounded " + (group.tabs.some(t => t.id === activeTab) ? "bg-shiraz/5 text-shiraz" : "text-text-main hover:bg-home-grau/5")}>
                <span>{group.name}</span>
                <span className="text-[10px] text-home-grau">{isGroupOpen ? "▲" : "▼"}</span>
              </button>
              {isGroupOpen && (
                <div className="flex flex-col gap-0.5 border-l-2 border-home-grau/20 ml-2 pl-2">
                  {group.tabs.filter((tab: any) => !searchQuery || (tab.label && tab.label.toLowerCase().includes(searchQuery.toLowerCase()))).map((tab: any) => {
                    if (tab.id.startsWith("divider")) {
                      return (
                        <div key={tab.id} className="my-1 pt-1 pointer-events-none">
                          <span className="text-[10px] font-bold text-home-grau uppercase tracking-wider">{tab.label.replace(/-/g, "").trim()}</span>
                        </div>
                      );
                    }
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setMobileMenuOpen(false); }} className={"w-full flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded transition-colors " + (isActive ? "bg-shiraz text-white shadow-sm" : "text-text-main/70 hover:bg-home-grau/10 hover:text-text-main")}>
                        <Icon size={14} className={isActive ? "text-white" : "text-text-main/50"} />
                        <span className="truncate flex-1 text-left">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="p-4 border-t border-home-grau/20 text-xs text-home-grau text-center">
         <strong>Disclaimer:</strong> Akad. Lehrzwecke.
      </div>
    </aside>
    <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
      <header className="bg-white border-b border-home-grau/30 sticky top-0 z-10 flex-shrink-0">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3 md:hidden">
              <button className="text-text-main p-2 -ml-2 rounded-lg hover:bg-home-grau/10" onClick={() => setMobileMenuOpen(true)}> 
                <Menu size={24} />
              </button>
              <div className="font-bold text-text-main flex items-center gap-1 text-sm">
                <GraduationCap size={16} className="text-shiraz"/> BaustoffBoard
              </div>
            </div>
            <div className="hidden md:flex items-center text-sm font-medium text-text-main/70">
               {tabGroups.flatMap(g => g.tabs as unknown as any[]).find(t => t.id === activeTab)?.label || ''}
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <button onClick={handleExport} disabled={isExporting} className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-1.5 text-sm font-medium text-text-main bg-off-white hover:bg-home-grau/30 rounded-lg transition-colors disabled:opacity-50">
                <Download size={16} />
                <span className="hidden sm:inline">{isExporting ? "Exportiere..." : "PDF Export"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto px-2 sm:px-6 py-6 custom-scrollbar" id="scroll-container">
        <div className="max-w-6xl mx-auto flex flex-col min-h-full">
          <div id="module-content" className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8 relative flex-1">
            <div className="hidden pdf-header mb-8 pb-4 border-b-2 border-shiraz">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-text-main">Prüfprotokoll</h1>
                  <p className="text-sm text-text-main/80 mt-1">Modul: {tabGroups.flatMap(g => g.tabs as unknown as any[]).find(t => t.id === activeTab)?.label}</p>
                  <p className="text-sm text-text-main/80">Datum: {new Date().toLocaleDateString("de-DE")}</p>
                </div>
              </div>
            </div>
            ${switchCases}
          </div>
        </div>
      </main>
    </div>
  </div>
);
}`;
fs.writeFileSync("src/App.tsx", firstPart + newLayout);
console.log("Done");