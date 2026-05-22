document.addEventListener("DOMContentLoaded", () => {
  const yearLabel = document.getElementById('year-label');
  if (yearLabel) {
    yearLabel.innerText = new Date().getFullYear();
  }
});

/* ==========================================================================
   1. INTERACTIVE PLEXUS/PARTICLE GRID BACKGROUND
   ========================================================================== */
const canvas = document.getElementById('particleCanvas');
let ctx = null;
let particlesArray = [];
let mouse = { x: null, y: null, radius: 150 };

if (canvas) {
  ctx = canvas.getContext('2d');
  
  // Canvas Resize Observer to keep it full screen
  const initCanvasSize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  
  initCanvasSize();
  window.addEventListener('resize', () => {
    initCanvasSize();
    createParticles();
  });

  // Capture cursor coordinates for interaction
  window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });
  
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });
}

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }
  
  draw() {
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  
  update() {
    if (!canvas) return;
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }
    this.x += this.directionX;
    this.y += this.directionY;
    this.draw();
  }
}

function createParticles() {
  if (!canvas) return;
  particlesArray = [];
  const numberOfParticles = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80);
  
  for (let i = 0; i < numberOfParticles; i++) {
    const size = (Math.random() * 2) + 1.5;
    const x = (Math.random() * (canvas.width - size * 2) + size);
    const y = (Math.random() * (canvas.height - size * 2) + size);
    const directionX = (Math.random() * 0.4) - 0.2;
    const directionY = (Math.random() * 0.4) - 0.2;
    
    // Subtle color matching theme based on active light/dark state
    const isDark = document.documentElement.classList.contains('dark');
    const color = isDark ? 'rgba(34, 197, 94, 0.45)' : 'rgba(34, 197, 94, 0.25)';
    
    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

function connectParticles() {
  if (!canvas || !ctx) return;
  let opacityValue = 1;
  const isDark = document.documentElement.classList.contains('dark');
  
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                     ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                     
      if (distance < (canvas.width / 8) * (canvas.height / 8)) {
        opacityValue = 1 - (distance / 16000);
        ctx.strokeStyle = isDark ? 
          `rgba(20, 184, 166, ${opacityValue * 0.15})` : `rgba(20, 184, 166, ${opacityValue * 0.08})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  if (!canvas || !ctx) return;
  requestAnimationFrame(animateParticles);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connectParticles();
}

// Start Particle Network
if (canvas) {
  createParticles();
  animateParticles();
}

/* ==========================================================================
   2. CODES / TYPING SEQUENCE CONTROLLER
   ========================================================================== */
const words = ["C++ Development", "DSA Optimization", "React Frontend Architecture", "Cloud APIs Solutions"];
let wordIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typingSpan = document.getElementById('typing-text');

function executeTypeSequence() {
  if (!typingSpan) return;
  const currentWord = words[wordIdx];
  
  if (isDeleting) {
    typingSpan.textContent = currentWord.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typingSpan.textContent = currentWord.substring(0, charIdx + 1);
    charIdx++;
  }

  let speed = isDeleting ? 30 : 70;

  if (!isDeleting && charIdx === currentWord.length) {
    speed = 2200; // Freeze word output
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    wordIdx = (wordIdx + 1) % words.length;
    speed = 400; // Freeze before rewrite
  }

  setTimeout(executeTypeSequence, speed);
}

document.addEventListener("DOMContentLoaded", () => {
  if (typingSpan) {
    setTimeout(executeTypeSequence, 1000);
  }
});

/* ==========================================================================
   3. INTERACTIVE SKILLS CATEGORY FILTERS
   ========================================================================== */
window.filterSkills = function(category) {
  const tabButtons = document.querySelectorAll('.skill-tab-btn');
  tabButtons.forEach(btn => {
    btn.classList.remove('bg-green-500', 'text-white');
    btn.classList.add('bg-white', 'dark:bg-gray-900', 'text-gray-600', 'dark:text-gray-400');
  });

  // Style active button clicked
  if (event && event.currentTarget) {
    event.currentTarget.classList.remove('bg-white', 'dark:bg-gray-900', 'text-gray-600', 'dark:text-gray-400');
    event.currentTarget.classList.add('bg-green-500', 'text-white');
  }

  const cards = document.querySelectorAll('.skill-card');
  cards.forEach(card => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.style.display = 'block';
      card.classList.add('scale-100', 'opacity-100');
    } else {
      card.style.display = 'none';
    }
  });
};

/* ==========================================================================
   4. INTERACTIVE DSA BUBBLE SORTING VISUALIZER
   ========================================================================== */
let currentArray = [];
let isSortingInProgress = false;

window.generateVisualizerArray = function() {
  if (isSortingInProgress) return;
  const sizeInput = document.getElementById('sort-size');
  const size = sizeInput ? parseInt(sizeInput.value) : 20;
  currentArray = [];
  const container = document.getElementById('visualizer-container');
  if (!container) return;
  container.innerHTML = '';
  
  const compLabel = document.getElementById('comparisons-count');
  if (compLabel) compLabel.innerText = '0';

  for (let i = 0; i < size; i++) {
    const value = Math.floor(Math.random() * 85) + 15; // Percent heights
    currentArray.push(value);

    const bar = document.createElement('div');
    bar.style.height = `${value}%`;
    bar.className = "visualizer-bar flex-1 rounded-t-lg bg-indigo-500/80 dark:bg-indigo-600/80 transition-all duration-150 relative group shadow-[inset_0_-20px_20px_rgba(0,0,0,0.1)]";
    
    // Tooltip displaying index value
    const tooltip = document.createElement('span');
    tooltip.innerText = value;
    tooltip.className = "absolute -top-7 left-1/2 transform -translate-x-1/2 text-[9px] font-mono text-white bg-gray-950 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10";
    bar.appendChild(tooltip);

    container.appendChild(bar);
  }
};

// Delay helper mimicking loop latency
function visualizerDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

window.startBubbleSort = async function() {
  if (isSortingInProgress) return;
  isSortingInProgress = true;
  
  const bars = document.getElementsByClassName('visualizer-bar');
  const speedInput = document.getElementById('sort-speed');
  const startBtn = document.getElementById('start-sort-btn');
  
  if (startBtn) {
    startBtn.disabled = true;
    startBtn.classList.add('opacity-50', 'pointer-events-none');
  }
  
  let comparisons = 0;
  let len = currentArray.length;

  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (!isSortingInProgress) return; // safety stop
      
      const speedValue = speedInput ? parseInt(speedInput.value) : 400;
      const delayTime = 900 - speedValue;

      // Highlight compared elements with Amber glow
      if (bars[j] && bars[j+1]) {
        bars[j].classList.add('bg-amber-500/90', 'scale-[1.03]', 'shadow-[0_0_10px_rgba(245,158,11,0.5)]');
        bars[j+1].classList.add('bg-amber-500/90', 'scale-[1.03]', 'shadow-[0_0_10px_rgba(245,158,11,0.5)]');
      }

      comparisons++;
      const compLabel = document.getElementById('comparisons-count');
      if (compLabel) compLabel.innerText = comparisons;

      await visualizerDelay(delayTime);

      if (currentArray[j] > currentArray[j+1]) {
        // Swap indices values in data
        let temp = currentArray[j];
        currentArray[j] = currentArray[j+1];
        currentArray[j+1] = temp;

        // Swap visual heights
        if (bars[j] && bars[j+1]) {
          bars[j].style.height = `${currentArray[j]}%`;
          bars[j+1].style.height = `${currentArray[j+1]}%`;

          // Swap inner tooltips values
          bars[j].querySelector('span').innerText = currentArray[j];
          bars[j+1].querySelector('span').innerText = currentArray[j+1];
        }
      }

      // Revert colors back to normal state
      if (bars[j] && bars[j+1]) {
        bars[j].classList.remove('bg-amber-500/90', 'scale-[1.03]', 'shadow-[0_0_10px_rgba(245,158,11,0.5)]');
        bars[j+1].classList.remove('bg-amber-500/90', 'scale-[1.03]', 'shadow-[0_0_10px_rgba(245,158,11,0.5)]');
      }
    }

    // Element is sorted - highlight with permanent dynamic Green glow
    if (bars[len - i - 1]) {
      bars[len - i - 1].classList.add('bg-green-500/90', 'shadow-[0_0_15px_rgba(34,197,94,0.3)]');
    }
  }

  isSortingInProgress = false;
  if (startBtn) {
    startBtn.disabled = false;
    startBtn.classList.remove('opacity-50', 'pointer-events-none');
  }
  showGeneralToast("Algorithm Executed!", "C++ equivalent sorting operations fully completed successfully.");
};

// Auto load visualizer array on launch
document.addEventListener("DOMContentLoaded", () => {
  generateVisualizerArray();
});

/* ==========================================================================
   5. INTERACTIVE SPEC DETAILS CASE STUDY MODALS
   ========================================================================== */
const projectsData = {
  portfolio: {
    title: "Modern Premium Portfolio Website",
    category: "Client Front-End Assembly",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800",
    description: "A highly customized single-file architecture. Features custom configurations using Tailwind, an interactive plexus-based particles canvas API that tracks pointer coordinate vectors, a fully custom algorithm simulation workspace (the DSA Arena), and modular layouts to make inspecting credentials intuitive.",
    tech: ["HTML5 / Web Standard Templates", "Tailwind CSS Utility CDNs", "Canvas Graphics API Engine", "FontAwesome Icon Packs", "Javascript Object Arrays"],
    github: "https://github.com/arunkahar09",
    live: "#"
  },
  saarthi: {
    title: "Saarthi Web Application",
    category: "Full Stack & Decision Matrices",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    description: "The Saarthi Counselor leverages node servers and custom mathematical databases built to index user criteria and output career suggestions. Features optimized SQL configurations for instant profile processing, secure API routing, and high responsiveness on screens.",
    tech: ["Node.js Server Modules", "Express Router Architectures", "MySQL Relational Schemas", "EJS Layout Frameworks", "Python Predictive Math"],
    github: "https://github.com/arunkahar09",
    live: "#"
  }
};

window.openProjectModal = function(key) {
  const data = projectsData[key];
  if (!data) return;

  const modalImg = document.getElementById('modal-project-img');
  const modalCat = document.getElementById('modal-project-category');
  const modalTitle = document.getElementById('modal-project-title');
  const modalDesc = document.getElementById('modal-project-desc');
  const modalTechContainer = document.getElementById('modal-project-tech');
  const modalGit = document.getElementById('modal-project-github');

  if (modalImg) modalImg.src = data.image;
  if (modalCat) modalCat.innerText = data.category;
  if (modalTitle) modalTitle.innerText = data.title;
  if (modalDesc) modalDesc.innerText = data.description;
  
  if (modalTechContainer) {
    modalTechContainer.innerHTML = '';
    data.tech.forEach(item => {
      const tag = document.createElement('span');
      tag.className = "px-3 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl";
      tag.innerText = item;
      modalTechContainer.appendChild(tag);
    });
  }

  if (modalGit) modalGit.href = data.github;

  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Lock primary screen scroll
  }
};

window.closeProjectModal = function() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // Unlock primary scroll
  }
};

/* ==========================================================================
   6. SECURE CONTACT FORM VALIDATION
   ========================================================================== */
const contactForm = document.getElementById('contact-form');
const formError = document.getElementById('form-error-msg');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (formError) {
      formError.classList.add('hidden');
      formError.innerText = '';
    }

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const msgInput = document.getElementById('message');

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const msg = msgInput ? msgInput.value.trim() : "";

    if (name.length < 2) {
      showFormErrorMessage("Please enter a valid developer identity (at least 2 characters).");
      return;
    }
    if (!validateEmail(email)) {
      showFormErrorMessage("Please enter a valid network transmission mail address.");
      return;
    }
    if (msg.length < 10) {
      showFormErrorMessage("Payload body is too brief. Please provide a detailed brief (at least 10 characters).");
      return;
    }

    // Generate mock server success feedback
    showGeneralToast("Log Successfully Transmitted!", `Thank you, ${name}! Your signal was received. Arun will contact you at ${email} shortly.`);
    contactForm.reset();
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showFormErrorMessage(txt) {
  if (formError) {
    formError.innerText = txt;
    formError.classList.remove('hidden');
  }
}

/* ==========================================================================
   7. THEME MANAGER & MISC UI TOASTS
   ========================================================================== */
const themeToggleBtn = document.getElementById('theme-toggle');
const darkIcon = document.getElementById('theme-toggle-dark-icon');
const lightIcon = document.getElementById('theme-toggle-light-icon');

function syncThemeIcons() {
  const isDark = document.documentElement.classList.contains('dark');
  if (isDark) {
    if (lightIcon) lightIcon.classList.remove('hidden');
    if (darkIcon) darkIcon.classList.add('hidden');
  } else {
    if (lightIcon) lightIcon.classList.add('hidden');
    if (darkIcon) darkIcon.classList.remove('hidden');
  }
}

// Initial Sync
syncThemeIcons();

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    syncThemeIcons();
    // Re-create particles to adapt transparency to the contrast value
    createParticles();
  });
}

// Mobile Menu Navigation drawer
const mobileMenuBtn = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (mobileMenu) {
      mobileMenu.classList.add('hidden');
    }
  });
});

// Active Navigation Highlighting Scroll-Spy
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  let currentSec = "";
  sections.forEach(sec => {
    const top = sec.offsetTop;
    if (pageYOffset >= (top - 200)) {
      currentSec = sec.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('text-green-500', 'dark:text-green-400', 'font-bold');
    if (link.getAttribute('href') === `#${currentSec}`) {
      link.classList.add('text-green-500', 'dark:text-green-400', 'font-bold');
    }
  });
});

