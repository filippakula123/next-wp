import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
// Resolve the installed transitive dependency, so the test also verifies pnpm applied the patch.
const braces = require('braces');

describe('braces CVE-2026-93687 depth guard', () => {
  it('preserves ordinary patterns, ranges and stringify behavior', () => {
    expect(braces.expand('src/{app,lib}/*.{ts,tsx}')).toEqual([
      'src/app/*.ts', 'src/app/*.tsx', 'src/lib/*.ts', 'src/lib/*.tsx',
    ]);
    expect(braces.expand('file-{1..3}.txt')).toEqual(['file-1.txt', 'file-2.txt', 'file-3.txt']);
    expect(braces.compile('src/{app,lib}/file')).toBe('src/(app|lib)/file');
    expect(braces.stringify(braces.parse('src/{app,lib}/file'))).toBe('src/{app,lib}/file');
  });
  it('rejects deep brace and parenthesis strings before recursive traversal', () => {
    for (const [open, close] of [['{', '}'], ['(', ')']]) {
      // Stay below braces' existing 10,000-character limit: that limit alone
      // does not protect recursive walkers from deeply nested short input.
      const pattern = open.repeat(4000) + 'a,b' + close.repeat(4000);
      for (const operation of [braces.parse, braces.compile, braces.expand, braces.stringify]) {
        expect(() => operation(pattern)).toThrow('Brace nesting exceeds the safety limit');
        expect(() => operation(pattern)).toThrow(SyntaxError);
      }
    }
  });
  it('also bounds traversal of supplied ASTs and cycles', () => {
    let ast: Record<string, unknown> = { type: 'root', nodes: [] };
    for (let i = 0; i < 5000; i++) ast = { type: 'root', nodes: [ast] };
    for (const operation of [braces.compile, braces.expand, braces.stringify]) {
      expect(() => operation(ast)).toThrow('Brace nesting exceeds the safety limit');
    }
    const cyclic = { type: 'root', nodes: [] as unknown[] };
    cyclic.nodes.push(cyclic);
    for (const operation of [braces.compile, braces.expand, braces.stringify]) {
      expect(() => operation(cyclic)).toThrow('Brace nesting exceeds the safety limit');
    }
  });
});
