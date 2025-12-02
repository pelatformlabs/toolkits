import { defineConfig } from "tsup";

export default defineConfig(() => {
  return {
    clean: true,
    dts: true,
    entry: ["./src/index.ts", "./src/s3.ts", "./src/cloudinary.ts", "./src/helpers.ts"],
    format: "esm",
    target: "ES2022",
  };
});
