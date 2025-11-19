(function(){
  if (!window.gsap) {
    document.body.classList.add('preloader-complete');
    return;
  }

function startLogoVideoPreloader(){
  const logoVideo      = document.querySelector('.main-header .logo video, .main-header .logo .logo-video');
  const preloaderLeft  = document.getElementById('preloaderLeft');
  const preloaderRight = document.getElementById('preloaderRight');
  const preloaderTop   = document.getElementById('preloaderTop');
  const preloaderBottom = document.getElementById('preloaderBottom');
  const preloaderContainer = document.getElementById('videoPreloaderContainer');
  const mainHeader = document.querySelector('.main-header');
  const socialNav  = document.querySelector('.social');
  const fullpage = document.getElementById('fullpage');



  if (socialNav) {
    if (window.innerWidth > 768) {
      // десктоп — как было
      socialNav.style.opacity = '0';
      socialNav.style.visibility = 'hidden';
      socialNav.style.pointerEvents = 'none';
    } else {
      // мобильный — не трогаем inline, даём управлять CSS
      socialNav.style.opacity = '';
      socialNav.style.visibility = '';
      socialNav.style.pointerEvents = '';
    }
  }


  console.log('Preloader elements:', {
    logoVideo: !!logoVideo,
    preloaderLeft: !!preloaderLeft,
    preloaderRight: !!preloaderRight,
    preloaderTop: !!preloaderTop,
    preloaderBottom: !!preloaderBottom
  });

  if (!logoVideo) {
    console.warn('Logo video not found, skipping preloader');
    document.body.classList.add('preloader-complete');
    return;
  }

  if (!preloaderLeft || !preloaderRight || !preloaderTop || !preloaderBottom) {
    console.warn('Preloader curtains not found, skipping preloader');
    document.body.classList.add('preloader-complete');
    return;
  }

  
  if (mainHeader) {
    mainHeader.style.opacity = '1';
    mainHeader.style.visibility = 'visible';
  }

  logoVideo.muted = true;
  logoVideo.playsInline = true;

  try {
    logoVideo.play();
  } catch (e) {
    console.warn('Autoplay error:', e);
  }

  
  const rect        = logoVideo.getBoundingClientRect();
  const centerX     = window.innerWidth / 2;
  const centerY     = window.innerHeight / 2;
  const logoCenterX = rect.left + rect.width / 2;
  const logoCenterY = rect.top  + rect.height / 2;

  const dx = centerX - logoCenterX;
  const dy = centerY - logoCenterY;

  
  gsap.set(logoVideo, {
    x: dx,
    y: dy,
    scale: 6,
    opacity: 1,
    transformOrigin: '50% 50%'
  });

  
  gsap.set(preloaderLeft,  { x: 0, y: 0 });
  gsap.set(preloaderRight, { x: 0, y: 0 });
  gsap.set(preloaderTop,   { x: 0, y: 0 });
  gsap.set(preloaderBottom,{ x: 0, y: 0 });

  const tl = gsap.timeline({
    onComplete: function(){
      if (preloaderContainer) {
        preloaderContainer.style.display = 'none';
      }

      
      document.body.classList.add('preloader-complete');

      
      if (socialNav) {
        if (window.innerWidth > 768) {
          // десктоп — показываем social после прелоадера
          socialNav.style.opacity = '1';
          socialNav.style.visibility = 'visible';
          socialNav.style.pointerEvents = 'auto';
        } else {
          // мобильный — оставляем CSS рулить
          socialNav.style.opacity = '';
          socialNav.style.visibility = '';
          socialNav.style.pointerEvents = '';
        }
      }

      if (window.runHomeTitleAnim) {
        window.runHomeTitleAnim();
      }

      if (window.runHomeHeroCtaAnim) {
        window.runHomeHeroCtaAnim();
      }
    }
  });



  tl.to({}, { duration: 6.5 });

  tl.addLabel('revealMove');

  tl.add(function(){
    document.body.classList.add('preloader-complete');
  }, 'revealMove-=0.15');

  tl.add(function(){
    if (fullpage) {
      fullpage.style.opacity = '1';
      fullpage.style.visibility = 'visible';
    }
  }, 'revealMove-=0.15');

  tl.add(function(){
    try {
      logoVideo.pause();
    } catch (e) {
      console.warn('Pause error:', e);
    }
  }, 'revealMove');

  tl.to(logoVideo, {
    x: 0,
    y: 0,
    duration: 0.6,
    scale: 3,
    ease: 'power1.out'
  }, 'revealMove');


  tl.to(preloaderLeft, {
    x: '-120%',
    duration: 0.3,
    ease: 'none'
  }, 'revealMove');

  
  tl.to(preloaderRight, {
    x: '120%',
    duration: 0.3,
    ease: 'none'
  }, 'revealMove');

  
  tl.to(preloaderTop, {
    y: '-120%',
    duration: 0.3,
    ease: 'none'
  }, 'revealMove');

  
  tl.to(preloaderBottom, {
    y: '120%',
    duration: 0.3,
    ease: 'none'
  }, 'revealMove');
}


  function initWhenReady() {
    if (document.body.classList.contains('preloader-initialized')) return;
    document.body.classList.add('preloader-initialized');


    requestAnimationFrame(() => {
      startLogoVideoPreloader();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhenReady);
  } else {
    initWhenReady();
  }


  setTimeout(function(){
    if (!document.body.classList.contains('preloader-complete')) {
      document.body.classList.add('preloader-complete');
    }
  }, 15000);
})();


(function($){
  
  if (window.location.hash) {
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }

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
    document.body.classList.toggle("home-logo-white", idx === 0);
  }

  
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

    bindSmoothScroll(".menu a, .mobile-nav-link, .logo-link, .btn-how, .about-cta a");

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

      const map = {section0:0, section1:1, section2:2, section3:3, section4:4};
      const idx = map[current] ?? 0;

      // обновляем меню
      highlightActiveMenuItem(idx);
      updateMenuStyle(idx);

      // показываем social только на главной секции в мобильной версии
      const socialNav = document.querySelector(".social");
      if (socialNav) {
        if (idx === 0) {
          socialNav.classList.add("show-on-home");
        } else {
          socialNav.classList.remove("show-on-home");
        }
      }
    });

    // сразу вычисляем активную секцию при загрузке
    $(window).trigger("scroll");
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
        this.style.background = ``;
      });
      submitBtn.addEventListener("mouseleave", function () {
        this.style.background =
          "";
      });
    }
  })();


  function initFlyInObserver() {
    if (!window.gsap) return;

    // === MAP (section1) — АНИМАЦИЯ КАРТЫ В МОБИЛКЕ ===
    const mapSection = document.getElementById("section1");
    if (mapSection) {
      const mapObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (window.runMapWrapperAnim) window.runMapWrapperAnim();
            mapObserver.disconnect();
          }
        });
      }, {
        threshold: 0.3
      });

      mapObserver.observe(mapSection);
    }

    // === DONATE (section2) ===
    const donateSection = document.getElementById("section2");
    if (donateSection) {
      const donateObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (window.runDonationWidgetAnim)   window.runDonationWidgetAnim();
            if (window.runDonateBenefitsAnim)   window.runDonateBenefitsAnim();
            if (window.runDonateAllocationAnim) window.runDonateAllocationAnim();
            if (window.runDonateTitlesAnim)     window.runDonateTitlesAnim();

            donateObserver.disconnect();
          }
        });
      }, {
        threshold: 0.3
      });

      donateObserver.observe(donateSection);
    }

    // === ABOUT (section3) ===
    const aboutSection = document.getElementById("section3");
    if (aboutSection) {
      const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (window.runAboutUsButtonsAnim) window.runAboutUsButtonsAnim();
            if (window.runAboutGridAnim)      window.runAboutGridAnim();
            if (window.runAboutTextAnim)      window.runAboutTextAnim();
            aboutObserver.disconnect();
          }
        });
      }, {
        threshold: 0.3
      });

      aboutObserver.observe(aboutSection);
    }
  }

  function initFullPage(){
    if (fullpageInstance || typeof fullpage === "undefined") return;
    fullpageInstance = new fullpage("#fullpage", {
      anchors: ["firstPage", "secondPage", "3rdPage", "4thpage", "5thpage"],
      css3: true,
      licenseKey: "OPEN-SOURCE-GPLV3-LICENSE",
      fixedElements: ".main-header, #sidebar, .social",
      afterLoad: function(origin, destination){
        highlightActiveMenuItem(destination.index);
        updateMenuStyle(destination.index);

        
        if (destination.index === 1) {
          setTimeout(function () {
            if (window.runMapWrapperAnim) window.runMapWrapperAnim();
          }, 120);
        }

        
        if (destination.index === 2) {
          setTimeout(function () {
            if (window.runDonationWidgetAnim)   window.runDonationWidgetAnim();
            if (window.runDonateBenefitsAnim)   window.runDonateBenefitsAnim();
            if (window.runDonateAllocationAnim) window.runDonateAllocationAnim();
            if (window.runDonateTitlesAnim)     window.runDonateTitlesAnim();
          }, 100);
        }

        
        if (destination.index === 3) {
          setTimeout(function () {
            if (window.runAboutUsButtonsAnim) window.runAboutUsButtonsAnim();
            if (window.runAboutGridAnim)      window.runAboutGridAnim();            
            if (window.runAboutTextAnim)      window.runAboutTextAnim();
          }, 150);
        }
      },


      afterSlideLoad: function(section, origin, destination){
      
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
      initFlyInObserver();
      
      setTimeout(() => {
        $("#section3 .slide").each(function(){
          $(this).css({display:"block", opacity:"1", visibility:"visible", transform:"none", position:"static"});
        });
      }, 100);
    } else {
      $("body").removeClass("mobile-scroll-mode");
      $(window).off(".mobileScroll");
      // Снимаем обработчики со всех элементов, куда мы их вешали в initMobileScroll
      $(".menu a, .mobile-nav-link, .logo-link, .btn-how, .about-cta a").off(".mobile");
      $("#section3 .slide").removeAttr("style");
      initFullPage();
    }
  }
  
  (function(){
    const wrapper = document.getElementById("mapWrapper");
    const iframe = document.getElementById("mapFrame");
    if (wrapper && iframe){
      iframe.style.pointerEvents = "none";
      wrapper.addEventListener("click", () => { iframe.style.pointerEvents = "auto"; });
      wrapper.addEventListener("mouseleave", () => { iframe.style.pointerEvents = "none"; });
    }
  })();
  
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
    if (heroBtn) openBtn && heroBtn.addEventListener("click", open);
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

    window._sidebar = { open, close, switchSlide };
  })();

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

  (function(){
    const overlay = document.getElementById("mobileNavOverlay");
    const burger  = document.getElementById("mobileBurger");
    if (!overlay) return;

    function closeOverlay(){
      overlay.classList.remove("open");
      if (burger) burger.setAttribute("aria-expanded", "false");
      setTimeout(()=> overlay.style.display = "none", 300);
    }

    window._closeMobileNavOverlay = closeOverlay;

    overlay.addEventListener("click", function(e){
      const link = e.target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return;

      const isMobileMode = document.body.classList.contains("mobile-scroll-mode");
      if (!isMobileMode) return;

      setTimeout(closeOverlay, 400);
    }, { passive: true });
  })();

  (function(){
    const overlay = document.getElementById("mobileNavOverlay");
    const panel   = overlay?.querySelector(".mobile-nav-panel");
    const aboutCta= document.querySelector("#section3 .about-cta");
    if (!overlay || !panel || !aboutCta) return;

    
    let placeholder = document.createElement("div");
    placeholder.style.display = "none";
    if (aboutCta.parentNode) {
      aboutCta.parentNode.insertBefore(placeholder, aboutCta);
    }

    function moveToMenu(){
      if (!panel.contains(aboutCta)) {
        panel.appendChild(aboutCta);
        aboutCta.classList.add("in-mobile-menu");
        aboutCta.style.opacity = '1';
        aboutCta.style.transform = 'scale(1)';
        aboutCta.querySelectorAll('*').forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'scale(1)';
        });
        
      }
    }

    function restoreToAbout(){
      if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.insertBefore(aboutCta, placeholder);
        aboutCta.classList.remove("in-mobile-menu");
      }
    }

    
    const mo = new MutationObserver(() => {
      if (overlay.classList.contains("open")) moveToMenu();
      else restoreToAbout();
    });
    mo.observe(overlay, { attributes: true, attributeFilter: ["class"] });

    
    overlay.addEventListener("click", (e)=>{ if (e.target === overlay) restoreToAbout(); });
    window.addEventListener("resize", () => { if (!overlay.classList.contains("open")) restoreToAbout(); });
    window.addEventListener("beforeunload", restoreToAbout);
  })();


  
  $(document).ready(function() {
    if (mobileMode) { 
      initMobileScroll(); 
      initFlyInObserver(); 
    } else { 
      initFullPage(); 
    }
  });

  let tmr;
  $(window).on("resize", function(){
    clearTimeout(tmr);
    tmr = setTimeout(handleResize, 250);
  });


  (function() {
    const CONFIG = {
      startValue: 0, 
      targetValue: 4296, 
      animationDuration: 2500,
      videoIncrement: 24,   
      videoSelector: '.my-video',
      counterSelector: '#devicesCount'
    };

    let currentCount = CONFIG.targetValue;
    let isAnimating = false;
    let videoIncrementInterval = null;

    
    function formatNumber(num) {
      return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

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
          startVideoIncrement();
        }
      }
      
      requestAnimationFrame(update);
    }

    function startVideoIncrement() {
      const video = document.querySelector(CONFIG.videoSelector);
      const counter = document.querySelector(CONFIG.counterSelector);
      
      if (!video || !counter) return;

      if (video.readyState < 1) {
        video.addEventListener('loadedmetadata', function onMetadata() {
          video.removeEventListener('loadedmetadata', onMetadata);
          startVideoIncrement();
        });
        return;
      }

      const videoDuration = video.duration;
      if (!videoDuration || videoDuration === 0) return;

      const incrementPerSecond = CONFIG.videoIncrement / videoDuration;

      if (videoIncrementInterval) {
        clearInterval(videoIncrementInterval);
      }

      videoIncrementInterval = setInterval(() => {
        currentCount += incrementPerSecond * 0.1;
        counter.textContent = formatNumber(currentCount);
      }, 100);

      video.addEventListener('ended', () => {
        if (videoIncrementInterval) {
          clearInterval(videoIncrementInterval);
        }
      });
    }


    function waitForPreloader(callback) {
      if (document.body.classList.contains('preloader-complete')) {
        callback();
        return;
      }

      
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && 
              mutation.attributeName === 'class' &&
              document.body.classList.contains('preloader-complete')) {
            observer.disconnect();
            setTimeout(callback, 800);
          }
        });
      });

      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
      });

      
      setTimeout(() => {
        observer.disconnect();
        callback();
      }, 10000);
    }

    function initCounter() {
      const counter = document.querySelector(CONFIG.counterSelector);
      if (!counter) {
        console.warn('Counter element not found');
        return;
      }

      counter.textContent = formatNumber(CONFIG.startValue);

      
      waitForPreloader(() => {
        animateCountUp(
          counter, 
          CONFIG.startValue, 
          CONFIG.targetValue, 
          CONFIG.animationDuration
        );
      });
    }

    
    window.addEventListener('beforeunload', () => {
      if (videoIncrementInterval) {
        clearInterval(videoIncrementInterval);
      }
    });

    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initCounter);
    } else {
      initCounter();
    }

    
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


  (function(){
    function matchStatsWidth(){
      const stats = document.querySelector('.home-stats');
      const cta = document.querySelector('.home-cta');
      if(!stats || !cta) return;

      const btns = cta.querySelectorAll('button, a');
      if(btns.length >= 2){
        const totalWidth = btns[0].offsetWidth + btns[1].offsetWidth + 16; 
        stats.style.width = totalWidth + 'px';
      }
    }

    window.addEventListener('load', matchStatsWidth);
    window.addEventListener('resize', matchStatsWidth);
  })();



  
})(jQuery);




