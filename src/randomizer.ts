import Message from "./interfaces/Message";

import { getActiveTabId, hideSliderAndDisplay } from "./popup";
import {
  colorRandomizerCorrect,
  colorRandomizerWrong,
} from "./exports.module.scss";

const randomizeBtn: HTMLButtonElement =
  document.getElementById("randomizer-button");
const randomizerLeftBtn: HTMLButtonElement =
  document.getElementById("randomizer-left");
const randomizerNoneBtn: HTMLButtonElement =
  document.getElementById("randomizer-none");
const randomizerRightBtn: HTMLButtonElement =
  document.getElementById("randomizer-right");

let currentPanValue;

const scoreObject = {
  scoreSpan: document.querySelector(".score-container .score"),
  totalSpan: document.querySelector(".score-container .total"),
  percentageSpan: document.querySelector(".score-container .percentage"),
  get score() {
    return parseInt(this.scoreSpan.textContent);
  },
  set score(value: number) {
    this.scoreSpan.textContent = value.toString();
  },
  get total() {
    return parseInt(this.totalSpan.textContent);
  },
  set total(value: number) {
    this.totalSpan.textContent = value.toString();
  },
};

function updateScorePercentage() {
  const percentage = Math.round((scoreObject.score / scoreObject.total) * 100);
  scoreObject.percentageSpan.textContent = `${percentage}%`;
}

async function setActiveTabPanValueClearBadge(value: number) {
  const tabId = await getActiveTabId();
  let message: Message;
  message = { name: "set-tab-pan-value-clear-badge", tabId, value };
  return await chrome.runtime.sendMessage(message);
}

async function randomizePanning() {
  // Generate a random number from 0 to 2
  const randValue = Math.floor(Math.random() * 3);
  let ret: string;
  switch (randValue) {
    case 0:
      await setActiveTabPanValueClearBadge(-1);
      ret = "LEFT";
      break;
    case 1:
      await setActiveTabPanValueClearBadge(1);
      ret = "RIGHT";
      break;
    default:
      await setActiveTabPanValueClearBadge(0);
      ret = "NONE";
      break;
  }
  return ret;
}

randomizeBtn.addEventListener("click", async () => {
  hideSliderAndDisplay(true);
  currentPanValue = await randomizePanning();
});
