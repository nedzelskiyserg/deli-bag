document.addEventListener('DOMContentLoaded', function () {
  // --- Typewriter Effect ---
  function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }

    type();
  }

  // Start typewriter effect after a delay
  setTimeout(() => {
    const typewriterText = document.getElementById('typewriter-text');
    if (typewriterText) {
      typeWriter(typewriterText, 'и никаких сюрпризов', 80);
    }
  }, 1000);

  // --- Mobile Menu Toggle ---
  const burgerBtn = document.querySelector('.header__burger-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const body = document.body;

  if (burgerBtn) {
    burgerBtn.addEventListener('click', function () {
      body.classList.toggle('mobile-nav-active');
    });
  }

  // Close mobile menu when clicking on links
  if (mobileNav) {
    mobileNav.addEventListener('click', function (e) {
      if (e.target.matches('.nav__link')) {
        body.classList.remove('mobile-nav-active');
      }
    });
  }

  // --- Modal Functionality ---
  const modal = document.getElementById('testdrive-modal');
  const modalOverlay = modal.querySelector('.modal__overlay');
  const modalClose = modal.querySelector('.modal__close');
  const testdriveBtns = document.querySelectorAll('.header__testdrive-btn, .main-block__btn--primary, .testdrive__btn, .contacts__btn, .about__btn, .future-delivery__btn, .delibag-lite__btn');

  // Body scroll-lock helpers — preserve scroll position, robust on iOS Safari
  let savedScrollY = 0;

  function lockBodyScroll() {
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    body.style.position = 'fixed';
    body.style.top = `-${savedScrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.classList.add('modal-open');
  }

  function unlockBodyScroll() {
    body.classList.remove('modal-open');
    body.style.position = '';
    body.style.top = '';
    body.style.left = '';
    body.style.right = '';
    body.style.width = '';
    window.scrollTo(0, savedScrollY);
  }

  // Open modal
  function openModal() {
    lockBodyScroll();
    modal.classList.add('modal--active');
    modal.setAttribute('aria-hidden', 'false');
    modal.scrollTop = 0;
  }

  // Close modal
  function closeModal() {
    modal.classList.remove('modal--active');
    modal.setAttribute('aria-hidden', 'true');
    setTimeout(unlockBodyScroll, 250);
  }

  // Event listeners for opening modal
  testdriveBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });

  // Event listeners for closing modal
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);

  // Close modal on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('modal--active')) {
      closeModal();
    }
  });

  // --- Smooth Scrolling ---
  const navLinks = document.querySelectorAll('.nav__link');
  const header = document.querySelector('.header');

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Only prevent default for internal anchor links
      if (href && href.startsWith('#')) {
        e.preventDefault();

        const targetElement = document.querySelector(href);
        if (targetElement) {
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // FAQ logic (оставляем как есть)
  const items = document.querySelectorAll('.faq__item');
  const questions = document.querySelectorAll('.faq__question-row');

  questions.forEach((btn, idx) => {
    btn.addEventListener('click', function () {
      const item = btn.closest('.faq__item');
      const answer = item.querySelector('.faq__answer');
      const isOpen = item.classList.contains('faq__item--active');

      // Закрыть все
      items.forEach((it) => {
        it.classList.remove('faq__item--active');
        const ans = it.querySelector('.faq__answer');
        ans.style.maxHeight = null;
        it.querySelector('.faq__question-row').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('faq__item--active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Секции с анимацией
  const animatedSections = [
    { selector: '.features-section', className: 'features-section--visible' },
    { selector: '.unique-features', className: 'unique-features--visible' },
    { selector: '.gallery', className: 'gallery--visible' },
    { selector: '.testdrive', className: 'testdrive--visible' },
    { selector: '.preview360__container', className: 'preview360--visible' },
    { selector: '.delibag-lite', className: 'delibag-lite--visible' },
    { selector: '.about', className: 'about--visible' },
    { selector: '.users', className: 'users--visible' },
    { selector: '.app-download', className: 'app-download--visible' }
  ];

  function animateClosestSection() {
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const centerY = windowHeight / 2;
    let closestSection = null;
    let minDist = Infinity;
    animatedSections.forEach(({ selector, className }) => {
      const el = document.querySelector(selector);
      if (!el || el.classList.contains(className)) return;
      const rect = el.getBoundingClientRect();
      const dist = Math.abs(rect.top - centerY);
      if (rect.top < windowHeight && dist < minDist) {
        minDist = dist;
        closestSection = { el, className };
      }
    });
    if (closestSection) {
      closestSection.el.classList.add(closestSection.className);
    }
  }

  window.addEventListener('scroll', animateClosestSection);
  window.addEventListener('resize', animateClosestSection);
  animateClosestSection(); // на случай, если уже видно при загрузке


  // --- Cookie banner ---
  const cookieKey = 'db_cookie_consent_v1';
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');

  if (cookieBanner) {
    const stored = localStorage.getItem(cookieKey);
    if (!stored) {
      cookieBanner.classList.add('cookie-banner--visible');
    }
    if (cookieAcceptBtn) {
      cookieAcceptBtn.addEventListener('click', function () {
        try {
          localStorage.setItem(cookieKey, JSON.stringify({
            accepted: true,
            ts: new Date().toISOString()
          }));
        } catch (e) {
          /* localStorage unavailable — silent */
        }
        cookieBanner.classList.remove('cookie-banner--visible');
      });
    }
  }

});