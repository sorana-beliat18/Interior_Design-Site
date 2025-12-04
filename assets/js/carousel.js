// This script is managing the image carousel functionality
document.addEventListener("DOMContentLoaded", function() {
  const track = document.querySelector(".carousel-track");
  const slides = Array.from(track.children);
  const nextButton = document.querySelector(".carousel-btn.next");
  const prevButton = document.querySelector(".carousel-btn.prev");

  let currentIndex = 0;

  function getVisibleCount() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function updateCarousel() {
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }

  nextButton.addEventListener("click", () => {
    const visible = getVisibleCount();
    if (currentIndex < slides.length - visible) {
      currentIndex++;
      updateCarousel();
    }
  });

  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  window.addEventListener("resize", updateCarousel);
});