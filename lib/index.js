import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const name = "pet-lan";
export const inject = [];

const APP_DIR = "D:\\dsh-home\\pet-lan";

function candidates() {
  const home = process.env.DSH_HOME || path.join(os.homedir(), ".dsh");
  return [
    process.env.DSH_PET_ELECTRON_PATH,
    path.join("D:\\dsh-home", "electron", "electron.exe"),
    path.join(home, "electron", "electron.exe"),
  ].filter(Boolean);
}

function resolveElectron() {
  for (const c of candidates()) {
    try { if (fs.existsSync(c)) return c; } catch { /* ignore */ }
  }
  return "";
}

export function apply(ctx) {
  const log = (m) => { try { ctx.logger?.info?.("[pet-lan] " + m); } catch { /* ignore */ } };

  if (!fs.existsSync(APP_DIR)) {
    log("skip: app dir missing " + APP_DIR);
    return;
  }
  const exe = resolveElectron();
  if (!exe) {
    log("skip: electron.exe not found");
    return;
  }

  let child = null;
  let disposed = false;

  const start = () => {
    if (disposed || (child && child.exitCode === null)) return;
    const env = { ...process.env };
    delete env.ELECTRON_RUN_AS_NODE;
    try {
      child = spawn(exe, [APP_DIR], { stdio: "ignore", env, windowsHide: false });
      log("spawned " + path.basename(exe));
      child.on("exit", (code) => { log("exited " + code); child = null; });
      child.on("error", (e) => { log("spawn error " + e.message); child = null; });
    } catch (e) {
      log("spawn failed " + e.message);
      child = null;
    }
  };

  start();

  ctx.effect(() => () => {
    disposed = true;
    try { if (child && child.exitCode === null) child.kill(); } catch { /* ignore */ }
    log("disposed");
  }, "pet-lan: kill desktop window");
}
