import Message from "./interfaces/Message";

import { getActiveTabId, hideSliderAndDisplay } from "./popup";

const randomizer = {
  randomizeBtn: document.getElementById(
    "randomizer-button"
  ) as HTMLButtonElement,
  leftBtn: document.getElementById("randomizer-left") as HTMLButtonElement,
  noneBtn: document.getElementById("randomizer-none") as HTMLButtonElement,
  rightBtn: document.getElementById("randomizer-right") as HTMLButtonElement,
};

let currentPanSetting;
let isCurrentlyChoosing = false;

const scoreObject = {
  scoreSpan: document.querySelector(
    ".score-container .score"
  ) as HTMLSpanElement,
  totalSpan: document.querySelector(
    ".score-container .total"
  ) as HTMLSpanElement,
  percentageSpan: document.querySelector(".score-container .percentage"),
  resetBtn: document.querySelector(".reset-score") as HTMLButtonElement,
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

function markButtonCorrect(btn: HTMLButtonElement) {
  btn.classList.add("correct");
}

function markButtonWrong(btn: HTMLButtonElement) {
  btn.classList.add("wrong");
}

function markCorrectButton() {
  switch (currentPanSetting) {
    case "LEFT":
      markButtonCorrect(randomizer.leftBtn);
      break;
    case "RIGHT":
      markButtonCorrect(randomizer.rightBtn);
      break;
    case "NONE":
      markButtonCorrect(randomizer.noneBtn);
      break;
    default:
      break;
  }
}

function resetButtons() {
  randomizer.leftBtn.classList.remove("correct", "wrong");
  randomizer.rightBtn.classList.remove("correct", "wrong");
  randomizer.noneBtn.classList.remove("correct", "wrong");
}

function handleAnswer(event: Event) {
  if (!isCurrentlyChoosing) return;
  isCurrentlyChoosing = false;
  switch (event.target) {
    case randomizer.leftBtn:
      currentPanSetting !== "LEFT" && markButtonWrong(randomizer.leftBtn);
      break;
    case randomizer.rightBtn:
      currentPanSetting !== "RIGHT" && markButtonWrong(randomizer.rightBtn);
      break;
    case randomizer.noneBtn:
      currentPanSetting !== "NONE" && markButtonWrong(randomizer.noneBtn);
      break;
    default:
      console.log("Unknown element passed into handleAnswer");
      break;
  }
  markCorrectButton();
}

randomizer.randomizeBtn.addEventListener("click", async () => {
  isCurrentlyChoosing = true;
  hideSliderAndDisplay(true);
  resetButtons();
  currentPanSetting = await randomizePanning();
});

scoreObject.resetBtn.addEventListener("click", async () => {
  isCurrentlyChoosing = false;
  hideSliderAndDisplay(false);
  resetButtons();
  setActiveTabPanValueClearBadge(0);
});

randomizer.leftBtn.addEventListener("click", handleAnswer);
randomizer.rightBtn.addEventListener("click", handleAnswer);
randomizer.noneBtn.addEventListener("click", handleAnswer);
