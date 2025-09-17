// Premium Effects and Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all premium effects
    initSmoothScrolling();
    initParallaxEffects();
    initCardAnimations();
    initLoadingStates();
    initTouchGestures();
    initPerformanceOptimizations();
});

// Smooth scrolling for better UX
function initSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Parallax effects for hero section
function initParallaxEffects() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
}

// Card animations and interactions
function initCardAnimations() {
    // Intersection Observer for card animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards
    document.querySelectorAll('.category-card, .model-card, .product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        observer.observe(card);
    });

    // Enhanced hover effects
    document.querySelectorAll('.category-card, .model-card, .product-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Loading states and transitions
function initLoadingStates() {
    // Add loading animation to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('loading')) return;
            
            this.classList.add('loading');
            const originalText = this.textContent;
            this.textContent = 'Загрузка...';
            
            // Simulate loading
            setTimeout(() => {
                this.classList.remove('loading');
                this.textContent = originalText;
            }, 1000);
        });
    });

    // Page transition effects
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            // Add fade out effect
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
}

// Touch gestures for mobile
function initTouchGestures() {
    let startY = 0;
    let startX = 0;
    let isScrolling = false;

    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
        isScrolling = false;
    });

    document.addEventListener('touchmove', function(e) {
        if (!isScrolling) {
            const currentY = e.touches[0].clientY;
            const currentX = e.touches[0].clientX;
            const diffY = Math.abs(currentY - startY);
            const diffX = Math.abs(currentX - startX);
            
            if (diffY > diffX) {
                isScrolling = true;
            }
        }
    });

    // Swipe gestures for cards
    document.querySelectorAll('.category-card, .model-card, .product-card').forEach(card => {
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        let isDragging = false;

        card.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
        });

        card.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
            
            const diffX = currentX - startX;
            const diffY = currentY - startY;
            
            if (Math.abs(diffX) > Math.abs(diffY)) {
                e.preventDefault();
                this.style.transform = `translateX(${diffX * 0.5}px) rotateY(${diffX * 0.1}deg)`;
            }
        });

        card.addEventListener('touchend', function() {
            if (!isDragging) return;
            
            isDragging = false;
            this.style.transform = 'translateX(0) rotateY(0)';
            
            const diffX = currentX - startX;
            if (Math.abs(diffX) > 50) {
                // Trigger card action
                this.click();
            }
        });
    });
}

// Performance optimizations
function initPerformanceOptimizations() {
    // Lazy loading for images (if any are added later)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Debounced scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(function() {
            // Scroll-based effects can be added here
        }, 10);
    });

    // Preload critical resources
    const criticalPages = ['index.html', 'apple-store.html'];
    criticalPages.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        document.head.appendChild(link);
    });
}

// Enhanced button interactions
function enhanceButtons() {
    document.querySelectorAll('button, .category-button, .model-button, .buy-button').forEach(button => {
        // Ripple effect
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add ripple effect CSS
const rippleCSS = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.loading {
    position: relative;
    pointer-events: none;
}

.loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Initialize enhanced buttons when DOM is ready
document.addEventListener('DOMContentLoaded', enhanceButtons);

// Export functions for global use
window.PremiumEffects = {
    initSmoothScrolling,
    initParallaxEffects,
    initCardAnimations,
    initLoadingStates,
    initTouchGestures,
    initPerformanceOptimizations,
    enhanceButtons
};
