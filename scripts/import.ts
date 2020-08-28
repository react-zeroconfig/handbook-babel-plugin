import { spawn } from "child_process";
import path from "path";

if (!process.env.ROCKET_SCRIPTS_HOME) {
  throw new Error(`Undefined $ROCKET_SCRIPTS_HOME`);
}

const cwd: string = process.cwd();

// import packages
spawn(
  `npm run build -- --out-dir "${path.resolve(cwd, "out/rocket-scripts")}"`,
  {
    cwd: process.env.ROCKET_SCRIPTS_HOME,
    shell: true,
    stdio: "inherit",
  }
);
