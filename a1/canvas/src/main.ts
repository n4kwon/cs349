import {
  addSKEventTranslator,
  setSKAnimationCallback,
  setSKDrawCallback,
  setSKEventListener,
  SKEvent,
  SKKeyboardEvent,
  SKMouseEvent,
  SKResizeEvent,
  startSimpleKit,
} from "simplekit/canvas-mode";
import { longClickTranslator } from "./longclick";
import { shuffleArray } from "./helper";

startSimpleKit();

type TargetPosition = {
  x: number;
  y: number;
  targetNum: number;
};

let targetPositions: TargetPosition[] = [];
let shuffleIds = 0;
let mode: "start" | "play" | "end" = "start";
let startTime: number | null = null;
let finalTime: number | null = null;
let bestTime: number | null = null;
let currentTargetIndex = 0;
let currentRadius = 30;
let sortedTargetCopy: TargetPosition[] = [];
let isError = false;
let gameReset = false;
let mouseDown = false;
let numTargets = 6;
let mouseX = 0,
  mouseY = 0;
let whenClicked = 0;
let linesDrawn = 0;

let targetHueValues: number[] = [0, 45, 60, 120, 180, 240, 275, 300];
let targetHues: number[] = [];
let targetValues: number[] = [];
let wiggleAngles: number[] = [];
targetValues = Array.from({ length: numTargets }, (_, i) => i + 1);
targetValues = shuffleArray(targetValues);

let targetAnimationIndex: number | null = null;
let animationStartTime: number | null = null;
let ringAnimationStarted = false;
let width = 0;
let height = 0;
let animationRadius = currentRadius;

// Constants:
const maxTargets = 8,
  minTargets = 3;
const maxRadius = 45,
  minRadius = 15;
const wiggleAmplitude = 10;
const wiggleFrequency = 5;

addSKEventTranslator(longClickTranslator);
setSKEventListener(handleEvent);
randomizeTargetHues();
randomizeWiggles();

setSKDrawCallback((gc: CanvasRenderingContext2D) => {
  resetGame();
  drawBackground(gc);
  displayText(gc);
  drawLine(gc);
  drawConnectingLine(gc);
  drawTargets(gc);
  drawRingOutward(gc);
});

setSKAnimationCallback((time) => {
  animateRing(time);
});

// Drawing Functions for the Callback:

function drawBackground(gc: CanvasRenderingContext2D) {
  gc.fillStyle = isError ? "darkred" : "black";
  gc.fillRect(0, 0, gc.canvas.width, gc.canvas.height);
}

function drawRingOutward(gc: CanvasRenderingContext2D) {
  if (ringAnimationStarted && targetAnimationIndex !== null) {
    const target = sortedTargetCopy[targetAnimationIndex];
    if (target) {
      gc.lineWidth = 3;
      gc.strokeStyle = "yellow";
      gc.beginPath();
      gc.arc(target.x, target.y, animationRadius, 0, Math.PI * 2);
      gc.stroke();
    }
  }
}

function drawConnectingLine(gc: CanvasRenderingContext2D) {
  let startWiggleX = 0;
  let startWiggleY = 0;
  let endWiggleX = 0;
  let endWiggleY = 0;
  for (let i = 1; i < currentTargetIndex; i++) {
    const firstTargetClicked = sortedTargetCopy[i - 1];
    const secondTargetClicked = sortedTargetCopy[i];

    if (mode === "end") {
      const time = Date.now() / 1000;
      startWiggleX =
        (wiggleAmplitude / 2) *
        Math.cos(wiggleFrequency * time + wiggleAngles[i - 1]);
      startWiggleY =
        (wiggleAmplitude / 2) *
        Math.sin(wiggleFrequency * time + wiggleAngles[i - 1]);
      endWiggleX =
        (wiggleAmplitude / 2) *
        Math.cos(wiggleFrequency * time + wiggleAngles[i]);
      endWiggleY =
        (wiggleAmplitude / 2) *
        Math.sin(wiggleFrequency * time + wiggleAngles[i]);
    }

    const originalTargetIndex = targetPositions.findIndex(
      (target) => target.targetNum === firstTargetClicked.targetNum
    );

    const time = (Date.now() - whenClicked) / 1000;
    const duration = 0.75;
    let percentOfAnimated = Math.min(1, time / duration);
    if (linesDrawn > i) {
      percentOfAnimated = 1;
    }

    const fromX = firstTargetClicked.x + startWiggleX;
    const fromY = firstTargetClicked.y + startWiggleY;
    const toX = secondTargetClicked.x + endWiggleX;
    const toY = secondTargetClicked.y + endWiggleY;
    const curX = fromX + (toX - fromX) * percentOfAnimated;
    const curY = fromY + (toY - fromY) * percentOfAnimated;

    const hueValue = targetHues[originalTargetIndex];

    gc.strokeStyle = `hsl(${hueValue}deg 80% 50%)`;
    gc.lineWidth = 6;
    gc.beginPath();
    gc.moveTo(fromX, fromY);
    gc.lineTo(curX, curY);
    gc.stroke();
  }
}

