document.addEventListener('DOMContentLoaded', function() {
    initPageScripts();
});

function initPageScripts() {
    const burgerMenu = document.querySelector('.burger-menu');
    const headerNav = document.querySelector('.header__nav');

    if (burgerMenu && headerNav) {
        burgerMenu.addEventListener('click', function() {
            burgerMenu.classList.toggle('active');
            headerNav.classList.toggle('active');
        });
    }


    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });

    // Подсветка активного пункта меню
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav__link, .dropdown__menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href) && href !== '/') {
            link.classList.add('active');
            // Если ссылка внутри выпадающего меню, подсвечиваем родителя
            const parentDropdown = link.closest('.nav__dropdown');
            if (parentDropdown) {
                const parentLink = parentDropdown.querySelector('.nav__link');
                if (parentLink) parentLink.classList.add('active');
            }
        } else if (href === '/' && currentPath === '/') {
            link.classList.add('active');
        }
    });

    initCookieBanner();
}

function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');

    if (!banner || !acceptBtn) return;

    // Проверяем, было ли уже дано согласие
    const cookiesAccepted = localStorage.getItem('cookies-accepted');

    if (!cookiesAccepted) {
        // Показываем плашку с небольшой задержкой
        setTimeout(() => {
            banner.classList.add('cookie-banner--visible');
        }, 1000);
    }

    acceptBtn.addEventListener('click', function() {
        localStorage.setItem('cookies-accepted', 'true');
        banner.classList.remove('cookie-banner--visible');
    });
}

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Закрываем все остальные пункты (опционально)
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Тоглим текущий
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Вызов инициализации FAQ
document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
});
