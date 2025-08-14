import React from 'react';
import RN from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useDeviceContext,
  useAppColorScheme,
  create,
  type TailwindFn,
  type Style,
} from 'twrnc';

let tailwindConfig;

try {
  tailwindConfig = require('../../../tailwind.config.js');
} catch (error) {}

const twrnc = create(tailwindConfig);

type StyledwindDeviceOptions = {
  observeDeviceColorSchemeChanges?: boolean;
  initialColorScheme?: 'device' | 'light' | 'dark';
};

function useColorScheme(options?: StyledwindDeviceOptions) {
  const ctx = React.useContext(ColorSchemeContext);
  if (ctx) {
    return [ctx.scheme, ctx.toggle, ctx.setScheme] as ReturnType<typeof useAppColorScheme>;
  }
  useDeviceContext(
    twrnc,
    ({
      initialColorScheme: (options?.initialColorScheme ?? 'device') as any,
      observeDeviceColorSchemeChanges: options?.observeDeviceColorSchemeChanges ?? false,
    } as unknown) as any
  );
  return useAppColorScheme(twrnc);
}

function useColorSchemeValue<T>(lightValue: T, darkValue: T): T {
  const ctx = React.useContext(ColorSchemeContext);
  if (ctx) {
    const deviceScheme = RN.useColorScheme();
    const effective = ctx.mode === 'device' ? deviceScheme : ctx.scheme;
    return effective === 'dark' ? darkValue : lightValue;
  }
  const [scheme] = useAppColorScheme(twrnc);
  return scheme === 'dark' ? darkValue : lightValue;
}

// Color Scheme Context API
type StorageAPI = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem?(key: string): Promise<void>;
};

type ColorSchemeMode = 'device' | 'light' | 'dark';

type ColorSchemeContextValue = {
  scheme: ReturnType<typeof useAppColorScheme>[0];
  mode: ColorSchemeMode;
  toggle: () => void;
  setMode: (mode: ColorSchemeMode) => void;
  setScheme: ReturnType<typeof useAppColorScheme>[2];
};

const ColorSchemeContext = React.createContext<ColorSchemeContextValue | null>(null);

type ProviderProps = {
  children?: React.ReactNode;
  initialColorScheme?: ColorSchemeMode;
  observeDeviceColorSchemeChanges?: boolean;
  storage?: StorageAPI;
  storageKey?: string;
};

function Provider({
  children,
  initialColorScheme = 'device',
  observeDeviceColorSchemeChanges = false,
  storage,
  storageKey = 'styledwind:color-scheme',
}: ProviderProps) {
  // Initialize device context once per tree using the chosen initial mode
  useDeviceContext(
    twrnc,
    ({
      initialColorScheme,
      observeDeviceColorSchemeChanges,
    } as unknown) as any
  );

  const [scheme, _toggle, _setScheme] = useAppColorScheme(twrnc);
  const [mode, setMode] = React.useState<ColorSchemeMode>(initialColorScheme);
  const [hydrated, setHydrated] = React.useState<boolean>(() => !storage);
  const deviceScheme = RN.useColorScheme();

  // Load persisted mode
  React.useEffect(() => {
    if (!storage) return;
    let mounted = true;
    (async () => {
      try {
        const saved = await storage.getItem(storageKey);
        if (mounted && (saved === 'light' || saved === 'dark' || saved === 'device')) {
          setMode(saved as ColorSchemeMode);
          if (saved === 'device') {
            _setScheme(deviceScheme as any);
          } else {
            _setScheme(saved as any);
          }
        }
      } catch {}
      if (mounted) setHydrated(true);
    })();
    return () => {
      mounted = false;
    };
  }, [storage, storageKey, _setScheme, deviceScheme]);

  // Persist mode
  React.useEffect(() => {
    if (!storage) return;
    (async () => {
      try {
        await storage.setItem(storageKey, mode);
      } catch {}
    })();
  }, [mode, storage, storageKey]);

  const toggle = React.useCallback(() => {
    setMode(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      _setScheme(next as any);
      return next;
    });
  }, [_setScheme]);

  const setModeAndScheme = React.useCallback(
    (nextMode: ColorSchemeMode) => {
      setMode(nextMode);
      if (nextMode === 'device') {
        _setScheme(deviceScheme as any);
      } else {
        _setScheme(nextMode as any);
      }
    },
    [_setScheme, deviceScheme]
  );

  const value = React.useMemo<ColorSchemeContextValue>(
    () => ({ scheme, mode, toggle, setMode: setModeAndScheme, setScheme: _setScheme }),
    [scheme, mode, toggle, setModeAndScheme, _setScheme]
  );

  if (storage && !hydrated) {
    return null;
  }
  return <ColorSchemeContext.Provider value={value}>{children}</ColorSchemeContext.Provider>;
}

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

