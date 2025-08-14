import React, { useEffect, createContext, useContext } from 'react';
import RN from 'react-native';
import {
  create,
  useAppColorScheme,
  useDeviceContext,
  type TailwindFn,
  type Style,
} from 'twrnc';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

let tailwindConfig;

try {
  tailwindConfig = require('../../../tailwind.config.js'); // eslint-disable-line @typescript-eslint/no-require-imports
} catch (error) {} // eslint-disable-line @typescript-eslint/no-unused-vars

const twrnc = create(tailwindConfig);

type ColorSchemeType = 'light' | 'dark' | 'device';

interface ColorSchemeContextValue {
  colorScheme: ColorSchemeType;
  toggleColorScheme: () => void;
  setColorScheme: (scheme: ColorSchemeType) => void;
}

const ColorSchemeContext = createContext<ColorSchemeContextValue | null>(null);

const allowedComponents = [
  'ActivityIndicator',
  'AnimatedFlatList',
  'AnimatedImage',
  'AnimatedScrollView',
  'AnimatedSectionList',
  'AnimatedText',
  'AnimatedView',
  'Button',
  'FlatList',
  'Image',
  'Modal',
  'SafeAreaView',
  'ScrollView',
  'SectionList',
  'StatusBar',
  'Switch',
  'Text',
  'TextInput',
  'TouchableHighlight',
  'TouchableNativeFeedback',
  'TouchableOpacity',
  'View',
];

interface AsyncStorage {
  clear(): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
  setItem(key: string, value: string): Promise<void>;
}

interface ProviderProps {
  children: React.ReactNode;
  initialColorScheme?: 'light' | 'dark' | 'device';
  storage?: AsyncStorage;
}

interface ImageProps extends RN.ImageProps {
  tintColor?: string;
}

interface TailwindComponentProps {
  children?: React.ReactNode;
  component?: React.FC<any>;
  [key: string]: any;
}

type TailwindComponents = TailwindFn & {
  ActivityIndicator: <T = object>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.ActivityIndicatorProps & T>;
  AnimatedFlatList: <T = object>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.Animated.AnimatedProps<RN.FlatListProps<any>> & T>;
  AnimatedImage: <T = object>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.Animated.AnimatedProps<ImageProps> & T>;
  AnimatedScrollView: <T = object>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.Animated.AnimatedProps<RN.ScrollViewProps> & T>;
  AnimatedSectionList: <T = object>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.Animated.AnimatedProps<RN.SectionListProps<any>> & T>;
  AnimatedText: <T = object>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.Animated.AnimatedProps<RN.TextProps> & T>;
  AnimatedView: <T = object>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.Animated.AnimatedProps<RN.ViewProps> & T>;
  Button: <T = object>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.ButtonProps & T>;
  FlatList: <T = object>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.FlatListProps<any> & T>;
  Image: <T = object>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<ImageProps & T>;
  Modal: <T = object>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.ModalProps & T>;
  SafeAreaView: <T = object>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.ViewProps & T>;
  ScrollView: <T = object>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.ScrollViewProps & T>;
  SectionList: <T = object>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.SectionListProps<any> & T>;
  StatusBar: <T = object>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.StatusBarProps & T>;
  Switch: <T = object>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.SwitchProps & T>;
  Text: <T = object>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.TextProps & T>;
  TextInput: <T = object>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.TextInputProps & T>;
  TouchableHighlight: <T = object>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.TouchableHighlightProps & T>;
  TouchableNativeFeedback: <T = object>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.TouchableNativeFeedbackProps & T>;
  TouchableOpacity: <T = object>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.TouchableOpacityProps & T>;
  View: <T = object>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.ViewProps & T>;
};

