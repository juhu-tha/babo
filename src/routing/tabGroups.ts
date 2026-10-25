import { NAV_TAB_GRUPPEN } from '../registry/modules';
import { iconFor } from '../registry/icons';

// Menü wird aus der zentralen Modul-Registry erzeugt (src/registry/modules.ts)
export const tabGroups = NAV_TAB_GRUPPEN.map(g => ({
  name: g.name,
  tabs: g.tabs.map(t => ({ id: t.id, label: t.label, icon: iconFor(t.icon) })),
}));
