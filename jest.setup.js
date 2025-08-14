// jest.setup.js

jest.mock('react-native-safe-area-context', () => {
  return {
    useSafeAreaInsets: () => ({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }),
  };
});

// AsyncStorage is mocked via moduleNameMapper in jest.config.js
