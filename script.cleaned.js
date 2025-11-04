
// ============================
// Optimized App Script (2025-10-31)
// ============================

// --- Instant loader for preloading preloader images ---
const preloaderImages = [
  './assets/preloader/img/1.jpg','./assets/preloader/img/2.jpg','./assets/preloader/img/3.jpg','./assets/preloader/img/4.jpg',
  './assets/preloader/img/5.jpg','./assets/preloader/img/6.jpg','./assets/preloader/img/7.jpg','./assets/preloader/img/8.jpg',
  './assets/preloader/img/9.jpg','./assets/preloader/img/10.jpg','./assets/preloader/img/11.jpg','./assets/preloader/img/12.jpg'
];

function preloadImages(urls, done) {
  let loaded = 0; const total = urls.length;
  if (!total) return done();
  urls.forEach(src => {
    const img = new Image();
    img.onload = img.onerror = () => { if (++loaded >= total) done(); };
    img.src = src;
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('instantLoader');
  preloadImages(preloaderImages, () => {
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => { loader.style.display = 'none'; }, 400);
    }
  });
});

// jQuery ready
(function($){
  // Remove hash if present (force start at top)
  if (window.location.hash) {
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }

  // Helpers
  const isMobile = () => window.innerWidth <= 767;
  let fullpageInstance = null;
  let mobileMode = isMobile();

  function highlightActiveMenuItem(idx) {
    document.querySelectorAll(".menu .nav-item, .mobile-nav-link").forEach(i => i.classList.remove("aactive"));
    const items = document.querySelectorAll(".menu .nav-item");
    const mobileItems = document.querySelectorAll(".mobile-nav-link");
    if (items[idx]) items[idx].classList.add("aactive");
    if (mobileItems[idx]) mobileItems[idx].classList.add("aactive");
  }

  function updateMenuStyle(idx) {
    document.body.classList.toggle("invert-menu", idx === 1);
  }

  // Initial header/preloader reveal via GSAP (if available)
  function runIntroAnimation(){
    if (!(window.gsap && document.querySelector('.preloader'))) return;
    const tl = gsap.timeline({ delay: 0 });
    tl.to(".col", { top: "0", duration: 3, ease: "power4.inOut" })
      .to(".c-1 .item", { top: "0", stagger: 0.25, duration: 3, ease: "power4.inOut" }, "-=2")
      .to(".c-2 .item", { top: "0", stagger: -0.25, duration: 3, ease: "power4.inOut" }, "-=4")
      .to(".c-3 .item", { top: "0", stagger: 0.25, duration: 3, ease: "power4.inOut" }, "-=4")
      .to(".c-4 .item", { top: "0", stagger: -0.25, duration: 3, ease: "power4.inOut" }, "-=4")
      .to(".c-5 .item", { top: "0", stagger: 0.25, duration: 3, ease: "power4.inOut" }, "-=4")
      .to(".preloader", { scale: 6, duration: 4, ease: "power4.inOut" }, "-=2")
      .to(".main-header, #section0", { opacity: 1, visibility: "visible", duration: 1.5, ease: "power3.out" }, "-=1.2")
      .to(".nav-item", { opacity: 1, y: 0, stagger: 0.2, duration: 1, ease: "power3.out" }, "<+0.3")
      .to({}, { duration: 0.5, onComplete: () => {
        const preloader = document.querySelector(".preloader");
        if (preloader) {
          preloader.style.zIndex = "-1";
          preloader.style.pointerEvents = "none";
          preloader.classList.add("completed");
        }
      }});
  }

  // Smooth scroll for mobile mode
  function bindSmoothScroll(selector){
    $(selector).off(".mobile").on("click.mobile", function(e){
      e.preventDefault();
      const href = $(this).attr("href");
      let sectionId = "";
      switch (href) {
        case "#firstPage": sectionId = "#section0"; break;
        case "#secondPage": sectionId = "#section1"; break;
        case "#3rdPage": sectionId = "#section2"; break;
        case "#4thpage": sectionId = "#section3"; break;
        case "#5thpage": sectionId = "#section4"; break;
        default: sectionId = href;
      }
      const $t = $(sectionId);
      if ($t.length) $("html, body").animate({ scrollTop: $t.offset().top }, 800);
    });
  }

  function initMobileScroll(){
    $("body").addClass("mobile-scroll-mode");
    bindSmoothScroll(".menu a, .mobile-nav-link");

    const $sections = $("#fullpage .section");
    $(window).off(".mobileScroll").on("scroll.mobileScroll", function(){
      let current = "";
      const pos = $(window).scrollTop() + 100;
      $sections.each(function(){
        const $s = $(this);
        const top = $s.offset().top;
        const bottom = top + $s.outerHeight();
        if (pos >= top && pos <= bottom) current = $s.attr("id");
      });
      const map = {section0:0, section1:1, section2:2, section3:3};
      const idx = map[current] ?? 0;
      highlightActiveMenuItem(idx);
      updateMenuStyle(idx);
    });
  }

  function initFullPage(){
    if (fullpageInstance || typeof fullpage === "undefined") return;
    fullpageInstance = new fullpage("#fullpage", {
      anchors: ["firstPage", "secondPage", "3rdPage", "4thpage", "5thpage"],
      css3: true,
      licenseKey: "OPEN-SOURCE-GPLV3-LICENSE",
      afterLoad: function(origin, destination){
        highlightActiveMenuItem(destination.index);
        updateMenuStyle(destination.index);

        const preloader = document.querySelector(".preloader.completed");
        if (preloader) {
          preloader.style.opacity = destination.index === 0 ? "1" : "0";
          preloader.style.zIndex = destination.index === 0 ? "-1" : "-1";
        }
      },
      afterSlideLoad: function(section, origin, destination){
        // hooks for section 3 slides if needed
        if (section.index === 3) {
          if (window.updatepuffcycleSlideNavigation) {
            window.updatepuffcycleSlideNavigation(destination.index);
          }
          if (destination.index === 1 && window.startpuffcycleAnimation) {
            setTimeout(window.startpuffcycleAnimation, 300);
          }
        }
      },
      onLeave: function(origin, destination, direction){
        // unified onLeave (merges previous duplicated handlers)
        if (origin.index === 3) {
          const s3 = document.getElementById("section3");
          if (s3) s3.classList.remove("active");
        }
      }
    });
  }

  function destroyFullPage(){
    if (fullpageInstance && typeof fullpage_api !== "undefined") {
      fullpage_api.destroy("all");
      fullpageInstance = null;
    }
  }

  function handleResize(){
    const nowMobile = isMobile();
    if (nowMobile === mobileMode) return;
    mobileMode = nowMobile;
    if (nowMobile){
      destroyFullPage();
      initMobileScroll();
      // make slides visible
      setTimeout(() => {
        $("#section3 .slide").each(function(){
          $(this).css({display:"block", opacity:"1", visibility:"visible", transform:"none", position:"static"});
        });
      }, 100);
    } else {
      $("body").removeClass("mobile-scroll-mode");
      $(window).off(".mobileScroll");
      $(".menu a, .mobile-nav-link").off(".mobile");
      $("#section3 .slide").removeAttr("style");
      initFullPage();
    }
  }

  // Map pointer events (click-to-interact)
  (function(){
    const wrapper = document.getElementById("mapWrapper");
    const iframe = document.getElementById("mapFrame");
    if (wrapper && iframe){
      iframe.style.pointerEvents = "none";
      wrapper.addEventListener("click", () => { iframe.style.pointerEvents = "auto"; });
      wrapper.addEventListener("mouseleave", () => { iframe.style.pointerEvents = "none"; });
    }
  })();

  // Sidebar (Order Bin)
  (function(){
    const openBtn = document.getElementById("openSidebar");
    const heroBtn = document.getElementById("heroOrderBinBtn");
    const heroBtn2 = document.getElementById("heroOrderBinBtn2");
    const closeBtn = document.getElementById("closeBtn");
    const sidebar  = document.getElementById("sidebar");
    const navBtns  = document.querySelectorAll(".sidebar-nav-btn");
    const slidesCt = document.querySelector(".sidebar-slides");
    const slides   = document.querySelectorAll(".sidebar-slide");
    const faqs     = document.querySelectorAll(".faq-question");
    let current = 0;
    if (!sidebar) return;

    const open = () => {
      document.body.classList.add("sidebar-open");
      sidebar.style.display = "block";
      requestAnimationFrame(()=> sidebar.classList.add("open"));
    };
    const close = () => {
      sidebar.classList.remove("open");
      document.body.classList.remove("sidebar-open");
      setTimeout(()=>{
        switchSlide(0);
        const form = sidebar.querySelector(".my-form");
        if (form) form.reset();
        faqs.forEach(q => {
          q.classList.remove("active");
          const ans = q.parentElement.querySelector(".faq-answer");
          if (ans) ans.classList.remove("active");
        });
        sidebar.style.display = "none";
      }, 600);
    };
    const switchSlide = (idx) => {
      navBtns.forEach(b => b.classList.remove("active"));
      if (navBtns[idx]) navBtns[idx].classList.add("active");
      slides.forEach(s => s.classList.remove("active"));
      if (slides[idx]) slides[idx].classList.add("active");
      if (slidesCt) slidesCt.style.transform = `translateX(${-idx*100}%)`;
      current = idx;
    };

    if (openBtn) openBtn.addEventListener("click", open);
    if (heroBtn) heroBtn.addEventListener("click", open);
    if (heroBtn2) heroBtn2.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    navBtns.forEach((btn, i) => btn.addEventListener("click", ()=> switchSlide(i)));
    faqs.forEach(q => q.addEventListener("click", () => {
      const ans = q.parentElement.querySelector(".faq-answer");
      const active = q.classList.contains("active");
      document.querySelectorAll(".faq-question").forEach(qq => {
        qq.classList.remove("active");
        const a = qq.parentElement.querySelector(".faq-answer");
        if (a) a.classList.remove("active");
      });
      if (!active) {
        q.classList.add("active");
        if (ans) ans.classList.add("active");
      }
    }));

    // expose for debugging
    window._sidebar = { open, close, switchSlide };
  })();

  // Mobile burger & overlay
  (function(){
    const burger = document.getElementById("mobileBurger");
    const overlay = document.getElementById("mobileNavOverlay");
    const closeBtn = document.getElementById("mobileNavClose");
    if (!burger || !overlay) return;

    function open(){
      overlay.style.display = "block";
      requestAnimationFrame(()=> overlay.classList.add("open"));
      burger.setAttribute("aria-expanded", "true");
    }
    function close(){
      overlay.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      setTimeout(()=> overlay.style.display = "none", 300);
    }
    burger.addEventListener("click", ()=> {
      const openState = burger.getAttribute("aria-expanded") === "true";
      openState ? close() : open();
    });
    if (closeBtn) closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", (e)=> {
      if (e.target === overlay) close();
    });
  })();

  // Init flows
  runIntroAnimation();
  if (mobileMode) initMobileScroll(); else initFullPage();

  let tmr;
  $(window).on("resize", function(){
    clearTimeout(tmr);
    tmr = setTimeout(handleResize, 250);
  });


  (function() {
  // Configuration
  const CONFIG = {
    startValue: 0,           // Starting value for animation
    targetValue: 4296,       // Your current count
    animationDuration: 2500, // Duration of initial animation (ms)
    videoIncrement: 24,      // How much to add per video loop
    videoSelector: '.my-video', // Video element selector
    counterSelector: '#devicesCount' // Counter element selector
  };

  let currentCount = CONFIG.targetValue;
  let isAnimating = false;
  let videoIncrementInterval = null;

  // Format number with space as thousands separator
  function formatNumber(num) {
    return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  // Easing function for smooth animation
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  // Initial count-up animation
  function animateCountUp(element, start, end, duration) {
    if (isAnimating) return;
    isAnimating = true;

    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      
      const currentValue = start + (end - start) * easedProgress;
      element.textContent = formatNumber(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        isAnimating = false;
        element.textContent = formatNumber(end);
        // Start video-based increment after initial animation
        startVideoIncrement();
      }
    }
    
    requestAnimationFrame(update);
  }

  // Increment counter based on video duration
  function startVideoIncrement() {
    const video = document.querySelector(CONFIG.videoSelector);
    const counter = document.querySelector(CONFIG.counterSelector);
    
    if (!video || !counter) return;

    // Wait for video metadata to load
    if (video.readyState < 1) {
      video.addEventListener('loadedmetadata', function onMetadata() {
        video.removeEventListener('loadedmetadata', onMetadata);
        startVideoIncrement();
      });
      return;
    }

    const videoDuration = video.duration;
    if (!videoDuration || videoDuration === 0) return;

    // Calculate increment per second
    const incrementPerSecond = CONFIG.videoIncrement / videoDuration;
    
    // Clear any existing interval
    if (videoIncrementInterval) {
      clearInterval(videoIncrementInterval);
    }

    // Update counter every 100ms for smooth animation
    videoIncrementInterval = setInterval(() => {
      currentCount += incrementPerSecond * 0.1;
      counter.textContent = formatNumber(currentCount);
    }, 100);

    // Reset increment when video loops
    video.addEventListener('ended', () => {
      // Video will loop automatically, just continue counting
    });
  }

  // Wait for preloader to complete
  function waitForPreloader(callback) {
    const preloader = document.querySelector('.preloader');
    
    if (!preloader) {
      // No preloader found, start immediately
      callback();
      return;
    }

    // Check if preloader already completed
    if (preloader.classList.contains('completed')) {
      callback();
      return;
    }

    // Watch for preloader completion
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'class' &&
            preloader.classList.contains('completed')) {
          observer.disconnect();
          // Small delay after preloader completes for better UX
          setTimeout(callback, 800);
        }
      });
    });

    observer.observe(preloader, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Fallback: if preloader takes too long (>20s), start anyway
    setTimeout(() => {
      observer.disconnect();
      callback();
    }, 20000);
  }

  // Initialize counter animation
  function initCounter() {
    const counter = document.querySelector(CONFIG.counterSelector);
    if (!counter) {
      console.warn('Counter element not found');
      return;
    }

    // Set initial value
    counter.textContent = formatNumber(CONFIG.startValue);

    // Wait for preloader to finish before starting animation
    waitForPreloader(() => {
      animateCountUp(
        counter, 
        CONFIG.startValue, 
        CONFIG.targetValue, 
        CONFIG.animationDuration
      );
    });
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (videoIncrementInterval) {
      clearInterval(videoIncrementInterval);
    }
  });

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCounter);
  } else {
    initCounter();
  }

  // Expose configuration for easy updates
  window.PuffcycleCounter = {
    updateConfig: function(newConfig) {
      Object.assign(CONFIG, newConfig);
    },
    getCurrentCount: function() {
      return currentCount;
    },
    resetCounter: function() {
      const counter = document.querySelector(CONFIG.counterSelector);
      if (counter) {
        currentCount = CONFIG.targetValue;
        counter.textContent = formatNumber(currentCount);
      }
    }
  };
})();



// === Match home-stats width to sum of two buttons (.home-cta) ===
(function(){
  function matchStatsWidth(){
    const stats = document.querySelector('.home-stats');
    const cta = document.querySelector('.home-cta');
    if(!stats || !cta) return;

    // суммируем ширину двух кнопок (How it Works + Order Bin)
    const btns = cta.querySelectorAll('button, a');
    if(btns.length >= 2){
      const totalWidth = btns[0].offsetWidth + btns[1].offsetWidth + 16; // 16px gap
      stats.style.width = totalWidth + 'px';
    }
  }

  window.addEventListener('load', matchStatsWidth);
  window.addEventListener('resize', matchStatsWidth);
})();



  
})(jQuery);



