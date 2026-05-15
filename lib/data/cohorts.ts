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
  {
    id: '7',
    name: 'AI/ML Engineering — Cohort 1',
    thumbnail: 'https://picsum.photos/seed/c7/400/240',
    cover: 'https://picsum.photos/seed/c7/1200/400',
    about: 'Hands-on cohort covering machine learning fundamentals, deep learning with PyTorch, and deploying ML models to production. Work on real industry problems with mentorship.',
    startDate: '2026-08-01',
    endDate: '2026-11-01',
    status: 'Upcoming',
    studentCount: 20,
    memberCount: 20,
    categories: ['AI/ML', 'Data Science'],
    teachers: [{ name: 'Oyuntsetseg Dorj', avatar: 'https://i.pravatar.cc/150?img=5', title: 'Data Scientist' }],
    trending: true,
  },
  {
    id: '8',
    name: 'Node.js Backend — Cohort 2',
    thumbnail: 'https://picsum.photos/seed/c8/400/240',
    cover: 'https://picsum.photos/seed/c8/1200/400',
    about: 'Build scalable backend services with Node.js, Express, and PostgreSQL. Cover authentication, REST APIs, WebSockets, and cloud deployment strategies.',
    startDate: '2026-06-15',
    endDate: '2026-09-15',
    status: 'Upcoming',
    studentCount: 22,
    memberCount: 22,
    categories: ['Backend'],
    teachers: [{ name: 'Davaanyam Erdenebileg', avatar: 'https://i.pravatar.cc/150?img=60', title: 'Node.js Expert' }],
  },
  {
    id: '9',
    name: 'React Native — Cohort 1',
    thumbnail: 'https://picsum.photos/seed/c9/400/240',
    cover: 'https://picsum.photos/seed/c9/1200/400',
    about: 'Cross-platform mobile development with React Native and Expo. Go from zero to published app on both iOS and Android with real-world project experience.',
    startDate: '2026-03-01',
    endDate: '2026-06-01',
    status: 'Active',
    studentCount: 16,
    memberCount: 16,
    categories: ['Mobile'],
    teachers: [{ name: 'Solongo Myagmar', avatar: 'https://i.pravatar.cc/150?img=9', title: 'iOS & React Native Developer' }],
    trending: true,
  },
  {
    id: '10',
    name: 'Security Engineering — Cohort 1',
    thumbnail: 'https://picsum.photos/seed/c10/400/240',
    cover: 'https://picsum.photos/seed/c10/1200/400',
    about: 'Cybersecurity fundamentals cohort covering ethical hacking, OWASP Top 10, network security, and secure coding practices for developers.',
    startDate: '2025-10-01',
    endDate: '2026-01-01',
    status: 'Completed',
    studentCount: 14,
    memberCount: 14,
    categories: ['Web Dev'],
    teachers: [{ name: 'Ankhbayar Galsandorj', avatar: 'https://i.pravatar.cc/150?img=52', title: 'Cybersecurity Analyst' }],
  },
];
