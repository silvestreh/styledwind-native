import React from 'react';
import { render } from '@testing-library/react-native';
import tw from './index';
import { View } from 'react-native';

const TextComponent = tw.Text<{ isBig?: boolean }>`
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
});
