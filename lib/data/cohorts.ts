export type CohortStatus = 'Active' | 'Upcoming' | 'Completed';

export interface Cohort {
  id: string;
  name: string;
  thumbnail: string;
  startDate: string;
  status: CohortStatus;
  studentCount: number;
}

export const cohorts: Cohort[] = [
  { id: '1', name: 'Web Development — Cohort 5', thumbnail: 'https://picsum.photos/seed/c1/400/240', startDate: '2026-06-01', status: 'Upcoming', studentCount: 24 },
  { id: '2', name: 'Data Science — Cohort 3', thumbnail: 'https://picsum.photos/seed/c2/400/240', startDate: '2026-04-15', status: 'Active', studentCount: 18 },
  { id: '3', name: 'UX Design — Cohort 2', thumbnail: 'https://picsum.photos/seed/c3/400/240', startDate: '2026-01-10', status: 'Completed', studentCount: 15 },
  { id: '4', name: 'Product Management — Cohort 1', thumbnail: 'https://picsum.photos/seed/c4/400/240', startDate: '2025-09-01', status: 'Completed', studentCount: 20 },
  { id: '5', name: 'Backend Engineering — Cohort 4', thumbnail: 'https://picsum.photos/seed/c5/400/240', startDate: '2026-07-01', status: 'Upcoming', studentCount: 30 },
  { id: '6', name: 'Mobile Development — Cohort 2', thumbnail: 'https://picsum.photos/seed/c6/400/240', startDate: '2026-05-01', status: 'Active', studentCount: 12 },
];
