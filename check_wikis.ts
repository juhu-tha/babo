import fs from 'fs';
import path from 'path';

const dir = 'src/modules';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

async function checkUrl(url: string, timeout = 3000): Promise<boolean> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      },
      signal: controller.signal
    });
    clearTimeout(id);
    return res.status === 200 || res.status === 301 || res.status === 302;
  } catch (e) {
    return false;
  }
}

function chunkArray(arr: any[], size: number) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

async function main() {
  const allUrls: {file: string, url: string}[] = [];
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const regex = /url:\s*['"](https:\/\/de\.wikipedia\.org\/wiki\/[^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      allUrls.push({ file, url: match[1] });
    }
  }

  let hasErrors = false;
  const chunks = chunkArray(allUrls, 10);
  
  for (const chunk of chunks) {
    await Promise.all(chunk.map(async ({file, url}) => {
      const ok = await checkUrl(url);
      if (!ok) {
        console.log(`[INVALID] File: ${file} | URL: ${url}`);
        hasErrors = true;
      }
    }));
  }
  
  if (!hasErrors) {
    console.log('All Wikipedia links are valid!');
  }
}

main();