(function(){
  if (!window.gsap) return;

  let played = false;

  function prepareDonateCardsInitial() {
    const cards = document.querySelectorAll('#section2 .donate-benefits .benefit-card');
    if (cards.length < 4) return;

    gsap.set(cards[0], { opacity: 0, x: -200, y: -200 });
    gsap.set(cards[1], { opacity: 0, x:  200, y: -200 });
    gsap.set(cards[2], { opacity: 0, x: -200, y:  200 });
    gsap.set(cards[3], { opacity: 0, x:  200, y:  200 });
  }

  function runDonateBenefitsAnim() {
    if (played) return;

    const cards = document.querySelectorAll('#section2 .donate-benefits .benefit-card');
    if (cards.length < 4) return;

    played = true;

    var c1 = cards[0];
    var c2 = cards[1];
    var c3 = cards[2];
    var c4 = cards[3];

    gsap.to(c1, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.9,
      ease: "none"
    });
    gsap.to(c2, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.9,
      ease: "none",
      delay: 0.06
    });
    gsap.to(c3, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.9,
      ease: "none",
      delay: 0.12
    });
    gsap.to(c4, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.9,
      ease: "none",
      delay: 0.18
    });
  }


  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", prepareDonateCardsInitial);
  } else {
    prepareDonateCardsInitial();
  }

  
  window.runDonateBenefitsAnim = runDonateBenefitsAnim;
})();


