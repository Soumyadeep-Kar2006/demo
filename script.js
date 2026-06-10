document.addEventListener("DOMContentLoaded", function() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));

    const msgInput = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    if (msgInput && charCount) {
        msgInput.addEventListener('input', function() {
            charCount.textContent = this.value.length + ' / 1000';
        });
    }

    window.sendViaGmail = function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const inquiry = document.getElementById('inquiry').value;
        const subject = document.getElementById('subject') ? document.getElementById('subject').value.trim() : '';
        const message = document.getElementById('message').value.trim();
        if (!name || !email || !message) return;
        const details = [];
        details.push('Name: ' + name);
        details.push('Email: ' + email);
        if (phone) details.push('Phone: ' + phone);
        if (inquiry) details.push('Inquiry Type: ' + inquiry);
        const body = details.join('%0A') + '%0A%0A' + message;
        window.location.href = 'mailto:skinowearofficial@gmail.com?subject=' + encodeURIComponent(subject || 'New Inquiry from ' + name) + '&body=' + body;
    };

    window.toggleMenu = function() {
        const menu = document.getElementById('mobileMenu');
        const icon = document.getElementById('menuIcon');
        if (menu.classList.contains('hidden')) {
            menu.classList.remove('hidden');
            menu.classList.add('flex');
            icon.textContent = 'close';
        } else {
            menu.classList.add('hidden');
            menu.classList.remove('flex');
            icon.textContent = 'menu';
        }
    };

    document.querySelectorAll('#mobileMenu a').forEach(link => {
        link.addEventListener('click', function() {
            document.getElementById('mobileMenu').classList.add('hidden');
            document.getElementById('mobileMenu').classList.remove('flex');
            document.getElementById('menuIcon').textContent = 'menu';
        });
    });

    const nav = document.querySelector('nav');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('shadow-lg');
        } else {
            nav.classList.remove('shadow-lg');
        }
    });

    const thumb = document.querySelector('.toggle-thumb');
    const track = document.querySelector('.toggle-switch');

    window.toggleTheme = function() {
        const body = document.body;
        const html = document.documentElement;
        const isLight = body.classList.contains('light-mode');

        if (isLight) {
            body.classList.remove('light-mode');
            html.classList.add('dark');
            if (thumb) thumb.classList.remove('light');
            if (track) {
                track.style.backgroundColor = '#4c4546';
                track.style.borderColor = 'rgba(212,175,55,0.2)';
            }
        } else {
            body.classList.add('light-mode');
            html.classList.remove('dark');
            if (thumb) thumb.classList.add('light');
            if (track) {
                track.style.backgroundColor = '#e9c349';
                track.style.borderColor = '#e9c349';
            }
        }
    };

    if (track) {
        track.style.backgroundColor = '#4c4546';
        track.style.borderColor = 'rgba(212,175,55,0.2)';
    }

    let galleryImages = [];
    let currentIndex = 0;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCounter = document.getElementById('lightboxCounter');

    function initGallery() {
        const items = document.querySelectorAll('.gallery-item');
        galleryImages = [];
        items.forEach((item, i) => {
            const img = item.querySelector('img');
            if (img) {
                galleryImages.push({ src: img.src, alt: img.alt });
                item.addEventListener('click', function(e) {
                    if (e.target.closest('.glass-panel')) return;
                    currentIndex = i;
                    openLightbox();
                });
            }
        });
    }

    window.openLightbox = function() {
        if (!galleryImages.length) return;
        lightboxImg.src = galleryImages[currentIndex].src;
        lightboxImg.alt = galleryImages[currentIndex].alt;
        lightboxCounter.textContent = (currentIndex + 1) + ' / ' + galleryImages.length;
        document.getElementById('lightboxPrev').style.display = galleryImages.length > 1 ? 'flex' : 'none';
        document.getElementById('lightboxNext').style.display = galleryImages.length > 1 ? 'flex' : 'none';
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
        requestAnimationFrame(() => lightbox.classList.add('show'));
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function(e) {
        if (e && e.target !== e.currentTarget) return;
        lightbox.classList.remove('show');
        setTimeout(() => {
            lightbox.classList.add('hidden');
            lightbox.classList.remove('flex');
            document.body.style.overflow = '';
        }, 300);
    };

    window.navigateLightbox = function(dir) {
        currentIndex = (currentIndex + dir + galleryImages.length) % galleryImages.length;
        lightboxImg.style.transform = 'scale(0.9)';
        requestAnimationFrame(() => {
            lightboxImg.src = galleryImages[currentIndex].src;
            lightboxImg.alt = galleryImages[currentIndex].alt;
            lightboxCounter.textContent = (currentIndex + 1) + ' / ' + galleryImages.length;
            requestAnimationFrame(() => lightboxImg.style.transform = '');
        });
    };

    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('show')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    initGallery();
});
