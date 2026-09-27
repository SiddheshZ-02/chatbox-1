# Husky Pre-commit Workflow Setup Guide

Sep 27, 2026 ·&#32;

This guide walks a new developer through installing and understanding the Husky + lint-staged + ESLint + Prettier pre-commit workflow used in the ** **React Native project.

## Overview

Husky runs a git hook on every commit. That hook runs lint-staged, which runs ESLint (`--fix`) then Prettier (`--write`) — only on your staged files. If something can't be auto-fixed, the commit stops until you fix it.

Result: every commit is linted and formatted automatically, no manual step needed.

## Pre-commit flow

&#91;embedded content: pre-commit flow · 2 steps, 1 decision, 1 retry loop\]

When you run `git commit`, Husky's `pre-commit` hook calls `lint-staged`, which runs ESLint and Prettier only on the files staged for that commit. If both pass, the commit proceeds. If either finds an unfixable problem, the commit is aborted with the errors printed to your terminal — fix them, `git add` the changes, and commit again.

## Package roles

Every package involved in the pre-commit flow, and the job it does. All are in `devDependencies` except `lint-staged`.

| Package | Role in the flow |
| --- | --- |
| `husky` | Manages git hooks. Runs on `npm install` via the `prepare` script and lets you register a `pre-commit` hook that runs a shell command. |
| `lint-staged` | Runs a given command only against the files that are staged (`git add`ed) for the current commit, not the whole repo. Configured under the `lint-staged` key in `package.json`. |
| `eslint` | Lints JS/TS/JSX/TSX files: catches bugs, unused code, and style issues. Run with `--fix` in this setup so it auto-corrects what it can. |
| `@react-native/eslint-config` | Base ESLint rule set tuned for React Native projects; extended by `.eslintrc.js`. |
| `eslint-plugin-simple-import-sort` | Auto-sorts `import`/`export` statements into a consistent order. |
| `eslint-plugin-unused-imports` | Flags and removes imports that are never used. |
| `prettier` | Formats code style (quotes, spacing, trailing commas, line width) consistently, independent of logic. Configured by `.prettierrc.js` (referenced by both ESLint's formatting hand-off and the `prettier --write` step). |
| `patch-package` | Not part of linting, but runs alongside via the `postinstall` script: re-applies any local patches to `node_modules` after every `npm install` so hand-fixed third-party bugs survive reinstalls. |

ESLint and Prettier are kept separate here (Prettier is not run through an ESLint plugin) — lint-staged runs `eslint --fix` first, then `prettier --write`, as two independent steps.

## Step-by-step setup (yarn)

**1. Install Node 20+** `node -v` to check.

**2. Install packages one by one — copy and paste each:**

```
yarn add --dev husky lint-staged
```

```
yarn add -D eslint
```

```
yarn add --dev prettier
```

```
yarn add -D @react-native/eslint-config
```

```
yarn add -D eslint-plugin-simple-import-sort
```

```
yarn add -D eslint-plugin-unused-imports
```

```
yarn add -D patch-package
```

Or, if package.json already lists them, just run:

```
yarn install
```

**3. Add these scripts to package.json:**

```
"scripts": {
  "prepare": "husky",
  "postinstall": "patch-package"
}
```

`prepare` sets up the git hook on every install. `postinstall` reapplies local patches.

**4. Create the hook:**

```
npx husky init
```

This creates  folder `.husky/pre-commit`. Open it and set its content to: remove older&#32;

```
yarn lint-staged
```

Commit this file so every teammate gets the hook.

**5. Add lint-staged config to package.json:**

```
"lint-staged": {
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"]
}
```

**6. Add `.eslintrc.js` and `.prettierrc.js`** at the project root — copy them&#32;

## Configuration files

Create both files at the project root, copy-paste exactly.

**.eslintrc.js**

```
module.exports = {
  root: true,
  extends: "@react-native",
 
  // Add extra ESLint plugins
  plugins: [
    "react", // React-related ESLint rules
    "unused-imports", // Automatically detects and removes unused imports
    "simple-import-sort", // Automatically sorts imports
  ],
  globals: {
    applog: "readonly",
    apilog: "readonly",
    appwarn: "readonly",
    apperror: "readonly",
  },
  rules: {
   "no-unused-expressions": "error", // Prevent unused expressions such as "someVariable;" accidentally
    "react-native/no-unused-styles": "error", // Detect React Native styles that are created but never used
    "react-native/no-raw-text": "error", // Prevent raw text outside <Text> components in React Native
    "unused-imports/no-unused-imports": "error", // Show an error when an import is not being used
    "simple-import-sort/imports": "error", //will enforce import ordering.
    "simple-import-sort/exports": "error", //will enforce export ordering.
    "react-hooks/exhaustive-deps": "off", // Disable React Hook dependency checking
    "react-native/no-inline-styles": "warn", // Warn when inline styles are used
  },
};
```

**.prettierrc.js**

```
module.exports = {
  arrowParens: "always", //Controls parentheses around arrow-function parameters.
  bracketSpacing: true, //This controls spaces inside { }.
  semi: true,
  trailingComma: "all",
};
```

Short version: parens around single arrow params, spaces in `{ }`, always semicolons, trailing commas everywhere.

**7. Test it:**

```
git add .
git commit -m "test hook"
```

lint-staged should run and auto-fix/format the staged files.

| Problem | Fix |
| --- | --- |
| Hook doesn't run | `yarn install` again; check `.husky/pre-commit` exists. |
| "husky: command not found" | Confirm `"prepare": "husky"` is in package.json scripts, then `yarn install` |
| Commit blocked with errors | Fix the reported lines, `git add`, commit again |
