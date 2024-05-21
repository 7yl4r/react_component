import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import { exec } from 'child_process';

const packageJson = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss(),
      {
        name: 'build-dwc-json',
        buildStart(){
          exec('node src/build-dwc-json.js', (err, stdout, stderr) => {
            if (err) {
              console.error(`Error executing script: ${err.message}`);
              return;
            }
            if (stderr) {
              console.error(`Script error: ${stderr}`);
              return;
            }
            console.log(`Script output: ${stdout}`);
          });
        }
      }
    ],
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    external: [/\.(css|less|scss)$/],
  },
];