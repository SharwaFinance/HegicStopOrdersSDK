import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/take_profit_sharwaFinance.ts"],
  format: ["cjs", "esm"], 
  dts: true, 
  splitting: false,
  sourcemap: true,
  clean: true,
});