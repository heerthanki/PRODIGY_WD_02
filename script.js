// stopwatch script.js
let startTime, elapsedTime = 0, timerInterval;
let laps = [];

const display = document.getElementById('display');
const lapsList = document.getElementById('laps-list');
const startPauseBtn = document.getElementById('start-pause');
const lapBtn = document.getElementById('lap');
const resetBtn = document.getElementById('reset');
const exportBtn = document.getElementById('export');
const messageBox = document.getElementById('message');

// Function to update display
function updateDisplay(time) {
    const minutes = String(Math.floor((time % 3600000) / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((time % 60000) / 1000)).padStart(2, '0');
    const milliseconds = String(time % 1000).padStart(3, '0');
    display.textContent = `${minutes}:${seconds}:${milliseconds}`;
}

// Function to show messages
function showMessage(text, isError = false) {
    messageBox.textContent = text;
    messageBox.classList.remove('hidden', 'alert-success', 'alert-danger');
    messageBox.classList.add(isError ? 'alert-danger' : 'alert-success');
    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 3000);
}

// Function to start or pause the timer
function startPauseTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        startPauseBtn.textContent = 'Start';
        showMessage('Timer paused');
    } else {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateDisplay(elapsedTime);
        }, 10);
        startPauseBtn.textContent = 'Pause';
        showMessage('Timer started');
    }
}

// Function to reset the timer
function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    elapsedTime = 0;
    laps = [];
    updateDisplay(elapsedTime);
    renderLaps();
    startPauseBtn.textContent = 'Start';
    showMessage('Timer reset');
}

// Function to record a lap time
function recordLap() {
    if (!timerInterval) {
        showMessage('Start the timer to record laps', true);
        return;
    }
    laps.push(elapsedTime);
    renderLaps();
    showMessage('Lap recorded');
}

// Function to render laps
function renderLaps() {
    lapsList.innerHTML = '';
    let previousLapTime = 0;
    laps.forEach((lapTime, index) => {
        const lapItem = document.createElement('li');
        lapItem.classList.add('list-group-item');
        const minutes = String(Math.floor((lapTime % 3600000) / 60000)).padStart(2, '0');
        const seconds = String(Math.floor((lapTime % 60000) / 1000)).padStart(2, '0');
        const milliseconds = String(lapTime % 1000).padStart(3, '0');
        const lapDiff = lapTime - previousLapTime;
        const diffMinutes = String(Math.floor((lapDiff % 3600000) / 60000)).padStart(2, '0');
        const diffSeconds = String(Math.floor((lapDiff % 60000) / 1000)).padStart(2, '0');
        const diffMilliseconds = String(lapDiff % 1000).padStart(3, '0');
        lapItem.textContent = `Lap ${index + 1}: ${minutes}:${seconds}:${milliseconds} (+${diffMinutes}:${diffSeconds}:${diffMilliseconds})`;
        lapsList.appendChild(lapItem);
        previousLapTime = lapTime;
    });
}

// Function to export laps
function exportLaps() {
    if (laps.length === 0) {
        showMessage('No laps to export', true);
        return;
    }
    const lapsData = laps.map((lapTime, index) => {
        const minutes = String(Math.floor((lapTime % 3600000) / 60000)).padStart(2, '0');
        const seconds = String(Math.floor((lapTime % 60000) / 1000)).padStart(2, '0');
        const milliseconds = String(lapTime % 1000).padStart(3, '0');
        return `Lap ${index + 1}: ${minutes}:${seconds}:${milliseconds}`;
    }).join('\n');
    const blob = new Blob([lapsData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'laps.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showMessage('Laps exported');
}

// Event listeners
startPauseBtn.addEventListener('click', startPauseTimer);
lapBtn.addEventListener('click', recordLap);
resetBtn.addEventListener('click', resetTimer);
exportBtn.addEventListener('click', exportLaps);

// Reset timer on page load
window.onload = resetTimer;
