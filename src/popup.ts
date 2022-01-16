/// <reference path="../node_modules/chrome-extension-async/chrome-extension-async.d.ts" />
import "chrome-extension-async";

import Message from "./interfaces/Message";

const volumeContainer: HTMLDivElement =
  document.querySelector(".slider-container");
const slider: HTMLInputElement = document.getElementById("slider-main");
const textDisplay: HTMLSpanElement =
  document.querySelector(".slider-value-text");

void (async () => {
  // Hide the slider until we know the initial volume
  volumeContainer.style.opacity = "0";

  const initialValue: number = await getActiveTabPanValue();
  slider.value = (initialValue * 100).toString();
  updateTextDisplay();

  volumeContainer.style.opacity = "1";
})();

function updateTextDisplay() {
  console.log("updating");
  textDisplay.textContent = slider.value;
}

slider.addEventListener("input", () => {
  const value = parseInt(slider.value) / 100;
  updateTextDisplay();
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
