// ===============================
// OPTIMIZED CROSS-BROWSER JAVASCRIPT
// Full browser compatibility, error handling, and performance
// ===============================

(function() {
  'use strict';

  // ===============================
  // BROWSER COMPATIBILITY CHECKS
  // ===============================
  
  // Check for required features
  var isModernBrowser = (
    'addEventListener' in window &&
    'querySelector' in document &&
    'classList' in document.createElement('div') &&
    'requestAnimationFrame' in window
  );

  if (!isModernBrowser) {
    console.warn('Browser does not support required features. Some functionality may be limited.');
  }

  // Polyfills
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) { return setTimeout(callback, 1000 / 60); };
  }

  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector;
  }

  if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
      var el = this;
      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }

  // ===============================
  // CONFIGURATION
  // ===============================
  var CONFIG = {
    animations: {
      preloaderDelay: 0,
      preloaderDuration: 3000,
      scrollIconDelay: 15000,
      counterDuration: 2000,
      slideTransition: 700,
      sidebarTransition: 800,
      faqTransition: 400
    },
    breakpoints: {
      mobile: 767,
      tablet: 1024,
      desktop: 1400
    },
    donation: {
      sandboxMode: false,
      paypalButtonId: 'YOUR_HOSTED_BUTTON_ID',
      currency: 'USD',
      defaultAmount: 25
    },
    performance: {
      debounceDelay: 250,
      throttleDelay: 100,
      lazyLoadOffset: 50
    }
  };

  // ===============================
  // UTILITY FUNCTIONS
  // ===============================
  
  // Safe query selector with error handling
  function safeQuery(selector, context) {
    try {
      context = context || document;
      return context.querySelector(selector);
    } catch (e) {
      console.error('Invalid selector:', selector, e);
      return null;
    }
  }

  function safeQueryAll(selector, context) {
    try {
      context = context || document;
      return Array.prototype.slice.call(context.querySelectorAll(selector));
    } catch (e) {
      console.error('Invalid selector:', selector, e);
      return [];
    }
  }

  // Debounce function for performance
  function debounce(func, wait) {
    var timeout;
    return function executedFunction() {
      var context = this;
      var args = arguments;
      var later = function() {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function for performance
  function throttle(func, limit) {
    var inThrottle;
    return function() {
      var args = arguments;
      var context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function() { inThrottle = false; }, limit);
      }
    };
  }

  // Check if mobile device
  function isMobile() {
    return window.innerWidth <= CONFIG.breakpoints.mobile ||
           ('ontouchstart' in window && navigator.maxTouchPoints > 0);
  }

  // Check if reduced motion is preferred
  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // ===============================
  // LAZY LOADING
  // ===============================
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      var lazyImages = safeQueryAll('img[loading="lazy"]');
      var imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: CONFIG.performance.lazyLoadOffset + 'px'
      });

      lazyImages.forEach(function(img) {
        imageObserver.observe(img);
      });
    }
  }

  // ===============================
  // MAIN INITIALIZATION
  // ===============================
  document.addEventListener('DOMContentLoaded', function() {
    try {
      initLazyLoading();
      initializeApp();
    } catch (error) {
      console.error('Initialization error:', error);
      // Fallback: show content even if scripts fail
      showContentFallback();
    }
  });

  function showContentFallback() {
    var preloader = safeQuery('.preloader');
    var header = safeQuery('.main-header');
    var section0 = safeQuery('#section0');
    
    if (preloader) preloader.style.display = 'none';
    if (header) {
      header.style.opacity = '1';
      header.style.visibility = 'visible';
    }
    if (section0) {
      section0.style.opacity = '1';
      section0.style.visibility = 'visible';
    }
  }

  function initializeApp() {
    // Remove hash from URL on load
    if (window.location.hash) {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }

    var fullpageInstance = null;
    var isMobileMode = isMobile();
    var reducedMotion = prefersReducedMotion();

    // ===============================
    // NAVIGATION FUNCTIONS
    // ===============================
    function highlightActiveMenuItem(sectionIndex) {
      var menuItems = safeQueryAll('.menu .nav-item, .mobile-nav-link');
      menuItems.forEach(function(item) {
        item.classList.remove('aactive');
      });
      
      var desktopItems = safeQueryAll('.menu .nav-item');
      var mobileItems = safeQueryAll('.mobile-nav-link');
      
      if (desktopItems[sectionIndex]) {
        desktopItems[sectionIndex].classList.add('aactive');
      }
      if (mobileItems[sectionIndex]) {
        mobileItems[sectionIndex].classList.add('aactive');
      }
    }

    function updateMenuStyle(sectionIndex) {
      var body = document.body;
      if (sectionIndex === 1) {
        body.classList.add('invert-menu');
      } else {
        body.classList.remove('invert-menu');
      }
    }

    // ===============================
    // PRELOADER ANIMATION
    // ===============================
    function initPreloader() {
      if (reducedMotion) {
        // Skip animations for users who prefer reduced motion
        showContentFallback();
        return;
      }

      // Initialize menu state
      var initialSection = 0;
      highlightActiveMenuItem(initialSection);
      updateMenuStyle(initialSection);

      // Check if GSAP is loaded
      if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded, skipping animations');
        showContentFallback();
        return;
      }

      try {
        var tl = gsap.timeline({ delay: CONFIG.animations.preloaderDelay / 1000 });
        
        tl.to('.col', { top: '0', duration: 3, ease: 'power4.inOut' });
        tl.to('.c-1 .item', { top: '0', stagger: 0.25, duration: 3, ease: 'power4.inOut' }, '-=2');
        tl.to('.c-2 .item', { top: '0', stagger: -0.25, duration: 3, ease: 'power4.inOut' }, '-=4');
        tl.to('.c-3 .item', { top: '0', stagger: 0.25, duration: 3, ease: 'power4.inOut' }, '-=4');
        tl.to('.c-4 .item', { top: '0', stagger: -0.25, duration: 3, ease: 'power4.inOut' }, '-=4');
        tl.to('.c-5 .item', { top: '0', stagger: 0.25, duration: 3, ease: 'power4.inOut' }, '-=4');
        tl.to('.preloader', { scale: 6, duration: 4, ease: 'power4.inOut' }, '-=2');
        tl.to('.main-header, #section0', { opacity: 1, visibility: 'visible', duration: 1.5, ease: 'power3.out' }, '-=1.5');
        tl.to('.nav-item', { opacity: 1, y: 0, stagger: 0.2, duration: 1, ease: 'power3.out' }, '<+0.3');
        
        tl.to({}, { 
          duration: 0.5, 
          onComplete: function() {
            var preloader = safeQuery('.preloader');
            if (preloader) {
              preloader.style.zIndex = '-1';
              preloader.style.pointerEvents = 'none';
              preloader.classList.add('completed');
            }
          }
        });
      } catch (error) {
        console.error('Animation error:', error);
        showContentFallback();
      }
    }

    // ===============================
    // FULLPAGE.JS INITIALIZATION
    // ===============================
    function initFullPage() {
      if (fullpageInstance || typeof fullpage === 'undefined') return;

      try {
        var menuClick = false;

        // Handle menu clicks
        safeQueryAll('.menu a, .mobile-nav-link').forEach(function(link) {
          link.addEventListener('click', function() {
            menuClick = true;
          });
        });

        fullpageInstance = new fullpage('#fullpage', {
          anchors: ['firstPage', 'secondPage', '3rdPage', '4thpage'],
          css3: true,
          licenseKey: 'OPEN-SOURCE-GPLV3-LICENSE',
          scrollingSpeed: CONFIG.animations.slideTransition,
          afterLoad: function(origin, destination) {
            highlightActiveMenuItem(destination.index);
            updateMenuStyle(destination.index);
            
            // Handle preloader background
            var preloader = safeQuery('.preloader.completed');
            if (preloader) {
              preloader.style.opacity = destination.index === 0 ? '1' : '0';
            }
            
            // Handle section 3 animations
            if (destination.index === 3) {
              var section3 = safeQuery('#section3');
              if (section3) section3.classList.add('active');
              setTimeout(startCleanvapeAnimation, 300);
            }
          },
          onLeave: function(origin, destination) {
            if (origin.index === 3) {
              var section3 = safeQuery('#section3');
              if (section3) section3.classList.remove('active');
            }
          }
        });
      } catch (error) {
        console.error('FullPage initialization error:', error);
        // Fall back to normal scrolling
        initMobileScroll();
      }
    }

    function destroyFullPage() {
      if (fullpageInstance && typeof fullpage_api !== 'undefined') {
        try {
          fullpage_api.destroy('all');
          fullpageInstance = null;
        } catch (error) {
          console.error('Error destroying fullpage:', error);
        }
      }
    }

    function initMobileScroll() {
      document.body.classList.add('mobile-scroll-mode');
      
      // Smooth scroll for navigation
      function smoothScroll(target) {
        var element = safeQuery(target);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }

      // Handle navigation clicks
      safeQueryAll('.mobile-nav-link, .menu a').forEach(function(link) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          var href = this.getAttribute('href');
          var sectionMap = {
            '#firstPage': '#section0',
            '#secondPage': '#section1',
            '#3rdPage': '#section2',
            '#4thpage': '#section3'
          };
          smoothScroll(sectionMap[href] || href);
          
          // Close mobile menu if open
          closeMobileNav();
        });
      });

      // Scroll spy for active menu highlighting
      var scrollSpy = throttle(function() {
        var sections = safeQueryAll('#fullpage .section');
        var scrollPosition = window.pageYOffset + 100;

        sections.forEach(function(section, index) {
          var top = section.offsetTop;
          var bottom = top + section.offsetHeight;

          if (scrollPosition >= top && scrollPosition <= bottom) {
            highlightActiveMenuItem(index);
            updateMenuStyle(index);
          }
        });
      }, CONFIG.performance.throttleDelay);

      window.addEventListener('scroll', scrollSpy);
    }

    // ===============================
    // RESPONSIVE HANDLING
    // ===============================
    function handleResize() {
      var newIsMobile = isMobile();
      
      if (newIsMobile !== isMobileMode) {
        isMobileMode = newIsMobile;
        
        if (isMobileMode) {
          destroyFullPage();
          initMobileScroll();
        } else {
          document.body.classList.remove('mobile-scroll-mode');
          initFullPage();
        }
      }
    }

    // Debounced resize handler
    var debouncedResize = debounce(handleResize, CONFIG.performance.debounceDelay);
    window.addEventListener('resize', debouncedResize);

    // ===============================
    // MAP INTERACTION
    // ===============================
    function initMap() {
      var wrapper = safeQuery('#mapWrapper');
      var iframe = safeQuery('#mapFrame');
      
      if (wrapper && iframe) {
        wrapper.addEventListener('click', function() {
          iframe.style.pointerEvents = 'auto';
        });
        
        wrapper.addEventListener('mouseleave', function() {
          iframe.style.pointerEvents = 'none';
        });
      }
    }

    // ===============================
    // SIDEBAR FUNCTIONALITY
    // ===============================
    function initSidebar() {
      var openBtn = safeQuery('#openSidebar');
      var closeBtn = safeQuery('#closeBtn');
      var sidebar = safeQuery('#sidebar');
      var sidebarNavBtns = safeQueryAll('.sidebar-nav-btn');
      var faqQuestions = safeQueryAll('.faq-question');
      var currentSlide = 0;

      function openSidebar() {
        if (!sidebar) return;
        document.body.classList.add('sidebar-open');
        sidebar.style.display = 'block';
        
        // Force reflow for animation
        sidebar.offsetHeight;
        
        requestAnimationFrame(function() {
          sidebar.classList.add('open');
          if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
        });
      }

      function closeSidebar() {
        if (!sidebar) return;
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-open');
        if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
        
        setTimeout(function() {
          switchSlide(0);
          var form = sidebar.querySelector('.my-form');
          if (form) form.reset();
          
          faqQuestions.forEach(function(q) {
            q.classList.remove('active');
            var answer = q.parentElement.querySelector('.faq-answer');
            if (answer) {
              answer.classList.remove('active');
              answer.setAttribute('aria-hidden', 'true');
            }
            q.setAttribute('aria-expanded', 'false');
          });
          
          sidebar.style.display = 'none';
        }, CONFIG.animations.sidebarTransition);
      }

      function switchSlide(slideIndex) {
        var slides = safeQueryAll('.sidebar-slide');
        var slidesContainer = safeQuery('.sidebar-slides');
        
        sidebarNavBtns.forEach(function(btn, index) {
          btn.classList.toggle('active', index === slideIndex);
          btn.setAttribute('aria-selected', index === slideIndex ? 'true' : 'false');
        });
        
        slides.forEach(function(slide, index) {
          slide.classList.toggle('active', index === slideIndex);
        });
        
        if (slidesContainer) {
          var translateX = -slideIndex * 100;
          slidesContainer.style.transform = 'translateX(' + translateX + '%)';
        }
        
        currentSlide = slideIndex;
      }

      function toggleFaqItem(questionElement) {
        var faqItem = questionElement.parentElement;
        var answer = faqItem.querySelector('.faq-answer');
        var isActive = questionElement.classList.contains('active');
        
        // Close all FAQ items
        faqQuestions.forEach(function(q) {
          q.classList.remove('active');
          q.setAttribute('aria-expanded', 'false');
          var a = q.parentElement.querySelector('.faq-answer');
          if (a) {
            a.classList.remove('active');
            a.setAttribute('aria-hidden', 'true');
          }
        });
        
        // Open clicked item if it wasn't active
        if (!isActive && answer) {
          questionElement.classList.add('active');
          questionElement.setAttribute('aria-expanded', 'true');
          answer.classList.add('active');
          answer.setAttribute('aria-hidden', 'false');
        }
      }

      // Event listeners
      if (openBtn) {
        openBtn.addEventListener('click', function(e) {
          e.preventDefault();
          openSidebar();
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener('click', closeSidebar);
        
        // Magnetic effect on hover
        closeBtn.addEventListener('mousemove', function(e) {
          var rect = closeBtn.getBoundingClientRect();
          var dx = e.clientX - (rect.left + rect.width / 2);
          var dy = e.clientY - (rect.top + rect.height / 2);
          var angle = Math.atan2(dy, dx);
          var radius = 8;
          closeBtn.style.transform = 'translate(' + Math.cos(angle) * radius + 'px, ' + Math.sin(angle) * radius + 'px)';
        });
        
        closeBtn.addEventListener('mouseleave', function() {
          closeBtn.style.transform = 'translate(0, 0)';
        });
      }

      sidebarNavBtns.forEach(function(btn, index) {
        btn.addEventListener('click', function() {
          switchSlide(index);
        });
      });

      faqQuestions.forEach(function(question) {
        question.addEventListener('click', function() {
          toggleFaqItem(question);
        });
        
        // Keyboard accessibility
        question.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFaqItem(question);
          }
        });
      });

      // Form validation
      var form = safeQuery('.my-form');
      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Basic validation
          var required = form.querySelectorAll('[required]');
          var isValid = true;
          
          required.forEach(function(field) {
            if (!field.value.trim()) {
              field.classList.add('error');
              isValid = false;
            } else {
              field.classList.remove('error');
            }
          });
          
          if (isValid) {
            // Handle form submission
            console.log('Form submitted');
            // Add your form submission logic here
          }
        });
      }
    }

    // ===============================
    // COUNTER ANIMATION
    // ===============================
    function initCounter() {
      var counterElement = safeQuery('#counter');
      if (!counterElement) return;

      var targetValue = 4247;
      var lastStep = false;
      
      counterElement.textContent = '0';
      
      setTimeout(function() {
        if (reducedMotion) {
          counterElement.textContent = targetValue;
          return;
        }
        
        var current = 0;
        var duration = CONFIG.animations.counterDuration;
        var steps = 60;
        var increment = targetValue / steps;
        var delay = duration / steps;
        
        function countUp() {
          current += increment;
          if (current >= targetValue) {
            counterElement.textContent = targetValue;
          } else {
            counterElement.textContent = Math.floor(current);
            requestAnimationFrame(function() {
              setTimeout(countUp, delay);
            });
          }
        }
        
        countUp();
      }, 6100);
      
      // Video sync
      var video = safeQuery('.my-video');
      if (video && counterElement) {
        video.addEventListener('timeupdate', function() {
          var exactSecond = 10.1;
          if (counterElement.textContent !== '0' && video.currentTime >= exactSecond && !lastStep) {
            targetValue++;
            counterElement.textContent = targetValue;
            counterElement.style.transform = 'scale(1.15)';
            setTimeout(function() {
              counterElement.style.transform = 'scale(1)';
            }, 250);
            lastStep = true;
          }
          if (video.currentTime < exactSecond) {
            lastStep = false;
          }
        });
      }
    }

    // ===============================
    // DONATION WIDGET
    // ===============================
    function initDonationWidget() {
      var widget = safeQuery('#donationWidget');
      if (!widget) return;

      var form = widget.querySelector('#donationForm');
      var amountButtons = widget.querySelectorAll('.donation-amount-btn');
      var customInput = widget.querySelector('#donationAmountInput');
      var errorBox = widget.querySelector('#donationError');
      var selectedAmount = CONFIG.donation.defaultAmount;

      function highlightSelected(amount) {
        amountButtons.forEach(function(b) {
          b.classList.remove('active');
        });
        var btn = widget.querySelector('.donation-amount-btn[data-amount="' + amount + '"]');
        if (btn) btn.classList.add('active');
      }

      function showError(msg) {
        if (errorBox) {
          errorBox.textContent = msg;
          errorBox.classList.add('visible');
        }
      }

      function clearError() {
        if (errorBox) {
          errorBox.textContent = '';
          errorBox.classList.remove('visible');
        }
      }

      highlightSelected(selectedAmount);

      amountButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
          selectedAmount = parseInt(btn.getAttribute('data-amount'), 10);
          highlightSelected(selectedAmount);
          customInput.value = '';
          clearError();
        });
      });

      if (customInput) {
        customInput.addEventListener('input', function() {
          if (customInput.value.trim() !== '') {
            selectedAmount = parseInt(customInput.value, 10) || 0;
            amountButtons.forEach(function(b) {
              b.classList.remove('active');
            });
          }
          clearError();
        });
      }

      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          clearError();
          
          if (!selectedAmount || selectedAmount <= 0) {
            showError('Please enter a valid amount.');
            return;
          }
          
          // Handle donation submission
          console.log('Donation amount:', selectedAmount);
          // Add your donation logic here
        });
      }
    }

    // ===============================
    // CLEANVAPE ANIMATIONS
    // ===============================
    function startCleanvapeAnimation() {
      if (reducedMotion) return;
      
      var numbers = safeQueryAll('[data-target]');
      
      numbers.forEach(function(number, index) {
        setTimeout(function() {
          var target = parseFloat(number.getAttribute('data-target'));
          var current = 0;
          var increment = target / 60;
          
          var timer = setInterval(function() {
            current += increment;
            if (current >= target) {
              if (target % 1 !== 0) {
                number.textContent = target.toFixed(1);
              } else {
                number.textContent = target.toLocaleString();
              }
              clearInterval(timer);
            } else {
              if (target % 1 !== 0 && current > 1) {
                number.textContent = current.toFixed(1);
              } else {
                number.textContent = Math.floor(current).toLocaleString();
              }
            }
          }, 25);
        }, index * 150);
      });
    }

    // ===============================
    // MOBILE NAVIGATION
    // ===============================
    function initMobileNav() {
      var mobileBurger = safeQuery('#mobileBurger');
      var mobileNavOverlay = safeQuery('#mobileNavOverlay');
      var mobileNavClose = safeQuery('#mobileNavClose');
      var mobileNavLinks = safeQueryAll('.mobile-nav-link');

      function openMobileNav() {
        if (mobileBurger && mobileNavOverlay) {
          mobileBurger.setAttribute('aria-expanded', 'true');
          mobileNavOverlay.classList.add('open');
          document.body.classList.add('mobile-nav-open');
        }
      }

      function closeMobileNav() {
        if (mobileBurger && mobileNavOverlay) {
          mobileBurger.setAttribute('aria-expanded', 'false');
          mobileNavOverlay.classList.remove('open');
          document.body.classList.remove('mobile-nav-open');
        }
      }

      if (mobileBurger) {
        mobileBurger.addEventListener('click', function() {
          var isOpen = mobileBurger.getAttribute('aria-expanded') === 'true';
          if (isOpen) {
            closeMobileNav();
          } else {
            openMobileNav();
          }
        });
      }

      if (mobileNavClose) {
        mobileNavClose.addEventListener('click', closeMobileNav);
      }

      if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', function(e) {
          if (e.target === mobileNavOverlay) {
            closeMobileNav();
          }
        });
      }

      mobileNavLinks.forEach(function(link) {
        link.addEventListener('click', function() {
          closeMobileNav();
        });
      });

      // Close on escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNavOverlay && mobileNavOverlay.classList.contains('open')) {
          closeMobileNav();
        }
      });

      // Close on resize to desktop
      window.addEventListener('resize', function() {
        if (window.innerWidth > CONFIG.breakpoints.mobile && mobileNavOverlay && mobileNavOverlay.classList.contains('open')) {
          closeMobileNav();
        }
      });
    }

    // ===============================
    // SCROLL ICON
    // ===============================
    function initScrollIcon() {
      var scrollIcon = safeQuery('.aniWrap');
      if (!scrollIcon) return;

      setTimeout(function() {
        if (window.location.hash === '' || window.location.hash === '#firstPage') {
          scrollIcon.style.opacity = '1';
        }
      }, CONFIG.animations.scrollIconDelay);
    }

    // ===============================
    // INITIALIZE ALL COMPONENTS
    // ===============================
    
    // Initialize preloader and animations
    initPreloader();
    
    // Initialize components after DOM is ready
    setTimeout(function() {
      // Initialize based on device type
      if (isMobileMode) {
        initMobileScroll();
      } else {
        initFullPage();
      }
      
      // Initialize all components
      initMap();
      initSidebar();
      initCounter();
      initDonationWidget();
      initMobileNav();
      initScrollIcon();
      
      // Set initial state
      highlightActiveMenuItem(0);
      updateMenuStyle(0);
    }, 100);
  }

  // ===============================
  // ERROR HANDLING
  // ===============================
  window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // Log errors but don't break the user experience
  });

  window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // Log promise rejections
  });

})();