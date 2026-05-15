export interface MasterClassSection {
  title: string;
  duration: string;
  description?: string;
}

export interface MasterClassTeacher {
  name: string;
  avatar: string;
  title: string;
  bio: string;
}

export interface MasterClass {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  duration: string;
  price: number | null;
  categories: string[];
  about: string;
  sections: MasterClassSection[];
  teacher: MasterClassTeacher;
  trending?: boolean;
}

export const MASTERCLASS_CATEGORIES = ['Web Dev', 'Data Science', 'UX Design', 'Product', 'Backend', 'DevOps', 'Mobile', 'Security'];

export const masterClasses: MasterClass[] = [
  {
    id: '1', title: 'Full-Stack Web Development with Next.js', instructor: 'Bat-Erdene Gantulga',
    thumbnail: 'https://picsum.photos/seed/mc1/400/240', duration: '3h 20m', price: 49,
    categories: ['Web Dev'],
    about: 'Build full-stack applications with Next.js 14, TypeScript, and Tailwind CSS. Learn server-side rendering, API routes, and deployment on Vercel.',
    sections: [
      { title: 'Introduction & Setup', duration: '15m', description: 'Project overview and environment setup' },
      { title: 'Next.js App Router', duration: '45m', description: 'Pages, layouts, and routing fundamentals' },
      { title: 'Data Fetching', duration: '40m', description: 'Server components, suspense, and caching' },
      { title: 'API Routes & Backend', duration: '50m', description: 'Building REST endpoints with Next.js' },
      { title: 'Authentication', duration: '35m', description: 'Implementing NextAuth.js' },
      { title: 'Deployment & CI/CD', duration: '15m', description: 'Deploying to Vercel with GitHub Actions' },
    ],
    teacher: { name: 'Bat-Erdene Gantulga', avatar: 'https://i.pravatar.cc/150?img=11', title: 'Senior Software Engineer', bio: '8+ years building scalable web apps. Contributor to Next.js ecosystem and open-source projects.' },
    trending: true,
  },
  {
    id: '2', title: 'Machine Learning for Beginners', instructor: 'Oyuntsetseg Dorj',
    thumbnail: 'https://picsum.photos/seed/mc2/400/240', duration: '4h 10m', price: 59,
    categories: ['Data Science'],
    about: 'A hands-on introduction to machine learning with Python. Covers supervised learning, model evaluation, and real-world datasets.',
    sections: [
      { title: 'Python & NumPy Basics', duration: '30m' },
      { title: 'Data Exploration with Pandas', duration: '40m' },
      { title: 'Linear Regression', duration: '35m' },
      { title: 'Classification Models', duration: '50m' },
      { title: 'Model Evaluation', duration: '30m' },
      { title: 'Intro to Neural Networks', duration: '45m' },
    ],
    teacher: { name: 'Oyuntsetseg Dorj', avatar: 'https://i.pravatar.cc/150?img=5', title: 'Data Scientist', bio: 'NLP and ML specialist with experience at top tech companies across Asia.' },
    trending: true,
  },
  {
    id: '3', title: 'UI/UX Design Fundamentals', instructor: 'Munkh-Erdene Bold',
    thumbnail: 'https://picsum.photos/seed/mc3/400/240', duration: '2h 45m', price: 39,
    categories: ['UX Design'],
    about: 'Learn the core principles of user interface and user experience design. From wireframes to high-fidelity prototypes in Figma.',
    sections: [
      { title: 'Design Thinking Overview', duration: '20m' },
      { title: 'User Research Methods', duration: '30m' },
      { title: 'Wireframing & Information Architecture', duration: '35m' },
      { title: 'Figma Prototyping', duration: '45m' },
      { title: 'Usability Testing', duration: '25m' },
    ],
    teacher: { name: 'Munkh-Erdene Bold', avatar: 'https://i.pravatar.cc/150?img=33', title: 'UX/UI Designer', bio: 'Cognitive psychology background applied to digital design. 6 years of design systems experience.' },
    trending: true,
  },
  {
    id: '4', title: 'Product Management in Practice', instructor: 'Tsendsuren Namsrai',
    thumbnail: 'https://picsum.photos/seed/mc4/400/240', duration: '2h 00m', price: null,
    categories: ['Product'],
    about: 'Free masterclass covering the fundamentals of product management. Learn how to define vision, prioritize features, and align teams.',
    sections: [
      { title: 'What is Product Management?', duration: '20m' },
      { title: 'Writing a Product Brief', duration: '25m' },
      { title: 'Prioritization Frameworks', duration: '30m' },
      { title: 'Working with Engineering', duration: '25m' },
      { title: 'Measuring Success', duration: '20m' },
    ],
    teacher: { name: 'Tsendsuren Namsrai', avatar: 'https://i.pravatar.cc/150?img=15', title: 'Product Manager', bio: '7 years in B2B SaaS product management. Shipped products used by 200k+ users.' },
    trending: true,
  },
  {
    id: '5', title: 'Django REST API Mastery', instructor: 'Enkhjargal Sukhbaatar',
    thumbnail: 'https://picsum.photos/seed/mc5/400/240', duration: '5h 30m', price: 69,
    categories: ['Backend'],
    about: 'Master Django REST Framework from models and serializers to authentication and deployment. Build a production-ready API by the end.',
    sections: [
      { title: 'Django Models & ORM', duration: '50m' },
      { title: 'Serializers & Viewsets', duration: '55m' },
      { title: 'Authentication & Permissions', duration: '45m' },
      { title: 'Filtering & Pagination', duration: '30m' },
      { title: 'Testing with pytest', duration: '40m' },
      { title: 'Deployment to Render', duration: '30m' },
    ],
    teacher: { name: 'Enkhjargal Sukhbaatar', avatar: 'https://i.pravatar.cc/150?img=47', title: 'Django & Python Expert', bio: 'Open-source contributor and backend architect with deep Django expertise.' },
    trending: true,
  },
  {
    id: '6', title: 'DevOps with Docker & Kubernetes', instructor: 'Gantulga Baatar',
    thumbnail: 'https://picsum.photos/seed/mc6/400/240', duration: '6h 00m', price: 79,
    categories: ['DevOps'],
    about: 'From zero to production with Docker and Kubernetes. Covers containerization, orchestration, CI/CD pipelines, and cloud deployment.',
    sections: [
      { title: 'Docker Fundamentals', duration: '60m' },
      { title: 'Docker Compose', duration: '45m' },
      { title: 'Kubernetes Architecture', duration: '60m' },
      { title: 'Deploying with Helm', duration: '45m' },
      { title: 'CI/CD with GitHub Actions', duration: '50m' },
      { title: 'Monitoring & Logging', duration: '40m' },
    ],
    teacher: { name: 'Gantulga Baatar', avatar: 'https://i.pravatar.cc/150?img=22', title: 'DevOps Engineer', bio: 'Cloud infrastructure engineer specializing in AWS, GCP, and container orchestration.' },
  },
  {
    id: '7', title: 'SwiftUI for iOS Development', instructor: 'Solongo Myagmar',
    thumbnail: 'https://picsum.photos/seed/mc7/400/240', duration: '3h 50m', price: 55,
    categories: ['Mobile'],
    about: 'Build beautiful iOS apps with SwiftUI. Covers state management, navigation, animations, and App Store submission.',
    sections: [
      { title: 'SwiftUI Basics', duration: '35m' },
      { title: 'State & Data Flow', duration: '40m' },
      { title: 'Navigation & Tabs', duration: '30m' },
      { title: 'Networking with URLSession', duration: '35m' },
      { title: 'Animations & Transitions', duration: '30m' },
      { title: 'App Store Submission', duration: '20m' },
    ],
    teacher: { name: 'Solongo Myagmar', avatar: 'https://i.pravatar.cc/150?img=9', title: 'iOS Developer', bio: '5 years of App Store experience with apps reaching 500k+ downloads.' },
  },
  {
    id: '8', title: 'Web Security & OWASP Top 10', instructor: 'Ankhbayar Galsandorj',
    thumbnail: 'https://picsum.photos/seed/mc8/400/240', duration: '2h 30m', price: null,
    categories: ['Security'],
    about: 'Free masterclass on web application security. Learn the OWASP Top 10 vulnerabilities and how to prevent them in your applications.',
    sections: [
      { title: 'Introduction to Web Security', duration: '20m' },
      { title: 'Injection Attacks', duration: '25m' },
      { title: 'Authentication Flaws', duration: '20m' },
      { title: 'XSS & CSRF', duration: '25m' },
      { title: 'Security Misconfiguration', duration: '20m' },
      { title: 'Secure Development Practices', duration: '20m' },
    ],
    teacher: { name: 'Ankhbayar Galsandorj', avatar: 'https://i.pravatar.cc/150?img=52', title: 'Cybersecurity Analyst', bio: 'Certified ethical hacker and OWASP contributor. 6 years of penetration testing experience.' },
  },
];
