/// <reference path="../node_modules/chrome-extension-async/chrome-extension-async.d.ts" />
import "chrome-extension-async";

import Message from "./interfaces/Message";

const inputEvent = new Event("input");

const volumeContainer: HTMLDivElement =
  document.querySelector(".slider-container");
const slider: HTMLInputElement = document.getElementById("slider-main");
const valueSpan: HTMLSpanElement = document.getElementById("slider-value");
const lrSpan: HTMLSpanElement = document.getElementById("slider-lr");
const resetBtn: HTMLButtonElement = document.getElementById("reset-button");

void (async () => {
  // Hide the slider until we know the initial volume
  volumeContainer.style.opacity = "0";

  const initialValue: number = await getActiveTabPanValue();
  slider.value = (initialValue * 100).toString();
  updateSliderDisplay();

  volumeContainer.style.opacity = "1";
})();

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

function resetSlider() {
  slider.value = "0";
  slider.dispatchEvent(inputEvent);
}

slider.addEventListener("input", () => {
  updateSliderDisplay();
  setActiveTabPanValue(parseInt(slider.value) / 100);
});

slider.addEventListener("dblclick", resetSlider);
resetBtn.addEventListener("click", resetSlider);

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

async function getActiveTabId() {
  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  return activeTab.id;
}
