// Vanilla JavaScript animation utilities

export const animations = {
  // Animate coin drop
  animateCoinDrop(element: HTMLElement) {
    element.style.animation = 'none';
    setTimeout(() => {
      element.style.animation = 'coin-drop 0.8s ease-out';
    }, 10);
  },

  // Animate product dispense
  animateProductDispense(element: HTMLElement) {
    element.style.animation = 'product-dispense 1s ease-in';
    setTimeout(() => {
      element.style.animation = 'none';
    }, 1000);
  },

  // Pulse effect
  pulseElement(element: HTMLElement) {
    element.classList.add('animate-pulse-glow');
    setTimeout(() => {
      element.classList.remove('animate-pulse-glow');
    }, 2000);
  },

  // Shake effect for errors
  shakeElement(element: HTMLElement) {
    element.style.animation = 'shake 0.5s';
    setTimeout(() => {
      element.style.animation = 'none';
    }, 500);
  }
};

// Add shake animation to CSS if not present
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
}
