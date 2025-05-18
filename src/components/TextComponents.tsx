import {View, Text, StyleProp, TextStyle, Platform} from 'react-native';
import React from 'react';
import {globalStyles} from '../styles/globalStyles';
import { appColors } from '../constants/appColors';

interface Props {
  text: string;
  color?: string;
  size?: number;
  flex?: number;
  font?: string;
  styles?: StyleProp<TextStyle>;
  title?: boolean;
}

const TextComponents = (props: Props) => {
  const {text, color, size, flex, font, title, styles} = props;

  const fontSizeDefault = Platform.OS === 'ios' ? 16 : 14;

  return (
    <Text
      style={[
        globalStyles.text,
        {
          color: color ?? appColors.text,
          flex: flex ?? 0,
          fontSize: size ? size : title ? 24 : fontSizeDefault,
        //   fontFamily: font ? font : fontFamilies.regular,
        },
        styles,
      ]}>
      {text}
    </Text>
  );
};

export default TextComponents;