function getPercentPosition(slider: HTMLInputElement) {
  const min = parseInt(slider.min);
  const max = parseInt(slider.max);
  const value = parseInt(slider.value);
  return ((value - min) / (max - min)) * 100;
}

for (const slider of document.querySelectorAll('input[type="range"]')) {
  slider.addEventListener("input", () => {
    const percentage = getPercentPosition(slider);
    slider.style.background = `
        linear-gradient(
            to right,
            var(--color-blue) 0%,
            var(--color-blue) ${percentage}%,
            var(--color-blue-desaturated) ${percentage}%,
            var(--color-blue-desaturated) 100%
        )
        `;
  });
}
