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

// Mock twrnc to control color scheme behavior in tests
let mockColorScheme = 'device';

// Create a mock function that can work as both a function and template literal
const mockTwrncFunction = jest.fn((strings, ...values) => {
  // Return empty styles object for template literal usage
  return {};
});

// Add the required methods to the mock function
Object.assign(mockTwrncFunction, {
  getColorScheme: jest.fn(() => mockColorScheme),
  setColorScheme: jest.fn((scheme) => {
    // Only accept valid color schemes, fallback to device for invalid ones
    if (['light', 'dark', 'device'].includes(scheme)) {
      mockColorScheme = scheme;
      mockTwrncFunction.getColorScheme.mockReturnValue(scheme);
    } else {
      // Invalid scheme, keep current or fallback to device
      mockColorScheme = mockColorScheme || 'device';
      mockTwrncFunction.getColorScheme.mockReturnValue(mockColorScheme);
    }
  }),
  updateDeviceContext: jest.fn(),
  __esModule: true,
});

const mockTwrnc = mockTwrncFunction;

jest.mock('twrnc', () => ({
  create: jest.fn(() => mockTwrnc),
  useAppColorScheme: jest.fn((tw) => {
    const [helper, setHelper] = require('react').useState(0);
    return [
      tw.getColorScheme(),
      () => {
        const currentScheme = tw.getColorScheme();
        tw.setColorScheme(currentScheme === 'dark' ? 'light' : 'dark');
        setHelper(helper + 1);
      },
      (newColorScheme) => {
        tw.setColorScheme(newColorScheme);
        setHelper(helper + 1);
      },
    ];
  }),
  useDeviceContext: jest.fn((tw, options) => {
    // Mock the behavior of setting initial color scheme
    if (options && options.initialColorScheme) {
      const initial = options.initialColorScheme;
      if (initial !== 'device') {
        tw.setColorScheme(initial);
      }
    }
  }),
}));

// Export mock for use in tests
global.mockTwrnc = mockTwrnc;
global.resetMockColorScheme = () => {
  mockColorScheme = 'device';
  mockTwrnc.getColorScheme.mockReturnValue('device');
  mockTwrnc.setColorScheme.mockImplementation((scheme) => {
    // Only accept valid color schemes, fallback to device for invalid ones
    if (['light', 'dark', 'device'].includes(scheme)) {
      mockColorScheme = scheme;
      mockTwrnc.getColorScheme.mockReturnValue(scheme);
    } else {
      // Invalid scheme, keep current or fallback to device
      mockColorScheme = mockColorScheme || 'device';
      mockTwrnc.getColorScheme.mockReturnValue(mockColorScheme);
    }
  });
};
