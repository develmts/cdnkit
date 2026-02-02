import { readdirSync, renameSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (name.endsWith(".js")) renameSync(p, p.slice(0, -3) + ".cjs");
  }
}

walk(new URL("../dist/cjs", import.meta.url).pathname);
