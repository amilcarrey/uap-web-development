module.exports = function (api) {
    api.cache(true);
    return {
      presets: ["babel-preset-expo"],
      plugins: [
        require.resolve("expo-router/babel"),
        ["module-resolver", { alias: { "@": "./src" } }],
        // si luego usás Reanimated, su plugin va *al final*:
        // "react-native-reanimated/plugin",
      ],
    };
  };
  