function createTailwindComponent<T = object>(
  Component: React.FC<any>,
  styles: TemplateStringsArray,
  ...interpolations: ((props: T) => false | Style | undefined)[]
) {
  const classNames = styles
    .filter(style => !['', ','].includes(style.trim()))
    .join();

  return React.forwardRef<any, TailwindComponentProps & T>(
    function TailwindComponent({ children, component, ...props }, ref) {
      // Subscribe to twrnc color scheme changes so all styled components re-render when toggled
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [__colorScheme] = useAppColorScheme(twrnc);

      let BaseComponent = Component;
      let baseStyle = null;

      if (typeof component === 'function') {
        const CustomComponent = component;
        baseStyle = (
          CustomComponent.defaultProps as React.ComponentProps<
            typeof BaseComponent
          >
        )?.style;
        BaseComponent = CustomComponent;
      }

      const insets = useSafeAreaInsets();
      let style = { ...twrnc`${classNames}` };

      interpolations.forEach(interpolation => {
        const interpolatedStyle = interpolation(props as T);
        if (interpolatedStyle) {
          style = { ...style, ...interpolatedStyle };
        }
      });

      if (classNames.includes('safe:pt')) style.paddingTop = insets.top;
      if (classNames.includes('safe:pb')) style.paddingBottom = insets.bottom;
      if (classNames.includes('safe:pl')) style.paddingLeft = insets.left;
      if (classNames.includes('safe:pr')) style.paddingRight = insets.right;

      if (classNames.includes('safe:mt')) style.marginTop = insets.top;
      if (classNames.includes('safe:mb')) style.marginBottom = insets.bottom;
      if (classNames.includes('safe:ml')) style.marginLeft = insets.left;
      if (classNames.includes('safe:mr')) style.marginRight = insets.right;

      if (classNames.includes('safe:top')) style.top = insets.top;
      if (classNames.includes('safe:bottom')) style.bottom = insets.bottom;
      if (classNames.includes('safe:left')) style.left = insets.left;
      if (classNames.includes('safe:right')) style.right = insets.right;

      if (classNames.includes('safe:h-top')) style.height = insets.top;
      if (classNames.includes('safe:h-bottom')) style.height = insets.bottom;
      if (classNames.includes('safe:w-left')) style.width = insets.left;
      if (classNames.includes('safe:w-right')) style.width = insets.right;

      return (
        <BaseComponent
          {...props}
          ref={ref}
          style={[baseStyle, style, props.style]}
        >
          {children}
        </BaseComponent>
      );
    }
  );
}

function generateTailwindStyledComponents(): TailwindComponents {
  return allowedComponents.reduce<TailwindComponents>((acc, componentName) => {
    const animatedComponentName = componentName.startsWith('Animated')
      ? componentName.split('Animated')[1]
      : null;
    const Component = animatedComponentName
      ? (RN.Animated as any)[animatedComponentName as keyof typeof RN.Animated]
      : RN[componentName as keyof typeof RN];

    (acc as Record<string, any>)[componentName] = (
      styles: TemplateStringsArray,
      ...interpolations: ((props: any) => false | Style | undefined)[]
    ) => createTailwindComponent(Component, styles, ...interpolations);

    return acc;
  }, twrnc as TailwindComponents);
}

export function Provider({
  children,
  initialColorScheme = 'device',
  storage,
}: ProviderProps) {
  const [colorScheme, toggleColorScheme, setColorScheme] =
    useAppColorScheme(twrnc);

  useDeviceContext(twrnc, {
    observeDeviceColorSchemeChanges: false,
    initialColorScheme,
  });

  // Load persisted color scheme once on mount
  useEffect(() => {
    if (storage) {
      storage.getItem('tw:color-scheme').then(value => {
        if (value) {
          setColorScheme(value as 'light' | 'dark');
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist color scheme on changes
  useEffect(() => {
    if (storage && (colorScheme === 'light' || colorScheme === 'dark')) {
      storage.setItem('tw:color-scheme', colorScheme);
    }
  }, [colorScheme, storage]);

  return (
    <ColorSchemeContext.Provider
      value={{
        colorScheme: (colorScheme as ColorSchemeType) || 'device',
        toggleColorScheme,
        setColorScheme: setColorScheme as (scheme: ColorSchemeType) => void,
      }}
    >
      {children}
    </ColorSchemeContext.Provider>
  );
}

const tw = generateTailwindStyledComponents();

export function useColorScheme() {
  const ctx = useContext(ColorSchemeContext);
  const [colorScheme, toggleColorScheme, setColorScheme] =
    useAppColorScheme(twrnc);

  if (ctx) return ctx;

  return {
    colorScheme: (colorScheme as ColorSchemeType) || 'device',
    toggleColorScheme,
    setColorScheme: setColorScheme as (scheme: ColorSchemeType) => void,
  };
}

export * from 'twrnc';
export default tw;
