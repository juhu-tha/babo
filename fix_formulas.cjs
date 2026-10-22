const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, 'src', 'modules');
const files = fs.readdirSync(modulesDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(modulesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // We want to find formel: '...' and replace contents
  content = content.replace(/formel:\s*['"]([^'"]+)['"]/g, (match, p1) => {
    let f = p1;
    
    // If it's just text, wrap in \text{}
    if (f === 'Nachbehandlungsdauer' || f === 'Kernfeuchte-Kompensation' || f === 'pH-Wert Abfall' || f === 'Empirische Schätzwerte') {
      return `formel: '\\\\text{${f}}'`;
    }

    // Replace unicode with latex
    f = f.replace(/·/g, '\\\\cdot ');
    f = f.replace(/Σ/g, '\\\\Sigma ');
    f = f.replace(/Δ/g, '\\\\Delta ');
    f = f.replace(/√\(([^)]+)\)/g, '\\\\sqrt{$1}');
    f = f.replace(/√([a-zA-Z0-9_{}]+)/g, '\\\\sqrt{$1}');
    f = f.replace(/²/g, '^2');
    f = f.replace(/³/g, '^3');
    f = f.replace(/≤/g, '\\\\le ');
    f = f.replace(/≥/g, '\\\\ge ');
    f = f.replace(/→/g, '\\\\rightarrow ');
    f = f.replace(/∝/g, '\\\\propto ');
    f = f.replace(/≈/g, '\\\\approx ');
    f = f.replace(/π/g, '\\\\pi ');
    f = f.replace(/α/g, '\\\\alpha ');
    f = f.replace(/β/g, '\\\\beta ');
    f = f.replace(/γ/g, '\\\\gamma ');
    f = f.replace(/ε/g, '\\\\varepsilon ');
    f = f.replace(/η/g, '\\\\eta ');
    f = f.replace(/θ/g, '\\\\theta ');
    f = f.replace(/λ/g, '\\\\lambda ');
    f = f.replace(/μ/g, '\\\\mu ');
    f = f.replace(/ν/g, '\\\\nu ');
    f = f.replace(/ρ/g, '\\\\rho ');
    f = f.replace(/σ/g, '\\\\sigma ');
    f = f.replace(/τ/g, '\\\\tau ');
    f = f.replace(/φ/g, '\\\\varphi ');
    f = f.replace(/ω/g, '\\\\omega ');
    f = f.replace(/Ø/g, '\\\\emptyset ');

    // Fix some specific formatting
    f = f.replace(/\\\\text\{([^}]+)\}/g, '$1'); // remove existing text to avoid double
    
    // If there is text like "für", wrap it
    f = f.replace(/ für /g, ' \\\\text{ für } ');
    f = f.replace(/ und /g, ' \\\\text{ und } ');

    return `formel: '${f}'`;
  });

  fs.writeFileSync(filePath, content, 'utf8');
});
console.log('Done');
