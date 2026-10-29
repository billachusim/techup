import { describe, expect, it } from "vitest";
import { facultyFieldBoost, fieldKey, FACULTY_FIELD_BOOST } from "../../src/lib/matching";

describe("facultyFieldBoost", () => {
  it("boosts a web student on a React role", () => {
    expect(facultyFieldBoost({ title: "Frontend Developer", required_skills: ["React"] }, "Web Development")).toBe(FACULTY_FIELD_BOOST);
  });
  it("maps plan names to their department", () => {
    expect(fieldKey("Data Wizard")).toBe("data science");
    expect(fieldKey("AI Innovator")).toBe("machine learning");
  });
  it("gives nothing outside the studied field", () => {
    expect(facultyFieldBoost({ title: "Data Analyst", required_skills: ["SQL"] }, "UI/UX Design")).toBe(0);
  });
  it("matches short words only as whole words", () => {
    expect(facultyFieldBoost({ title: "Build engineer", required_skills: ["Maintenance"] }, "UI/UX Design")).toBe(0);
    expect(facultyFieldBoost({ title: "UI designer" }, "UI/UX Design")).toBe(FACULTY_FIELD_BOOST);
  });
  it("gives nothing without a known field", () => {
    expect(facultyFieldBoost({ title: "Web developer" }, null)).toBe(0);
  });
});