(function(){
  if (!window.gsap) return;

  let allocationPlayed = false;

  function prepareDonateAllocationInitial() {
    const items = document.querySelectorAll('#section2 .donate-allocation .alloc-pill');
    if (!items.length) return;

    const off = window.innerWidth * 1.2;
    gsap.set(items, { opacity: 0, x: -off });
  }


  function animatePercent(el) {
    const span = el.querySelector('.percent');
    if (!span) return;

    let targetText = span.textContent.replace('%','').trim();
    let target = parseInt(targetText, 10);
    if (isNaN(target)) return;

    let obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration: 1.2,
      ease: "none",
      onUpdate: () => {
        span.textContent = Math.round(obj.val) + "%";
      }
    });
  }


  function runDonateAllocationAnim() {
    if (allocationPlayed) return;
    allocationPlayed = true;

    const items = document.querySelectorAll('#section2 .donate-allocation .alloc-pill');
    if (!items.length) return;

    const off = window.innerWidth * 1.2;

    
    gsap.set(items, { opacity: 0, x: off });

    gsap.to(items, {
      opacity: 1,
      x: 0,
      duration: 1.2,
      ease: "power1.inOut",
      stagger: 0.12,
      onComplete: () => {
        items.forEach(animatePercent);
      }
    });
  }

  
  window.prepareDonateAllocationInitial = prepareDonateAllocationInitial;
  window.runDonateAllocationAnim = runDonateAllocationAnim;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", prepareDonateAllocationInitial);
  } else {
    prepareDonateAllocationInitial();
  }

})();



