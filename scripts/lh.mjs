// Mobile Lighthouse runner. Usage: node scripts/lh.mjs <url> [url2 ...]
// Prints performance score + LCP (value & element) + CLS + TBT per URL.
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';

const urls = process.argv.slice(2);
const chrome = await launch({
  chromePath: process.env.CHROME_PATH,
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
});

for (const url of urls) {
  const { lhr } = await lighthouse(
    url,
    { port: chrome.port, output: 'json', logLevel: 'error' },
    { extends: 'lighthouse:default', settings: { onlyCategories: ['performance'], formFactor: 'mobile' } },
  );
  const perf = Math.round((lhr.categories.performance.score ?? 0) * 100);
  const lcp = lhr.audits['largest-contentful-paint']?.displayValue ?? '?';
  const cls = lhr.audits['cumulative-layout-shift']?.displayValue ?? '?';
  const tbt = lhr.audits['total-blocking-time']?.displayValue ?? '?';
  const fcp = lhr.audits['first-contentful-paint']?.displayValue ?? '?';
  // Dig out the LCP element node from whatever shape the audit uses.
  const findNode = (audit) => {
    const stack = [...(audit?.details?.items ?? [])];
    while (stack.length) {
      const it = stack.shift();
      if (it?.node) return it.node;
      if (it?.items) stack.push(...it.items);
      if (it?.subItems?.items) stack.push(...it.subItems.items);
    }
    return null;
  };
  const lcpNode = findNode(lhr.audits['largest-contentful-paint-element']);
  const lcpSnippet = (lcpNode?.snippet || lcpNode?.nodeLabel || '(n/a)').replace(/\s+/g, ' ').slice(0, 130);
  const shifters = (lhr.audits['layout-shift-elements']?.details?.items ?? [])
    .slice(0, 4)
    .map((it) => `${(it.node?.snippet || it.node?.nodeLabel || '?').replace(/\s+/g, ' ').slice(0, 70)} [${it.score?.toFixed?.(3) ?? '?'}]`);
  console.log('────────────────────────────────────────────────────────');
  console.log('URL :', url);
  console.log('PERF:', perf, '| FCP:', fcp, '| LCP:', lcp, '| CLS:', cls, '| TBT:', tbt);
  console.log('LCP element:', lcpSnippet);
  if (shifters.length) console.log('Top CLS shifters:\n  - ' + shifters.join('\n  - '));
  if (process.env.DUMP) {
    const fs = await import('node:fs');
    const tag = url.replace(/[^a-z0-9]/gi, '_').slice(0, 40);
    fs.writeFileSync(`/tmp/lhr-${tag}.json`, JSON.stringify(lhr));
    const keys = Object.keys(lhr.audits).filter((k) => /shift|layout|contentful|cls/i.test(k));
    console.log('audit keys:', keys.join(', '));
    console.log('saved /tmp/lhr-' + tag + '.json');
  }
}

await chrome.kill();
