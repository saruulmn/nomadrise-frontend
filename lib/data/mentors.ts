export interface Mentor {
  id: string;
  name: string;
  title: string;
  expertise: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  skills: string[];
  bio: string;
  introVideoUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  price: number;
  meetingsPerMonth: number;
  trending?: boolean;
}

export const MENTOR_SKILLS = ['React', 'TypeScript', 'Python', 'Machine Learning', 'UX Design', 'Product', 'Django', 'DevOps', 'iOS', 'Security', 'Node.js', 'SQL'];

export const mentors: Mentor[] = [
  {
    id: '1', name: 'Bat-Erdene Gantulga', title: 'Senior Software Engineer', expertise: 'React, TypeScript, Node.js',
    avatar: 'https://i.pravatar.cc/150?img=11', rating: 4.9, reviewCount: 42,
    skills: ['React', 'TypeScript', 'Node.js'],
    bio: 'Passionate software engineer with 8+ years of experience building scalable web applications. I love helping developers level up their React and TypeScript skills through hands-on mentorship and real project work.',
    introVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    linkedinUrl: 'https://linkedin.com/in/bat-erdene',
    websiteUrl: 'https://bat-erdene.dev',
    price: 80, meetingsPerMonth: 4, trending: true,
  },
  {
    id: '2', name: 'Oyuntsetseg Dorj', title: 'Data Scientist', expertise: 'Python, Machine Learning, SQL',
    avatar: 'https://i.pravatar.cc/150?img=5', rating: 4.7, reviewCount: 31,
    skills: ['Python', 'Machine Learning', 'SQL'],
    bio: 'Data scientist specializing in NLP and predictive modeling. Worked at top tech companies across Asia. I help students navigate the ML landscape and build portfolio-worthy projects.',
    linkedinUrl: 'https://linkedin.com/in/oyuntsetseg',
    price: 70, meetingsPerMonth: 4, trending: true,
  },
  {
    id: '3', name: 'Munkh-Erdene Bold', title: 'UX/UI Designer', expertise: 'Figma, Design Systems, Research',
    avatar: 'https://i.pravatar.cc/150?img=33', rating: 4.8, reviewCount: 27,
    skills: ['UX Design', 'Figma'],
    bio: 'Designer with a background in cognitive psychology. I help designers build systematic thinking and create user-centered products. Figma expert with 6 years of design systems experience.',
    linkedinUrl: 'https://linkedin.com/in/munkh-erdene',
    websiteUrl: 'https://munkh-erdene.design',
    price: 65, meetingsPerMonth: 4, trending: true,
  },
  {
    id: '4', name: 'Tsendsuren Namsrai', title: 'Product Manager', expertise: 'Agile, Roadmapping, B2B SaaS',
    avatar: 'https://i.pravatar.cc/150?img=15', rating: 4.6, reviewCount: 19,
    skills: ['Product'],
    bio: 'Product manager with 7 years in B2B SaaS. I guide aspiring PMs from ideation to launch, covering roadmapping, metrics, and stakeholder alignment.',
    linkedinUrl: 'https://linkedin.com/in/tsendsuren',
    price: 75, meetingsPerMonth: 2, trending: true,
  },
  {
    id: '5', name: 'Enkhjargal Sukhbaatar', title: 'Django & Python Expert', expertise: 'Django, PostgreSQL, REST APIs',
    avatar: 'https://i.pravatar.cc/150?img=47', rating: 4.9, reviewCount: 55,
    skills: ['Django', 'Python', 'SQL'],
    bio: 'Backend engineer focused on Python and Django. Contributor to several open-source projects. I mentor developers who want to go deep on backend architecture, APIs, and databases.',
    introVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    linkedinUrl: 'https://linkedin.com/in/enkhjargal',
    price: 90, meetingsPerMonth: 4, trending: true,
  },
  {
    id: '6', name: 'Gantulga Baatar', title: 'DevOps Engineer', expertise: 'AWS, Docker, Kubernetes',
    avatar: 'https://i.pravatar.cc/150?img=22', rating: 4.5, reviewCount: 14,
    skills: ['DevOps'],
    bio: 'Cloud and DevOps engineer with expertise in AWS, containerization, and CI/CD pipelines. I help teams ship faster and more reliably.',
    linkedinUrl: 'https://linkedin.com/in/gantulga-baatar',
    price: 85, meetingsPerMonth: 2,
  },
  {
    id: '7', name: 'Solongo Myagmar', title: 'iOS Developer', expertise: 'Swift, SwiftUI, Xcode',
    avatar: 'https://i.pravatar.cc/150?img=9', rating: 4.7, reviewCount: 23,
    skills: ['iOS'],
    bio: 'iOS developer with 5 years of App Store experience. Built apps with 500k+ downloads. I mentor developers through Swift fundamentals to publishing their first app.',
    linkedinUrl: 'https://linkedin.com/in/solongo',
    websiteUrl: 'https://solongo.io',
    price: 70, meetingsPerMonth: 4,
  },
  {
    id: '8', name: 'Ankhbayar Galsandorj', title: 'Cybersecurity Analyst', expertise: 'Penetration Testing, OWASP, Linux',
    avatar: 'https://i.pravatar.cc/150?img=52', rating: 4.8, reviewCount: 38,
    skills: ['Security'],
    bio: 'Certified ethical hacker with expertise in web application security. I guide developers through the OWASP Top 10 and help them build secure-by-default applications.',
    linkedinUrl: 'https://linkedin.com/in/ankhbayar',
    price: 95, meetingsPerMonth: 2,
  },
];