(function(){
  if (!window.gsap) return;

  let donationWidgetPlayed = false;

  function prepareDonationWidgetInitial() {
    const widget = document.querySelector('#section2 .donation-widget');
    if (!widget) return;

    const off = window.innerWidth * 1.2;
    gsap.set(widget, { opacity: 0, x: -off });
  }

  function runDonationWidgetAnim() {
    if (donationWidgetPlayed) return;

    const widget = document.querySelector('#section2 .donation-widget');
    if (!widget) return;

    donationWidgetPlayed = true;

    const off = window.innerWidth * 1.2;
    gsap.set(widget, { opacity: 0, x: -off });

    gsap.to(widget, {
      opacity: 1,
      x: 0,
      duration: 1.2,
      ease: 'none'
    });
  }
  

  window.runDonationWidgetAnim = runDonationWidgetAnim;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', prepareDonationWidgetInitial);
  } else {
    prepareDonationWidgetInitial();
  }
})();


(function(){
  if (!window.gsap) return;

  let donateTitlesPlayed = false;

  
  function wrapTitle(selector) {
    const el = document.querySelector(selector);
    if (!el) return null;

    
    const existing = el.querySelector('.reveal-inner');
    if (existing) return existing;

    const text = el.textContent;

    const inner = document.createElement('span');
    inner.className = 'reveal-inner';
    inner.textContent = text;
    inner.style.display = 'inline-block';

    
    el.textContent = '';
    el.style.overflow = 'hidden';
    el.style.display = 'inline-block';

    el.appendChild(inner);
    return inner;
  }

  
  function prepareDonateTitlesInitial() {
    const h1Inner        = wrapTitle('#section2 .donate-h1');
    const subInner       = wrapTitle('#section2 .donate-sub');
    const whereInner     = wrapTitle('#section2 .donate-where-title');
    const whereSubInner  = wrapTitle('#section2 .donate-where-sub');

    const items = [h1Inner, subInner, whereInner, whereSubInner].filter(Boolean);
    if (!items.length) return;

    gsap.set(items, {
      yPercent: 100,
      opacity: 0
    });
  }

  
  function runDonateTitlesAnim() {
    if (donateTitlesPlayed) return;
    donateTitlesPlayed = true;

    const h1Inner        = wrapTitle('#section2 .donate-h1');
    const subInner       = wrapTitle('#section2 .donate-sub');
    const whereInner     = wrapTitle('#section2 .donate-where-title');
    const whereSubInner  = wrapTitle('#section2 .donate-where-sub');

    const items = [h1Inner, subInner, whereInner, whereSubInner].filter(Boolean);
    if (!items.length) return;

    gsap.to(items, {
      yPercent: 0,
      opacity: 1,
      duration: 1.1,
      ease: 'none',
      stagger: 0.15
    });
  }

  
  window.runDonateTitlesAnim = runDonateTitlesAnim;

  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', prepareDonateTitlesInitial);
  } else {
    prepareDonateTitlesInitial();
  }
})();


