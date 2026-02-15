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
  const modalForm = document.getElementById('testdrive-form');

  // Open modal
  function openModal() {
    modal.classList.add('modal--active');
    body.classList.add('modal-open');

    // Focus on first input and initialize components
    setTimeout(() => {
      const firstInput = modal.querySelector('.form__input');
      if (firstInput) firstInput.focus();

      // Initialize phone mask and city select
      initPhoneMask();
      initCityLogic();
    }, 300);
  }

  // Close modal
  function closeModal() {
    modal.classList.remove('modal--active');
    body.classList.remove('modal-open');

    // Reset form
    if (modalForm) {
      modalForm.reset();
    }
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

  // Form submission
  if (modalForm) {
    modalForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(modalForm);
      const data = Object.fromEntries(formData);

      let isValid = true;
      let finalCity = '';

      // Clear all previous errors
      const inputs = modalForm.querySelectorAll('.form__input');
      inputs.forEach(input => clearError(input));

      // 1. Validate Name
      const nameInput = document.getElementById('name');
      if (!nameInput.value.trim()) {
        showError(nameInput, 'Это поле обязательно для заполнения');
        isValid = false;
      }

      // 2. Validate Phone
      const phoneInput = document.getElementById('phone');
      const phoneValue = phoneInput.value;
      if (!phoneValue) {
        showError(phoneInput, 'Введите номер телефона');
        isValid = false;
      } else if (phoneValue.length !== 18) {
        showError(phoneInput, 'Введите корректный номер: +7 (XXX) XXX-XX-XX');
        isValid = false;
      }

      // 3. Validate Email
      const emailInput = document.getElementById('email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        showError(emailInput, 'Введите email');
        isValid = false;
      } else if (!emailRegex.test(emailInput.value)) {
        showError(emailInput, 'Введите корректный email адрес');
        isValid = false;
      }

      // 4. Validate City
      const citySelect = document.getElementById('city-select');
      const customCityInput = document.getElementById('custom-city');

      if (!citySelect.value) {
        showError(citySelect, 'Выберите город из списка');
        isValid = false;
      } else if (citySelect.value === 'other') {
        if (!customCityInput.value.trim()) {
          showError(customCityInput, 'Введите название вашего города');
          isValid = false;
        } else {
          finalCity = customCityInput.value.trim();
        }
      } else {
        finalCity = citySelect.value;
      }

      if (!isValid) return;

      // Show loading state
      const submitBtn = modalForm.querySelector('.modal__btn');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `
        <span class="btn__text">Отправка...</span>
        <span class="btn__icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1V5M10 15V19M3.93 3.93L7.07 7.07M12.93 12.93L16.07 16.07M1 10H5M15 10H19M3.93 16.07L7.07 12.93M12.93 7.07L16.07 3.93" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      `;

      submitBtn.disabled = true;

      // Prepare payload for backend
      const payload = {
        name: data['Имя'],
        phone: data['Телефон'],
        email: data['Email'],
        city: finalCity,
        message: data['Дополнительная информация']
      };

      fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(response => {
          if (response.ok) {
            // Show success message
            submitBtn.innerHTML = `
            <span class="btn__text">Отправлено!</span>
            <span class="btn__icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6667 5L7.5 14.1667L3.33334 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          `;

            submitBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';

            // Reset button after 3 seconds
            setTimeout(() => {
              submitBtn.innerHTML = originalText;
              submitBtn.style.background = '';
              submitBtn.disabled = false;
              closeModal();
            }, 3000);

            console.log('Form submitted successfully');
          } else {
            throw new Error('Network response was not ok');
          }
        })
        .catch(function (error) {
          // Show error message
          submitBtn.innerHTML = `
          <span class="btn__text">Ошибка отправки</span>
          <span class="btn__icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 1L18 18H2L10 1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        `;

          submitBtn.style.background = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';

          // Reset button after 3 seconds
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 3000);

          console.error('Form submission failed:', error);
        });
    });
  }

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

  // Open modal
  function openModal() {
    modal.classList.add('modal--active');
    body.classList.add('modal-open');

    // Focus on first input and initialize components
    setTimeout(() => {
      const firstInput = modal.querySelector('.form__input');
      if (firstInput) firstInput.focus();

      // Initialize phone mask and city select
      initPhoneMask();
      initCityLogic();
    }, 300);
  }

  // --- Scroll Animation ---

  // --- Phone Mask ---
  function initPhoneMask() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, ''); // Убираем все нецифры

      if (value.length === 0) {
        e.target.value = '';
        return;
      }

      // Форматируем номер
      let formattedValue = '';

      if (value.length >= 1) {
        formattedValue = '+7';
      }

      if (value.length >= 2) {
        formattedValue += ' (';
      }

      if (value.length >= 5) {
        formattedValue += value.substring(1, 4) + ') ';
      } else if (value.length >= 2) {
        formattedValue += value.substring(1);
      }

      if (value.length >= 8) {
        formattedValue += value.substring(4, 7) + '-';
      } else if (value.length >= 5) {
        formattedValue += value.substring(4);
      }

      if (value.length >= 10) {
        formattedValue += value.substring(7, 9) + '-';
      } else if (value.length >= 8) {
        formattedValue += value.substring(7);
      }

      if (value.length >= 12) {
        formattedValue += value.substring(9, 11);
      } else if (value.length >= 10) {
        formattedValue += value.substring(9);
      }

      e.target.value = formattedValue;
    });

    // Обработка удаления символов
    phoneInput.addEventListener('keydown', function (e) {
      if (e.key === 'Backspace') {
        const cursorPosition = e.target.selectionStart;
        const value = e.target.value;

        // Если курсор находится перед скобкой или дефисом, пропускаем их
        if (value[cursorPosition - 1] === '(' ||
          value[cursorPosition - 1] === ')' ||
          value[cursorPosition - 1] === ' ' ||
          value[cursorPosition - 1] === '-') {
          e.preventDefault();
          e.target.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
        }
      }
    });
  }

  // --- Validation Helpers ---
  function showError(input, message) {
    const errorSpan = input.parentNode.querySelector('.error-message');
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.classList.add('error-message--visible');
    }
    input.classList.add('form__input--error');
  }

  function clearError(input) {
    const errorSpan = input.parentNode.querySelector('.error-message');
    if (errorSpan) {
      errorSpan.classList.remove('error-message--visible');
    }
    input.classList.remove('form__input--error');
  }

  // --- Real-time Validation ---
  function initValidation() {
    const inputs = document.querySelectorAll('.form__input');
    inputs.forEach(input => {
      // Clear error on input
      input.addEventListener('input', function () {
        clearError(this);
      });

      // Validate on blur (optional, can be annoying if too aggressive)
      input.addEventListener('blur', function () {
        if (this.value.trim() !== '') {
          // Only validate on blur if user entered something, implies they finished typing
          if (this.id === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.value)) showError(this, 'Некорректный email');
          } else if (this.id === 'phone') {
            if (this.value.length !== 18) showError(this, 'Неполный номер');
          }
        }
      });
    });
  }

  // --- Native City Logic ---
  function initCityLogic() {
    const citySelect = document.getElementById('city-select');
    const customCityContainer = document.getElementById('custom-city-container');
    const customCityInput = document.getElementById('custom-city');

    if (!citySelect || !customCityContainer) return;

    citySelect.addEventListener('change', function () {
      clearError(this); // Clear select error
      if (this.value === 'other') {
        customCityContainer.style.display = 'block';
        setTimeout(() => {
          customCityContainer.classList.add('custom-city-input--visible');
          if (customCityInput) customCityInput.focus();
        }, 10);
      } else {
        customCityContainer.classList.remove('custom-city-input--visible');
        setTimeout(() => {
          customCityContainer.style.display = 'none';
          if (customCityInput) {
            customCityInput.value = '';
            clearError(customCityInput); // Clear custom input error
          }
        }, 300);
      }
    });
  }

  // Initialize validation listeners
  initValidation();

});