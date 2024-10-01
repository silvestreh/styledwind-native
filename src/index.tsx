import React from 'react';
import RN from 'react-native';
import { useDeviceContext, create, type TailwindFn, type Style } from 'twrnc';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

let tailwindConfig;

try {
  tailwindConfig = require('../../../tailwind.config.js');
} catch (error) {}

const twrnc = create(tailwindConfig);

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
  ) => React.FC<RN.ActivityIndicatorProps & T>;
  AnimatedFlatList: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.Animated.AnimatedProps<RN.FlatListProps<any>> & T>;
  AnimatedImage: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.Animated.AnimatedProps<ImageProps> & T>;
  AnimatedScrollView: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.Animated.AnimatedProps<RN.ScrollViewProps> & T>;
  AnimatedSectionList: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.Animated.AnimatedProps<RN.SectionListProps<any>> & T>;
  AnimatedText: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.Animated.AnimatedProps<RN.TextProps> & T>;
  AnimatedView: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.Animated.AnimatedProps<RN.ViewProps> & T>;
  Button: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.ButtonProps & T>;
  FlatList: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.FlatListProps<any> & T>;
  Image: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<ImageProps & T>;
  Modal: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.ModalProps & T>;
  SafeAreaView: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.ViewProps & T>;
  ScrollView: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.ScrollViewProps & T>;
  SectionList: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.SectionListProps<any> & T>;
  StatusBar: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.StatusBarProps & T>;
  Switch: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.SwitchProps & T>;
  Text: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.TextProps & T>;
  TextInput: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.TextInputProps & T>;
  TouchableHighlight: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.TouchableHighlightProps & T>;
  TouchableNativeFeedback: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.TouchableNativeFeedbackProps & T>;
  TouchableOpacity: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.TouchableOpacityProps & T>;
  View: <T = {}>(
    styles: TemplateStringsArray,
    ...interpolations: ((props: T) => false | Style | undefined)[]
  ) => React.FC<RN.ViewProps & T>;
};

function createTailwindComponent<T = {}>(
  Component: React.FC<any>,
  styles: TemplateStringsArray,
  ...interpolations: ((props: T) => false | Style | undefined)[]
) {
  const classNames = styles.filter(style => !['', ','].includes(style.trim())).join();

  return function TailwindComponent({ children, component, ...props }: TailwindComponentProps) {
    useDeviceContext(twrnc);

    let BaseComponent = Component;
    let baseStyle = null;

    if (typeof component === 'function') {
      const CustomComponent = component;
      baseStyle = (CustomComponent.defaultProps as React.ComponentProps<typeof BaseComponent>)
        ?.style;
      BaseComponent = CustomComponent;
    }

    const insets = useSafeAreaInsets();
    let style = twrnc`${classNames}`;

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
      <BaseComponent {...props} style={[baseStyle, style, props.style]}>
        {children}
      </BaseComponent>
    );
  };
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
export default tw;
