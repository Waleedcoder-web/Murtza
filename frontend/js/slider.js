/**
 * AURA LAB // HERO BANNER TELEMETRY SLIDER
 * Controls smooth slide cross-fades, automated pacing, telemetry counters,
 * and user pause/play controls.
 */

let currentSlideIdx = 0;
const totalSlides = 2;
let sliderInterval = null;
let isSliderPlaying = true;
const SLIDE_DURATION = 6000;

function goToSlide(index) {
  currentSlideIdx = index;
  
  // Update slide layers
  for (let i = 0; i < totalSlides; i++) {
    const slide = document.getElementById(`hero-slide-${i}`);
    if (slide) {
      if (i === currentSlideIdx) {
        slide.classList.remove('opacity-0', 'pointer-events-none', 'z-0');
        slide.classList.add('opacity-100', 'z-10');
      } else {
        slide.classList.remove('opacity-100', 'z-10');
        slide.classList.add('opacity-0', 'pointer-events-none', 'z-0');
      }
    }
  }

  // Update dots
  const dotsContainer = document.getElementById('slide-indicators');
  if (dotsContainer) {
    const dots = dotsContainer.querySelectorAll('.slide-dot');
    dots.forEach((dot, idx) => {
      if (idx === currentSlideIdx) {
        dot.className = 'slide-dot w-8 h-1.5 rounded-full bg-white transition-all';
      } else {
        dot.className = 'slide-dot w-3 h-1.5 rounded-full bg-white/40 hover:bg-white/70 transition-all';
      }
    });
  }

  // Update slide number indicator
  const numDisplay = document.getElementById('active-slide-num');
  if (numDisplay) {
    numDisplay.textContent = `0${currentSlideIdx + 1}`;
  }
}

function nextSlide() {
  const nextIdx = (currentSlideIdx + 1) % totalSlides;
  goToSlide(nextIdx);
}

function startSliderAuto() {
  if (sliderInterval) clearInterval(sliderInterval);
  sliderInterval = setInterval(nextSlide, SLIDE_DURATION);
  isSliderPlaying = true;
  updatePauseIcon();
}

function stopSliderAuto() {
  if (sliderInterval) clearInterval(sliderInterval);
  isSliderPlaying = false;
  updatePauseIcon();
}

function toggleSliderAuto() {
  if (isSliderPlaying) {
    stopSliderAuto();
  } else {
    startSliderAuto();
  }
}

function updatePauseIcon() {
  const icon = document.getElementById('pause-icon');
  if (icon) {
    icon.textContent = isSliderPlaying ? 'pause' : 'play_arrow';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const sliderEl = document.getElementById('hero-slider');
  if (sliderEl) {
    startSliderAuto();

    sliderEl.addEventListener('mouseenter', () => {
      if (isSliderPlaying) clearInterval(sliderInterval);
    });

    sliderEl.addEventListener('mouseleave', () => {
      if (isSliderPlaying) startSliderAuto();
    });
  }
});
