module.exports = {
  root: true, // Make this the root ESLint configuration
  extends: "@react-native", // Use React Native's recommended ESLint rules

  // Add extra ESLint plugins
  plugins: [
    "react", // React-related ESLint rules
    "unused-imports", // Automatically detects and removes unused imports
    "simple-import-sort", // Automatically sorts imports
  ],

  // Define global variables that ESLint should recognize
  globals: {
    applog: "readonly",
    apilog: "readonly",
    appwarn: "readonly",
    apperror: "readonly",
  },

  // ESLint rules for this project
  rules: {
    "no-unused-expressions": "error", // Prevent unused expressions such as "someVariable;" accidentally
    "react-native/no-unused-styles": "error", // Detect React Native styles that are created but never used
    "react-native/no-raw-text": "error", // Prevent raw text outside <Text> components in React Native
    "unused-imports/no-unused-imports": "error", // Show an error when an import is not being used
    "simple-import-sort/imports": "error", //will enforce import ordering.
    "simple-import-sort/exports": "error", //will enforce export ordering.
    "react-hooks/exhaustive-deps": "off", // Disable React Hook dependency checking
    "react-native/no-inline-styles": "warn", // Warn when inline styles are used
    // '@typescript-eslint/no-explicit-any': 'warn',    // Allow "any" in TypeScript, but show a warning
    // '@typescript-eslint/no-floating-promises': 'warn', // Warn when a Promise is not handled/awaited
    // '@typescript-eslint/require-await': 'warn', // Warn when async functions don't actually use await
  },
};
