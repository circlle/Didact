module.exports = {
  "presets": [
    "@babel/preset-env",
    ["@babel/preset-typescript", { jsxPragma: "Didact" }]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-react-jsx",
      {
        "pragma": "Didact.createElement"
      }
    ]
  ]
}