import { describe, expect, it } from "vitest";
import { isLuzikLanguage, storedLanguage, translatedNavigation, luzikLanguages } from "@/lib/luzik-languages";

describe("automatic browser translation", () => {
  it("supports the five requested languages and rejects invalid saved values", () => {
    expect(luzikLanguages.map(item => item.code)).toEqual(["pl", "en", "de", "it", "uk"]);
    expect(isLuzikLanguage("uk")).toBe(true);
    expect(storedLanguage("ru")).toBe("pl");
    expect(storedLanguage(null)).toBe("pl");
    expect(storedLanguage("de")).toBe("de");
  });
  it("reloads internal routes and filters without intercepting anchors, mail, or external destinations", () => {
    const page = "https://luzikkielce.pl/cennik";
    expect(translatedNavigation("/kontakt", page)).toBe("https://luzikkielce.pl/kontakt");
    expect(translatedNavigation("/blog?page=2", page)).toBe("https://luzikkielce.pl/blog?page=2");
    expect(translatedNavigation("#cena-b", page)).toBe(null);
    expect(translatedNavigation("/cennik#cena-b", page)).toBe(null);
    expect(translatedNavigation("https://example.com", page)).toBe(null);
    expect(translatedNavigation("mailto:autoluzik@wp.pl", page)).toBe(null);
    expect(translatedNavigation("tel:+48504166557", page)).toBe(null);
  });
});
