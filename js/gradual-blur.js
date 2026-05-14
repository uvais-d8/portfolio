function createGradualBlur(options) {
  const config = Object.assign({
    position: 'bottom',
    strength: 2,
    height: '1rem',
    width: '100%',
    divCount: 5,
    exponential: false,
    zIndex: 999,
    opacity: 1,
    curve: 'linear',
    target: 'page', // 'page' or 'parent'
    parentElement: document.body
  }, options);

  const container = document.createElement('div');
  container.className = `gradual-blur ${config.target === 'page' ? 'gradual-blur-page' : 'gradual-blur-parent'}`;

  // Container styling
  container.style.zIndex = config.zIndex;
  container.style.opacity = config.opacity;

  const isVertical = ['top', 'bottom'].includes(config.position);
  if (isVertical) {
    container.style.height = config.height;
    container.style.width = config.width;
    container.style[config.position] = '0';
    container.style.left = '0';
    container.style.right = '0';
  } else {
    container.style.width = config.height;
    container.style.height = '100%';
    container.style[config.position] = '0';
    container.style.top = '0';
    container.style.bottom = '0';
  }

  const inner = document.createElement('div');
  inner.className = 'gradual-blur-inner';

  const curveFunctions = {
    linear: p => p,
    bezier: p => p * p * (3 - 2 * p),
    'ease-in': p => p * p,
    'ease-out': p => 1 - Math.pow(1 - p, 2),
    'ease-in-out': p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
  };

  const curveFunc = curveFunctions[config.curve] || curveFunctions.linear;
  const increment = 100 / config.divCount;

  const directions = {
    top: 'to top',
    bottom: 'to bottom',
    left: 'to left',
    right: 'to right'
  };
  const direction = directions[config.position] || 'to bottom';

  for (let i = 1; i <= config.divCount; i++) {
    let progress = i / config.divCount;
    progress = curveFunc(progress);

    let blurValue;
    if (config.exponential) {
      blurValue = Math.pow(progress, 2) * config.strength;
    } else {
      blurValue = progress * config.strength;
    }

    const p1 = Math.round((increment * i - increment) * 10) / 10;
    const p2 = Math.round(increment * i * 10) / 10;
    const p3 = Math.round((increment * i + increment) * 10) / 10;
    const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

    let gradient = `transparent ${p1}%, black ${p2}%`;
    if (p3 <= 100) gradient += `, black ${p3}%`;
    if (p4 <= 100) gradient += `, transparent ${p4}%`;

    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.inset = '0';
    div.style.maskImage = `linear-gradient(${direction}, ${gradient})`;
    div.style.WebkitMaskImage = `linear-gradient(${direction}, ${gradient})`;
    div.style.backdropFilter = `blur(${blurValue.toFixed(3)}rem)`;
    div.style.WebkitBackdropFilter = `blur(${blurValue.toFixed(3)}rem)`;
    div.style.opacity = config.opacity;

    inner.appendChild(div);
  }

  container.appendChild(inner);
  config.parentElement.appendChild(container);

  return container;
}

// Automatically apply gradual blur to the bottom of the page
document.addEventListener('DOMContentLoaded', () => {
  const blurElement = createGradualBlur({
    position: 'bottom',
    height: '5rem',
    strength: 1.5,
    divCount: 15,
    exponential: true,
    target: 'page'
  });

  const heroSection = document.querySelector('.hero, .hero-wrap');
  
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const heroHeight = heroSection ? heroSection.offsetHeight : 500;
    
    if (scrollPosition < heroHeight - 700) {
      blurElement.style.opacity = '0';
      blurElement.style.pointerEvents = 'none';
    } else {
      blurElement.style.opacity = '1';
      blurElement.style.pointerEvents = 'auto';
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run initially
});
