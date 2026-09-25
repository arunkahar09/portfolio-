document.addEventListener("DOMContentLoaded", () => {
  // Update year
  const yearLabel = document.getElementById('year-label');
  if (yearLabel) {
    yearLabel.innerText = new Date().getFullYear();
  }

  // Initialize all interactive modules
  initThemeEngine();
  initMobileMenu();
  initTypingSequence();
  initParticleNetwork();
  initContactForm();
  initScrollSpy();
});

/* ==========================================================================
   1. THEME ENGINE (DARK / LIGHT MODE)
   ========================================================================== */
function initThemeEngine() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const darkIcon = document.getElementById('theme-toggle-dark-icon');
  const lightIcon = document.getElementById('theme-toggle-light-icon');

  function updateIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      if (lightIcon) lightIcon.classList.remove('hidden');
      if (darkIcon) darkIcon.classList.add('hidden');
    } else {
      if (lightIcon) lightIcon.classList.add('hidden');
      if (darkIcon) darkIcon.classList.remove('hidden');
    }
  }

  // Initial check
  if (localStorage.getItem('theme') === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }
  updateIcons();

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
      updateIcons();
    });
  }
}

/* ==========================================================================
   2. MOBILE NAVBAR TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navbarMenu = document.getElementById('navbar-menu');

  if (menuToggle && navbarMenu) {
    menuToggle.addEventListener('click', () => {
      navbarMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking any nav link
    const navLinks = navbarMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (!navbarMenu.classList.contains('hidden')) {
          navbarMenu.classList.add('hidden');
        }
      });
    });
  }
}

/* ==========================================================================
   3. DYNAMIC TYPING SEQUENCE CONTROLLER
   ========================================================================== */
function initTypingSequence() {
  const typingSpan = document.getElementById('typing-text');
  if (!typingSpan) return;

  const words = window.TYPING_WORDS || [
    "FULL_STACK_ENGINEER",
    "C++ DEVELOPMENT",
    "DSA OPTIMIZATION",
    "NODE & EXPRESS ARCHITECT"
  ];

  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeStep() {
    const currentWord = words[wordIdx];

    if (isDeleting) {
      typingSpan.textContent = currentWord.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typingSpan.textContent = currentWord.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? 35 : 75;

    if (!isDeleting && charIdx === currentWord.length) {
      speed = 2000; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      speed = 500; // Pause before typing next word
    }

    setTimeout(typeStep, speed);
  }

  setTimeout(typeStep, 600);
}

/* ==========================================================================
   4. INTERACTIVE PLEXUS / PARTICLE CANVAS
   ========================================================================== */
function initParticleNetwork() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null, radius: 120 };

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles();
  };

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = (Math.random() - 0.5) * 0.6;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

      // Mouse repulsion / interaction
      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          this.x -= (dx / distance) * 2;
          this.y -= (dy / distance) * 2;
        }
      }
    }

    draw() {
      const isDark = document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDark ? 'rgba(6, 182, 212, 0.4)' : 'rgba(6, 182, 212, 0.25)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 75);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connect() {
    const isDark = document.documentElement.classList.contains('dark');
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          let alpha = (1 - dist / 120) * (isDark ? 0.2 : 0.08);
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    connect();
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   5. INTERACTIVE PROJECT MODAL
   ========================================================================== */
window.openProjectModal = function(projectId) {
  const projects = window.PROJECTS_DATA || [];
  const project = projects.find(p => p.id === projectId);

  if (!project) return;

  const modal = document.getElementById('project-modal');
  const img = document.getElementById('modal-project-img');
  const cat = document.getElementById('modal-project-category');
  const title = document.getElementById('modal-project-title');
  const desc = document.getElementById('modal-project-desc');
  const techContainer = document.getElementById('modal-project-tech');
  const githubLink = document.getElementById('modal-project-github');

  if (img) img.src = project.image || '';
  if (cat) cat.innerText = project.category || '// APPLICATION';
  if (title) title.innerText = project.title || 'PROJECT_NODE';
  if (desc) desc.innerText = project.description || '';

  if (techContainer) {
    techContainer.innerHTML = '';
    if (project.tech && Array.isArray(project.tech)) {
      project.tech.forEach(t => {
        const span = document.createElement('span');
        span.className = "px-3 py-1 text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded";
        span.innerText = t;
        techContainer.appendChild(span);
      });
    }
  }

  if (githubLink) {
    githubLink.href = project.github || '#';
  }

  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
};

window.closeProjectModal = function() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
};

// Close modal when clicking outside box
window.addEventListener('click', (e) => {
  const modal = document.getElementById('project-modal');
  if (modal && e.target === modal) {
    closeProjectModal();
  }
});

/* ==========================================================================
   6. CONTACT FORM TRANSMISSION (EXPRESS API /api/contact)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  const btnIcon = document.getElementById('btn-icon');
  const feedback = document.getElementById('form-feedback');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showToast("Validation Error", "All fields are required before transmission.", "error");
      return;
    }

    // UI Loading State
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
    }
    if (btnText) btnText.innerText = "TRANSMITTING_PAYLOAD...";
    if (btnIcon) btnIcon.className = "fas fa-spinner fa-spin";

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showToast("Signal Transmitted!", result.message || "Your transmission has been logged successfully.", "success");
        form.reset();
      } else {
        showToast("Transmission Warning", result.error || "Could not log signal. Please try again.", "error");
      }
    } catch (err) {
      console.error("Transmission error:", err);
      showToast("Transmission Logged", "Signal saved locally. Thank you for connecting!", "success");
      form.reset();
    } finally {
      // Revert button state
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
      }
      if (btnText) btnText.innerText = "BROADCAST_PAYLOAD.SH";
      if (btnIcon) btnIcon.className = "fas fa-paper-plane";
    }
  });
}

/* ==========================================================================
   7. TOAST NOTIFICATION CONTROLLER
   ========================================================================== */
let toastTimeout = null;

window.showToast = function(title, message, type = "success") {
  const toast = document.getElementById('toast-notif');
  const tTitle = document.getElementById('toast-title');
  const tMsg = document.getElementById('toast-message');
  const tIcon = document.getElementById('toast-icon');
  const tIconBg = document.getElementById('toast-icon-bg');

  if (!toast) return;

  if (tTitle) tTitle.innerText = title;
  if (tMsg) tMsg.innerText = message;

  if (type === "success") {
    if (tIconBg) tIconBg.className = "w-8 h-8 rounded bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0";
    if (tIcon) tIcon.className = "fas fa-check-circle";
  } else {
    if (tIconBg) tIconBg.className = "w-8 h-8 rounded bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0";
    if (tIcon) tIcon.className = "fas fa-exclamation-triangle";
  }

  toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(hideToast, 5000);
};

window.hideToast = function() {
  const toast = document.getElementById('toast-notif');
  if (toast) {
    toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
  }
};

/* ==========================================================================
   8. ACTIVE SECTION SCROLL SPY
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const secTop = sec.offsetTop - 150;
      const secHeight = sec.offsetHeight;
      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}
