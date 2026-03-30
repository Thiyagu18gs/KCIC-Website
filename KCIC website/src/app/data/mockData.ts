// Mock data for demonstration purposes

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'depthead' | 'admin';
  department: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  department: string;
  date: string;
  tags: string[];
  status: 'approved' | 'pending' | 'rejected';
  feedback?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

// Mock users
export const mockUsers: User[] = [
  { id: '1', name: 'John Student', email: 'student@kcic.edu', role: 'student', department: 'Computer Science' },
  { id: '2', name: 'Dr. Mary Head', email: 'depthead@kcic.edu', role: 'depthead', department: 'Computer Science' },
  { id: '3', name: 'Admin User', email: 'admin@kcic.edu', role: 'admin', department: 'Administration' },
];

// Mock blog posts
export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Artificial Intelligence in Education',
    content: 'Artificial Intelligence is revolutionizing the way we approach education...',
    author: 'John Student',
    authorId: '1',
    department: 'Computer Science',
    date: '2026-03-28',
    tags: ['AI', 'Education', 'Technology'],
    status: 'approved'
  },
  {
    id: '2',
    title: 'Understanding Quantum Computing Fundamentals',
    content: 'Quantum computing represents a paradigm shift in computational theory...',
    author: 'Sarah Williams',
    authorId: '4',
    department: 'Computer Science',
    date: '2026-03-27',
    tags: ['Quantum Computing', 'Physics', 'Research'],
    status: 'approved'
  },
  {
    id: '3',
    title: 'Business Ethics in the Digital Age',
    content: 'As technology advances, we must reconsider our ethical frameworks...',
    author: 'Michael Chen',
    authorId: '5',
    department: 'Business Administration',
    date: '2026-03-26',
    tags: ['Ethics', 'Business', 'Digital Transformation'],
    status: 'approved'
  },
  {
    id: '4',
    title: 'Machine Learning Applications in Healthcare',
    content: 'This post explores various ML applications in modern healthcare systems...',
    author: 'John Student',
    authorId: '1',
    department: 'Computer Science',
    date: '2026-03-29',
    tags: ['Machine Learning', 'Healthcare'],
    status: 'pending'
  },
  {
    id: '5',
    title: 'Cybersecurity Best Practices for Students',
    content: 'Understanding basic cybersecurity principles is essential for all students...',
    author: 'Emily Davis',
    authorId: '6',
    department: 'Computer Science',
    date: '2026-03-28',
    tags: ['Cybersecurity', 'Safety', 'Best Practices'],
    status: 'pending'
  },
];

// Mock announcements
export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Spring Semester Registration Now Open',
    content: 'Students can now register for Spring 2026 semester courses through the student portal.',
    date: '2026-03-29'
  },
  {
    id: '2',
    title: 'Academic Excellence Awards Ceremony - April 15',
    content: 'Join us in celebrating our outstanding students and faculty members at the annual Academic Excellence Awards.',
    date: '2026-03-28'
  },
];

// Auth state (in a real app, this would be managed by authentication system)
let currentUser: User | null = null;

// Initialize from localStorage on load
const initAuth = () => {
  const storedUser = localStorage.getItem('kcic_user');
  if (storedUser) {
    try {
      currentUser = JSON.parse(storedUser);
    } catch (e) {
      localStorage.removeItem('kcic_user');
    }
  }
};

// Call init on module load
initAuth();

export const login = (email: string, password: string): User | null => {
  const user = mockUsers.find(u => u.email === email);
  if (user) {
    currentUser = user;
    localStorage.setItem('kcic_user', JSON.stringify(user));
    return user;
  }
  return null;
};

export const logout = () => {
  currentUser = null;
  localStorage.removeItem('kcic_user');
};

export const getCurrentUser = (): User | null => {
  return currentUser;
};

export const getApprovedPosts = (): BlogPost[] => {
  return mockBlogPosts.filter(post => post.status === 'approved');
};

export const getPendingPosts = (department: string): BlogPost[] => {
  return mockBlogPosts.filter(post => post.status === 'pending' && post.department === department);
};

export const getStudentPosts = (studentId: string): BlogPost[] => {
  return mockBlogPosts.filter(post => post.authorId === studentId);
};