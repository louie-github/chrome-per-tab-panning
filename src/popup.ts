/// <reference path="../node_modules/chrome-extension-async/chrome-extension-async.d.ts" />
import "chrome-extension-async";

export {
  // Functions
  getActiveTabId,
  getActiveTabPanValue,
  setActiveTabPanValue,
  // DOM elements
  volumeContainer,
  sliderContainer,
  slider,
  sliderDisplayContainer as textDisplayContainer,
  valueSpan,
  lrSpan,
  resetBtn,
  // DOM functions
  isLeftRight,
  updateSliderDisplay,
  hideSliderAndDisplay,
  resetSlider,
};

const inputEvent = new Event("input");

const volumeContainer: HTMLDivElement =
  document.querySelector(".display-container");
const sliderContainer: HTMLDivElement = document.querySelector(
  ".display-row.main-row"
);
const slider: HTMLInputElement = document.getElementById("slider-main");
const sliderDisplayContainer: HTMLDivElement = document.querySelector(
  ".display-row.slider-display"
);
const valueSpan: HTMLSpanElement = document.getElementById("slider-value");
const lrSpan: HTMLSpanElement = document.getElementById("slider-lr");
const resetBtn: HTMLButtonElement = document.querySelector(
  ".display-row.main-row .reset-button"
);

async function getActiveTabId() {
  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  return activeTab.id;
}

// Tab communication
async function getActiveTabPanValue() {
  const tabId = await getActiveTabId();
  const message: Message = { name: "get-tab-pan-value", tabId };
  return await chrome.runtime.sendMessage(message);
}

async function setActiveTabPanValue(value: number) {
  const tabId = await getActiveTabId();
  let message: Message;
  message = { name: "set-tab-pan-value", tabId, value };
  return await chrome.runtime.sendMessage(message);
}

// popup utility functions
function isLeftRight() {
  const value = parseInt(slider.value);
  if (value < 0) {
    return "\u2190 LEFT";
  } else if (value > 0) {
    return "RIGHT \u2192";
  } else {
    return "NONE";
  }
}

function updateSliderDisplay() {
  lrSpan.textContent = isLeftRight();
  valueSpan.textContent = `${slider.value}%`;
}

function hideSliderAndDisplay(flag: boolean) {
  const opacityValue = flag ? "0" : "1";
  slider.style.opacity = opacityValue;
  sliderDisplayContainer.style.opacity = opacityValue;
}

function resetSlider() {
  slider.value = "0";
  slider.dispatchEvent(inputEvent);
}

slider.addEventListener("input", async () => {
  updateSliderDisplay();
  await setActiveTabPanValue(parseInt(slider.value) / 100);
});

slider.addEventListener("dblclick", resetSlider);
resetBtn.addEventListener("click", () => {
  resetSlider();
  slider.style.opacity = "1";
  sliderDisplayContainer.style.opacity = "1";
});

void (async () => {
  // Hide the slider until we know the initial pan value
  volumeContainer.style.opacity = "0";

  const initialValue: number = await getActiveTabPanValue();
  slider.value = (initialValue * 100).toString();
  slider.dispatchEvent(inputEvent);

  volumeContainer.style.opacity = "1";
})();
