/**
 * Portfolio site interactions.
 * Pure vanilla JS, no external dependencies.
 */

(function () {
    'use strict';

    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav__link');
    const yearEl = document.getElementById('year');
    const statNumbers = document.querySelectorAll('.stat__number');
    const skillsTrack = document.getElementById('skillsTrack');
    const skillsPrev = document.getElementById('skillsPrev');
    const skillsNext = document.getElementById('skillsNext');
    const blogGrid = document.getElementById('blogGrid');

    /**
     * Update the copyright year in the footer.
     */
    function updateYear() {
        if (!yearEl) return;
        yearEl.textContent = new Date().getFullYear().toString();
    }

    /**
     * Toggle the mobile navigation menu.
     */
    function toggleMenu() {
        const isOpen = nav.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    /**
     * Close the mobile navigation menu.
     */
    function closeMenu() {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    /**
     * Add/remove the scrolled header style.
     */
    function handleScroll() {
        if (window.scrollY > 20) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }

    /**
     * Highlight the active nav link based on scroll position.
     */
    function highlightActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 120;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    /**
     * Animate numbers from 0 to their target value.
     */
    function animateStats() {
        statNumbers.forEach((number) => {
            const target = parseInt(number.getAttribute('data-count'), 10);
            if (Number.isNaN(target)) return;

            let current = 0;
            const duration = 1200;
            const startTime = performance.now();

            function step(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                current = Math.floor(eased * target);
                number.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    number.textContent = target;
                }
            }

            requestAnimationFrame(step);
        });
    }

    /**
     * Skills slider logic.
     */
    function initSkillsSlider() {
        if (!skillsTrack || !skillsPrev || !skillsNext) return;

        const cards = skillsTrack.querySelectorAll('.skill-card');
        if (cards.length === 0) return;

        let currentIndex = 0;
        const gap = 24; // matches CSS gap (1.5rem = 24px)
        const cardWidth = cards[0].offsetWidth;
        const shift = cardWidth + gap;

        function updateSlider() {
            skillsTrack.style.transform = `translateX(-${currentIndex * shift}px)`;
            skillsPrev.disabled = currentIndex === 0;
            skillsNext.disabled = currentIndex >= cards.length - getVisibleCards();
        }

        function getVisibleCards() {
            const containerWidth = skillsTrack.parentElement.offsetWidth;
            return Math.max(1, Math.floor(containerWidth / shift));
        }

        skillsPrev.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex -= 1;
                updateSlider();
            }
        });

        skillsNext.addEventListener('click', () => {
            const maxIndex = cards.length - getVisibleCards();
            if (currentIndex < maxIndex) {
                currentIndex += 1;
                updateSlider();
            }
        });

        window.addEventListener('resize', () => {
            const maxIndex = cards.length - getVisibleCards();
            currentIndex = Math.min(currentIndex, Math.max(0, maxIndex));
            updateSlider();
        });

        updateSlider();
    }

    /**
     * Render blog posts from the shared blogPosts data into the blog grid.
     */
    function renderBlogPosts() {
        if (!blogGrid || typeof blogPosts === 'undefined') return;

        const fragment = document.createDocumentFragment();

        blogPosts.forEach((post, index) => {
            const article = document.createElement('article');
            article.className = 'blog-card reveal';
            article.style.transitionDelay = `${index * 80}ms`;

            article.innerHTML = `
                <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="blog-card__media" aria-hidden="true">
                    <img src="${post.image}" alt="" loading="lazy">
                </a>
                <div class="blog-card__body">
                    <time class="blog-card__date" datetime="${post.date}">${post.date}</time>
                    <h3 class="blog-card__title">
                        <a href="${post.url}" target="_blank" rel="noopener noreferrer">${post.title}</a>
                    </h3>
                    <p class="blog-card__excerpt">${post.excerpt}</p>
                    <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="blog-card__link">
                        Read article
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                    </a>
                </div>
            `;

            fragment.appendChild(article);
        });

        blogGrid.appendChild(fragment);
    }

    /**
     * Initialise IntersectionObserver to trigger stats animation once.
     */
    function initStatObserver() {
        if (!('IntersectionObserver' in window) || statNumbers.length === 0) {
            animateStats();
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateStats();
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.4 }
        );

        observer.observe(statNumbers[0].closest('.stats'));
    }

    /**
     * Theme toggle logic.
     */
    const themeToggle = document.getElementById('themeToggle');
    const THEME_KEY = 'portfolio-theme';

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
        }
    }

    function getPreferredTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved) return saved;
        return 'light';
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
    }

    function initTheme() {
        if (!themeToggle) return;
        applyTheme(getPreferredTheme());
        themeToggle.addEventListener('click', toggleTheme);
    }

    /**
     * Initialise scroll-triggered reveal animations.
     */
    function initRevealAnimations() {
        const revealElements = document.querySelectorAll('.reveal');
        if (revealElements.length === 0) return;

        if (!('IntersectionObserver' in window)) {
            revealElements.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
        );

        revealElements.forEach((el) => observer.observe(el));
    }

    /**
     * Initialise all event listeners and state.
     */
    function init() {
        updateYear();
        handleScroll();
        highlightActiveLink();

        window.addEventListener('scroll', () => {
            handleScroll();
            highlightActiveLink();
        });

        menuToggle.addEventListener('click', toggleMenu);

        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('is-open')) {
                    closeMenu();
                }
            });
        });

        initStatObserver();
        initSkillsSlider();
        renderBlogPosts();
        initRevealAnimations();
        initTheme();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