function displayText(gc: CanvasRenderingContext2D) {
  gc.font = "24px sans-serif";
  gc.textAlign = "center";
  gc.textBaseline = "middle";
  gc.fillStyle = "white";
  if (mode === "start") {
    gc.fillText("click target 1 to begin", gc.canvas.width / 2, 25);
  } else if (mode === "play") {
    const currentTime = performance.now();
    const totalSeconds = (
      (currentTime - (startTime ?? currentTime)) /
      1000
    ).toFixed(2);
    gc.fillText(`${totalSeconds}s`, gc.canvas.width / 2, 25);
  } else if (mode === "end" && finalTime !== null) {
    let message = `Final time: ${finalTime.toFixed(2)}s`;
    if (bestTime !== null && finalTime === bestTime) {
      message += " (new best!)";
    } else if (bestTime !== null) {
      message += ` (best ${bestTime.toFixed(2)}s)`;
    }
    gc.fillText(message, gc.canvas.width / 2, 25);
  }
}

function drawLine(gc: CanvasRenderingContext2D) {
  gc.lineWidth = 2;
  gc.strokeStyle = "white";
  gc.beginPath();
  gc.moveTo(0, 50);
  gc.lineTo(gc.canvas.width, 50);
  gc.stroke();
}

// The wiggle calculations performed in this function were taken from ChatGPT
function drawTargets(gc: CanvasRenderingContext2D) {
  let hoveredIndex: number | null = null;

  for (let i = 0; i < targetPositions.length; i++) {
    if (isTargetClicked(mouseX, mouseY, targetPositions[i])) {
      hoveredIndex = i;
    }
  }

  const circle = (
    x: number,
    y: number,
    text: number,
    color: string,
    showBlueHover: boolean,
    showYellowOutline: boolean
  ) => {
    gc.beginPath();
    gc.arc(x, y, currentRadius, 0, Math.PI * 2);
    gc.fillStyle = color;
    gc.fill();
    gc.strokeStyle = color;
    gc.stroke();

    if (showBlueHover && mode !== "end") {
      gc.lineWidth = 3;
      gc.strokeStyle = "lightblue";
      gc.beginPath();
      gc.arc(x, y, currentRadius, 0, Math.PI * 2);
      gc.stroke();
    }

    if (showYellowOutline) {
      gc.lineWidth = 3;
      gc.strokeStyle = "yellow";
      gc.beginPath();
      gc.arc(x, y, currentRadius + 3, 0, Math.PI * 2);
      gc.stroke();
    }

    gc.fillStyle = "black";
    gc.font = "20px sans-serif";
    gc.textAlign = "center";
    gc.textBaseline = "middle";
    gc.fillText(String(text), x, y);
  };

  let currRadius = Math.min(
    gc.canvas.width / 2 - 15 - currentRadius,
    gc.canvas.height / 2 - 50 - 15 - currentRadius
  );

  calculateTargetPositions(
    numTargets,
    gc.canvas.width / 2,
    (gc.canvas.height + 50) / 2,
    currRadius
  );

  for (let i = 0; i < targetPositions.length; i++) {
    let { x, y }: TargetPosition = targetPositions[i];
    const hueValue = targetHues[i];
    const color = `hsl(${hueValue}deg 80% 50%)`;
    const showBlueHover =
      i === hoveredIndex && currentTargetIndex < targetValues[i];
    const showYellowOutline = showBlueHover && mouseDown;

    targetPositions[i].targetNum = targetValues[i];

    let wiggleX = 0;
    let wiggleY = 0;
    if (mode === "end") {
      const time = Date.now() / 1000;
      wiggleX =
        wiggleAmplitude * Math.cos(wiggleFrequency * time + wiggleAngles[i]);
      wiggleY =
        wiggleAmplitude * Math.sin(wiggleFrequency * time + wiggleAngles[i]);
      x += wiggleX;
      y += wiggleY;
    }

    if (targetValues[i] < currentTargetIndex + 1) {
      circle(x, y, targetValues[i], color, showBlueHover, showYellowOutline);
    } else if (targetValues[i] === currentTargetIndex + 1) {
      circle(x, y, targetValues[i], "white", showBlueHover, showYellowOutline);
    } else {
      circle(
        x,
        y,
        targetValues[i],
        "darkgrey",
        showBlueHover,
        showYellowOutline
      );
    }
  }
  sortedTargetCopy = [...targetPositions].sort(
    (a, b) => a.targetNum - b.targetNum
  );
}

