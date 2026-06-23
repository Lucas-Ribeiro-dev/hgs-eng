document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initRevealAnimation();
    initSmoothScroll();
    initServicesCarousel();
    initContactForm();
});

function initHeaderScroll() {
    const headerElement = document.getElementById('main-header');
    
    if (!headerElement) return;
    if (headerElement.classList.contains('header--solid')) return;

    function checkScroll() {
        if (window.scrollY > 10) {
            headerElement.classList.add('header--scrolled');
        } else {
            headerElement.classList.remove('header--scrolled');
        }
    }

    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(checkScroll);
    }, { passive: true });
    
    // Check on load
    checkScroll();
}

function initRevealAnimation() {
    const elements = document.querySelectorAll('.js-reveal');
    
    if (!elements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elements.forEach(el => observer.observe(el));
}

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initServicesCarousel() {
    const navItems = document.querySelectorAll('.services__nav-item');
    const services = document.querySelectorAll('.service-presentation');
    const pauseBtn = document.querySelector('.services__pause-btn');
    
    if (!navItems.length || !services.length) return;

    let currentIndex = 0;
    let intervalId;
    const intervalTime = 5000; // 5 seconds
    let isPaused = false;

    function showService(index) {
        // Remove active class from all
        navItems.forEach(item => item.classList.remove('is-active'));
        services.forEach(serv => serv.classList.remove('is-active'));

        // Add active class to current item
        navItems[index].classList.add('is-active');
        
        // Find target id and show corresponding service
        const targetId = navItems[index].getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.classList.add('is-active');
        }
    }

    function nextService() {
        currentIndex = (currentIndex + 1) % navItems.length;
        showService(currentIndex);
    }

    function startAutoLoop() {
        if (!isPaused) {
            intervalId = setInterval(nextService, intervalTime);
        }
    }

    function resetAutoLoop() {
        clearInterval(intervalId);
        if (!isPaused) {
            startAutoLoop();
        }
    }

    if (pauseBtn) {
        const iconPause = pauseBtn.querySelector('.icon-pause');
        const iconPlay = pauseBtn.querySelector('.icon-play');
        
        pauseBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            if (isPaused) {
                clearInterval(intervalId);
                iconPause.style.display = 'none';
                iconPlay.style.display = 'block';
                pauseBtn.setAttribute('aria-label', 'Continuar transição automática');
            } else {
                startAutoLoop();
                iconPause.style.display = 'block';
                iconPlay.style.display = 'none';
                pauseBtn.setAttribute('aria-label', 'Pausar transição automática');
            }
        });
    }

    // Add click events to nav
    navItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            showService(currentIndex);
            resetAutoLoop(); // Reset timer so it doesn't jump right after click
        });
    });

    // Start automatic loop
    startAutoLoop();

    const servicesSection = document.getElementById('services');
    if (servicesSection && pauseBtn) {
        const iconPause = pauseBtn.querySelector('.icon-pause');
        const iconPlay = pauseBtn.querySelector('.icon-play');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && isPaused) {
                    isPaused = false;
                    startAutoLoop();
                    if (iconPause && iconPlay) {
                        iconPause.style.display = 'block';
                        iconPlay.style.display = 'none';
                        pauseBtn.setAttribute('aria-label', 'Pausar transição automática');
                    }
                }
            });
        }, { threshold: 0 });
        observer.observe(servicesSection);
    }
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.classList.remove('is-invalid');
            
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('is-invalid');
            } else if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    input.classList.add('is-invalid');
                }
            }
        });
        
        if (isValid) {
            // In a real scenario, this would be an AJAX request
            alert('Message sent successfully!');
            form.reset();
        }
    });
}
