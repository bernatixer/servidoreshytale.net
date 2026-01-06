/**
 * NEXUS - Hytale Server Website
 * Interactive features and animations
 */

// ==========================================
// Particle System
// ==========================================
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 60;
        this.mouse = { x: null, y: null, radius: 100 };
        
        this.colors = [
            'rgba(63, 212, 217, 0.6)',   // Teal
            'rgba(212, 160, 18, 0.5)',    // Gold
            'rgba(139, 92, 246, 0.4)',    // Purple
            'rgba(255, 255, 255, 0.3)'    // White
        ];
        
        this.init();
        this.animate();
        this.addEventListeners();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this));
        }
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        this.connectParticles();
        requestAnimationFrame(() => this.animate());
    }
    
    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.15;
                    this.ctx.strokeStyle = `rgba(63, 212, 217, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(system) {
        this.system = system;
        this.x = Math.random() * system.canvas.width;
        this.y = Math.random() * system.canvas.height;
        this.size = Math.random() * 3 + 1;
        this.baseSize = this.size;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = system.colors[Math.floor(Math.random() * system.colors.length)];
    }
    
    update() {
        // Movement
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap around edges
        if (this.x > this.system.canvas.width + 10) this.x = -10;
        if (this.x < -10) this.x = this.system.canvas.width + 10;
        if (this.y > this.system.canvas.height + 10) this.y = -10;
        if (this.y < -10) this.y = this.system.canvas.height + 10;
        
        // Mouse interaction
        if (this.system.mouse.x !== null) {
            const dx = this.x - this.system.mouse.x;
            const dy = this.y - this.system.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.system.mouse.radius) {
                const force = (this.system.mouse.radius - distance) / this.system.mouse.radius;
                this.x += dx * force * 0.02;
                this.y += dy * force * 0.02;
                this.size = this.baseSize + force * 2;
            } else {
                this.size = this.baseSize;
            }
        }
    }
    
    draw() {
        this.system.ctx.fillStyle = this.color;
        this.system.ctx.beginPath();
        this.system.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.system.ctx.fill();
    }
}

// ==========================================
// Scroll Reveal
// ==========================================
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('[data-reveal]');
        this.init();
    }
    
    init() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('revealed');
                        }, index * 100);
                        this.observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        this.elements.forEach(el => this.observer.observe(el));
    }
}

// ==========================================
// Navigation
// ==========================================
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.mobileBtn = document.querySelector('.mobile-menu-btn');
        this.navLinks = document.querySelector('.nav-links');
        this.links = document.querySelectorAll('.nav-links a');
        
        this.init();
    }
    
    init() {
        // Scroll handler
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Mobile menu toggle
        if (this.mobileBtn) {
            this.mobileBtn.addEventListener('click', () => this.toggleMobile());
        }
        
        // Close mobile menu on link click
        this.links.forEach(link => {
            link.addEventListener('click', () => {
                this.mobileBtn?.classList.remove('active');
                this.navLinks?.classList.remove('active');
            });
        });
        
        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                this.mobileBtn?.classList.remove('active');
                this.navLinks?.classList.remove('active');
            }
        });
    }
    
    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar?.classList.add('scrolled');
        } else {
            this.navbar?.classList.remove('scrolled');
        }
    }
    
    toggleMobile() {
        this.mobileBtn?.classList.toggle('active');
        this.navLinks?.classList.toggle('active');
    }
}

// ==========================================
// Copy IP
// ==========================================
class CopyIP {
    constructor() {
        this.btn = document.getElementById('copyIp');
        this.ipText = document.getElementById('ipText');
        this.toast = document.getElementById('toast');
        this.ip = 'play.nexus.gg';
        
        if (this.btn) {
            this.btn.addEventListener('click', () => this.copy());
        }
    }
    
    async copy() {
        try {
            await navigator.clipboard.writeText(this.ip);
            this.showToast();
            
            // Visual feedback
            if (this.ipText) {
                const originalText = this.ipText.textContent;
                this.ipText.textContent = '¡Copiado!';
                setTimeout(() => {
                    this.ipText.textContent = originalText;
                }, 2000);
            }
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = this.ip;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast();
        }
    }
    
    showToast() {
        if (this.toast) {
            this.toast.classList.add('show');
            setTimeout(() => {
                this.toast.classList.remove('show');
            }, 3000);
        }
    }
}

// ==========================================
// Smooth Scroll for anchor links
// ==========================================
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ==========================================
// Hero Parallax Effect (Disabled - kept static)
// ==========================================
class HeroParallax {
    constructor() {
        // Parallax disabled - hero stays static on scroll
    }
}

// ==========================================
// Counter Animation
// ==========================================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-value');
        this.init();
    }
    
    init() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );
        
        this.counters.forEach(counter => this.observer.observe(counter));
    }
    
    animateCounter(element) {
        const text = element.textContent;
        const match = text.match(/(\d+)/);
        
        if (!match) return;
        
        const target = parseInt(match[0], 10);
        const suffix = text.replace(match[0], '');
        const duration = 1500;
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);
            
            element.textContent = current.toLocaleString() + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// ==========================================
// Typing Effect for Hero Tagline
// ==========================================
class TypingEffect {
    constructor(selector, phrases, options = {}) {
        this.element = document.querySelector(selector);
        if (!this.element) return;
        
        this.phrases = phrases;
        this.typeSpeed = options.typeSpeed || 80;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.pauseDuration = options.pauseDuration || 2000;
        this.currentPhraseIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        
        // Start after a delay
        setTimeout(() => this.type(), 1000);
    }
    
    type() {
        const currentPhrase = this.phrases[this.currentPhraseIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentPhrase.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentPhrase.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }
        
        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
        
        if (!this.isDeleting && this.currentCharIndex === currentPhrase.length) {
            typeSpeed = this.pauseDuration;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.phrases.length;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// ==========================================
// Initialize Everything
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Core features
    new ParticleSystem('particles');
    new ScrollReveal();
    new Navigation();
    new CopyIP();
    new SmoothScroll();
    new HeroParallax();
    new CounterAnimation();
    
    // Optional: Typing effect for tagline
    // Uncomment to enable rotating taglines
    /*
    new TypingEffect('.hero-tagline', [
        'Donde comienza tu próxima gran aventura',
        'La comunidad que esperábamos',
        'Tu hogar en Hytale'
    ]);
    */
    
    // Add loaded class to body for entrance animations
    document.body.classList.add('loaded');
    
    console.log('%c🌟 NEXUS Server %c Bienvenido al mejor servidor de Hytale en español', 
        'background: linear-gradient(135deg, #14a3a8, #0d7377); color: white; padding: 8px 16px; border-radius: 4px 0 0 4px; font-weight: bold;',
        'background: #1e2844; color: #f5c542; padding: 8px 16px; border-radius: 0 4px 4px 0;'
    );
});

// ==========================================
// Utility: Debounce
// ==========================================
function debounce(func, wait = 20) {
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

// ==========================================
// Handle video loading fallback
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('.hero-video');
    if (video) {
        video.addEventListener('error', () => {
            // If video fails to load, apply a gradient background instead
            const heroBg = document.querySelector('.hero-bg');
            if (heroBg) {
                heroBg.style.background = `
                    radial-gradient(ellipse at center, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                    radial-gradient(ellipse at 80% 20%, rgba(63, 212, 217, 0.2) 0%, transparent 40%),
                    linear-gradient(135deg, #0a0e1a 0%, #151d32 50%, #0a0e1a 100%)
                `;
                video.style.display = 'none';
            }
        });
    }
});

