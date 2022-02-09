/// <reference path="../node_modules/chrome-extension-async/chrome-extension-async.d.ts" />
import "chrome-extension-async";

import Message from "./interfaces/Message";

export {
  // Functions
  getActiveTabId,
  getActiveTabPanValue,
  setActiveTabPanValue,
  // DOM elements
  volumeContainer,
  sliderContainer,
  slider,
  sliderDisplayContainer,
  valueSpan,
  lrSpan,
  resetBtn,
  // DOM functions
  isLeftRight,
  updateSliderDisplay,
  hideSliderAndDisplay,
  resetPanValue,
};

const inputEvent = new Event("input");

const volumeContainer = document.querySelector(
  ".display-container"
) as HTMLDivElement;
const sliderContainer = document.querySelector(
  ".display-row.main-row"
) as HTMLDivElement;
const slider = document.getElementById("slider-main") as HTMLInputElement;
const sliderDisplayContainer = document.querySelector(
  ".display-row.slider-display"
) as HTMLDivElement;
const valueSpan = document.getElementById("slider-value") as HTMLSpanElement;
const lrSpan = document.getElementById("slider-lr") as HTMLSpanElement;
const resetBtn = document.querySelector(
  ".display-row.main-row .reset-button"
) as HTMLButtonElement;

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
  const message: Message = { name: "set-tab-pan-value", tabId, value };
  return await chrome.runtime.sendMessage(message);
}

async function resetTab() {
  const tabId = await getActiveTabId();
  const message: Message = { name: "reset-tab", tabId };
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

function resetPanValue() {
  slider.value = "0";
  slider.dispatchEvent(inputEvent);
}

slider.addEventListener("input", async () => {
  updateSliderDisplay();
  await setActiveTabPanValue(parseInt(slider.value) / 100);
});

slider.addEventListener("dblclick", resetPanValue);
resetBtn.addEventListener("click", () => {
  resetPanValue();
  resetTab();
  slider.style.opacity = "1";
  sliderDisplayContainer.style.opacity = "1";
});

void (async () => {
  // Hide the slider until we know the initial pan value
  volumeContainer.style.opacity = "0";

  const initialValue = (await getActiveTabPanValue()) as unknown as number;
  slider.value = (initialValue * 100).toString();
  slider.dispatchEvent(inputEvent);

  volumeContainer.style.opacity = "1";
})();