function animateRing(time: number) {
  if (
    ringAnimationStarted &&
    targetAnimationIndex !== null &&
    animationStartTime !== null
  ) {
    const duration = time - animationStartTime;
    const progress = Math.min(duration / 333, 1);
    animationRadius = currentRadius + progress * 15;

    if (progress >= 1) {
      ringAnimationStarted = false;
      targetAnimationIndex = null;
      animationStartTime = null;
    }
  }
}

function startRingAnimation(targetIndex: number) {
  targetAnimationIndex = targetIndex;
  animationStartTime = performance.now();
  ringAnimationStarted = true;
}

// Event Handler:
function handleEvent(event: SKEvent) {
  switch (event.type) {
    case "keydown": {
      const { key } = event as SKKeyboardEvent;
      if (key === "c") {
        if (mode === "start" || mode === "play") {
          if (currentTargetIndex === 0 && mode === "start") {
            startTime = performance.now();
            mode = "play";
            startRingAnimation(currentTargetIndex);
            currentTargetIndex++;
          } else if (
            currentTargetIndex > 0 &&
            currentTargetIndex < targetPositions.length
          ) {
            startRingAnimation(currentTargetIndex);
            whenClicked = Date.now();
            linesDrawn++;
            currentTargetIndex++;
            if (currentTargetIndex === targetPositions.length) {
              updateFinalTimes(startTime);
            }
          }
        }
      }
      if (key === " ") {
        if (mode === "start") {
          shuffleIds = Math.random() * 360; // effectively randomizes how we display the targets on the screen
        } else if (mode === "end") {
          mode = "start";
          gameReset = true;
        }
      }
      if (mode === "start") {
        if (key === "]" && numTargets < maxTargets) {
          shuffleIds = Math.random() * 360;
          numTargets++;
          targetValues = Array.from({ length: numTargets }, (_, i) => i + 1);
          targetValues = shuffleArray(targetValues);
          recalculateTargets(currentRadius, true);
        } else if (key === "[" && numTargets > minTargets) {
          shuffleIds = Math.random() * 360;
          numTargets--;
          targetValues = Array.from({ length: numTargets }, (_, i) => i + 1);
          targetValues = shuffleArray(targetValues);
          recalculateTargets(currentRadius, true);
        } else if (key === "{" && currentRadius > minRadius) {
          currentRadius -= 5;
          recalculateTargets(currentRadius, false);
        } else if (key === "}" && currentRadius < maxRadius) {
          currentRadius += 5;
          recalculateTargets(currentRadius, false);
        }
      }
      break;
    }
    case "mousedown": {
      const { x, y } = event as SKMouseEvent;
      mouseDown = true;
      if (mode === "start" && currentTargetIndex === 0) {
        const target1Position = sortedTargetCopy[0];
        if (!isTargetClicked(x, y, target1Position)) {
          isError = true;
        }
      } else if (
        mode === "play" &&
        currentTargetIndex > 0 &&
        currentTargetIndex < targetPositions.length - 1
      ) {
        const target = sortedTargetCopy[currentTargetIndex];
        if (!isTargetClicked(x, y, target)) {
          isError = true;
        }
      }
      break;
    }

    case "mouseup": {
      mouseDown = false;
      isError = false;
      const { x, y } = event as SKMouseEvent;
      if (mode === "start") {
        const target1Position = sortedTargetCopy[0];
        if (isTargetClicked(x, y, target1Position)) {
          startTime = performance.now();
          mode = "play";
          startRingAnimation(currentTargetIndex);
          currentTargetIndex++;
        }
      } else if (
        mode === "play" &&
        currentTargetIndex > 0 &&
        currentTargetIndex < targetPositions.length
      ) {
        const target = sortedTargetCopy[currentTargetIndex];
        if (isTargetClicked(x, y, target)) {
          startRingAnimation(currentTargetIndex);
          currentTargetIndex++;
          whenClicked = Date.now();
          linesDrawn++;
          if (currentTargetIndex === targetPositions.length) {
            updateFinalTimes(startTime);
          }
        }
      }
      break;
    }
    case "mousemove": {
      const { x, y } = event as SKMouseEvent;
      mouseX = x;
      mouseY = y;
      break;
    }
    case "longclick": {
      if (mode === "play") {
        gameReset = true;
        resetGame();
      }
      console.log("Longclick detected", event);
      break;
    }
    case "resize":
      const re = event as SKResizeEvent;
      width = re.width;
      height = re.height;
      break;
  }
}

