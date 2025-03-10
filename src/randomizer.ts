import Message from "./interfaces/Message";

import { getActiveTabId, hideSliderAndDisplay } from "./popup";

enum PanSetting {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  NONE = "NONE",
}

const randomizer = {
  randomizeBtn: document.getElementById(
    "randomizer-button"
  ) as HTMLButtonElement,
  leftBtn: document.getElementById("randomizer-left") as HTMLButtonElement,
  noneBtn: document.getElementById("randomizer-none") as HTMLButtonElement,
  rightBtn: document.getElementById("randomizer-right") as HTMLButtonElement,
};

function buttonToSetting(btn: HTMLButtonElement) {
  switch (btn) {
    case randomizer.leftBtn:
      return PanSetting.LEFT;
    case randomizer.rightBtn:
      return PanSetting.RIGHT;
    case randomizer.noneBtn:
      return PanSetting.NONE;
    default:
      return;
  }
}

function settingToButton(setting: PanSetting) {
  switch (setting) {
    case PanSetting.LEFT:
      return randomizer.leftBtn;
    case PanSetting.RIGHT:
      return randomizer.rightBtn;
    case PanSetting.NONE:
      return randomizer.noneBtn;
    default:
      return;
  }
}

let currentPanSetting: PanSetting;
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

interface RandomizerSession {
  index: number;
  timeTaken: number;
  correctAnswer: PanSetting;
  userAnswer: PanSetting;
  wasCorrect: boolean;
}

const exportSessionBtn = document.querySelector(
  ".randomizer-exports .export-current"
) as HTMLButtonElement;
const randomizerSessions: RandomizerSession[] = [];
let sessionIndex = 0;
let currentSessionStartTimeMs: number;
let currentSessionEndTimeMs: number;

function clearArray<T>(arr: Array<T>) {
  while (arr.length != 0) {
    arr.pop();
  }
}

function updateScorePercentage() {
  let percentage = Math.round((scoreObject.score / scoreObject.total) * 100);
  if (isNaN(percentage)) percentage = 0;
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
  switch (randValue) {
    case 0:
      await setActiveTabPanValueClearBadge(-1);
      return PanSetting.LEFT;
    case 1:
      await setActiveTabPanValueClearBadge(1);
      return PanSetting.RIGHT;
    default:
      await setActiveTabPanValueClearBadge(0);
      return PanSetting.NONE;
  }
}

function markButtonCorrect(btn: HTMLButtonElement) {
  btn.classList.add("correct");
}

function markButtonWrong(btn: HTMLButtonElement) {
  btn.classList.add("wrong");
}

function markCorrectButton() {
  markButtonCorrect(settingToButton(currentPanSetting));
}

function resetButtons() {
  randomizer.leftBtn.classList.remove("correct", "wrong");
  randomizer.rightBtn.classList.remove("correct", "wrong");
  randomizer.noneBtn.classList.remove("correct", "wrong");
}

function handleAnswer(event: Event) {
  currentSessionEndTimeMs = Date.now();
  if (!isCurrentlyChoosing) return;
  isCurrentlyChoosing = false;
  const selectedBtn = event.target as HTMLButtonElement;
  const answerPanSetting = buttonToSetting(selectedBtn);
  const wasCorrect = answerPanSetting === currentPanSetting;
  if (wasCorrect) {
    scoreObject.score += 1;
  } else {
    markButtonWrong(selectedBtn);
  }
  scoreObject.total += 1;
  updateScorePercentage();
  markCorrectButton();

  randomizerSessions.push({
    index: sessionIndex,
    timeTaken: (currentSessionEndTimeMs - currentSessionStartTimeMs) / 1000,
    correctAnswer: currentPanSetting,
    userAnswer: answerPanSetting,
    wasCorrect: wasCorrect,
  });
  sessionIndex += 1;
}

async function startSession() {
  isCurrentlyChoosing = true;
  hideSliderAndDisplay(true);
  resetButtons();
  currentPanSetting = await randomizePanning();
  currentSessionStartTimeMs = Date.now();
}

async function resetSession() {
  isCurrentlyChoosing = false;
  hideSliderAndDisplay(false);
  scoreObject.score = 0;
  scoreObject.total = 0;
  updateScorePercentage();
  resetButtons();
  clearArray(randomizerSessions);
  sessionIndex = 0;
  await setActiveTabPanValueClearBadge(0);
}

function saveText(filename, text, isJson: boolean = false) {
  const downloaderElement = document.createElement("a");
  const mimeType = isJson ? "application/json" : "text/plain";
  downloaderElement.href =
    `data:${mimeType};charset=utf-8,` + encodeURIComponent(text);
  downloaderElement.download = filename;
  document.body.appendChild(downloaderElement);
  downloaderElement.click();
  document.body.removeChild(downloaderElement);
}

function exportSession() {
  const jsonData = JSON.stringify({ sessions: randomizerSessions });
  saveText("session.json", jsonData, true);
}

randomizer.randomizeBtn.addEventListener("click", startSession);

scoreObject.resetBtn.addEventListener("click", resetSession);
exportSessionBtn.addEventListener("click", exportSession);

randomizer.leftBtn.addEventListener("click", handleAnswer);
randomizer.rightBtn.addEventListener("click", handleAnswer);
randomizer.noneBtn.addEventListener("click", handleAnswer);
