import { readFile } from 'node:fs/promises';

if (process.argv[2] === '--head') {
  const response = await fetch(process.argv[3]);
  const html = await response.text();
  console.log(html.slice(0, html.indexOf('</head>') + 7));
  console.log('link header', response.headers.get('link'));
} else if (process.argv[2] === '--headers') {
  for (const base of process.argv.slice(3)) {
    const document = await fetch(base);
    const html = await document.text();
    const assets = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)].map(match => match[1]);
    for (const path of ['/', ...assets.slice(0, 3)]) {
      const response = await fetch(new URL(path, base), { headers: { 'Accept-Encoding': 'gzip, br' } });
      console.log(JSON.stringify({ base, path, status: response.status, encoding: response.headers.get('content-encoding'), length: response.headers.get('content-length'), server: response.headers.get('server'), cache: response.headers.get('cache-control') }));
      await response.arrayBuffer();
    }
  }
} else {
  for (const file of process.argv.slice(2)) {
    const report = JSON.parse(await readFile(file, 'utf8'));
    const audits = report.audits;
    const requests = audits['network-requests']?.details?.items || [];
    console.log(JSON.stringify({ file, url: report.finalDisplayedUrl, score: Math.round(report.categories.performance.score * 100),
      metrics: Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index'].map(id => [id, audits[id]?.numericValue])),
      lcp: audits['lcp-breakdown-insight']?.details,
      transfer: Object.fromEntries(['Document', 'Script', 'Stylesheet', 'Font', 'Image'].map(type => [type, requests.filter(item => item.resourceType === type).reduce((sum, item) => sum + item.transferSize, 0)])),
    }));
  }
}
