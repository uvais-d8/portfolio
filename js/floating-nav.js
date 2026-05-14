document.addEventListener('DOMContentLoaded', () => {
  // Create the floating nav element
  const floatingNav = document.createElement('div');
  floatingNav.className = 'floating-nav';
  floatingNav.innerHTML = `
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="work.html">Work</a>
    <a href="contact.html">Contact</a>
  `;
  document.body.appendChild(floatingNav);

  let isScrolling;
  const heroSection = document.querySelector('.hero, .hero-wrap');
  
  const handleScroll = () => {
    // 1. Hide while scrolling
    floatingNav.classList.remove('visible');

    // 2. Clear previous timeout
    window.clearTimeout(isScrolling);

    // 3. Set a timeout to run after scrolling stops
    isScrolling = setTimeout(() => {
      const scrollPosition = window.scrollY;
      const heroHeight = heroSection ? heroSection.offsetHeight : 500;

      // 4. Only show if we are BELOW the hero section
      if (scrollPosition > heroHeight - 100) {
        floatingNav.classList.add('visible');
      }
    }, 400); // Wait 400ms after scroll stops to show
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
});