interface ImageProps extends RN.ImageProps {
  tintColor?: string;
}

interface TailwindComponentProps {
  children?: React.ReactNode;
  component?: React.FC<any>;
  [key: string]: any;
}

type TailwindComponents = TailwindFn & {
  ActivityIndicator: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.ForwardRefExoticComponent<
    RN.ActivityIndicatorProps & T & React.RefAttributes<any>
  >;
  AnimatedFlatList: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.ForwardRefExoticComponent<
    RN.Animated.AnimatedProps<RN.FlatListProps<any>> &
      T &
      React.RefAttributes<any>
  >;
  AnimatedImage: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.ForwardRefExoticComponent<
    RN.Animated.AnimatedProps<ImageProps> & T & React.RefAttributes<any>
  >;
  AnimatedScrollView: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.ForwardRefExoticComponent<
    RN.Animated.AnimatedProps<RN.ScrollViewProps> & T & React.RefAttributes<any>
  >;
  AnimatedSectionList: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.ForwardRefExoticComponent<
    RN.Animated.AnimatedProps<RN.SectionListProps<any>> &
      T &
      React.RefAttributes<any>
  >;
  AnimatedText: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.ForwardRefExoticComponent<
    RN.Animated.AnimatedProps<RN.TextProps> & T & React.RefAttributes<any>
  >;
  AnimatedView: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.ForwardRefExoticComponent<
    RN.Animated.AnimatedProps<RN.ViewProps> & T & React.RefAttributes<any>
  >;
  Button: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.ForwardRefExoticComponent<RN.ButtonProps & T & React.RefAttributes<any>>;
  FlatList: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.ForwardRefExoticComponent<
    RN.FlatListProps<any> & T & React.RefAttributes<any>
  >;
  Image: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.ForwardRefExoticComponent<ImageProps & T & React.RefAttributes<any>>;
  Modal: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.ForwardRefExoticComponent<RN.ModalProps & T & React.RefAttributes<any>>;
  SafeAreaView: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.ForwardRefExoticComponent<RN.ViewProps & T & React.RefAttributes<any>>;
  ScrollView: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.ForwardRefExoticComponent<
    RN.ScrollViewProps & T & React.RefAttributes<any>
  >;
  SectionList: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.ForwardRefExoticComponent<
    RN.SectionListProps<any> & T & React.RefAttributes<any>
  >;
  StatusBar: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.ForwardRefExoticComponent<
    RN.StatusBarProps & T & React.RefAttributes<any>
  >;
  Switch: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.ForwardRefExoticComponent<RN.SwitchProps & T & React.RefAttributes<any>>;
  Text: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.ForwardRefExoticComponent<RN.TextProps & T & React.RefAttributes<any>>;
  TextInput: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.ForwardRefExoticComponent<
    RN.TextInputProps & T & React.RefAttributes<any>
  >;
  TouchableHighlight: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.ForwardRefExoticComponent<
    RN.TouchableHighlightProps & T & React.RefAttributes<any>
  >;
  TouchableNativeFeedback: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.ForwardRefExoticComponent<
    RN.TouchableNativeFeedbackProps & T & React.RefAttributes<any>
  >;
  TouchableOpacity: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.ForwardRefExoticComponent<
    RN.TouchableOpacityProps & T & React.RefAttributes<any>
  >;
  View: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.ForwardRefExoticComponent<RN.ViewProps & T & React.RefAttributes<any>>;
};

function createTailwindComponent<T = {}>(
  Component: any,
  styles: TemplateStringsArray,
  ...interpolations: ((props: T) => false | Style | undefined)[]
) {
  const classNames = styles.filter(style => !['', ','].includes(style.trim())).join();

  return React.forwardRef<any, TailwindComponentProps & T>(function TailwindComponent({ children, component, ...props }, ref) {
    // Device context is managed by the Provider or the consuming hook; avoid per-component init

    let BaseComponent = Component as any;
    let baseStyle = null;

    if (typeof component === 'function') {
      const CustomComponent = component as any;
      baseStyle = (CustomComponent.defaultProps as any)
        ?.style;
      BaseComponent = CustomComponent as any;
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
  });
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

const tw = generateTailwindStyledComponents();

export * from 'twrnc';
export {
  create,
  useDeviceContext,
  useColorSchemeValue,
  useColorScheme,
  Provider,
  ColorSchemeContext,
};
export default tw;
