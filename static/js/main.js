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
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
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
}
