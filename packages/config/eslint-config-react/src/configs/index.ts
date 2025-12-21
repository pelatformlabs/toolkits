import type { Linter } from "eslint";

import { configs } from "@pelatform/eslint-config";
import { react } from "./react.js";

export { react } from "./react.js";

export const base: Linter.Config[] = configs.base;

export const fast: Linter.Config[] = configs.fast;

export const reactFull: Linter.Config[] = [...base, ...react];

export const reactFast: Linter.Config[] = [...fast, ...react];
