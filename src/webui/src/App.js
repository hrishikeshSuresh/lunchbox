// import React from 'react';
// // import { StyleSheet, Text, View } from 'react-native';
// import {
//   StyleSheet,
//   ImageBackground,
//   Dimensions,
//   StatusBar,
//   KeyboardAvoidingView,
//   View
// } from "react-native";
// import { Block, Checkbox, Text, theme } from "galio-framework";
// import { Button, Icon, Input } from "../components";
// import { Images, argonTheme } from "../constants";
// const { width, height } = Dimensions.get("screen");
// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Block width={width * 0.8} style={{ marginBottom: 15 }}>
//         <Input
//           borderless
//           placeholder="E-mail"
//           iconContent={
//             <Icon
//               size={16}
//               color={argonTheme.COLORS.ICON}
//               name="hat-3"
//               family="ArgonExtra"
//               style={styles.inputIcons}
//             />
//           }
//         />
//       </Block>
//       <Block width={width * 0.8} style={{ marginBottom: 15 }}>
//         <Input
//           borderless
//           placeholder="Email"
//           iconContent={
//             <Icon
//               size={16}
//               color={argonTheme.COLORS.ICON}
//               name="ic_mail_24px"
//               family="ArgonExtra"
//               style={styles.inputIcons}
//             />
//           }
//         />
//       </Block>
//       <Block width={width * 0.8}>
//         <Input
//           password
//           borderless
//           placeholder="Password"
//           iconContent={
//             <Icon
//               size={16}
//               color={argonTheme.COLORS.ICON}
//               name="padlock-unlocked"
//               family="ArgonExtra"
//               style={styles.inputIcons}
//             />
//           }
//         />
//         <Block row style={styles.passwordCheck}>
//           <Text size={12} color={argonTheme.COLORS.MUTED}>
//             password strength:
//           </Text>
//           <Text bold size={12} color={argonTheme.COLORS.SUCCESS}>
//             {" "}
//             strong
//           </Text>
//         </Block>
//       </Block>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   registerContainer: {
//     width: width * 0.9,
//     height: height * 0.78,
//     backgroundColor: "#F4F5F7",
//     borderRadius: 4,
//     shadowColor: argonTheme.COLORS.BLACK,
//     shadowOffset: {
//       width: 0,
//       height: 4
//     },
//     shadowRadius: 8,
//     shadowOpacity: 0.1,
//     elevation: 1,
//     overflow: "hidden"
//   },
//   socialConnect: {
//     backgroundColor: argonTheme.COLORS.WHITE,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderColor: "#8898AA"
//   },
//   socialButtons: {
//     width: 120,
//     height: 40,
//     backgroundColor: "#fff",
//     shadowColor: argonTheme.COLORS.BLACK,
//     shadowOffset: {
//       width: 0,
//       height: 4
//     },
//     shadowRadius: 8,
//     shadowOpacity: 0.1,
//     elevation: 1
//   },
//   socialTextButtons: {
//     color: argonTheme.COLORS.PRIMARY,
//     fontWeight: "800",
//     fontSize: 14
//   },
//   inputIcons: {
//     marginRight: 12
//   },
//   passwordCheck: {
//     paddingLeft: 15,
//     paddingTop: 13,
//     paddingBottom: 30
//   },
//   createButton: {
//     width: width * 0.5,
//     marginTop: 25
//   }
// });



global.server_ip="http://10.0.2.2:4000"
// global.server_ip="http://192.168.43.217:4000"
// global.server_ip="http://192.168.1.116:4000"
// global.server_ip="http://10.20.207.253:4000"

global.withflask=1
import React from 'react';
import { Image } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import { Block, GalioProvider } from 'galio-framework';
import MainNavigation from './MainNavigation'
// import Screens from './navigation/Screens';
import { Images, articles, argonTheme } from './constants';

// cache app images
const assetImages = [
  Images.Onboarding,
  Images.LogoOnboarding,
  Images.Logo,
  Images.Pro,
  Images.ArgonLogo,
  Images.iOSLogo,
  Images.androidLogo,
  Images.star
];

// cache product images
articles.map(article => assetImages.push(article.image));

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  }
  
  render() {
    if(!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <GalioProvider theme={argonTheme}>
          <Block flex>
            {/* <Screens /> */}
            {/* <Onboarding /> */}
            <MainNavigation/>
          </Block>
        </GalioProvider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      ...cacheImages(assetImages),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

}
