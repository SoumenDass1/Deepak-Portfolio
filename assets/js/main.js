// =============================================
// Main JavaScript for Deepak Dass Portfolio
// =============================================

(function () {
    'use strict';

    // =============================================
    // DOM Elements
    // =============================================
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const resumeBtn = document.getElementById('resumeBtn');
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const scrollTopBtn = document.getElementById('scrollTop');
    const currentYearSpan = document.getElementById('currentYear');
    const sections = document.querySelectorAll('.section');

    // =============================================
    // Initialize on DOM Load
    // =============================================
    document.addEventListener('DOMContentLoaded', function () {
        initSmoothScroll();
        initHeaderScroll();
        initMobileNav();
        initResumeButton();
        initContactForm();
        initScrollTop();
        initScrollAnimations();
        setCurrentYear();
        setActiveNavOnScroll();
    });

    // =============================================
    // Set Current Year in Footer
    // =============================================
    function setCurrentYear() {
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }
    }

    // =============================================
    // Smooth Scroll Navigation
    // =============================================
    function initSmoothScroll() {
        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        navToggle.classList.remove('active');
                    }

                    // Update active link
                    setActiveNavLink(this);
                }
            });
        });
    }

    // =============================================
    // Set Active Navigation Link
    // =============================================
    function setActiveNavLink(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    // =============================================
    // Active Nav on Scroll
    // =============================================
    function setActiveNavOnScroll() {
        window.addEventListener('scroll', function () {
            let current = '';
            const headerHeight = header.offsetHeight;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 100;
                const sectionHeight = section.clientHeight;

                if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // =============================================
    // Header Scroll Effect
    // =============================================
    function initHeaderScroll() {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // =============================================
    // Mobile Navigation Toggle
    // =============================================
    function initMobileNav() {
        if (navToggle) {
            navToggle.addEventListener('click', function () {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // =============================================
    // Resume Button Functionality
    // =============================================
    function initResumeButton() {
        if (resumeBtn) {
            const btnText = resumeBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;

            // Hover effect - change text
            resumeBtn.addEventListener('mouseenter', function () {
                btnText.textContent = 'Show Resume';
            });

            resumeBtn.addEventListener('mouseleave', function () {
                btnText.textContent = originalText;
            });

            // Click handler - open PDF in new tab
            resumeBtn.addEventListener('click', function () {
                // Using placeholder path - update with actual resume path
                const resumePath = 'assets/resume.pdf';
                window.open(resumePath, '_blank');
            });
        }
    }

    // =============================================
    // Contact Form Submission
    // =============================================
    function initContactForm() {
        if (contactForm) {
            contactForm.addEventListener('submit', async function (e) {
                e.preventDefault();

                // Get form data
                const formData = {
                    name: document.getElementById('name').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    subject: document.getElementById('subject').value.trim(),
                    message: document.getElementById('message').value.trim()
                };

                // Basic validation
                if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                    showFormMessage('Please fill in all fields.', 'error');
                    return;
                }

                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email)) {
                    showFormMessage('Please enter a valid email address.', 'error');
                    return;
                }

                // Disable submit button to prevent double submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.querySelector('.btn-text').textContent;
                submitBtn.disabled = true;
                submitBtn.querySelector('.btn-text').textContent = 'Sending...';

                try {
                    // Make API call
                    const response = await fetch('/api/contact', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });

                    const data = await response.json();

                    if (response.ok) {
                        showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                        contactForm.reset();
                    } else {
                        throw new Error(data.message || 'Failed to send message');
                    }
                } catch (error) {
                    console.error('Form submission error:', error);
                    showFormMessage(
                        'Sorry, there was an error sending your message. Please try again or email me directly.',
                        'error'
                    );
                } finally {
                    // Re-enable submit button
                    submitBtn.disabled = false;
                    submitBtn.querySelector('.btn-text').textContent = originalBtnText;
                }
            });
        }
    }

    // =============================================
    // Show Form Message
    // =============================================
    function showFormMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = `form-message ${type}`;
            formMessage.style.display = 'block';

            // Auto-hide after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }

    // =============================================
    // Scroll to Top Button
    // =============================================
    function initScrollTop() {
        if (scrollTopBtn) {
            // Show/hide button based on scroll position
            window.addEventListener('scroll', function () {
                if (window.scrollY > 500) {
                    scrollTopBtn.style.opacity = '1';
                    scrollTopBtn.style.pointerEvents = 'auto';
                } else {
                    scrollTopBtn.style.opacity = '0';
                    scrollTopBtn.style.pointerEvents = 'none';
                }
            });

            // Scroll to top on click
            scrollTopBtn.addEventListener('click', function () {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            // Initialize as hidden
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.pointerEvents = 'none';
            scrollTopBtn.style.transition = 'opacity 0.3s ease';
        }
    }

    // =============================================
    // Scroll Animations with Intersection Observer
    // =============================================
    function initScrollAnimations() {
        // Elements to animate on scroll
        const animateElements = document.querySelectorAll(
            '.skill-category, .timeline-item, .info-item, .about-paragraph'
        );

        // Add fade-in class to elements
        animateElements.forEach(el => {
            el.classList.add('fade-in');
        });

        // Intersection Observer options
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        // Callback function
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optionally unobserve after animation
                    // observer.unobserve(entry.target);
                }
            });
        };

        // Create observer
        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe elements
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }

    // =============================================
    // Utility: Debounce Function
    // =============================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // =============================================
    // Performance: Optimize Scroll Listeners
    // =============================================
    // Wrap scroll-heavy functions in debounce for better performance
    const optimizedHeaderScroll = debounce(function () {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 10);

})();
