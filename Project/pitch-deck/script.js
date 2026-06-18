/* =============================================
   AGRO GROVE — PITCH DECK CONTROLLER
   Navigation, Animations & Interactions
   ============================================= */

class PitchDeck {
  constructor() {
    this.slides = document.querySelectorAll('.slide');
    this.totalSlides = this.slides.length;
    this.currentSlide = 0;
    this.isAnimating = false;
    this.animationDuration = 600;

    this.init();
  }

  init() {
    // Set first slide active
    this.slides[0].classList.add('active');

    // Build navigation
    this.buildNav();
    this.buildProgressBar();
    this.buildSlideCounter();
    this.buildFullscreenButton();

    // Event listeners
    this.bindKeyboard();
    this.bindTouch();
    this.bindWheel();

    // Update UI
    this.updateNav();
    this.updateProgress();
    this.updateCounter();

    // Trigger initial animations
    this.triggerAnimations(0);
  }

  buildNav() {
    // Arrow buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'nav__arrow nav__arrow--prev';
    prevBtn.innerHTML = '&#8249;';
    prevBtn.setAttribute('aria-label', 'Previous slide');
    prevBtn.addEventListener('click', () => this.prev());

    const nextBtn = document.createElement('button');
    nextBtn.className = 'nav__arrow nav__arrow--next';
    nextBtn.innerHTML = '&#8250;';
    nextBtn.setAttribute('aria-label', 'Next slide');
    nextBtn.addEventListener('click', () => this.next());

    document.body.appendChild(prevBtn);
    document.body.appendChild(nextBtn);

    // Dot navigation
    const nav = document.createElement('nav');
    nav.className = 'nav';

    const dots = document.createElement('div');
    dots.className = 'nav__dots';

    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = 'nav__dot';
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => this.goTo(i));
      dots.appendChild(dot);
    }

    nav.appendChild(dots);
    document.body.appendChild(nav);

    this.dots = dots.querySelectorAll('.nav__dot');
    this.prevBtn = prevBtn;
    this.nextBtn = nextBtn;
  }

  buildProgressBar() {
    const bar = document.createElement('div');
    bar.className = 'progress-bar';
    document.body.appendChild(bar);
    this.progressBar = bar;
  }

  buildSlideCounter() {
    const counter = document.createElement('div');
    counter.className = 'slide-counter';
    document.body.appendChild(counter);
    this.slideCounter = counter;
  }

  buildFullscreenButton() {
    const fsBtn = document.createElement('button');
    fsBtn.className = 'fullscreen-btn';
    fsBtn.setAttribute('aria-label', 'Toggle fullscreen');
    fsBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`;
    
    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.warn(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });

    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) {
        fsBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>`;
      } else {
        fsBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`;
      }
    });

    document.body.appendChild(fsBtn);
  }

  bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          this.next();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          this.prev();
          break;
        case 'Home':
          e.preventDefault();
          this.goTo(0);
          break;
        case 'End':
          e.preventDefault();
          this.goTo(this.totalSlides - 1);
          break;
      }
    });
  }

  bindTouch() {
    let startX = 0;
    let startY = 0;
    const threshold = 50;

    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const deltaX = e.changedTouches[0].clientX - startX;
      const deltaY = e.changedTouches[0].clientY - startY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
        if (deltaX < 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    }, { passive: true });
  }

  bindWheel() {
    let lastWheelTime = 0;
    const wheelDebounce = 800;

    document.addEventListener('wheel', (e) => {
      const now = Date.now();
      if (now - lastWheelTime < wheelDebounce) return;

      if (Math.abs(e.deltaY) > 30) {
        lastWheelTime = now;
        if (e.deltaY > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    }, { passive: true });
  }

  next() {
    if (this.isAnimating || this.currentSlide >= this.totalSlides - 1) return;
    this.goTo(this.currentSlide + 1);
  }

  prev() {
    if (this.isAnimating || this.currentSlide <= 0) return;
    this.goTo(this.currentSlide - 1);
  }

  goTo(index) {
    if (this.isAnimating || index === this.currentSlide) return;
    if (index < 0 || index >= this.totalSlides) return;

    this.isAnimating = true;

    const current = this.slides[this.currentSlide];
    const target = this.slides[index];
    const direction = index > this.currentSlide ? 1 : -1;

    // Reset animation classes on current slide
    this.resetAnimations(current);

    // Remove active from current
    current.classList.remove('active');
    if (direction > 0) {
      current.classList.add('prev');
    }

    // Ensure target doesn't have 'prev' class when becoming active
    target.classList.remove('prev');

    // Position target
    target.style.transform = `translateX(${direction * 60}px)`;
    target.classList.add('active');

    // Force reflow
    void target.offsetWidth;

    // Animate target in
    target.style.transform = '';

    this.currentSlide = index;

    // Update UI
    this.updateNav();
    this.updateProgress();
    this.updateCounter();

    // Trigger content animations
    setTimeout(() => {
      this.triggerAnimations(index);
    }, 100);

    // Release animation lock
    setTimeout(() => {
      current.classList.remove('prev');
      this.isAnimating = false;
    }, this.animationDuration);
  }

  triggerAnimations(slideIndex) {
    const slide = this.slides[slideIndex];
    const animatedElements = slide.querySelectorAll('.anim-up, .anim-left, .anim-right, .anim-scale');

    animatedElements.forEach((el) => {
      // Reset and re-trigger
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    });
  }

  resetAnimations(slide) {
    const animatedElements = slide.querySelectorAll('.anim-up, .anim-left, .anim-right, .anim-scale');
    animatedElements.forEach((el) => {
      el.style.animation = 'none';
    });
  }

  updateNav() {
    // Update dots
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentSlide);
    });

    // Update arrows visibility
    this.prevBtn.style.opacity = this.currentSlide === 0 ? '0.3' : '1';
    this.prevBtn.style.pointerEvents = this.currentSlide === 0 ? 'none' : 'auto';
    this.nextBtn.style.opacity = this.currentSlide === this.totalSlides - 1 ? '0.3' : '1';
    this.nextBtn.style.pointerEvents = this.currentSlide === this.totalSlides - 1 ? 'none' : 'auto';
  }

  updateProgress() {
    const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
    this.progressBar.style.width = `${progress}%`;
  }

  updateCounter() {
    const current = String(this.currentSlide + 1).padStart(2, '0');
    const total = String(this.totalSlides).padStart(2, '0');
    this.slideCounter.textContent = `${current} / ${total}`;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PitchDeck();
});
