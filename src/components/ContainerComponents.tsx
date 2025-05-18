import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {ReactNode} from 'react';
// import {globalStyles} from '../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'iconsax-react-native';
import { appColors } from '../constants/appColors';
import { globalStyles } from '../styles/globalStyles';
import RowComponents from './RowComponents';
import TextComponents from './TextComponents';
// import RowComponents from './RowComponents';
// import { ArrowLeft } from 'iconsax-react-nativejs';
// import { appColors } from '../contants/appColors';
// import TextComponents from './TextComponents';
// import { fontFamilies } from '../contants/fontFamilies';

interface Props {
  isImagesBackgournd?: boolean;
  isScroll?: boolean;
  title?: string;
  children?: ReactNode;
  back?: boolean;
}
const ContainerComponents = (props: Props) => {
  const {isImagesBackgournd, isScroll, title, children, back} = props;

  const navigation: any = useNavigation();

  const headerComponent = () => {
    return (
      <View style={{flex: 1, paddingTop: 30}}>
        {(title || back) && (
          <RowComponents styles={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            minWidth: 48,
            minHeight: 48,
          }}>
          {back && (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{marginRight: 12}}>
                <ArrowLeft size={24} color={appColors.text} />
              </TouchableOpacity>
            )}
            {title ? (
              <TextComponents
                text={title}
                size={16}
                // font={fontFamilies.medium}
                flex={1}
              />
            ) : (
              <></>
            )}
          </RowComponents>
        )}
        {returnContainer}
      </View>
    );
  };

  const returnContainer = isScroll ? (
    <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>{children}</ScrollView>
  ) : (
    <View style={{flex: 1}}>{children}</View>
  );
return (
//   return isImagesBackgournd ? (
//     <ImageBackground
//       source={require('../assets/images/splash-images.png')}
//       style={{flex: 1}}
//       imageStyle={{flex: 1}}>
//       <SafeAreaView style={{flex: 1}}>{headerComponent()}</SafeAreaView>
//     </ImageBackground>
//   ) : (
    <SafeAreaView style={[globalStyles.container]}>
      <View>{returnContainer}</View>
    </SafeAreaView>
  );
};

export default ContainerComponents;