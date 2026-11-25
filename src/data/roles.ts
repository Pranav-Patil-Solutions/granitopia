/** Open roles on the careers page. The contact form only prefills known keys. */
export const CAREER_ROLE_KEYS = [
  "quarryLead",
  "exportSales",
  "cncFinisher",
  "logistics",
] as const;

export type CareerRoleKey = (typeof CAREER_ROLE_KEYS)[number];

export function isCareerRoleKey(value: string): value is CareerRoleKey {
  return (CAREER_ROLE_KEYS as readonly string[]).includes(value);
}
