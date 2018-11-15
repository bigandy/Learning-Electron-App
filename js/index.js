const { ipcRenderer } = require("electron");

// update the time every 1s
var time = document.querySelector("time");
var [minutes, seconds] = time.innerHTML.split(":");
document.body.style.backgroundColor = "green";
document.body.style.color = "white";
function minTwoDigits(n) {
  return (n < 10 ? "0" : "") + n;
}

const updateTrayText = title => {
  ipcRenderer.send("update-timer", title);
};

var interval;
function updateTimer() {
  seconds--;
  if (seconds < 0) {
    seconds = 59;
    minutes--;
  }
  var timerValue = `${minTwoDigits(minutes)}:${minTwoDigits(seconds)}`;
  time.innerHTML = timerValue;
  document.title = timerValue;

  updateTrayText(timerValue);

  if (minutes <= 0 && seconds <= 0) {
    clearInterval(interval);
    document.body.style.backgroundColor = "red";
  }
}

interval = setInterval(updateTimer, 1000);
