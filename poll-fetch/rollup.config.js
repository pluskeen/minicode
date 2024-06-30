import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

const config = [
  {
    input: 'index.ts',
    output: [
      {
        file: './lib/index.esm.js',
        format: 'es',
        sourcemap: true,
      },
      {
        file: './lib/index.umd.js',
        format: 'umd',
        name: 'pollFetch'
      }
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json'
      })
    ]
  },
  {
    input: "index.ts",
    output: [{ file: "lib/index.d.ts", format: "es" }],
    plugins: [dts()]
  }
]
export default config;
