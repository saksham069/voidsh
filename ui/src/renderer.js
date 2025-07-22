import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

const term = new Terminal({ cursorBlink: true });
const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

const terminalEl = document.getElementById("terminal");
term.open(terminalEl);
fitAddon.fit();

let mode = "cmd";
let promptBuffer = "";

function clearCurrentLine() {
  term.write("\x1b[2K");
  promptBuffer = "";
}

function printPrompt() {
  clearCurrentLine();
  const promptText = mode === "prompt" ? "\r(prompt)> " : "\r> ";
  term.write(promptText);
}

term.writeln("\x1b[32m\x1b[1mWelcome to voidsh\x1b[0m\n");
printPrompt();
term.focus();

window.addEventListener("resize", () => fitAddon.fit());

term.onData((data) => {
  if (data.charCodeAt(0) === 13) {
    // ENTER
    if (mode === "prompt") {
      term.writeln(
        `\n\r\x1b[32m\x1b[1m[Prompted Response]: ${promptBuffer}\x1b[0m\n`
      );
    } else {
      term.writeln(
        `\n\r\x1b[90m\x1b[1mCommand executed (fake): ${promptBuffer}\x1b[0m\n`
      );
    }
    promptBuffer = "";
    printPrompt();
  } else if (data.charCodeAt(0) === 127) {
    // BACKSPACE
    if (promptBuffer.length > 0) {
      promptBuffer = promptBuffer.slice(0, -1);
      term.write("\b \b");
    }
  } else {
    promptBuffer += data;
    term.write(data);
  }
});

// mode switch logic
const modeToggle = document.getElementById("modeToggle");
const cmdLabel = document.getElementById("cmd-label");
const promptLabel = document.getElementById("prompt-label");

modeToggle.addEventListener("change", () => {
  clearCurrentLine();
  if (modeToggle.checked) {
    mode = "prompt";
    document.body.classList.add("prompt-mode");
    cmdLabel.style.color = "#888";
    promptLabel.style.color = "#fff";
    printPrompt();
  } else {
    mode = "cmd";
    document.body.classList.remove("prompt-mode");
    promptLabel.style.color = "#888";
    cmdLabel.style.color = "#fff";
    printPrompt();
  }
});

// settings page inject

const settingsIcon = document.getElementById("settings-icon");
const settingsPage = document.getElementById("settings-page");
const closeSettingsBtn = document.getElementById("close-settings");

settingsIcon.addEventListener("click", () => {
  settingsPage.classList.add("active");
});

closeSettingsBtn.addEventListener("click", () => {
  settingsPage.classList.remove("active");
});

// remove browser logic ======= (test later)

// broswer shortcuts
window.addEventListener("keydown", (e) => {
  if (
    (e.ctrlKey &&
      ["w", "r", "t", "n", "+", "-", "0", "p"].includes(e.key.toLowerCase())) ||
    (e.ctrlKey &&
      e.shiftKey &&
      ["i", "j", "c", "k"].includes(e.key.toLowerCase())) ||
    ["F12"].includes(e.key)
  ) {
    e.preventDefault();
  }
});

// prevent conetxt menu (ctrl + shift + I)
window.addEventListener("contextmenu", (e) => e.preventDefault());

// disable drag/drop
window.addEventListener("dragstart", (e) => e.preventDefault());
window.addEventListener("dragover", (e) => e.preventDefault());
window.addEventListener("drop", (e) => e.preventDefault());

// disable zoom using mouse wheel
window.addEventListener(
  "wheel",
  (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  },
  { passive: false }
);
