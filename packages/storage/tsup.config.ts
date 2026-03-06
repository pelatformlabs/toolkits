import { defineConfig } from "tsup";

import pkg from "./package.json";

export default defineConfig(() => {
  return {
    clean: true,
    dts: true,
    external: [...Object.keys(pkg.peerDependencies || {})],
    entry: ["./src/index.ts", "./src/s3.ts", "./src/cloudinary.ts", "./src/helpers.ts"],
    format: "esm",
    target: "ES2022",
  };
});
