export interface Mentor {
  id: string;
  name: string;
  title: string;
  expertise: string;
  avatar: string;
  rating: number;
  reviewCount: number;
}

export const mentors: Mentor[] = [
  { id: '1', name: 'Bat-Erdene Gantulga', title: 'Senior Software Engineer', expertise: 'React, TypeScript, Node.js', avatar: 'https://i.pravatar.cc/150?img=11', rating: 4.9, reviewCount: 42 },
  { id: '2', name: 'Oyuntsetseg Dorj', title: 'Data Scientist', expertise: 'Python, Machine Learning, SQL', avatar: 'https://i.pravatar.cc/150?img=5', rating: 4.7, reviewCount: 31 },
  { id: '3', name: 'Munkh-Erdene Bold', title: 'UX/UI Designer', expertise: 'Figma, Design Systems, Research', avatar: 'https://i.pravatar.cc/150?img=33', rating: 4.8, reviewCount: 27 },
  { id: '4', name: 'Tsendsuren Namsrai', title: 'Product Manager', expertise: 'Agile, Roadmapping, B2B SaaS', avatar: 'https://i.pravatar.cc/150?img=15', rating: 4.6, reviewCount: 19 },
  { id: '5', name: 'Enkhjargal Sukhbaatar', title: 'Django & Python Expert', expertise: 'Django, PostgreSQL, REST APIs', avatar: 'https://i.pravatar.cc/150?img=47', rating: 4.9, reviewCount: 55 },
  { id: '6', name: 'Gantulga Baatar', title: 'DevOps Engineer', expertise: 'AWS, Docker, Kubernetes', avatar: 'https://i.pravatar.cc/150?img=22', rating: 4.5, reviewCount: 14 },
  { id: '7', name: 'Solongo Myagmar', title: 'iOS Developer', expertise: 'Swift, SwiftUI, Xcode', avatar: 'https://i.pravatar.cc/150?img=9', rating: 4.7, reviewCount: 23 },
  { id: '8', name: 'Ankhbayar Galsandorj', title: 'Cybersecurity Analyst', expertise: 'Penetration Testing, OWASP, Linux', avatar: 'https://i.pravatar.cc/150?img=52', rating: 4.8, reviewCount: 38 },
];