(function(){
  if (!window.gsap) return;

  let aboutUsButtonsPlayed = false;

  function prepareAboutUsButtonsInitial() {
    const orderBtn  = document.querySelector('#section3 .about-cta button.btn-order-bin');
    const donateBtn = document.querySelector('#section3 .about-cta a.btn-order-bin');

    if (!orderBtn || !donateBtn) return;

    gsap.set([orderBtn, donateBtn], {
      opacity: 0,
      scale: 0.7
    });
  }

  function runAboutUsButtonsAnim() {
    if (aboutUsButtonsPlayed) return;
    aboutUsButtonsPlayed = true;

    const orderBtn  = document.querySelector('#section3 .about-cta button.btn-order-bin');
    const donateBtn = document.querySelector('#section3 .about-cta a.btn-order-bin');

    if (!orderBtn || !donateBtn) return;

    gsap.to(orderBtn, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: "elastic.out(1, 0.4)"
    });

    gsap.to(donateBtn, {
      opacity: 1,
      scale: 1,
      duration: 1.1,
      ease: "elastic.out(1, 0.4)",
      delay: 0.1
    });
  }

  window.runAboutUsButtonsAnim = runAboutUsButtonsAnim;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', prepareAboutUsButtonsInitial);
  } else {
    prepareAboutUsButtonsInitial();
  }
})();


