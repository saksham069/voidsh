import pty from "node-pty";
import os from "os";

export function createPtyProcess() {
  const shell = os.platform() === "win32" ? "powershell.exe" : process.env.SHELL || "bash";

  const ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env,
  });

  return ptyProcess;
}
