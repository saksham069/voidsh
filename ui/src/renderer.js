import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

const cmdTerm = new Terminal({ cursorBlink: true });
const llmTerm = new Terminal({ cursorBlink: true });

const cmdFit = new FitAddon();
const llmFit = new FitAddon();

cmdTerm.loadAddon(cmdFit);
llmTerm.loadAddon(llmFit);

const cmdEl = document.getElementById("cmd-terminal");
const llmEl = document.getElementById("llm-terminal");

cmdTerm.open(cmdEl);
llmTerm.open(llmEl);

cmdFit.fit();
llmFit.fit();

let mode = "cmd";
let llmBuffer = "";

cmdTerm.writeln("\x1b[32m\x1b[1mWelcome to voidsh [CMD]...\x1b[0m\n");
llmTerm.writeln("\x1b[31m\x1b[1mWelcome to voidsh [LLM]...\x1b[0m\n");
llmTerm.write("\r\x1b[31m\x1b[1m[?]\x1b[0m > ");

cmdTerm.focus();

// resize handler
window.addEventListener("resize", () => {
  cmdFit.fit();
  llmFit.fit();
});

// CMD mode: receive pty output
window.electronAPI.onTerminalData((data) => {
  if (mode === "cmd") {
    cmdTerm.write(data);
  }
});

// CMD input handling
cmdTerm.onData((data) => {
  if (mode === "cmd") {
    window.electronAPI.writeToTerminal(data);
  }
});

// LLM mode input handling
llmTerm.onData((data) => {
  if (mode === "prompt") {
    if (data.charCodeAt(0) === 13) {
      // ENTER
      llmTerm.writeln(
        `\n\r\x1b[32m\x1b[1m[Prompted Response]: ${llmBuffer}\x1b[0m\n`
      );
      llmBuffer = "";
      llmTerm.write("\r\x1b[31m\x1b[1m[?]\x1b[0m > ");
    } else if (data.charCodeAt(0) === 127) {
      // BACKSPACE
      if (llmBuffer.length > 0) {
        llmBuffer = llmBuffer.slice(0, -1);
        llmTerm.write("\b \b");
      }
    } else {
      llmBuffer += data;
      llmTerm.write(data);
    }
  }
});

// mode switch logic
const modeToggle = document.getElementById("modeToggle");
const cmdLabel = document.getElementById("cmd-label");
const promptLabel = document.getElementById("prompt-label");

function switchMode(newMode) {
  mode = newMode;
  if (newMode === "cmd") {
    cmdEl.style.display = "";
    llmEl.style.display = "none";
    cmdLabel.style.color = "#fff";
    promptLabel.style.color = "#888";
    cmdTerm.focus();
  } else {
    cmdEl.style.display = "none";
    llmEl.style.display = "block";
    cmdLabel.style.color = "#888";
    promptLabel.style.color = "#fff";
    llmTerm.focus();
  }
}
switchMode("cmd");

modeToggle.addEventListener("click", () => {
  if (modeToggle.checked) {
    switchMode("prompt");
    document.body.classList.add("prompt-mode");
  } else {
    switchMode("cmd");
    document.body.classList.remove("prompt-mode");
  }
});

// settings page
const settingsIcon = document.getElementById("settings-icon");
const settingsPage = document.getElementById("settings-page");
const closeSettingsBtn = document.getElementById("close-settings");

settingsIcon.addEventListener("click", () => {
  settingsPage.classList.add("active");
});

closeSettingsBtn.addEventListener("click", () => {
  settingsPage.classList.remove("active");
});

// disable browser shortcuts
window.addEventListener("keydown", (e) => {
  if (
    (e.ctrlKey &&
      ["w", "r", "t", "n", "0", "p"].includes(e.key.toLowerCase())) ||
    (e.ctrlKey &&
      e.shiftKey &&
      ["i", "j", "c", "k"].includes(e.key.toLowerCase())) ||
    ["F12"].includes(e.key)
  ) {
    e.preventDefault();
  }
  if (e.ctrlKey && ["/"].includes(e.key.toLowerCase())) {
    modeToggle.click();
  }
});

// prevent context menu
window.addEventListener("contextmenu", (e) => e.preventDefault());

// disable drag/drop
window.addEventListener("dragstart", (e) => e.preventDefault());
window.addEventListener("dragover", (e) => e.preventDefault());
window.addEventListener("drop", (e) => e.preventDefault());

// disable zoom with ctrl + wheel
window.addEventListener(
  "wheel",
  (e) => {
    if (e.ctrlKey) e.preventDefault();
  },
  { passive: false }
);
