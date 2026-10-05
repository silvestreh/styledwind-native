// Uses the real twrnc instead of the mock from jest.setup.js.
jest.unmock('twrnc');

import React from 'react';
import { Text } from 'react-native';
import { act, fireEvent, render } from '@testing-library/react-native';
import { createStyledwind } from './index';

const colorOf = (node: { props: { style: unknown } }) =>
  ([node.props.style] as unknown[])
    .flat(Infinity)
    .filter(Boolean)
    .map(style => (style as { color?: string }).color)
    .filter(Boolean)
    .pop();

// A styled component under a parent that does not re-render (a memoized
// subtree, a screen under a navigator) kept the old scheme's styles.
describe('styled components follow the color scheme', () => {
  it('re-render under a Provider even when their parent does not', () => {
    const { tw, Provider, useColorScheme } = createStyledwind();
    const Label = tw.Text`text-black dark:text-white`;
    const Frozen = React.memo(() => <Label testID="label">hi</Label>);
    const Controls = () => {
      const { setColorScheme, toggleColorScheme } = useColorScheme();
      return (
        <>
          <Text testID="dark" onPress={() => setColorScheme('dark')} />
          <Text testID="toggle" onPress={toggleColorScheme} />
        </>
      );
    };

    const { getByTestId } = render(
      <Provider initialColorScheme="light">
        <Controls />
        <Frozen />
      </Provider>
    );

    expect(colorOf(getByTestId('label'))).toBe('#000');
    fireEvent.press(getByTestId('dark'));
    expect(colorOf(getByTestId('label'))).toBe('#fff');
    fireEvent.press(getByTestId('toggle'));
    expect(colorOf(getByTestId('label'))).toBe('#000');
  });

  it('re-render without a Provider when another component changes the scheme', () => {
    const { tw, useColorScheme } = createStyledwind();
    const Label = tw.Text`text-black dark:text-white`;
    const Frozen = React.memo(() => <Label testID="label">hi</Label>);
    const Scheme = React.memo(() => (
      <Text testID="scheme">{useColorScheme().colorScheme}</Text>
    ));
    const Controls = () => {
      const { setColorScheme } = useColorScheme();
      return <Text testID="dark" onPress={() => setColorScheme('dark')} />;
    };

    act(() => tw.setColorScheme('light'));
    const { getByTestId } = render(
      <>
        <Controls />
        <Scheme />
        <Frozen />
      </>
    );

    expect(colorOf(getByTestId('label'))).toBe('#000');
    fireEvent.press(getByTestId('dark'));
    expect(colorOf(getByTestId('label'))).toBe('#fff');
    expect(getByTestId('scheme').props.children).toBe('dark');
  });

  it('re-render when the scheme is set on the instance directly', () => {
    const { tw, Provider, useColorScheme } = createStyledwind();
    const Label = tw.Text`text-black dark:text-white`;
    const Frozen = React.memo(() => <Label testID="label">hi</Label>);
    const Scheme = React.memo(() => (
      <Text testID="scheme">{useColorScheme().colorScheme}</Text>
    ));

    // Without a Provider.
    act(() => tw.setColorScheme('light'));
    const bare = render(
      <>
        <Scheme />
        <Frozen />
      </>
    );
    act(() => tw.setColorScheme('dark'));
    expect(colorOf(bare.getByTestId('label'))).toBe('#fff');
    expect(bare.getByTestId('scheme').props.children).toBe('dark');
    bare.unmount();

    // Under a Provider: the styled components follow the instance.
    const provided = render(
      <Provider initialColorScheme="light">
        <Frozen />
      </Provider>
    );
    expect(colorOf(provided.getByTestId('label'))).toBe('#000');
    act(() => tw.setColorScheme('dark'));
    expect(colorOf(provided.getByTestId('label'))).toBe('#fff');
  });

  it('mounting a Provider over mounted components warns of nothing', () => {
    const { tw, Provider } = createStyledwind();
    const Label = tw.Text`text-black dark:text-white`;
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    act(() => tw.setColorScheme('light'));

    const Late = ({ on }: { on: boolean }) => (
      <>
        <Label testID="label">hi</Label>
        {on ? <Provider initialColorScheme="dark">{null}</Provider> : null}
      </>
    );
    const { getByTestId, rerender } = render(<Late on={false} />);
    rerender(<Late on />);

    expect(colorOf(getByTestId('label'))).toBe('#fff');
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it('keeps instances apart', () => {
    const a = createStyledwind();
    const b = createStyledwind();
    const LabelB = b.tw.Text`text-black dark:text-white`;
    const Controls = () => {
      const { setColorScheme } = a.useColorScheme();
      return <Text testID="dark" onPress={() => setColorScheme('dark')} />;
    };

    const { getByTestId } = render(
      <a.Provider initialColorScheme="light">
        <b.Provider initialColorScheme="light">
          <Controls />
          <LabelB testID="label">hi</LabelB>
        </b.Provider>
      </a.Provider>
    );

    fireEvent.press(getByTestId('dark'));
    expect(colorOf(getByTestId('label'))).toBe('#000');
  });
});
