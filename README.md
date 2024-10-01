# styledwind-native

> A tiny wrapper for [`twrnc`](https://github.com/jaredh159/tailwind-react-native-classnames) that brings a familiar [`styled-components`](https://github.com/styled-components/styled-components)-like API to React Native, making it easy to apply dynamic Tailwind CSS styles while avoiding verbose inline styling.

## Description

`styledwind-native` is a lightweight utility designed to offer a familiar [`styled-components`](https://github.com/styled-components/styled-components) API on top of [`twrnc`](https://github.com/jaredh159/tailwind-react-native-classnames) for React Native. It allows you to apply Tailwind utility classes in a clean, declarative manner, making your components more maintainable by avoiding excessive inline styles.

With `styledwind-native`, you can:
- Define React Native components with Tailwind utility classes using a concise API.
- Dynamically adjust styles based on component props.
- Seamlessly handle safe-area insets for modern devices.
- Keep your components cleaner and easier to maintain, while still leveraging the full power of Tailwind CSS and [`twrnc`](https://github.com/jaredh159/tailwind-react-native-classnames).

## Features

- **Familiar API**: Styled-components-like API, so you can define your styles and components without verbose inline styles.
- **Tailwind CSS for React Native**: Leverages the power of [`twrnc`](https://github.com/jaredh159/tailwind-react-native-classnames) to bring utility-first styling to your components.
- **Dynamic Styling with Props**: Conditionally apply styles based on props, making your components more flexible and reusable.
- **Support for Core React Native Components**: Easily style components like `View`, `Text`, `ScrollView`, and many more.
- **Safe-Area Insets Support**: Automatically adjust layouts for safe-area insets to handle notches and system bars on modern devices.
- **Fully Configurable**: Works seamlessly with your own Tailwind configuration via `tailwind.config.js`.


## Installation

To install `styledwind-native` along with [`twrnc`](https://github.com/jaredh159/tailwind-react-native-classnames), run:

```bash
npm install styledwind-native twrnc
```

## Usage Example

Here's how you can use styledwind-native to create dynamically styled components:

```tsx
import React from 'react';
import tw from 'styledwind-native';

const Text = tw.Text<{ isBig?: boolean }>`
  text-base

  ${props => props.isBig && tw`text-2xl`}
`;

const MyComponent = () => {
  return (
    <Text isBig>
      This text is styled with Tailwind!
    </Text>
  );
};

export default MyComponent;
```

## VS Code Intellisense

Add the following to the settings of the
[official Tailwind plugin](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
for VS Code.

```jsonc
// ...
"editor.quickSuggestions": {
  "strings": true // forces VS Code to trigger completions when editing "string" content
},
"tailwindCSS.classAttributes": [
  // ...
  "style"
],
"tailwindCSS.includeLanguages": {
  "typescript": "javascript", // if you are using typescript
  "typescriptreact": "javascript"  // if you are using typescript with react
},
"tailwindCSS.experimental.classRegex": [
  "tw`([^`]*)", // tw`...`
  "tw\\.[^`]+`([^`]*)`" // tw.xxx<xxx>`...`
],
```

More detailed instructions, including how to add snippets, are available
[here](https://github.com/jaredh159/tailwind-react-native-classnames/discussions/124).

## Why Use `styledwind-native`?

If you're building a React Native app and want to use Tailwind CSS for styling, `styledwind-native` simplifies the process by wrapping [`twrnc`](https://github.com/jaredh159/tailwind-react-native-classnames) with a [`styled-components`](https://github.com/styled-components/styled-components)-like API. This reduces the need for verbose inline styles, making your components cleaner, easier to read, and more maintainable.