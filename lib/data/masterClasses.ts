export interface MasterClass {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  duration: string;
  price: number | null;
}

export const masterClasses: MasterClass[] = [
  { id: '1', title: 'Full-Stack Web Development with Next.js', instructor: 'Bat-Erdene Gantulga', thumbnail: 'https://picsum.photos/seed/mc1/400/240', duration: '3h 20m', price: 49 },
  { id: '2', title: 'Machine Learning for Beginners', instructor: 'Oyuntsetseg Dorj', thumbnail: 'https://picsum.photos/seed/mc2/400/240', duration: '4h 10m', price: 59 },
  { id: '3', title: 'UI/UX Design Fundamentals', instructor: 'Munkh-Erdene Bold', thumbnail: 'https://picsum.photos/seed/mc3/400/240', duration: '2h 45m', price: 39 },
  { id: '4', title: 'Product Management in Practice', instructor: 'Tsendsuren Namsrai', thumbnail: 'https://picsum.photos/seed/mc4/400/240', duration: '2h 00m', price: null },
  { id: '5', title: 'Django REST API Mastery', instructor: 'Enkhjargal Sukhbaatar', thumbnail: 'https://picsum.photos/seed/mc5/400/240', duration: '5h 30m', price: 69 },
  { id: '6', title: 'DevOps with Docker & Kubernetes', instructor: 'Gantulga Baatar', thumbnail: 'https://picsum.photos/seed/mc6/400/240', duration: '6h 00m', price: 79 },
  { id: '7', title: 'SwiftUI for iOS Development', instructor: 'Solongo Myagmar', thumbnail: 'https://picsum.photos/seed/mc7/400/240', duration: '3h 50m', price: 55 },
  { id: '8', title: 'Web Security & OWASP Top 10', instructor: 'Ankhbayar Galsandorj', thumbnail: 'https://picsum.photos/seed/mc8/400/240', duration: '2h 30m', price: null },
];
