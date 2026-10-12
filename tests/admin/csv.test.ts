import { describe, expect, it } from "vitest";
import { csvCell, csvFilename, toCsv } from "../../src/lib/csv";

describe("csv export", () => {
  it("quotes commas, quotes and new lines", () => {
    expect(csvCell('Ada, "the" coder')).toBe('"Ada, ""the"" coder"');
    expect(csvCell("line one\nline two")).toBe('"line one\nline two"');
    expect(csvCell(null)).toBe("");
    expect(csvCell(150000)).toBe("150000");
  });

  it("neutralises text that a spreadsheet would run as a formula", () => {
    expect(csvCell('=HYPERLINK("http://x")')).toBe(
      '"\'=HYPERLINK(""http://x"")"',
    );
    expect(csvCell("+1+cmd|' /C calc'!A0")).toBe("'+1+cmd|' /C calc'!A0");
    expect(csvCell("-12.50")).toBe("-12.50");
    expect(csvCell("@ada")).toBe("'@ada");
    expect(csvCell(-5)).toBe("-5");
  });

  it("leaves phone numbers as typed", () => {
    expect(csvCell("+234 801 234 5678")).toBe("+234 801 234 5678");
  });

  it("builds a header row and one line per row", () => {
    const csv = toCsv(
      [
        { n: "Ada", a: 1 },
        { n: "Bo", a: null },
      ],
      [
        { header: "Name", value: (r) => r.n },
        { header: "Amount", value: (r) => r.a },
      ],
    );
    expect(csv).toBe("Name,Amount\r\nAda,1\r\nBo,");
  });

  it("names files by local date", () => {
    expect(csvFilename("leads-new", new Date(2026, 9, 2))).toBe(
      "leads-new-2026-10-02.csv",
    );
  });
});
