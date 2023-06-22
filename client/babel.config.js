module.exports = {
    plugins: ["@babel/plugin-syntax-jsx"],
    "presets": ["@babel/preset-env", ["@babel/preset-react", {
        "runtime": "automatic"
    }]]
}
// This config file enables usage of tailwind css framework in webpack-dev-server