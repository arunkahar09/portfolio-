// server.js - Futuristic Portfolio Backend with Email Notifications
const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Attempt to load database configuration safely
let db = null;
try {
  db = require('./database');
} catch (err) {
  console.warn('Database module not loaded, running in standalone mode:', err.message);
}

const app = express();
const port = process.env.PORT || 3000;

// Set EJS as Templating View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Assets (public, IMG, and dist)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/IMG', express.static(path.join(__dirname, 'IMG')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));

// Email Transporter Helper (Nodemailer)
function getEmailTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS.trim()
    }
  });
}

// Portfolio Data Store (Updated from Resume Details)
const portfolioData = {
  profile: {
    name: 'Arun Kahar',
    terminalId: 'ARUN_DEV_2026',
    status: 'AVAILABLE_FOR_HIRE',
    phone: '+91-8827259227',
    email: 'arunkahar09@gmail.com',
    location: 'Bhopal, India',
    github: 'https://github.com/arunkahar09',
    linkedin: 'https://linkedin.com/in/arunkahar09',
    tagline: 'FULL_STACK_DEVELOPER // C++ & DSA SPECIALIST',
    titles: [
      'FULL_STACK_DEVELOPER',
      'C++ & DSA SPECIALIST',
      'NODE.JS / EXPRESS / EJS',
      'AZURE CLOUD CERTIFIED'
    ],
    bio: 'Software engineer and web developer with expertise in C++, Data Structures & Algorithms (500+ problems solved), and Full-Stack development using Node.js, Express.js, EJS, and modern SQL databases.',
    avatar: '/IMG/ME.jpg',
    resumeLink: '/IMG/ME.jpg',
    aboutParagraphs: [
      'I am an energetic Software Engineer & Full-Stack Developer with deep technical strengths in <strong class="text-cyan-400 font-bold">Data Structures, Algorithms (DSA) in C++</strong>, and resilient backend systems architecture.',
      'I have solved <strong class="text-green-400 font-bold">500+ coding problems</strong> across LeetCode & CodeChef, secured <strong class="text-cyan-400 font-bold">AIR 2034 in TCS CodeVita Season 13</strong>, and achieved a <strong class="text-purple-400 font-bold">CodeChef Global Rank of 237</strong> (Starters 220, Max Rating: 1477).',
      'On the web engineering frontier, I architect clean full-stack web applications using <strong>Node.js, Express.js, EJS, SQLite, and MySQL</strong> with modular, responsive, and performance-optimized UI layouts.'
    ],
    socialLinks: [
      { name: 'GitHub', url: 'https://github.com/arunkahar09', icon: 'fab fa-github', handle: 'github.com/arunkahar09' },
      { name: 'LinkedIn', url: 'https://linkedin.com/in/arunkahar09', icon: 'fab fa-linkedin', handle: 'linkedin.com/in/arunkahar09' },
      { name: 'Email', url: 'mailto:arunkahar09@gmail.com', icon: 'fas fa-envelope', handle: 'arunkahar09@gmail.com' },
      { name: 'Phone', url: 'tel:+918827259227', icon: 'fas fa-phone', handle: '+91-8827259227' }
    ]
  },
  
  achievements: [
    {
      id: 'codevita',
      badge: 'AIR 2034',
      title: 'TCS CodeVita Season 13',
      highlight: 'All India Rank 2034',
      description: 'Secured AIR 2034 among tens of thousands of national engineering participants in the prestigious coding competition.',
      icon: 'fas fa-trophy',
      accentColor: 'cyan',
      glow: 'neon-glow-cyan'
    },
    {
      id: 'codechef-contest',
      badge: 'GLOBAL RANK 237',
      title: 'CodeChef Starters 220',
      highlight: 'Global Rank 237 / Rated Contest',
      description: 'Achieved top 250 global rank in rated competitive algorithmic programming contest.',
      icon: 'fas fa-medal',
      accentColor: 'green',
      glow: 'neon-glow-green'
    },
    {
      id: 'dsa-problems',
      badge: '500+ SOLVED',
      title: 'Competitive Programming Mastery',
      highlight: 'CodeChef Max Rating: 1477',
      description: 'Solved over 500+ complex algorithmic and data structure problems across LeetCode and CodeChef.',
      icon: 'fas fa-code',
      accentColor: 'purple',
      glow: 'neon-glow-purple'
    }
  ],

  certifications: [
    {
      id: 'az-900',
      code: 'AZ-900',
      title: 'Microsoft Certified: Azure Fundamentals',
      issuer: 'Microsoft',
      badge: 'OFFICIAL CERTIFIED',
      description: 'Demonstrated foundational knowledge of cloud services, security, privacy, compliance, and Azure architecture & pricing.',
      icon: 'fab fa-microsoft',
      link: 'https://learn.microsoft.com/certifications/'
    }
  ],

  skills: [
    { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', glow: 'neon-glow-cyan', category: 'Language' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', category: 'Language' },
    { name: 'SQL / PL-SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', glow: 'neon-glow-cyan', category: 'Database' },
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', glow: 'neon-glow-green', category: 'Backend' },
    { name: 'Express.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', customClass: 'filter dark:invert', category: 'Backend' },
    { name: 'EJS Templates', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ejs/ejs-original.svg', customClass: 'text-red-500', category: 'Template Engine' },
    { name: 'HTML5 & CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', category: 'Frontend' },
    { name: 'SQLite', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg', category: 'Database' },
    { name: 'Azure Cloud', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg', glow: 'neon-glow-cyan', category: 'Cloud' },
    { name: 'Git & GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', category: 'Dev Tools' },
    { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', category: 'Dev Tools' },
    { name: 'DSA & OOPs', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-plain.svg', glow: 'neon-glow-green', category: 'Core Concept' }
  ],

  projects: [
    {
      id: 'travel-tour',
      title: '// TRAVEL_TOUR_PLATFORM',
      subtitle: 'Full-Stack Tourism & Discovery System',
      category: 'Node.js / Express.js / EJS / SQLite',
      image: '/IMG/p1 3 211212.jpg',
      description: 'Architected a full-stack web application showcasing tourism destinations, discovery features, searchable travel blogs, and media streaming capabilities with dynamic SQLite backend data management.',
      highlights: [
        'Structured dynamic, database-driven pages using SQLite & Express.js for efficient backend content management.',
        'Designed a responsive UI using EJS templating engine, optimizing user navigation and platform interactivity.',
        'Implemented discovery search and tourism destination catalog features.'
      ],
      tech: ['Node.js', 'Express.js', 'EJS Views', 'SQLite', 'HTML5', 'CSS3'],
      github: 'https://github.com/arunkahar09',
      live: '#'
    },
    {
      id: 'cow-owner-id',
      title: '// COW_OWNER_ID_SYSTEM',
      subtitle: 'Cattle & Owner Identification Management',
      category: 'Frontend & SQL Integration / SQLite',
      image: '/IMG/pexels-divinetechygirl-1181343.jpg',
      description: 'Designed and built a dynamic, responsive record management interface for cattle and owner identification with optimized schema design and fast record retrieval.',
      highlights: [
        'Designed dynamic, responsive user interface using Bootstrap, HTML5, and CSS3 for seamless data entry.',
        'Schema design and SQL integration (SQLite) to organize records and enable fast retrieval of owner identification data.',
        'Collaborated with backend workflows to connect frontend components with API endpoints for smooth data flow.'
      ],
      tech: ['SQLite', 'Bootstrap', 'HTML5', 'CSS3', 'SQL Queries', 'API Integration'],
      github: 'https://github.com/arunkahar09',
      live: '#'
    },
    {
      id: 'sarthi-healthcare',
      title: '// SAARTHI_HEALTHCARE_MATRIX',
      subtitle: 'Real-Time Healthcare Interaction Bridge',
      category: 'Full-Stack Decision Matrix',
      image: '/IMG/1.png',
      description: 'Smart assistance environment connecting nearby hospitals and patients for medicine reminders, doctor appointment tokens, and emergency SOS ambulance response matrix.',
      highlights: [
        'Hospital locator with specialized emergency filter pipeline.',
        'Medicine reminder & doctor appointment scheduling architecture.',
        'One-tap emergency call & live SOS location dispatch.'
      ],
      tech: ['Node.js', 'Express', 'MySQL', 'EJS Templates', 'Predictive Logic'],
      github: 'https://github.com/arunkahar09',
      live: '#'
    }
  ]
};

// Main EJS Route
app.get('/', (req, res) => {
  res.render('index', {
    title: `${portfolioData.profile.name.toUpperCase()} | FULL_STACK_CYBER_PORTFOLIO`,
    profile: portfolioData.profile,
    achievements: portfolioData.achievements,
    certifications: portfolioData.certifications,
    skills: portfolioData.skills,
    projects: portfolioData.projects
  });
});

// API Route for Contact Form with Direct Email Notification & Database Logging
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'All fields are mandatory for transmission.' });
    }

    const submissionTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // 1. Save to Database if connected
    if (db && typeof db.query === 'function') {
      try {
        const sqlQuery = "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)";
        const [result] = await db.query(sqlQuery, [name, email, message]);
        console.log(`[DB] Contact message saved with ID: ${result.insertId}`);
      } catch (dbErr) {
        console.warn(`[DB WARNING] (${dbErr.message}), saving transmission in server log.`);
      }
    }

    console.log(`\n================== [NEW CONTACT INQUIRY] ==================`);
    console.log(`👤 Name:    ${name}`);
    console.log(`📧 Email:   ${email}`);
    console.log(`🕒 Time:    ${submissionTime}`);
    console.log(`💬 Message: ${message}`);
    console.log(`===========================================================\n`);

    // 2. Send Direct Email Notification to Arun Kahar (arunkahar09@gmail.com)
    const transporter = getEmailTransporter();
    const receiverMail = process.env.RECEIVER_EMAIL || process.env.EMAIL_USER || 'arunkahar09@gmail.com';

    if (transporter) {
      const mailOptions = {
        from: `"Arun Portfolio Alerts" <${process.env.EMAIL_USER}>`,
        to: receiverMail,
        replyTo: email,
        subject: `⚡ New Portfolio Contact from: ${name}`,
        text: `New contact submission on your portfolio website:\n\nSender Name: ${name}\nSender Email: ${email}\nDate & Time: ${submissionTime}\n\nMessage / Inquired About:\n${message}\n\n(Click reply to answer directly to ${email})`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #030712; color: #f3f4f6; padding: 25px; border-radius: 10px; border: 1px solid #06b6d4; max-width: 600px; margin: auto;">
            
            <div style="border-bottom: 2px solid #06b6d4; padding-bottom: 12px; margin-bottom: 20px;">
              <h2 style="color: #06b6d4; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">
                ⚡ New Contact Inquiry Received
              </h2>
              <p style="color: #9ca3af; font-size: 13px; margin-top: 5px; margin-bottom: 0;">
                Someone just submitted the contact form on your portfolio website.
              </p>
            </div>

            <!-- SENDER DETAILS CARD -->
            <div style="background-color: #0b0f19; padding: 16px; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 18px;">
              <p style="margin: 6px 0; font-size: 14px;"><strong>👤 Sender Name:</strong> <span style="color: #ffffff; font-weight: bold;">${name}</span></p>
              <p style="margin: 6px 0; font-size: 14px;"><strong>📧 Email Address:</strong> <a href="mailto:${email}" style="color: #06b6d4; text-decoration: none; font-weight: bold;">${email}</a></p>
              <p style="margin: 6px 0; font-size: 13px; color: #9ca3af;"><strong>🕒 Timestamp:</strong> ${submissionTime}</p>
            </div>

            <!-- MESSAGE PAYLOAD -->
            <div style="background-color: #0b0f19; padding: 18px; border-radius: 8px; border-left: 4px solid #06b6d4; margin-bottom: 22px;">
              <h4 style="margin: 0 0 10px 0; color: #06b6d4; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
                💬 Message / Reason for Contact:
              </h4>
              <p style="white-space: pre-wrap; color: #e5e7eb; font-size: 14px; line-height: 1.6; margin: 0;">${message}</p>
            </div>

            <!-- ACTION BUTTON -->
            <div style="text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #164e63;">
              <a href="mailto:${email}?subject=Re: Your inquiry on Arun Kahar's Portfolio" style="background: linear-gradient(135deg, #06b6d4, #22c55e); color: #030712; padding: 12px 28px; text-decoration: none; font-weight: 900; border-radius: 6px; display: inline-block; text-transform: uppercase; font-size: 13px; letter-spacing: 1px;">
                Reply Directly to ${name}
              </a>
            </div>

            <p style="text-align: center; color: #6b7280; font-size: 11px; margin-top: 20px;">
              // ARUN KAHAR PORTFOLIO TRANSMISSION SYSTEM &bull; NODE.JS + EXPRESS
            </p>
          </div>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL DISPATCH] ✅ Email notification successfully delivered to ${receiverMail}`);
      } catch (mailErr) {
        console.error(`[EMAIL DISPATCH ERROR] ❌ Could not send email:`, mailErr.message);
      }
    } else {
      console.log(`[EMAIL NOTICE] ⚠️ EMAIL_PASS is empty in .env. Add Gmail App Password in .env to receive emails in your inbox.`);
    }

    res.status(201).json({
      success: true,
      message: `Transmission received! Thank you ${name}, Arun has received your inquiry and will reply to ${email} shortly.`
    });

  } catch (error) {
    console.error('Contact route error:', error.message);
    res.status(500).json({ success: false, error: 'Server transmission error occurred.' });
  }
});

// Health check endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    system: 'SYSTEMS_OPERATIONAL',
    engine: 'Node.js Express + EJS',
    portfolioOwner: portfolioData.profile.name,
    emailConfigured: Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS),
    uptime: `${Math.floor(process.uptime())}s`
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).render('index', {
    title: '404 - TERMINAL_NOT_FOUND',
    profile: portfolioData.profile,
    achievements: portfolioData.achievements,
    certifications: portfolioData.certifications,
    skills: portfolioData.skills,
    projects: portfolioData.projects
  });
});

// Start Server only when run directly, so Vercel can import the app safely
if (require.main === module) {
  app.listen(port, () => {
    console.log(`=========================================`);
    console.log(`🚀 Cyber Portfolio running at: http://localhost:${port}`);
    console.log(`⚡ Developer: ${portfolioData.profile.name} (${portfolioData.profile.email})`);
    console.log(`📧 Notification Email: ${process.env.RECEIVER_EMAIL || 'arunkahar09@gmail.com'}`);
    console.log(`=========================================`);
  });
}

module.exports = app;
