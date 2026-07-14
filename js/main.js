document.addEventListener('DOMContentLoaded', () => {
  // Page load transition trigger
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 50);

  // Toggle header border and backdrop filter on scroll
  const header = document.querySelector('header');
  const checkNavbarScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', checkNavbarScroll);
  checkNavbarScroll();

  // Mobile navigation menu toggle
  const navToggle = document.getElementById('navToggleBtn');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close when clicking layout links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll reveal animations observer
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          
          // Trigger dynamic stats counting
          const counterEl = entry.target.querySelector('.stat-counter');
          if (counterEl) {
            runStatsCounter(counterEl);
          }
          
          // Re-draw connection lines when the hero visual reveals
          if (entry.target.classList.contains('hero-visual') && typeof window.renderNodeWires === 'function') {
            window.renderNodeWires();
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // Smooth integer counter logic for stats block
  function runStatsCounter(element) {
    const maxVal = parseInt(element.getAttribute('data-target'), 10);
    const suffixStr = element.getAttribute('data-suffix') || '';
    const animDuration = 1800; // ms
    const delayStep = 30; // ms
    const totalSteps = Math.ceil(animDuration / delayStep);
    const stepIncrement = maxVal / totalSteps;
    let currentVal = 0;
    let indexStep = 0;

    const timer = setInterval(() => {
      indexStep++;
      currentVal += stepIncrement;
      if (indexStep >= totalSteps) {
        clearInterval(timer);
        element.textContent = maxVal.toLocaleString() + suffixStr;
      } else {
        element.textContent = Math.floor(currentVal).toLocaleString() + suffixStr;
      }
    }, delayStep);
  }

  // Google reviews carousel slider control bindings
  const scrollWrapper = document.getElementById('reviewsCarousel');
  const prevArrow = document.querySelector('.carousel-btn.prev');
  const nextArrow = document.querySelector('.carousel-btn.next');

  if (scrollWrapper && prevArrow && nextArrow) {
    const cardStepSize = () => {
      const singleCard = scrollWrapper.querySelector('.review-card');
      return singleCard ? singleCard.offsetWidth + 32 : 320;
    };

    nextArrow.addEventListener('click', () => {
      scrollWrapper.scrollBy({ left: cardStepSize(), behavior: 'smooth' });
    });

    prevArrow.addEventListener('click', () => {
      scrollWrapper.scrollBy({ left: -cardStepSize(), behavior: 'smooth' });
    });

    // Auto-dim navigation controls on carousel limits
    const updateArrowsState = () => {
      const scrollLimit = scrollWrapper.scrollWidth - scrollWrapper.clientWidth;
      prevArrow.style.opacity = scrollWrapper.scrollLeft <= 5 ? '0.5' : '1';
      prevArrow.style.pointerEvents = scrollWrapper.scrollLeft <= 5 ? 'none' : 'all';
      nextArrow.style.opacity = scrollWrapper.scrollLeft >= scrollLimit - 5 ? '0.5' : '1';
      nextArrow.style.pointerEvents = scrollWrapper.scrollLeft >= scrollLimit - 5 ? 'none' : 'all';
    };

    scrollWrapper.addEventListener('scroll', updateArrowsState);
    setTimeout(updateArrowsState, 300);
    window.addEventListener('resize', updateArrowsState);
  }

  // Interactive contact form submission mockup
  const contactForm = document.getElementById('contactForm');
  const successOverlay = document.getElementById('formSuccess');

  if (contactForm && successOverlay) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let validated = true;
      const inputsList = contactForm.querySelectorAll('.form-control');
      
      inputsList.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          validated = false;
          input.style.borderColor = 'var(--color-error)';
        } else {
          input.style.borderColor = '';
        }
      });

      if (!validated) return;

      // Animate submit button to loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const textCache = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <svg viewBox="0 0 50 50" style="animation: spinner-rot 1s linear infinite; width: 18px; height: 18px; fill: none;">
          <circle cx="25" cy="25" r="20" stroke="currentColor" stroke-width="5" stroke-dasharray="80, 200"></circle>
        </svg> Sending...
      `;
      submitBtn.disabled = true;

      // Mock network response delay
      setTimeout(() => {
        successOverlay.classList.add('visible');
        contactForm.reset();
        submitBtn.innerHTML = textCache;
        submitBtn.disabled = false;
      }, 1200);
    });

    const resetTrigger = document.getElementById('resetFormBtn');
    if (resetTrigger) {
      resetTrigger.addEventListener('click', () => {
        successOverlay.classList.remove('visible');
      });
    }
  }

  // Auto-fill query inputs from URL params
  const queryParams = new URLSearchParams(window.location.search);
  const selectedProduct = queryParams.get('product') || queryParams.get('subject');
  const dropdownSelect = document.getElementById('formSubject');
  
  if (selectedProduct && dropdownSelect) {
    const decodedValue = decodeURIComponent(selectedProduct).toLowerCase();
    for (let i = 0; i < dropdownSelect.options.length; i++) {
      if (dropdownSelect.options[i].value.toLowerCase() === decodedValue) {
        dropdownSelect.selectedIndex = i;
        break;
      }
    }
  }

  // Draw network canvas wire overlays
  const canvasNode = document.getElementById('techCanvas');
  const linesNode = document.getElementById('techLines');
  const coreHub = document.getElementById('centralHub');

  if (canvasNode && linesNode && coreHub) {
    window.renderNodeWires = () => {
      const canvasBounds = canvasNode.getBoundingClientRect();
      const coreBounds = coreHub.getBoundingClientRect();
      
      const hubCenterPointX = (coreBounds.left + coreBounds.width / 2) - canvasBounds.left;
      const hubCenterPointY = (coreBounds.top + coreBounds.height / 2) - canvasBounds.top;
      
      canvasNode.querySelectorAll('.grid-node').forEach((node, nodeIndex) => {
        const nodeBounds = node.getBoundingClientRect();
        const nodeCenterPointX = (nodeBounds.left + nodeBounds.width / 2) - canvasBounds.left;
        const nodeCenterPointY = (nodeBounds.top + nodeBounds.height / 2) - canvasBounds.top;
        
        const wireBgLine = document.getElementById(`bg-line-${nodeIndex}`);
        const wireFlowLine = document.getElementById(`flow-line-${nodeIndex}`);
        
        if (wireBgLine && wireFlowLine) {
          const coordinatesStr = `M ${nodeCenterPointX} ${nodeCenterPointY} L ${hubCenterPointX} ${hubCenterPointY}`;
          wireBgLine.setAttribute('d', coordinatesStr);
          wireFlowLine.setAttribute('d', coordinatesStr);
        }
      });
    };

    // Trigger wire renders
    setTimeout(window.renderNodeWires, 200);
    window.addEventListener('resize', window.renderNodeWires);
    window.addEventListener('scroll', window.renderNodeWires);
  }
});
