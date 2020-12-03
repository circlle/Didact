const path = require("path")
const { nodeResolve } = require("@rollup/plugin-node-resolve")
const babel = require("rollup-plugin-babel")
const pkg = require("./package.json")

const extensions = ['.js', '.ts', '.tsx']

const resolve = (...args) => path.resolve(__dirname, ...args)

module.exports = {
  input: resolve("./src/index.ts"),
  output: {
    file: resolve("./", pkg.main),
    format: "esm"
  },
  plugins: [
    nodeResolve({
      extensions,
      moduleOnly: true
    }),
    babel({
      exclude: "node_modules/**",
      extensions
    })
  ]
}