(function(){
  if (!window.gsap) return;

  let aboutGridPlayed = false;

  function prepareAboutGridInitial() {
    const items = document.querySelectorAll('#section3 .about-grid .about-card');
    if (!items.length) return;

    gsap.set(items, {
      opacity: 0,
      y: 40
    });
  }

  function runAboutGridAnim() {
    if (aboutGridPlayed) return;
    aboutGridPlayed = true;

    const items = document.querySelectorAll('#section3 .about-grid .about-card');
    if (!items.length) return;

    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "none",
    });
  }

  window.runAboutGridAnim = runAboutGridAnim;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', prepareAboutGridInitial);
  } else {
    prepareAboutGridInitial();
  }
})();


(function(){
  if (!window.gsap) return;

  let aboutTextPrepared = false;
  let aboutTextPlayed   = false;

  
  function prepareAboutTextInitial() {
    if (aboutTextPrepared) return;
    aboutTextPrepared = true;

    const leftItems  = document.querySelectorAll(".about-title, .about-lead, .about-mini");
    const rightItems = document.querySelectorAll(".about-text");

    
    gsap.set(leftItems, {
      opacity: 0,
      y: -10
    });

    
    gsap.set(rightItems, {
      opacity: 0,
      y: 10
    });
  }

  
  window.runAboutTextAnim = function() {
    if (aboutTextPlayed) return;
    aboutTextPlayed = true;

    
    prepareAboutTextInitial();

    const leftItems  = document.querySelectorAll(".about-title, .about-lead, .about-mini");
    const rightItems = document.querySelectorAll(".about-text");

    const tl = gsap.timeline();

    
    tl.to(leftItems, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "none",
    });

    
    tl.to(rightItems, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "none",
    }, "-=1");     
  };

  
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", prepareAboutTextInitial);
  } else {
    prepareAboutTextInitial();
  }
})();


