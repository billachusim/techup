alter table public.courses add column if not exists sort_order integer not null default 100;
update public.courses c set sort_order = v.o from (values
('Programming Fundamentals',1),('Introduction to Web Development',2),('Version Control with Git',3),
('Web Development Basics',1),('Responsive Design',2),('JavaScript Essentials',3),('Introduction to Backend',4),
('React & Modern Frontend',1),('Advanced JavaScript & TypeScript',2),('Backend Development with Node.js',3),('Database Design & SQL',4),('Full-Stack Project Development',5),
('Python for Data Science',1),('Data Analysis with Pandas',2),('Data Visualization',3),('Machine Learning Fundamentals',4),('Deep Learning & Neural Networks',5),
('Deep Learning Fundamentals',1),('TensorFlow & PyTorch',2),('Computer Vision & Image Processing',3),('Natural Language Processing',4),('AI Model Deployment',5),
('Network Security Fundamentals',1),('CompTIA Security+ Certification',2),('Ethical Hacking & Penetration Testing',3),('SOC Operations & Incident Response',4),('Advanced Threat Detection',5),
('AWS Cloud Fundamentals',1),('Azure & GCP Essentials',2),('Docker & Kubernetes',3),('DevOps & CI/CD Pipelines',4),('Cloud Architecture Design',5),
('UI/UX Design Principles',1),('Figma & Design Tools',2),('Product Design Process',3),('Design Systems & Components',4),('Portfolio Development',5),
('Social Media Marketing Strategy',1),('Content Marketing & Creation',2),('Video & Photo Editing',3),('SEO & SEM Mastery',4),('Marketing Analytics & Growth',5)
) as v(n,o) where c.name = v.n;