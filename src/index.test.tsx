import React from 'react';
import { render, act } from '@testing-library/react-native';
import tw, { useStyledwindColorScheme, useAppColorScheme } from './index';
import { View, TextInput, StyleSheet } from 'react-native';

type TextComponentProps = {
  isBig?: boolean;
};

const TextComponent = tw.Text<TextComponentProps>`
  text-base
  text-slate-600
  ${(props) => props.isBig && tw`text-2xl`}
`;

const SafeAreaComponent = tw.View`
  safe:pt
  safe:pb
  safe:pl
  safe:pr
  safe:top
  safe:bottom
  safe:left
  safe:right
  safe:mt
  safe:mb
  safe:ml
  safe:mr
  safe:h-top
  safe:h-bottom
  safe:w-left
  safe:w-right
`;

describe('styledwind-native', () => {
  it('should render a basic component with static styles', () => {
    const { getByText } = render(<TextComponent>Test</TextComponent>);
    const element = getByText('Test');

    // Filter out null and undefined styles from the array
    const filteredStyle = element.props.style.filter(Boolean);

    // Check if the static styles are applied correctly (snapshot test)
    expect(filteredStyle).toEqual(
      expect.arrayContaining([{ fontSize: 16, color: '#475569', lineHeight: 24 }])
    );
  });

  it('should apply dynamic styles based on props', () => {
    const { getByText } = render(<TextComponent isBig>Big Text</TextComponent>);
    const element = getByText('Big Text');

    // Filter out null and undefined styles from the array
    const filteredStyle = element.props.style.filter(Boolean);

    // Check if the dynamic style (text-2xl) is applied when isBig is true
    expect(filteredStyle).toEqual(
      expect.arrayContaining([{ fontSize: 24, color: '#475569', lineHeight: 32 }])
    );
  });

  it('should apply safe area insets', () => {
    const { getByTestId } = render(
      <SafeAreaComponent testID="safe-area">
        <View />
      </SafeAreaComponent>
    );
    const element = getByTestId('safe-area');
    const filteredStyle = element.props.style.filter(Boolean);
    expect(filteredStyle).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          paddingTop: expect.any(Number),
          paddingBottom: expect.any(Number),
          paddingLeft: expect.any(Number),
          paddingRight: expect.any(Number),
          marginTop: expect.any(Number),
          marginBottom: expect.any(Number),
          marginLeft: expect.any(Number),
          marginRight: expect.any(Number),
          height: expect.any(Number),
          width: expect.any(Number),
        }),
      ])
    );
  });

  it('should forward ref to View', () => {
    const ref = React.createRef<View>();
    const Box = tw.View``;
    render(
      <Box ref={ref}>
        <View />
      </Box>
    );
    expect(ref.current).toBeTruthy();
  });

  it('should forward ref to TextInput', () => {
    const ref = React.createRef<TextInput>();
    const Input = tw.TextInput``;
    render(<Input ref={ref} />);
    expect(ref.current).toBeTruthy();
  });

  it('should allow setting and toggling color scheme', () => {
    const ColorBox = tw.View`bg-white dark:bg-black`;

    type HarnessApi = {
      getScheme: () => 'light' | 'dark' | null | undefined;
      toggle: () => void;
      set: (s: 'light' | 'dark' | null | undefined) => void;
    };

    const Harness = React.forwardRef<HarnessApi>(function Harness(_props, ref) {
      const [scheme, toggle, setScheme] = useStyledwindColorScheme({
        initialColorScheme: 'light',
        observeDeviceColorSchemeChanges: false,
      });

      React.useImperativeHandle(
        ref,
        () => ({
          getScheme: () => scheme,
          toggle,
          set: setScheme,
        }),
        [scheme, toggle, setScheme]
      );

      return <ColorBox testID="color-box" />;
    });

    const ref = React.createRef<HarnessApi>();
    const { getByTestId } = render(<Harness ref={ref} />);

    const node = getByTestId('color-box');
    const whiteBg = (tw`bg-white` as any).backgroundColor;
    const blackBg = (tw`bg-black` as any).backgroundColor;

    // Initial: light
    expect(ref.current?.getScheme()).toBe('light');
    const initialStyle = StyleSheet.flatten(node.props.style);
    expect(initialStyle.backgroundColor).toBe(whiteBg);

    // Set dark
    act(() => {
      ref.current?.set('dark');
    });
    const darkStyle = StyleSheet.flatten(getByTestId('color-box').props.style);
    expect(ref.current?.getScheme()).toBe('dark');
    expect(darkStyle.backgroundColor).toBe(blackBg);

    // Toggle back to light
    act(() => {
      ref.current?.toggle();
    });
    const lightStyle = StyleSheet.flatten(getByTestId('color-box').props.style);
    expect(ref.current?.getScheme()).toBe('light');
    expect(lightStyle.backgroundColor).toBe(whiteBg);
  });

  it('should default to device scheme and toggle to a different background', () => {
    const ColorBox = tw.View`bg-white dark:bg-black`;

    type HarnessApi = { toggle: () => void };

    const Harness = React.forwardRef<HarnessApi>(function Harness(_props, ref) {
      const [_scheme, toggle] = useStyledwindColorScheme({
        initialColorScheme: 'device',
        observeDeviceColorSchemeChanges: false,
      });
      React.useImperativeHandle(ref, () => ({ toggle }), [toggle]);
      return <ColorBox testID="device-color-box" />;
    });

    const ref = React.createRef<HarnessApi>();
    const { getByTestId } = render(<Harness ref={ref} />);

    const initialBg = (StyleSheet.flatten(getByTestId('device-color-box').props.style) as any)
      .backgroundColor;

    act(() => {
      ref.current?.toggle();
    });

    const afterToggleBg = (
      StyleSheet.flatten(getByTestId('device-color-box').props.style) as any
    ).backgroundColor;

    expect(afterToggleBg).not.toBe(initialBg);
  });

});