(function () {
  if (!window.gsap) return;

  let homeTitlePrepared = false;
  let homeTitlePlayed = false;

  function prepareHomeTitle() {
    if (homeTitlePrepared) return;
    homeTitlePrepared = true;

    const title = document.querySelector(".home-title");
    if (!title) return;

    const nodes = Array.from(title.childNodes);
    const frag = document.createDocumentFragment();

    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        let currentWordSpan = null;

        for (let i = 0; i < text.length; i++) {
          const ch = text[i];

          // Разделитель слов — обычный пробел
          if (ch === " ") {
            // Закрываем текущее слово
            currentWordSpan = null;
            // Добавляем обычный пробел между словами
            frag.appendChild(document.createTextNode(" "));
            continue;
          }

          // Переводы строк / табы оставляем как есть
          if (ch === "\n" || ch === "\t") {
            currentWordSpan = null;
            frag.appendChild(document.createTextNode(ch));
            continue;
          }

          // Если это первая буква нового слова — создаем оболочку-слово
          if (!currentWordSpan) {
            currentWordSpan = document.createElement("span");
            currentWordSpan.className = "home-word";
            frag.appendChild(currentWordSpan);
          }

          // Буква внутри слова
          const letterSpan = document.createElement("span");
          letterSpan.className = "home-letter";
          letterSpan.textContent = ch;
          currentWordSpan.appendChild(letterSpan);
        }
      } else {
        // <br> и другие узлы клонируем как есть
        frag.appendChild(node.cloneNode(true));
      }
    });

    // Переписываем содержимое заголовка
    title.innerHTML = "";
    title.appendChild(frag);

    // Прячем все буквы перед анимацией
    const letters = title.querySelectorAll(".home-letter");
    gsap.set(letters, {
      opacity: 0
    });
  }


  window.runHomeTitleAnim = function () {
  if (homeTitlePlayed) return;
  homeTitlePlayed = true;

  prepareHomeTitle();

  const letters = document.querySelectorAll(".home-letter");
  if (!letters.length) return;

  gsap.to(letters, {
    opacity: 1,
    duration: 0.2,  
    ease: "none",      
    stagger: 0.08   
  });
};

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", prepareHomeTitle);
  } else {
    prepareHomeTitle();
  }
})();


(function(){
  if (!window.gsap) return;

  let homeHeroCtaPlayed = false;

  function prepareHomeHeroCtaInitial() {
    const stats    = document.querySelector('#section0 .home-stats');
    const orderBtn = document.querySelector('#section0 .home-cta .btn-order-bin');
    const howBtn   = document.querySelector('#section0 .home-cta .btn-how');

    const items = [stats, orderBtn, howBtn].filter(Boolean);
    if (!items.length) return;
    
    gsap.set(items, {
      opacity: 0,
      scale: 0.7
    });
  }

  function runHomeHeroCtaAnim() {
    if (homeHeroCtaPlayed) return;
    homeHeroCtaPlayed = true;

    const stats    = document.querySelector('#section0 .home-stats');
    const orderBtn = document.querySelector('#section0 .home-cta .btn-order-bin');
    const howBtn   = document.querySelector('#section0 .home-cta .btn-how');

    if (!stats || !orderBtn || !howBtn) return;

    
    gsap.to(stats, {
      opacity: 1,
      scale: 1,
      duration: 1.1,
      ease: "elastic.out(1, 0.4)"
    });

    
    gsap.to(orderBtn, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: "elastic.out(1, 0.4)",
      delay: 0.08
    });

    
    gsap.to(howBtn, {
      opacity: 1,
      scale: 1,
      duration: 1.1,
      ease: "elastic.out(1, 0.4)",
      delay: 0.16
    });
  }

  
  window.runHomeHeroCtaAnim = runHomeHeroCtaAnim;

  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', prepareHomeHeroCtaInitial);
  } else {
    prepareHomeHeroCtaInitial();
  }
})();



