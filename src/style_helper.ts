import { colorSliderLeft, colorSliderRight } from "./exports.module.scss";

function getPercentPosition(slider: HTMLInputElement) {
  const min = parseInt(slider.min);
  const max = parseInt(slider.max);
  const value = parseInt(slider.value);
  return ((value - min) / (max - min)) * 100;
}

for (const sliderEl of document.querySelectorAll('input[type="range"]')) {
  const slider = sliderEl as HTMLInputElement;
  slider.addEventListener("input", () => {
    const percentage = getPercentPosition(slider);
    slider.style.background = `
        linear-gradient(
            to right,
            ${colorSliderLeft} 0%,
            ${colorSliderLeft} ${percentage}%,
            ${colorSliderRight} ${percentage}%,
            ${colorSliderRight} 100%
        )
        `;
  });
}
