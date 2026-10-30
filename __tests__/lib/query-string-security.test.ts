import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import queryString from "query-string";

describe("query-string decoding security", () => {
  it("decodes ordinary Polish query parameters", () => {
    expect(queryString.parse("q=Za%C5%BC%C3%B3%C5%82%C4%87+g%C4%99%C5%9Bl%C4%85").q)
      .toBe("Zażółć gęślą");
  });

  it("handles many distinct encoded runs with malformed input without blocking", () => {
    // Isolate the synchronous decoder so an affected dependency cannot hang Vitest.
    const output = execFileSync(process.execPath, ["--input-type=module", "-e", `
      import queryString from 'query-string';
      const byte = value => value.toString(16).padStart(2, '0');
      const runs = Array.from({ length: 32000 }, (_, index) =>
        '%' + byte(index >>> 8) + '%' + byte(index & 255) + 'x');
      const parsed = queryString.parse('value=' + runs.join('') + '%zz');
      if (typeof parsed.value !== 'string' || !parsed.value.endsWith('%zz')) {
        throw new Error('Malformed percent sequences must be preserved');
      }
      process.stdout.write('decoded');
    `], { cwd: process.cwd(), timeout: 10000, encoding: "utf8" });
    expect(output).toBe("decoded");
  }, 15000);
});