(function(){
  if (!window.gsap) return;

  let mapPlayed = false;

  function prepareMapWrapperInitial() {
    const wrapper = document.getElementById('mapWrapper');
    if (!wrapper) return;

    gsap.set(wrapper, {
      opacity: 0,
      scale: 0.85,
      transformOrigin: '50% 50%'
    });
  }

  function runMapWrapperAnim() {
    if (mapPlayed) return;
    mapPlayed = true;

    const wrapper = document.getElementById('mapWrapper');
    if (!wrapper) return;

    gsap.fromTo(wrapper,
      {
        opacity: 0,
        scale: 0.45
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'none'
      }
    );
  }
  

  window.runMapWrapperAnim = runMapWrapperAnim;

  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', prepareMapWrapperInitial);
  } else {
    prepareMapWrapperInitial();
  }
})();



// ====== SECTION 4: STATS SLIDER ======
(function initSection4StatsSlider() {
  const section4 = document.getElementById('section4');
  if (!section4) return;

  const segButtons = section4.querySelectorAll('.seg-item');
  const thumbs     = section4.querySelectorAll('.seg-thumb');
  const slides     = section4.querySelectorAll('.impact-slide');
  const wrapper    = section4.querySelector('.slides-wrapper');
  const swipeArea  = wrapper || section4;

  if (!segButtons.length || !thumbs.length || !slides.length || !wrapper) return;

  const slideOrder = ['slide1', 'slide2'];
  let currentIndex = 0;
  let autoTimer    = null;

  
  function fixWrapperHeight() {
    let maxH = 0;
    const prev = [];

    slides.forEach(slide => {
      prev.push(slide.style.display);
      slide.style.display = 'block';  
      const h = slide.offsetHeight;
      if (h > maxH) maxH = h;
    });

    slides.forEach((slide, i) => {
      slide.style.display = prev[i];     
    });

    wrapper.style.minHeight = maxH + 'px'; 
  }

  function setSlide(index, userTriggered = false) {
    if (index < 0) index = slideOrder.length - 1;
    if (index >= slideOrder.length) index = 0;
    currentIndex = index;

    const targetId = slideOrder[currentIndex];

    segButtons.forEach(btn => {
      const isActive = btn.dataset.target === targetId;
      btn.classList.toggle('active', isActive);
    });

    const percentage = currentIndex * 100;
    thumbs.forEach(thumb => {
      thumb.style.transform = `translateX(${percentage}%)`;
    });

    slides.forEach(slide => {
      slide.classList.toggle('active', slide.id === targetId);
    });

    
    const activeSlide = document.getElementById(targetId);
    if (activeSlide && wrapper) {
      const height = activeSlide.offsetHeight;
      wrapper.style.minHeight = `${height}px`;
    }

    if (userTriggered) restartAutoSlide();
  }

  // клики по любому из переключателей
  segButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const index = slideOrder.indexOf(targetId);
      if (index !== -1) setSlide(index, true);
    });
  });


  function startAutoSlide() {
    autoTimer = setInterval(() => {
      setSlide(currentIndex + 1, false);
    }, 9000);
  }

  function restartAutoSlide() {
    if (autoTimer) clearInterval(autoTimer);
    startAutoSlide();
  }

  
  let touchStartX = 0;
  swipeArea.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  swipeArea.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const dx = touchEndX - touchStartX;
    const threshold = 50;

    if (Math.abs(dx) > threshold) {
      if (dx < 0) {
        setSlide(currentIndex + 1, true);
      } else {
        setSlide(currentIndex - 1, true);
      }
    }
  }, { passive: true });

  
  fixWrapperHeight();
  setSlide(0, false);
  startAutoSlide();
})();





document.addEventListener("keydown", function(e){
  if (e.key === "Escape") {
    var sidebar = document.getElementById("sidebar");
    if (sidebar && (sidebar.classList.contains("open") || document.body.classList.contains("sidebar-open"))) {
      sidebar.classList.remove("open");
      document.body.classList.remove("sidebar-open");
      setTimeout(function(){ if (sidebar) sidebar.style.display = "none"; }, 600);
    }
  }
});