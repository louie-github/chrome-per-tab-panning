/// <reference path="../node_modules/chrome-extension-async/chrome-extension-async.d.ts" />
import "chrome-extension-async";

import Message from "./interfaces/Message";

const initialValue = 0;

interface CapturedTab {
  audioContext: AudioContext;
  // While we will never use `streamSource` property in the code,
  // it is necessary to keep a reference to it, or else
  // it will get garbage-collected and the sound will be gone.
  streamSource: MediaStreamAudioSourceNode;
  stereoPannerNode: StereoPannerNode;
}

// We use promises to fight race conditions.
const tabs: { [tabId: number]: Promise<CapturedTab> } = {};

/**
 * Captures a tab's sound, allowing it to be programmatically modified.
 * Puts a promise into the `tabs` object. We only need to call this function
 * if the tab isn't yet in that object.
 * @param tabId Tab ID
 */
function captureTab(tabId: number) {
  tabs[tabId] = new Promise(async (resolve) => {
    const stream = await chrome.tabCapture.capture({
      audio: true,
      video: false,
    });

    const audioContext = new AudioContext();
    const streamSource = audioContext.createMediaStreamSource(stream);
    const stereoPannerNode = audioContext.createStereoPanner();

    streamSource.connect(stereoPannerNode);
    stereoPannerNode.connect(audioContext.destination);

    resolve({ audioContext, streamSource, stereoPannerNode: stereoPannerNode });
  });
}

/**
 * Returns a tab's pan value, `initialValue` if the tab isn't captured yet.
 * @param tabId Tab ID
 */
async function getTabPanValue(tabId: number) {
  return tabId in tabs
    ? (await tabs[tabId]).stereoPannerNode.pan.value
    : initialValue;
}

/**
 * Sets a tab's pan value. Captures the tab if it wasn't captured.
 * @param tabId - Tab ID
 * @param value - Pan value. `0` means disabled, `-1` is 100% left, `1` is 100% right, `0.5` is 50% right, etc.
 * @param [clearBadge=false] - Whether to clear the tab badge instead of updating it.
 */
async function setTabPanValue(
  tabId: number,
  value: number,
  clearBadge: boolean = false
) {
  if (!(tabId in tabs)) {
    captureTab(tabId);
  }

  (await tabs[tabId]).stereoPannerNode.pan.value = value;

  if (clearBadge) {
    updateBadge(tabId, 0);
  } else {
    updateBadge(tabId, value);
  }
}

/**
 * Updates the badge which represents current pan value.
 * @param tabId Tab ID
 * @param value Pan value. `-1` will display "L 100%", `1` will display
 *              "R 100%", and `0` will display "OFF".
 */
async function updateBadge(tabId: number, value: number) {
  if (tabId in tabs) {
    const valuePercentage = Math.round(Math.abs(value) * 100);
    let text;
    if (value < 0) {
      text = `L ${valuePercentage}`;
    } else if (value > 0) {
      text = `R ${valuePercentage}`;
    } else {
      text = "";
    }
    chrome.browserAction.setBadgeText({ text, tabId });
  }
}

/**
 * Removes the tab from `tabs` object and closes its AudioContext.
 * This function gets called when a tab is closed.
 * @param tabId Tab ID
 */
async function disposeTab(tabId: number) {
  if (tabId in tabs) {
    (await tabs[tabId]).audioContext.close();
    delete tabs[tabId];
  }
}

// Handle messages from popup
chrome.runtime.onMessage.addListener(
  async (message: Message, sender, sendResponse) => {
    let clearBadge = false;
    switch (message.name) {
      case "get-tab-pan-value":
        sendResponse(await getTabPanValue(message.tabId));
        break;
      case "set-tab-pan-value-clear-badge":
        clearBadge = true;
      case "set-tab-pan-value":
        sendResponse(undefined); // Nothing to send here.
        await setTabPanValue(message.tabId, message.value, clearBadge);
        break;
      default:
        throw Error(`Unknown message received: ${message}`);
    }
  }
);

// Clean everything up once the tab is closed
chrome.tabs.onRemoved.addListener(disposeTab);
