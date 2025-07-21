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

function printPrompt() {
  term.write("\r\n> ");
}

function printPromptModePrompt() {
  term.write("\r\n(prompt)> ");
}

term.writeln("Welcome to voidsh");
printPrompt();

window.addEventListener("resize", () => fitAddon.fit());

term.onData((data) => {
  if (data.charCodeAt(0) === 13) {
    // ENTER
    if (mode === "prompt") {
      term.writeln(`\r\n[Prompted Response]: ${promptBuffer}`);
      promptBuffer = "";
      printPromptModePrompt();
    } else {
      term.write("\r\nCommand executed (fake)");
      printPrompt();
    }
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
  if (modeToggle.checked) {
    mode = "prompt";
    document.body.classList.add("prompt-mode");
    cmdLabel.style.color = "#888";
    promptLabel.style.color = "#fff";
    term.writeln("\r\n[Switched to PROMPT mode]");
    printPromptModePrompt();
  } else {
    mode = "cmd";
    document.body.classList.remove("prompt-mode");
    promptLabel.style.color = "#888";
    cmdLabel.style.color = "#fff";
    term.writeln("\r\n[Switched to CMD mode]");
    printPrompt();
  }
});
