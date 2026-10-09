import { describe, expect, it } from "vitest";
import { metadataCrawlerPattern } from "@/lib/luzik-crawlers";

describe("complete crawler metadata", () => {
  it("covers search, AI search and social previews", () => {
    for (const agent of ["Googlebot", "Google-InspectionTool", "Bingbot", "OAI-SearchBot", "GPTBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "facebookexternalhit", "Twitterbot", "Slackbot", "LinkedInBot", "Chrome-Lighthouse", "Slurp", "SkypeUriPreview", "WhatsApp"]) {
      expect(metadataCrawlerPattern.test(agent), agent).toBe(true);
    }
  });
  it("preserves metadata streaming for normal browser visits", () => {
    expect(metadataCrawlerPattern.test("Mozilla/5.0 Chrome/130.0.0.0 Safari/537.36")).toBe(false);
  });
});
