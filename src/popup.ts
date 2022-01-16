/// <reference path="../node_modules/chrome-extension-async/chrome-extension-async.d.ts" />
import "chrome-extension-async";

import Message from "./interfaces/Message";

const volumeContainer: HTMLDivElement =
  document.querySelector(".slider-container");
const slider: HTMLInputElement = document.getElementById("slider-main");
const valueSpan: HTMLSpanElement = document.getElementById("slider-value");
const lrSpan: HTMLSpanElement = document.getElementById("slider-lr");

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

slider.addEventListener("input", () => {
  const value = parseInt(slider.value) / 100;
  updateSliderDisplay();
  setActiveTabVolume(value);
});

async function getActiveTabPanValue() {
  const tabId = await getActiveTabId();
  const message: Message = { name: "get-tab-pan-value", tabId };
  return await chrome.runtime.sendMessage(message);
}

async function setActiveTabVolume(value: number) {
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
