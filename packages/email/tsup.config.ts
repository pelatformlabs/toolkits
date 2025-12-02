import { defineConfig } from "tsup";

export default defineConfig(() => {
  return {
    clean: true,
    dts: true,
    external: ["react"],
    entry: ["./src/index.ts", "./src/components.ts", "./src/helpers.ts"],
    format: "esm",
    target: "ES2022",
  };
});
