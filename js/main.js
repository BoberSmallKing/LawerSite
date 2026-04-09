document.addEventListener('DOMContentLoaded', function() {
  loadLayout()
    .then(function() {
    initPageScripts();
  })
    .catch(function() {
    initPageScripts();
  });
});

function getComponentsBasePath() {
  var path = window.location.pathname || '';
  if (path.indexOf('/pages/') !== -1) {
    return '../components/';
  }
  return 'components/';
}

function loadLayout() {
    const headerTarget = document.getElementById('header');
    const footerTarget = document.getElementById('footer');
    const requests = [];
  const basePath = getComponentsBasePath();

    if (headerTarget) {
        requests.push(
      fetch(basePath + 'header.html')
                .then(function(response) {
                    return response.text();
                })
                .then(function(html) {
                    headerTarget.innerHTML = html;
                })
        );
    }

    if (footerTarget) {
        requests.push(
      fetch(basePath + 'footer.html')
                .then(function(response) {
                    return response.text();
                })
                .then(function(html) {
                    footerTarget.innerHTML = html;
                })
        );
    }

    if (requests.length === 0) {
        return Promise.resolve();
    }

    return Promise.all(requests);
}

function initPageScripts() {
    const burgerMenu = document.querySelector('.burger-menu');
    const headerNav = document.querySelector('.header__nav');
    const openSubmenuBtn = document.querySelector('.js-open-submenu');
    const closeSubmenuBtn = document.querySelector('.js-close-submenu');

    if (burgerMenu && headerNav) {
        burgerMenu.addEventListener('click', function() {
            burgerMenu.classList.toggle('active');
            headerNav.classList.toggle('active');
            // При закрытии основного меню, также убираем вложенное
            if (!headerNav.classList.contains('active')) {
                headerNav.classList.remove('show-submenu');
            }
        });
    }

    if (openSubmenuBtn && headerNav) {
        openSubmenuBtn.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                headerNav.classList.add('show-submenu');
            }
        });
    }

    if (closeSubmenuBtn && headerNav) {
        closeSubmenuBtn.addEventListener('click', function() {
            headerNav.classList.remove('show-submenu');
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

    const animateElements = document.querySelectorAll('.stats__item, .service-card, .team__member, .approach__item, .advantage__item, .pricing__item');
    animateElements.forEach(function(el) {
        observer.observe(el);
    });

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isServiceDetailsPage = currentPage.indexOf('service-') === 0;
    const navLinks = document.querySelectorAll('.nav__link');

    navLinks.forEach(function(link) {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
        if (isServiceDetailsPage && href === 'services.html') {
            link.classList.add('active');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
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

let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        const headerNav = document.querySelector('.header__nav');
        if (window.innerWidth > 768 && headerNav) {
            headerNav.classList.remove('active', 'show-submenu');
            document.querySelector('.burger-menu').classList.remove('active');
        }
    }, 250);
});
