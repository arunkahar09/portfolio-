
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DARK MODE TOGGLE 
    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    const docElement = document.documentElement;

    // Check karo ki elements page par hain ya nahi
    if (themeToggleBtn && darkIcon && lightIcon) {
        
        if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            docElement.classList.add('dark');
            lightIcon.classList.remove('hidden'); // Dark mode mein light icon (sun) dikhao
        } else {
            docElement.classList.remove('dark');
            darkIcon.classList.remove('hidden'); // Light mode mein dark icon (moon) dikhao
        }

        // Ab click listener add karo
        themeToggleBtn.addEventListener('click', () => {
            docElement.classList.toggle('dark');
            darkIcon.classList.toggle('hidden');
            lightIcon.classList.toggle('hidden');

            if (docElement.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // --- 2. TYPING TEXT ANIMATION ---
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const texts = ['CODER', 'Enthusiast Person', 'Full-Stack Developer', 'Problem Solver'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typeSpeed = 150;
        const deleteSpeed = 100;
        const delay = 2000;

        function type() {
            const currentText = texts[textIndex];

            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    setTimeout(type, 500);
                } else {
                    setTimeout(type, deleteSpeed);
                }
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === currentText.length) {
                    isDeleting = true;
                    setTimeout(type, delay);
                } else {
                    setTimeout(type, typeSpeed);
                }
            }
        }
        type(); // Typing animation shuru karein
    }

    // --- 3. SCROLL-REVEAL ANIMATION ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Optional: Remove 'visible' when scrolling back up
                // entry.target.classList.remove('visible'); 
            }
        });
    }, {
        threshold: 0.1
    });
    revealElements.forEach(el => observer.observe(el));


    // --- 4. ACTIVE NAV LINK HIGHLIGHTING ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const homeLink = document.querySelector('.nav-link[href="#home"]');

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 80;
                const sectionHeight = section.offsetHeight;
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });

            if (scrollY < sections[0].offsetTop - 80) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (homeLink) {
                    homeLink.classList.add('active');
                }
            }
        });

        // Page load par Home ko active set karo (agar homeLink mila hai)
        if (homeLink && window.pageYOffset < sections[0].offsetTop - 80) {
            homeLink.classList.add('active');
        }
    }


    // --- 5. NAVBAR SCROLL EFFECT ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                // On Scroll
                navbar.classList.add('bg-gray-100', 'dark:bg-gray-900', 'shadow-md');
                navbar.classList.remove('bg-white/80', 'dark:bg-gray-950/80', 'backdrop-blur-sm', 'shadow-none');
            } else {
                // At Top
                navbar.classList.remove('bg-gray-100', 'dark:bg-gray-900', 'shadow-md');
                navbar.classList.add('bg-white/80', 'dark:bg-gray-950/80', 'backdrop-blur-sm', 'shadow-none');
            }
        });
    }

    // --- 6. MOBILE NAV TOGGLE (YEH HAMBURGER MENU KE LIYE HAI) ---
    const menuButton = document.querySelector('[data-collapse-toggle="navbar-default"]');
    const mobileMenu = document.getElementById('navbar-default');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            // Menu par 'hidden' class ko toggle karein
            mobileMenu.classList.toggle('hidden');

            // Accessibility ke liye attribute ko update karein
            const isExpanded = menuButton.getAttribute('aria-expanded') === 'true' || false;
            menuButton.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // ... (aapka poora purana code)

    // --- 7. NAYA CODE: CONTACT FORM HANDLING ---
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Page reload hone se rokein

            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            try {
                // Data ko backend par bhejein
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    alert(result.message);
                    contactForm.reset();
                } else {
                    alert('Error: ' + result.error);
                }

            } catch (error) {
                console.error('Fetch error:', error);
                alert('Network error hua.');
            } finally {
                submitButton.textContent = 'Send Message';
                submitButton.disabled = false;
            }
        });
    }

}); // <-- Yeh aapki file ka closing bracket hai (Line 154)

 // <-- DOMContentLoaded ka closing bracket
