/**
 * Faculty IDs belong to Tech Faculty students and alumni (from registering for a
 * course) or are issued by staff. IDs the old talent pages created
 * (source "talent_marketplace") never count, unless the person later enrolled with it.
 * Mirrors public.is_student_faculty_id() in the database.
 */
export const TALENT_PAGE_ID_SOURCE = "talent_marketplace";

export function isStudentFacultyId(source: string | null | undefined, hasEnrollment = false): boolean {
  return hasEnrollment || (source ?? "") !== TALENT_PAGE_ID_SOURCE;
}
