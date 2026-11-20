import { describe, expect, it } from "vitest";
import { isStudentFacultyId } from "@/lib/faculty-id-rules";

describe("which Faculty IDs belong to students and alumni", () => {
  it("counts an ID from registering for a course", () => {
    expect(isStudentFacultyId("programme_enrolment")).toBe(true);
  });
  it("counts an ID staff issued by hand", () => {
    expect(isStudentFacultyId("staff_issued")).toBe(true);
  });
  it("does not count an ID the old talent pages created", () => {
    expect(isStudentFacultyId("talent_marketplace")).toBe(false);
  });
  it("counts a talent-page ID once the person enrolled with it", () => {
    expect(isStudentFacultyId("talent_marketplace", true)).toBe(true);
  });
});
