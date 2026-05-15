export type CohortStatus = 'Active' | 'Upcoming' | 'Completed';

export interface CohortTeacher {
  name: string;
  avatar: string;
  title: string;
}

export interface Cohort {
  id: string;
  name: string;
  thumbnail: string;
  cover: string;
  about: string;
  startDate: string;
  endDate: string;
  status: CohortStatus;
  studentCount: number;
  memberCount: number;
  categories: string[];
  teachers: CohortTeacher[];
  trending?: boolean;
}

export const COHORT_CATEGORIES = ['Web Dev', 'Data Science', 'UX Design', 'Product', 'Backend', 'Mobile', 'AI/ML'];

export const cohorts: Cohort[] = [
  {
    id: '1',
    name: 'Web Development — Cohort 5',
    thumbnail: 'https://picsum.photos/seed/c1/400/240',
    cover: 'https://picsum.photos/seed/c1/1200/400',
    about: 'A comprehensive cohort covering modern web development with React, Next.js, and TypeScript. Build real-world projects and get mentored by industry professionals.',
    startDate: '2026-06-01',
    endDate: '2026-09-01',
    status: 'Upcoming',
    studentCount: 24,
    memberCount: 24,
    categories: ['Web Dev'],
    teachers: [{ name: 'Bat-Erdene Gantulga', avatar: 'https://i.pravatar.cc/150?img=11', title: 'Senior Software Engineer' }],
    trending: true,
  },
  {
    id: '2',
    name: 'Data Science — Cohort 3',
    thumbnail: 'https://picsum.photos/seed/c2/400/240',
    cover: 'https://picsum.photos/seed/c2/1200/400',
    about: 'Learn Python, data analysis, and machine learning from experienced data scientists. Work on real datasets and build your portfolio.',
    startDate: '2026-04-15',
    endDate: '2026-07-15',
    status: 'Active',
    studentCount: 18,
    memberCount: 18,
    categories: ['Data Science', 'AI/ML'],
    teachers: [{ name: 'Oyuntsetseg Dorj', avatar: 'https://i.pravatar.cc/150?img=5', title: 'Data Scientist' }],
    trending: true,
  },
  {
    id: '3',
    name: 'UX Design — Cohort 2',
    thumbnail: 'https://picsum.photos/seed/c3/400/240',
    cover: 'https://picsum.photos/seed/c3/1200/400',
    about: 'Master user experience design from research to prototype. Learn Figma, design thinking, and usability testing with real projects.',
    startDate: '2026-01-10',
    endDate: '2026-04-10',
    status: 'Completed',
    studentCount: 15,
    memberCount: 15,
    categories: ['UX Design'],
    teachers: [{ name: 'Munkh-Erdene Bold', avatar: 'https://i.pravatar.cc/150?img=33', title: 'UX/UI Designer' }],
    trending: true,
  },
  {
    id: '4',
    name: 'Product Management — Cohort 1',
    thumbnail: 'https://picsum.photos/seed/c4/400/240',
    cover: 'https://picsum.photos/seed/c4/1200/400',
    about: 'Develop product thinking and strategy skills. Cover roadmapping, stakeholder management, and agile methodologies with industry experts.',
    startDate: '2025-09-01',
    endDate: '2025-12-01',
    status: 'Completed',
    studentCount: 20,
    memberCount: 20,
    categories: ['Product'],
    teachers: [{ name: 'Tsendsuren Namsrai', avatar: 'https://i.pravatar.cc/150?img=15', title: 'Product Manager' }],
    trending: true,
  },
  {
    id: '5',
    name: 'Backend Engineering — Cohort 4',
    thumbnail: 'https://picsum.photos/seed/c5/400/240',
    cover: 'https://picsum.photos/seed/c5/1200/400',
    about: 'Deep dive into backend engineering with Django, PostgreSQL, and REST APIs. Build scalable server-side applications from scratch.',
    startDate: '2026-07-01',
    endDate: '2026-10-01',
    status: 'Upcoming',
    studentCount: 30,
    memberCount: 30,
    categories: ['Backend'],
    teachers: [{ name: 'Enkhjargal Sukhbaatar', avatar: 'https://i.pravatar.cc/150?img=47', title: 'Django & Python Expert' }],
    trending: true,
  },
  {
    id: '6',
    name: 'Mobile Development — Cohort 2',
    thumbnail: 'https://picsum.photos/seed/c6/400/240',
    cover: 'https://picsum.photos/seed/c6/1200/400',
    about: 'Build iOS applications with Swift and SwiftUI. Learn app store deployment, performance optimization, and mobile best practices.',
    startDate: '2026-05-01',
    endDate: '2026-08-01',
    status: 'Active',
    studentCount: 12,
    memberCount: 12,
    categories: ['Mobile'],
    teachers: [{ name: 'Solongo Myagmar', avatar: 'https://i.pravatar.cc/150?img=9', title: 'iOS Developer' }],
  },
];
