const electron = require("electron");
const { app, Menu, Tray, nativeImage, ipcMain } = electron;
const path = require("path");

// app.dock.hide();

const idleIcon = nativeImage.createFromPath(
  path.join(__dirname, "idle_16x16.png")
);
idleIcon.setTemplateImage(true);

const activeIcon = nativeImage.createFromPath(
  path.join(__dirname, "icon_16x16.png")
);
activeIcon.setTemplateImage(true);

let tray = null;
let contextMenu = null;

function getTime(d) {
  return `${d
    .getHours()
    .toString()
    .padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

const check = () => {
  const now = new Date();
  const hour = now.getHours();
  const time = getTime(now);

  tray.setImage(idleIcon);
};

setInterval(check, 1000 * 30);
var due = "thirty";
// closing closes for 20 minutes
app.on("close-blocker", () => {
  let now = new Date();
  const time = getTime(now);
});

ipcMain.on("update-timer", (event, timeLeft) => {
  tray.setTitle(timeLeft);
});

function updateMenu() {
  if (!tray) return;

  tray.setToolTip(`Bedtime @ ${due}`);
  var time = "30:00";
  tray.setTitle(time);

  contextMenu = Menu.buildFromTemplate([
    {
      label: "Quit Timer",
      accelerator: "cmd+q",
      role: "quit"
    }
  ]);
  tray.setContextMenu(contextMenu);
}

module.exports = function createTray() {
  tray = new Tray(idleIcon);
  updateMenu();
  check();
  electron.powerMonitor.on("resume", check);
};
