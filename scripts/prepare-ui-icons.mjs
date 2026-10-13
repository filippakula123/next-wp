import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const originals = require('lucide-react');
const files = [];
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(file);
    else if (entry.name.endsWith('.tsx')) files.push(file);
  }
}
await collect('app');
await collect('components');
const names = new Set();
for (const file of files) {
  const content = await readFile(file, 'utf8');
  const source = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
  for (const node of source.statements) {
    if (!ts.isImportDeclaration(node) || !['lucide-react', '@/components/site/icons'].includes(node.moduleSpecifier.text)) continue;
    for (const element of node.importClause?.namedBindings?.elements || []) names.add(element.propertyName?.text || element.name.text);
  }
  const updated = content.replace(/from (["'])lucide-react\1/g, 'from "@/components/site/icons"')
    .replace(/className=(["'])([\s\S]*?)\1/g, (_, quote, value) => `className=${quote}${value.replace(/\s+/g, ' ').trim()}${quote}`);
  if (updated !== content) await writeFile(file, updated);
}
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const id = name => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const sorted = [...names].sort();
const symbols = sorted.map(name => {
  const nodes = originals[name].render({}, null).props.iconNode;
  return `<symbol id="${id(name)}" viewBox="0 0 24 24">${nodes.map(([tag, attributes]) => `<${tag} ${Object.entries(attributes).filter(([key]) => key !== 'key').map(([key, value]) => `${key}="${escape(value)}"`).join(' ')}/>`).join('')}</symbol>`;
});
const svg = `<svg xmlns="http://www.w3.org/2000/svg">${symbols.join('')}</svg>`;
const spritePath = `/luzik/ui-icons-${createHash('sha256').update(svg).digest('hex').slice(0, 12)}.svg`;
await writeFile(`public${spritePath}`, svg);
await writeFile('public/luzik/ui-icons-LICENSE.txt', await readFile('node_modules/lucide-react/LICENSE', 'utf8'));
const code = `// Generated from the original Lucide paths by scripts/prepare-ui-icons.mjs.\nimport type { SVGProps } from 'react';\n\ntype IconProps = SVGProps<SVGSVGElement> & { size?: number | string; absoluteStrokeWidth?: boolean };\nconst sprite = '${spritePath}';\nfunction icon(name: string) {\n  return function StaticIcon({ size = 24, color = 'currentColor', strokeWidth = 2, absoluteStrokeWidth = false, className = '', ...props }: IconProps) {\n    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={\`lucide lucide-\${name} \${className}\`} {...props}><use href={\`\${sprite}#\${name}\`} /></svg>;\n  };\n}\n${sorted.map(name => `export const ${name} = icon('${id(name)}');`).join('\n')}\n`;
await writeFile('components/site/icons.tsx', code);
console.log(`Generated ${sorted.length} cached icons (${Buffer.byteLength(svg)} bytes).`);
