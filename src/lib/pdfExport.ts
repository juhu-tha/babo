import { jsPDF } from 'jspdf';
import * as htmlToImage from 'html-to-image';

export const exportToPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Show PDF header
  const header = element.querySelector('.pdf-header') as HTMLElement;
  if (header) {
    header.classList.remove('hidden');
    header.classList.add('block');
  }

  // Append appendix with formulas and parameters
  const appendix = document.createElement('div');
  appendix.className = 'pdf-appendix mt-8 p-6 bg-white rounded-xl border border-home-grau/20 break-inside-avoid';
  appendix.innerHTML = `
    <h2 class="text-xl font-bold text-text-main mb-6">Verwendete Parameter & Formeln</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 class="text-sm font-bold uppercase tracking-wider text-text-main/70 mb-4">Parameter</h3>
        <ul class="space-y-2 text-sm" id="pdf-param-list"></ul>
      </div>
      <div>
        <h3 class="text-sm font-bold uppercase tracking-wider text-text-main/70 mb-4">Formeln</h3>
        <ul class="space-y-3 text-sm" id="pdf-formula-list"></ul>
      </div>
    </div>
  `;

  // Extract parameters
  const paramList = appendix.querySelector('#pdf-param-list')!;
  const parameters = element.querySelectorAll('.pdf-parameter');
  let hasParams = false;
  
  // Use a Map to keep unique parameters by label
  const uniqueParams = new Map<string, {val: string, unit: string, html: string}>();
  parameters.forEach(param => {
    const labelEl = param.querySelector('.pdf-parameter-label');
    const val = param.getAttribute('data-value');
    const unit = param.getAttribute('data-unit') || '';
    if (labelEl && val) {
      const labelText = labelEl.textContent || '';
      uniqueParams.set(labelText, {val, unit, html: labelEl.innerHTML});
    }
  });

  if (uniqueParams.size > 0) {
    uniqueParams.forEach(({val, unit, html}) => {
      hasParams = true;
      const li = document.createElement('li');
      li.className = 'flex justify-between items-center border-b border-home-grau/10 pb-1';
      li.innerHTML = `<span>${html}</span> <span class="font-bold">${val} ${unit}</span>`;
      paramList.appendChild(li);
    });
  } else {
    paramList.innerHTML = '<li class="text-home-grau italic">Keine anpassbaren Parameter gefunden.</li>';
  }

  // Extract formulas
  const formulaList = appendix.querySelector('#pdf-formula-list')!;
  const formulas = element.querySelectorAll('.pdf-formula');
  const uniqueFormulas = new Map<string, string>();
  
  formulas.forEach(f => {
    const rawText = f.getAttribute('data-formula');
    if (rawText && !uniqueFormulas.has(rawText)) {
      uniqueFormulas.set(rawText, f.innerHTML);
    }
  });

  if (uniqueFormulas.size > 0) {
    uniqueFormulas.forEach((html) => {
      const li = document.createElement('li');
      li.className = 'bg-off-white p-3 rounded-lg border border-home-grau/10 break-inside-avoid flex items-center justify-center';
      // Some formula spans might use katex CSS, which we need to retain
      // But html contains the inner spans. That works.
      li.innerHTML = html;
      formulaList.appendChild(li);
    });
  } else {
    formulaList.innerHTML = '<li class="text-home-grau italic">Keine Berechnungsgleichungen gefunden.</li>';
  }

  element.appendChild(appendix);

  try {
    const dataUrl = await htmlToImage.toJpeg(element, {
      quality: 0.95,
      backgroundColor: '#F8F9FA',
      pixelRatio: 1.5,
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasToPdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;

    let heightLeft = canvasToPdfHeight;
    let position = 0;

    pdf.addImage(dataUrl, 'JPEG', 0, position, pdfWidth, canvasToPdfHeight);
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - canvasToPdfHeight;
      pdf.addPage();
      pdf.addImage(dataUrl, 'JPEG', 0, position, pdfWidth, canvasToPdfHeight);
      heightLeft -= pdfHeight;
    }

    try {
      pdf.save(`${filename}.pdf`);
    } catch (e) {
      console.warn("Failed to trigger direct download, attempting blob download fallback", e);
      try {
        const blob = pdf.output('blob');
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${filename}.pdf`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      } catch (fallbackError) {
        console.error("Fallback download failed", fallbackError);
        const fallbackUrl = pdf.output('bloburl').toString();
        const fallbackLink = document.createElement('a');
        fallbackLink.href = fallbackUrl;
        fallbackLink.download = `${filename}.pdf`;
        fallbackLink.target = '_blank';
        document.body.appendChild(fallbackLink);
        fallbackLink.click();
        document.body.removeChild(fallbackLink);
      }
    }
  } catch (error: any) {
    console.error('PDF Export failed:', error);
  } finally {
    if (appendix && appendix.parentNode) {
      appendix.parentNode.removeChild(appendix);
    }
    // Hide PDF header again
    if (header) {
      header.classList.remove('block');
      header.classList.add('hidden');
    }
  }
};
