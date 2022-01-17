/// <reference path="../node_modules/chrome-extension-async/chrome-extension-async.d.ts" />
import "chrome-extension-async";

import Message from "./interfaces/Message";

const inputEvent = new Event("input");

const volumeContainer: HTMLDivElement =
  document.querySelector(".slider-container");
const sliderContainer: HTMLDivElement = document.querySelector(
  ".display-row.main-row"
);
const slider: HTMLInputElement = document.getElementById("slider-main");
const textDisplayContainer: HTMLDivElement = document.querySelector(
  ".display-row.text-display"
);
const valueSpan: HTMLSpanElement = document.getElementById("slider-value");
const lrSpan: HTMLSpanElement = document.getElementById("slider-lr");
const resetBtn: HTMLButtonElement = document.getElementById("reset-button");

const randomizeBtn: HTMLButtonElement =
  document.getElementById("randomizer-button");
const randomizerLeftBtn: HTMLButtonElement =
  document.getElementById("randomizer-left");
const randomizerNoneBtn: HTMLButtonElement =
  document.getElementById("randomizer-none");
const randomizerRightBtn: HTMLButtonElement =
  document.getElementById("randomizer-right");

// Tab communication
async function getActiveTabPanValue() {
  const tabId = await getActiveTabId();
  const message: Message = { name: "get-tab-pan-value", tabId };
  return await chrome.runtime.sendMessage(message);
}

async function setActiveTabPanValue(
  value: number,
  clearBadge: boolean = false
) {
  const tabId = await getActiveTabId();
  let message: Message;
  if (clearBadge) {
    message = { name: "set-tab-pan-value-clear-badge", tabId, value };
  } else {
    message = { name: "set-tab-pan-value", tabId, value };
  }
  return await chrome.runtime.sendMessage(message);
}

async function getActiveTabId() {
  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  return activeTab.id;
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

function resetSlider() {
  slider.value = "0";
  slider.dispatchEvent(inputEvent);
}

// Randomizer functionality
function toggleSliderAndDisplay(flag: boolean) {
  // Toggle if flag is unspecified
  if (flag === undefined) {
    flag = sliderContainer.style.opacity === "0";
  }
  const opacityValue = flag ? "1" : "0";
  slider.style.opacity = opacityValue;
  textDisplayContainer.style.opacity = opacityValue;
}

async function randomizePanning() {
  // Generate a random number from 0 to 2
  const randValue = Math.floor(Math.random() * 3);
  let ret: string;
  switch (randValue) {
    case 0:
      await setActiveTabPanValue(-1, true);
      ret = "LEFT";
      break;
    case 1: // RIGHT
      await setActiveTabPanValue(1, true);
      ret = "RIGHT";
      break;
    default:
      await setActiveTabPanValue(0, true);
      ret = "NONE";
      break;
  }
  return ret;
}

slider.addEventListener("input", async () => {
  updateSliderDisplay();
  await setActiveTabPanValue(parseInt(slider.value) / 100);
});

slider.addEventListener("dblclick", resetSlider);
resetBtn.addEventListener("click", () => {
  resetSlider();
  toggleSliderAndDisplay(true);
});

randomizeBtn.addEventListener("click", async () => {
  toggleSliderAndDisplay(false);
  await randomizePanning();
});

void (async () => {
  // Hide the slider until we know the initial pan value
  volumeContainer.style.opacity = "0";

  const initialValue: number = await getActiveTabPanValue();
  slider.value = (initialValue * 100).toString();
  updateSliderDisplay();

  volumeContainer.style.opacity = "1";
})();
