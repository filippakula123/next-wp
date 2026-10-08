import { describe, expect, it } from "vitest";
import { buildLuzikSiteData } from "@/lib/luzik-settings";
import { organizationSchemaFor, pageSchema, luzikPageMetadata } from "@/lib/luzik-seo";

describe("WordPress school settings", () => {
  it("updates contact links, course date, individual prices and structured data together", () => {
    const data = buildLuzikSiteData({ course_date: "2026-11-09", course_time: "17:30", phone: "+48 700 000 123", email: "biuro@example.com", address: "Kielce, ul. Testowa 2", floor: "II piętro", opens: "09:00", price_b: 4100, price_a2: 3100, lesson_a2: 180 });
    expect(data.header).toMatchObject({ courseDateLabel: "09.11.2026", courseLabel: "Najbliższy kurs 09.11 g.17.30", phoneHref: "tel:+48700000123", officeAddress: "Kielce, ul. Testowa 2 · II piętro" });
    expect(data.courses.find(course => course.id === "b")?.price).toBe(4100);
    expect(data.courses.find(course => course.id === "a2")?.price).toBe(3100);
    expect(data.lessons[3].price).toBe("150 / 180");
    expect(organizationSchemaFor(data)["@graph"][0]).toMatchObject({ telephone: "+48700000123", email: "biuro@example.com", address: { streetAddress: "ul. Testowa 2" }, openingHoursSpecification: { opens: "09:00" } });
    expect(pageSchema("kursy-prawa-jazdy-kategorii-b", data.courses)["@graph"].find(node => node["@type"] === "Course")).toMatchObject({ offers: { price: 4100 } });
    expect(luzikPageMetadata("kontakt", data).description).toContain("ul. Testowa 2, II piętro");
    expect(luzikPageMetadata("kontakt", data).description).toContain("biuro@example.com");
    expect(pageSchema("kontakt", data.courses, data)["@graph"][0].description).toBe(luzikPageMetadata("kontakt", data).description);
  });

  it("retains working defaults for malformed or unavailable settings", () => {
    const defaults = buildLuzikSiteData();
    expect(buildLuzikSiteData(null)).toEqual(defaults);
    const data = buildLuzikSiteData({ course_date: "2026-02-30", course_time: "24:30", phone: "javascript:alert(1)", email: "invalid", facebook: "javascript:alert(1)", price_b: -1, price_a2: "free", lesson_am: 0 });
    expect(data).toEqual(defaults);
  });
});
