import React from 'react';
import RN from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [scheme] = useAppColorScheme(twrnc);
  return scheme === 'dark' ? darkValue : lightValue;
}

type PersistedOptions = StyledwindDeviceOptions & { storageKey?: string };

function usePersistedColorScheme(options?: PersistedOptions) {
  const [scheme, toggle, setScheme] = useColorScheme(options);
  const storageKey = options?.storageKey ?? 'styledwind:color-scheme';
  const didLoadRef = React.useRef(false);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(storageKey);
        if (mounted && (saved === 'light' || saved === 'dark')) {
          setScheme(saved as any);
        }
      } catch {}
      if (mounted) didLoadRef.current = true;
    })();
    return () => {
      mounted = false;
    };
  }, [setScheme, storageKey]);

  React.useEffect(() => {
    if (!didLoadRef.current) return;
    (async () => {
      try {
        if (scheme === 'light' || scheme === 'dark') {
          await AsyncStorage.setItem(storageKey, scheme);
        } else {
          await AsyncStorage.setItem(storageKey, 'system');
        }
      } catch {}
    })();
  }, [scheme, storageKey]);

  return [scheme, toggle, setScheme] as ReturnType<typeof useAppColorScheme>;
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
    // Keep hook order stable and preserve current scheme
    const [scheme] = useAppColorScheme(twrnc);
    useDeviceContext(
      twrnc,
      ({
        initialColorScheme: (scheme ?? 'device') as any,
        observeDeviceColorSchemeChanges: false,
      } as unknown) as any
    );

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
        key={twrnc.memoBuster}
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
export { create, useDeviceContext, useColorSchemeValue, useColorScheme, usePersistedColorScheme };
export default tw;
