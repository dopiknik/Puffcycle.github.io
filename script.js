// ===============================
// Прелоадер, анимации, fullPage.js, карта, sidebar — с подсветкой меню
// Mobile-adaptive version with normal scroll on mobile devices
// ===============================

$(document).ready(function () {
  // Всегда загружать с главной страницы
  if (window.location.hash) {
    history.pushState(
      "",
      document.title,
      window.location.pathname + window.location.search,
    );
  }

  // Mobile detection
  function isMobile() {
    return window.innerWidth <= 767;
  }

  // Store fullPage instance
  let fullpageInstance = null;
  let isMobileMode = isMobile();

  // --- Existing code (updated for mobile compatibility) ---
  function highlightActiveMenuItem(sectionIndex) {
    document
      .querySelectorAll(".menu .nav-item, .mobile-nav-link")
      .forEach((item) => {
        item.classList.remove("aactive");
      });
    const menuItems = document.querySelectorAll(".menu .nav-item");
    const mobileMenuItems = document.querySelectorAll(".mobile-nav-link");
    if (menuItems[sectionIndex]) {
      menuItems[sectionIndex].classList.add("aactive");
    }
    if (mobileMenuItems[sectionIndex]) {
      mobileMenuItems[sectionIndex].classList.add("aactive");
    }
  }

  // Функция для изменения стиля меню в зависимости от секции
  function updateMenuStyle(sectionIndex) {
    const body = document.body;

    // Применяем инверсию меню для section1 (индекс 1)
    if (sectionIndex === 1) {
      body.classList.add("invert-menu");
    } else {
      body.classList.remove("invert-menu");
    }
  }

  // ===============================
  // УПРОЩЕННЫЙ БЛОК ЗАГРУЗКИ
  // ===============================
  let initialSection = 0;
  highlightActiveMenuItem(initialSection);
  updateMenuStyle(initialSection);

  // Всегда запускаем только одну, основную анимацию загрузки
  let tl = gsap.timeline({ delay: 0 });
  tl.to(".col", { top: "0", duration: 3, ease: "power4.inOut" });
  tl.to(
    ".c-1 .item",
    { top: "0", stagger: 0.25, duration: 3, ease: "power4.inOut" },
    "-=2",
  );
  tl.to(
    ".c-2 .item",
    { top: "0", stagger: -0.25, duration: 3, ease: "power4.inOut" },
    "-=4",
  );
  tl.to(
    ".c-3 .item",
    { top: "0", stagger: 0.25, duration: 3, ease: "power4.inOut" },
    "-=4",
  );
  tl.to(
    ".c-4 .item",
    { top: "0", stagger: -0.25, duration: 3, ease: "power4.inOut" },
    "-=4",
  );
  tl.to(
    ".c-5 .item",
    { top: "0", stagger: 0.25, duration: 3, ease: "power4.inOut" },
    "-=4",
  );
  tl.to(".preloader", { scale: 6, duration: 4, ease: "power4.inOut" }, "-=2");
  tl.to(
    ".nav-item a, .title p, .slide-num p, .preview img",
    { top: 0, stagger: 0.075, duration: 1, ease: "power3.out" },
    "-=1.5",
  );
  tl.to(
    ".icon ion-icon, .icon-2 ion-icon",
    { scale: 1, stagger: 0.05, ease: "power3.out" },
    "-=1",
  );
  tl.to(
    ".main-header, #section0",
    { opacity: 1, visibility: "visible", duration: 1.5, ease: "power3.out" },
    "-=1.5",
  );
  tl.to(
    ".nav-item",
    { opacity: 1, y: 0, stagger: 0.2, duration: 1, ease: "power3.out" },
    "<+0.3",
  );

  // Ждем дополнительное время после последней анимации и только потом меняем preloader
  tl.to(
    {},
    {
      duration: 0.5,
      onComplete: function () {
        const preloader = document.querySelector(".preloader");
        if (preloader) {
          preloader.style.zIndex = "-1";
          preloader.style.pointerEvents = "none";
          preloader.classList.add("completed");
        }
      },
    },
  );
  // ===============================
  // КОНЕЦ УПРОЩЕННОГО БЛОКА
  // ===============================

  // ===============================
  // FULLPAGE vs MOBILE SCROLL INITIALIZATION
  // ===============================

  function initFullPage() {
    if (fullpageInstance) return; // Already initialized

    const slideSections = [1, 2, 3, 4];
    const currentSlides = {};
    let isSliding = false;
    let menuClick = false;

    $(".menu a, .mobile-nav-link").on("click", function () {
      menuClick = true;
    });

    fullpageInstance = new fullpage("#fullpage", {
      anchors: ["firstPage", "secondPage", "3rdPage", "4thpage"],
      css3: true,
      licenseKey: "OPEN-SOURCE-GPLV3-LICENSE",
      afterLoad: function (origin, destination) {
        highlightActiveMenuItem(destination.index);
        updateMenuStyle(destination.index);

        // Управление preloader фоном
        const preloader = document.querySelector(".preloader.completed");
        if (preloader) {
          if (destination.index === 0) {
            // На первой странице показываем как фон
            preloader.style.opacity = "1";
            preloader.style.zIndex = "-1";
          } else {
            // На других страницах скрываем
            preloader.style.opacity = "0";
          }
        }

        if (destination.index === 3) {
          document.getElementById("section3").classList.add("active");
          setTimeout(() => {
            if (cleanvapeCurrentSlide === 1) {
              startCleanvapeAnimation();
            }
          }, 300);
        } else {
          document.getElementById("section3").classList.remove("active");
        }
      },
      onLeave: function (origin, destination) {
        if (origin.index === 3) {
          document.getElementById("section3").classList.remove("active");
        }
      },
      afterSlideLoad: function (section, origin, destination) {
        const sectionIndex = section.index;
        currentSlides[sectionIndex] = destination.index;

        if (sectionIndex === 3) {
          updateCleanvapeSlideNavigation(destination.index);
          cleanvapeCurrentSlide = destination.index;

          if (destination.index === 1) {
            setTimeout(startCleanvapeAnimation, 300);
          }
        }
      },
      onLeave: function (origin, destination, direction) {
        if (menuClick) {
          menuClick = false;
          return true;
        }
        const sectionIndex = origin.index;
        const currentSlideIndex = currentSlides[sectionIndex] || 0;

        if (sectionIndex === 3 && !isSliding) {
          if (direction === "down" && cleanvapeCurrentSlide === 0) {
            isSliding = true;
            fullpage_api.moveSlideRight();
            setTimeout(() => (isSliding = false), 700);
            return false;
          }
          if (direction === "up" && cleanvapeCurrentSlide === 1) {
            isSliding = true;
            fullpage_api.moveSlideLeft();
            setTimeout(() => (isSliding = false), 700);
            return false;
          }
        }

        if (slideSections.includes(sectionIndex) && !isSliding) {
          const numSlides = $(".section")
            .eq(sectionIndex)
            .find(".slide").length;
          if (direction === "down" && currentSlideIndex < numSlides - 1) {
            isSliding = true;
            fullpage_api.moveSlideRight();
            setTimeout(() => (isSliding = false), 700);
            return false;
          }
          if (direction === "up" && currentSlideIndex > 0) {
            isSliding = true;
            fullpage_api.moveSlideLeft();
            setTimeout(() => (isSliding = false), 700);
            return false;
          }
        }
      },
    });
  }

  function destroyFullPage() {
    if (fullpageInstance && typeof fullpage_api !== "undefined") {
      fullpage_api.destroy("all");
      fullpageInstance = null;
    }
  }

  function initMobileScroll() {
    // Enable normal scroll and navigation for mobile
    $("body").addClass("mobile-scroll-mode");

    // Handle mobile navigation clicks
    $(".mobile-nav-link")
      .off("click.mobile")
      .on("click.mobile", function (e) {
        e.preventDefault();
        const href = $(this).attr("href");
        let sectionId = "";
        switch (href) {
          case "#firstPage":
            sectionId = "#section0";
            break;
          case "#secondPage":
            sectionId = "#section1";
            break;
          case "#3rdPage":
            sectionId = "#section2";
            break;
          case "#4thpage":
            sectionId = "#section3";
            break;
          default:
            sectionId = href;
        }
        const target = $(sectionId);
        if (target.length) {
          $("html, body").animate({ scrollTop: target.offset().top }, 800);
        }
      });

    $(".menu a")
      .off("click.mobile")
      .on("click.mobile", function (e) {
        e.preventDefault();
        const href = $(this).attr("href");
        let sectionId = "";
        switch (href) {
          case "#firstPage":
            sectionId = "#section0";
            break;
          case "#secondPage":
            sectionId = "#section1";
            break;
          case "#3rdPage":
            sectionId = "#section2";
            break;
          case "#4thpage":
            sectionId = "#section3";
            break;
          default:
            sectionId = href;
        }
        const target = $(sectionId);
        if (target.length) {
          $("html, body").animate({ scrollTop: target.offset().top }, 800);
        }
      });

    // Mobile scroll spy for menu highlighting
    let sections = $("#fullpage .section");
    $(window)
      .off("scroll.mobile")
      .on("scroll.mobile", function () {
        let current = "";
        let scrollPosition = $(window).scrollTop() + 100;

        sections.each(function () {
          let top = $(this).offset().top;
          let bottom = top + $(this).outerHeight();

          if (scrollPosition >= top && scrollPosition <= bottom) {
            current = $(this).attr("id");
          }
        });

        // Update active menu item
        let sectionIndex = 0;
        switch (current) {
          case "section0":
            sectionIndex = 0;
            break;
          case "section1":
            sectionIndex = 1;
            break;
          case "section2":
            sectionIndex = 2;
            break;
          case "section3":
            sectionIndex = 3;
            break;
        }

        highlightActiveMenuItem(sectionIndex);
        updateMenuStyle(sectionIndex);

        // Trigger CleanVape animation on scroll for mobile
        if (current === "section3") {
          const heroSection = document.querySelector(
            "#section3 .cleanvape-hero-section",
          );
          if (
            heroSection &&
            !heroSection.classList.contains("animated-mobile")
          ) {
            const rect = heroSection.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
              heroSection.classList.add("animated-mobile");
            }
          }

          const statsSection = document.querySelector(
            "#section3 .cleanvape-light-stats-section",
          );
          if (statsSection && !statsSection.classList.contains("animated")) {
            const rect = statsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
              statsSection.classList.add("animated");
              setTimeout(startCleanvapeAnimation, 300);
            }
          }
        }
      });
  }

  function handleResize() {
    const newIsMobile = isMobile();

    if (newIsMobile !== isMobileMode) {
      isMobileMode = newIsMobile;

      if (isMobileMode) {
        // Switch to mobile mode
        destroyFullPage();
        initMobileScroll();

        setTimeout(() => {
          $("#section3 .slide").each(function () {
            $(this).css({
              display: "block",
              opacity: "1",
              visibility: "visible",
              transform: "none",
              position: "static",
            });
          });
        }, 100);
      } else {
        // Switch to desktop mode
        $("body").removeClass("mobile-scroll-mode");
        $(window).off("scroll.mobile");
        $(".mobile-nav-link").off("click.mobile");
        $(".menu a").off("click.mobile");

        $("#section3 .slide").removeAttr("style");

        initFullPage();
      }
    }
  }

  // Initial setup
  if (isMobileMode) {
    initMobileScroll();
  } else {
    initFullPage();
  }

  // Handle window resize
  let resizeTimeout;
  $(window).on("resize", function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 250);
  });

  // Map interactive enable/disable
  const wrapper = document.getElementById("mapWrapper");
  const iframe = document.getElementById("mapFrame");
  if (wrapper && iframe) {
    wrapper.addEventListener("click", function () {
      iframe.style.pointerEvents = "auto";
    });
    wrapper.addEventListener("mouseleave", function () {
      iframe.style.pointerEvents = "none";
    });
  }

  // Sidebar logic
  const openBtn = document.getElementById("openSidebar");
  const closeBtn = document.getElementById("closeBtn");
  const sidebar = document.getElementById("sidebar");
  const sidebarNavBtns = document.querySelectorAll(".sidebar-nav-btn");
  const sidebarSlides = document.querySelector(".sidebar-slides");
  const slideElements = document.querySelectorAll(".sidebar-slide");
  const faqQuestions = document.querySelectorAll(".faq-question");
  let currentSlide = 0;

  function openSidebar() {
    document.body.classList.add("sidebar-open");
    sidebar.style.display = "block";
    requestAnimationFrame(() => {
      sidebar.classList.add("open");
    });
  }
  function closeSidebar() {
    sidebar.classList.remove("open");
    document.body.classList.remove("sidebar-open");

    setTimeout(() => {
      switchSlide(0);
      const form = sidebar.querySelector(".my-form");
      if (form) {
        form.reset();
      }
      faqQuestions.forEach((q) => {
        q.classList.remove("active");
        q.parentElement.querySelector(".faq-answer").classList.remove("active");
      });
      sidebar.style.display = "none";
    }, 800);
  }
  function switchSlide(slideIndex) {
    sidebarNavBtns.forEach((btn) => btn.classList.remove("active"));
    sidebarNavBtns[slideIndex].classList.add("active");
    slideElements.forEach((slide) => slide.classList.remove("active"));
    slideElements[slideIndex].classList.add("active");
    const translateX = -slideIndex * 100;
    sidebarSlides.style.transform = `translateX(${translateX}%)`;
    currentSlide = slideIndex;
  }
  function toggleFaqItem(questionElement) {
    const faqItem = questionElement.parentElement;
    const answer = faqItem.querySelector(".faq-answer");
    const isActive = questionElement.classList.contains("active");
    faqQuestions.forEach((q) => {
      q.classList.remove("active");
      q.parentElement.querySelector(".faq-answer").classList.remove("active");
    });
    if (!isActive) {
      questionElement.classList.add("active");
      answer.classList.add("active");
    }
  }

  if (openBtn) {
    openBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openSidebar();
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener("mousemove", function (e) {
      const rect = closeBtn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const angle = Math.atan2(dy, dx);
      const radius = 8;
      closeBtn.style.transform = `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)`;
    });
    closeBtn.addEventListener("mouseleave", function () {
      closeBtn.style.transform = "translate(0, 0)";
    });
    closeBtn.addEventListener("click", () => {
      closeSidebar();
    });
  }
  sidebarNavBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      switchSlide(index);
    });
  });
  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      toggleFaqItem(question);
    });
  });

  // Counter
  let targetValue = 4247;
  let lastStep = false;
  const counterElement = document.getElementById("counter");
  if (counterElement) {
    counterElement.textContent = 0;
    setTimeout(function () {
      let current = 0;
      const duration = 2000;
      const steps = 60;
      const increment = targetValue / steps;
      const delay = duration / steps;
      function countUp() {
        current += increment;
        if (current >= targetValue) {
          counterElement.textContent = targetValue;
        } else {
          counterElement.textContent = Math.floor(current);
          setTimeout(countUp, delay);
        }
      }
      countUp();
    }, 6100);
  }
  const exactSecond = 10.1;
  const video = document.querySelector(".my-video");
  if (video && counterElement) {
    video.addEventListener("timeupdate", function () {
      if (
        counterElement.textContent !== "0" &&
        video.currentTime >= exactSecond &&
        !lastStep
      ) {
        targetValue++;
        counterElement.textContent = targetValue;
        counterElement.style.transform = "scale(1.15)";
        setTimeout(() => {
          counterElement.style.transform = "scale(1)";
        }, 250);
        lastStep = true;
      }
      if (video.currentTime < exactSecond) {
        lastStep = false;
      }
    });
  }

  // ===============================
  // Donation Widget (Isolated)
  // ===============================
  (function initDonationWidget() {
    const widget = document.getElementById("donationWidget");
    if (!widget) return;

    // CONFIG (placeholders!)
    const IS_SANDBOX = false; // true for sandbox
    const PAYPAL_HOSTED_BUTTON_ID = "YOUR_HOSTED_BUTTON_ID"; // TODO: replace
    const CURRENCY = "USD";
    const SUBSCRIPTION_PLANS = {
      10: "P-PLANID_FOR_10",
      25: "P-PLANID_FOR_25",
      50: "P-PLANID_FOR_50",
      100: "P-PLANID_FOR_100",
    };
    const PAYPAL_BASE = IS_SANDBOX
      ? "https://www.sandbox.paypal.com"
      : "https://www.paypal.com";

    // Elements (scoped)
    const form = widget.querySelector("#donationForm");
    const amountButtons = widget.querySelectorAll(".donation-amount-btn");
    const customInput = widget.querySelector("#donationAmountInput");
    const errorBox = widget.querySelector("#donationError");
    const submitBtn = widget.querySelector(".donation-submit-btn");

    let selectedAmount = 25;
    highlightSelected(selectedAmount);

    amountButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedAmount = parseInt(btn.getAttribute("data-amount"), 10);
        highlightSelected(selectedAmount);
        customInput.value = "";
        clearError();
      });
    });

    customInput.addEventListener("input", () => {
      if (customInput.value.trim() !== "") {
        selectedAmount = parseInt(customInput.value, 10) || 0;
        amountButtons.forEach((b) => b.classList.remove("active"));
      } else {
        const activeBtn = widget.querySelector(".donation-amount-btn.active");
        selectedAmount = activeBtn
          ? parseInt(activeBtn.getAttribute("data-amount"), 10)
          : 0;
      }
      clearError();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearError();
      if (!validateAmount()) {
        showError("Please enter a valid amount.");
        return;
      }
      const frequency = getFrequency();
      if (frequency === "oneTime") {
        redirectOneTime(selectedAmount);
      } else {
        redirectSubscription(selectedAmount);
      }
    });

    function getFrequency() {
      return widget.querySelector('input[name="donationFrequency"]:checked')
        .value;
    }
    function validateAmount() {
      return selectedAmount && selectedAmount > 0;
    }
    function highlightSelected(amount) {
      amountButtons.forEach((b) => b.classList.remove("active"));
      const btn = widget.querySelector(
        `.donation-amount-btn[data-amount="${amount}"]`,
      );
      if (btn) btn.classList.add("active");
    }
    function showError(msg) {
      if (!errorBox) return;
      errorBox.textContent = msg;
      errorBox.classList.add("visible");
    }
    function clearError() {
      if (!errorBox) return;
      errorBox.textContent = "";
      errorBox.classList.remove("visible");
    }
    function redirectOneTime(amount) {
      const url = `${PAYPAL_BASE}/donate/?hosted_button_id=${encodeURIComponent(PAYPAL_HOSTED_BUTTON_ID)}&amount=${encodeURIComponent(amount)}&currency_code=${encodeURIComponent(CURRENCY)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
    function redirectSubscription(amount) {
      const planId = SUBSCRIPTION_PLANS[amount];
      if (!planId) {
        showError(
          "No subscription plan for this amount. Choose another or use one-time.",
        );
        return;
      }
      const url = `${PAYPAL_BASE}/webapps/billing/subscriptions?plan_id=${encodeURIComponent(planId)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }

    if (submitBtn) {
      submitBtn.addEventListener("mousemove", function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.style.background = `radial-gradient(circle at ${x}px ${y}px, var(--donation-tertiary) 0%, var(--donation-primary) 100%)`;
      });
      submitBtn.addEventListener("mouseleave", function () {
        this.style.background =
          "linear-gradient(135deg, var(--donation-primary) 0%, var(--donation-tertiary) 100%)";
      });
    }
  })();

  // ===============================
  // CLEANVAPE FUNCTIONALITY
  // ===============================
  let cleanvapeCurrentSlide = 0;
  let cleanvapeIsScrolling = false;
  const cleanvapeTotalSlides = 2;

  function updateCleanvapeSlideNavigation(activeIndex) {
    const navItems = document.querySelectorAll(".cleanvape-slide-nav-item");
    navItems.forEach((item, index) => {
      item.classList.toggle("active", index === activeIndex);
    });
  }

  function navigateCleanvapeSlide(direction) {
    if (isMobileMode) return;

    if (
      direction === "next" &&
      cleanvapeCurrentSlide < cleanvapeTotalSlides - 1
    ) {
      fullpage_api.moveSlideRight();
    } else if (direction === "prev" && cleanvapeCurrentSlide > 0) {
      fullpage_api.moveSlideLeft();
    }
  }

  const cleanvapeNavPrev = document.getElementById("cleanvapeNavPrev");
  const cleanvapeNavNext = document.getElementById("cleanvapeNavNext");

  if (cleanvapeNavPrev) {
    cleanvapeNavPrev.addEventListener("click", () => {
      if (!isMobileMode) navigateCleanvapeSlide("prev");
    });
  }

  if (cleanvapeNavNext) {
    cleanvapeNavNext.addEventListener("click", () => {
      if (!isMobileMode) navigateCleanvapeSlide("next");
    });
  }

  document
    .querySelectorAll(".cleanvape-slide-nav-item")
    .forEach((item, index) => {
      item.addEventListener("click", () => {
        if (isMobileMode) return;
        if (index === 0 && cleanvapeCurrentSlide !== 0) {
          fullpage_api.moveSlideLeft();
        } else if (index === 1 && cleanvapeCurrentSlide !== 1) {
          fullpage_api.moveSlideRight();
        }
      });
    });

  function handleCleanvapeWheel(e) {
    if (isMobileMode) return;

    const activeSection = document.querySelector(".fp-section.active");
    if (!activeSection || activeSection.id !== "section3") {
      return;
    }

    e.preventDefault();

    if (cleanvapeIsScrolling) return;
    cleanvapeIsScrolling = true;

    if (e.deltaY > 0) {
      navigateCleanvapeSlide("next");
    } else {
      navigateCleanvapeSlide("prev");
    }

    setTimeout(() => {
      cleanvapeIsScrolling = false;
    }, 800);
  }

  document.addEventListener("wheel", handleCleanvapeWheel, { passive: false });

  let cleanvapeTouchStartY = 0;
  let cleanvapeTouchEndY = 0;
  const cleanvapeMinSwipeDistance = 50;

  document.addEventListener("touchstart", function (e) {
    if (isMobileMode) return;
    const activeSection = document.querySelector(".fp-section.active");
    if (activeSection && activeSection.id === "section3") {
      cleanvapeTouchStartY = e.changedTouches[0].screenY;
    }
  });

  document.addEventListener("touchend", function (e) {
    if (isMobileMode) return;
    const activeSection = document.querySelector(".fp-section.active");
    if (activeSection && activeSection.id === "section3") {
      cleanvapeTouchEndY = e.changedTouches[0].screenY;
      handleCleanvapeSwipe();
    }
  });

  function handleCleanvapeSwipe() {
    const swipeDistance = cleanvapeTouchStartY - cleanvapeTouchEndY;

    if (Math.abs(swipeDistance) > cleanvapeMinSwipeDistance) {
      if (swipeDistance > 0) {
        navigateCleanvapeSlide("next");
      } else {
        navigateCleanvapeSlide("prev");
      }
    }
  }

  function startCleanvapeAnimation() {
    const numbers = document.querySelectorAll("[data-target]");

    numbers.forEach((number, index) => {
      setTimeout(() => {
        const target = parseFloat(number.getAttribute("data-target"));
        let current = 0;
        const increment = target / 60;

        const timer = setInterval(() => {
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

  document.addEventListener("mousemove", function (e) {
    if (isMobileMode) return;
    const activeSection = document.querySelector(".fp-section.active");
    if (activeSection && activeSection.id === "section3") {
      const shapes = document.querySelectorAll(".cleanvape-shape");
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;

      shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.5;
        const x = mouseX * speed * 15;
        const y = mouseY * speed * 15;

        shape.style.transform = `translate(${x}px, ${y}px)`;
      });
    }
  });

  document.addEventListener("keydown", function (e) {
    if (isMobileMode) return;
    const activeSection = document.querySelector(".fp-section.active");
    if (activeSection && activeSection.id === "section3") {
      if (e.key === "ArrowLeft") {
        navigateCleanvapeSlide("prev");
      } else if (e.key === "ArrowRight") {
        navigateCleanvapeSlide("next");
      }
    }
  });

  setTimeout(() => {
    const cleanvapeScrollHint = document.getElementById("cleanvapeScrollHint");
    if (cleanvapeScrollHint) {
      cleanvapeScrollHint.style.opacity = "0";
      setTimeout(() => {
        cleanvapeScrollHint.style.display = "none";
      }, 500);
    }
  }, 5000);
});

// ===============================
// MOBILE BURGER MENU FUNCTIONALITY
// ===============================
document.addEventListener("DOMContentLoaded", function () {
  const mobileBurger = document.getElementById("mobileBurger");
  const mobileNavOverlay = document.getElementById("mobileNavOverlay");
  const mobileNavClose = document.getElementById("mobileNavClose");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  const body = document.body;

  function openMobileNav() {
    if (mobileBurger && mobileNavOverlay) {
      mobileBurger.setAttribute("aria-expanded", "true");
      mobileNavOverlay.classList.add("open");
      body.classList.add("mobile-nav-open");
    }
  }

  function closeMobileNav() {
    if (mobileBurger && mobileNavOverlay) {
      mobileBurger.setAttribute("aria-expanded", "false");
      mobileNavOverlay.classList.remove("open");
      body.classList.remove("mobile-nav-open");
    }
  }

  function toggleMobileNav() {
    const isOpen = mobileBurger?.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  if (mobileBurger) {
    mobileBurger.addEventListener("click", toggleMobileNav);
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener("click", closeMobileNav);
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener("click", function (e) {
      if (e.target === mobileNavOverlay) {
        closeMobileNav();
      }
    });
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", function () {
      closeMobileNav();
      setTimeout(() => {}, 300);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileNavOverlay?.classList.contains("open")) {
      closeMobileNav();
    }
  });

  window.addEventListener("resize", function () {
    if (
      window.innerWidth > 767 &&
      mobileNavOverlay?.classList.contains("open")
    ) {
      closeMobileNav();
    }
  });
});

// Простое управление иконкой скролла
$(document).ready(function () {
  const scrollIcon = $(".aniWrap");

  setTimeout(() => {
    if (window.location.hash === "" || window.location.hash === "#firstPage") {
      scrollIcon.css("opacity", "1");
    }
  }, 15000);

  // Скрыть при переходе на другие страницы
  $("#fullpage").on("afterLoad", function (origin, destination) {
    if (destination.index === 0) {
      scrollIcon.css("opacity", "1");
    } else {
      scrollIcon.css("opacity", "0");
    }
  });
});

// ===============================
// END OF FILE
// ===============================