// Game Logic + Calculations:
function updateFinalTimes(startTime: number | null) {
  mode = "end";
  if (startTime) {
    const currentTime = performance.now();
    finalTime = (currentTime - startTime) / 1000;
    if (bestTime === null || finalTime < bestTime) {
      bestTime = finalTime;
    }
  }
}

function recalculateTargets(circleRadius: number, numTargetsChanged: boolean) {
  if (numTargetsChanged) {
    randomizeTargetHues();
    randomizeWiggles();
  }
  const calculatedRadius = Math.min(
    width / 2 - 15 - circleRadius,
    height / 2 - 50 - 15 - circleRadius
  );
  calculateTargetPositions(
    numTargets,
    width / 2,
    (height + 50) / 2,
    calculatedRadius
  );
}

function resetGame() {
  if (gameReset) {
    linesDrawn = 0;
    gameReset = false;
    randomizeTargetHues();
    randomizeWiggles();
    mode = "start";
    currentTargetIndex = 0;
    finalTime = null;
    startTime = null;
    targetValues = Array.from({ length: numTargets }, (_, i) => i + 1);
    targetValues = shuffleArray(targetValues);
  }
}

function isTargetClicked(x: number, y: number, target: TargetPosition) {
  const dx = x - target.x;
  const dy = y - target.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  // 30 is supposed to be radius, 10 is line-width/tolerance
  return (
    distance <= currentRadius ||
    (distance >= currentRadius - 10 && distance <= currentRadius + 10)
  );
}

// function to calculate target positions to form circle created using ChatGPT
function calculateTargetPositions(
  numTargets: number,
  centerX: number,
  centerY: number,
  radius: number
) {
  targetPositions = [];
  const angleStep = (Math.PI * 2) / numTargets;
  for (let i = 0; i < numTargets; i++) {
    // if we add a number here to the angle i can essentially shuffle targets as needed
    const angle = i * angleStep - Math.PI / 2 + shuffleIds;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    targetPositions.push({ x: x, y: y, targetNum: -1 });
  }
}

// Randomization Logic:
function randomizeTargetHues() {
  targetHues = [];
  const randomIndex = Math.floor(Math.random() * targetHueValues.length);
  for (let i = 0; i < numTargets; i++) {
    const index = (randomIndex + i) % targetHueValues.length;
    targetHues.push(targetHueValues[index]);
  }
}

function randomizeWiggles() {
  wiggleAngles = [];
  for (let i = 0; i < numTargets; i++) {
    wiggleAngles.push(Math.random() * Math.PI * 2);
  }
}