// Toast Notifications System setup
const toast = document.getElementById('toast-notif');
const toastTitle = document.getElementById('toast-title');
const toastMsg = document.getElementById('toast-message');
const toastIcon = document.getElementById('toast-icon');
const toastIconBg = document.getElementById('toast-icon-bg');

window.showGeneralToast = function(title, body) {
  if (!toast) return;
  if (toastTitle) toastTitle.innerText = title;
  if (toastMsg) toastMsg.innerText = body;
  
  if (toastIconBg) {
    toastIconBg.className = "w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950/60 text-green-500 flex items-center justify-center text-lg flex-shrink-0";
  }
  if (toastIcon) {
    toastIcon.className = "fa-solid fa-circle-check";
  }

  toast.classList.remove('translate-y-10', 'opacity-0', 'pointer-events-none');
  setTimeout(hideToast, 5000);
};

window.showTemporaryResumeToast = function() {
  if (!toast) return;
  if (toastTitle) toastTitle.innerText = "Resume Download Logged";
  if (toastMsg) {
    toastMsg.innerText = "A mockup resume sequence was initiated. For physical deployments, substitute this anchor directly with your PDF file asset!";
  }
  
  if (toastIconBg) {
    toastIconBg.className = "w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center text-lg flex-shrink-0";
  }
  if (toastIcon) {
    toastIcon.className = "fa-solid fa-file-arrow-down";
  }

  toast.classList.remove('translate-y-10', 'opacity-0', 'pointer-events-none');
  setTimeout(hideToast, 5000);
};

window.hideToast = function() {
  if (toast) {
    toast.classList.add('translate-y-10', 'opacity-0', 'pointer-events-none');
  }
};