const fs = require('fs');
const path = require('path');

function generateSitemap() {
  const appPath = path.join(__dirname, 'src', 'App.tsx');
  if (!fs.existsSync(appPath)) {
    console.error('App.tsx not found!');
    process.exit(1);
  }

  const appContent = fs.readFileSync(appPath, 'utf8');

  // Match: id: 'tab_id' or id: "tab_id"
  const regex = /id:\s*['"]([^'"]+)['"]/g;
  let match;
  const tabIds = new Set();

  while ((match = regex.exec(appContent)) !== null) {
    const tabId = match[1];
    // Exclude dividers or obsolete test references
    if (!tabId.startsWith('divider_') && tabId !== 'obsoleted_ref' && tabId !== 'divider_digitales') {
      tabIds.add(tabId);
    }
  }

  // Ensure 'start' is at the top, or just treat all equally
  const baseUrl = 'https://ais-pre-3kb4bjh7mntt4x5tbftq6q-129958746883.europe-west2.run.app';
  const currentDate = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Main Root URL
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/</loc>\n`;
  xml += `    <lastmod>${currentDate}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;

  // Tab URLs using SPA hashes
  for (const id of Array.from(tabIds).sort()) {
    if (id === 'start') continue; // Already covered by root URL basically
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/#${id}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  // Write to workspace root sitemap.xml
  const rootSitemapPath = path.join(__dirname, 'sitemap.xml');
  fs.writeFileSync(rootSitemapPath, xml, 'utf8');
  console.log(`Created sitemap at: ${rootSitemapPath}`);

  // Write to public/sitemap.xml so it is served by the production server at /sitemap.xml
  const publicSitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
  fs.writeFileSync(publicSitemapPath, xml, 'utf8');
  console.log(`Created sitemap at: ${publicSitemapPath}`);
}

generateSitemap();
