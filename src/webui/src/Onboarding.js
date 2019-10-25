// import React from "react";
// import {
//   ImageBackground,
//   Image,
//   StyleSheet,
//   StatusBar,
//   Dimensions
// } from "react-native";
// import { Block, Button, Text, theme } from "galio-framework";

// const { height, width } = Dimensions.get("screen");

// import argonTheme from "../constants/Theme";
// import Images from "../constants/Images";

// class Onboarding extends React.Component {
//   render() {
//     const { navigation } = this.props;

//     return (
//       <Block flex style={styles.container}>
//         <StatusBar hidden />
//         <Block flex center>
//         <ImageBackground
//             source={Images.Onboarding}
//             style={{ height, width, zIndex: 1 }}
//           />
//         </Block>
//         <Block center>
//           <Image source={Images.LogoOnboarding} style={styles.logo} />
//         </Block>
//         <Block flex space="between" style={styles.padded}>
//             <Block flex space="around" style={{ zIndex: 2 }}>
//               <Block style={styles.title}>
//                 <Block>
//                   <Text color="white" size={60}>
//                     Design
//                   </Text>
//                 </Block>
//                 <Block>
//                   <Text color="white" size={60}>
//                     System
//                   </Text>
//                 </Block>
//                 <Block style={styles.subTitle}>
//                   <Text color="white" size={16}>
//                     Fully coded React Native components.
//                   </Text>
//                 </Block>
//               </Block>
//               <Block center>
//                 <Button
//                   style={styles.button}
//                   color={argonTheme.COLORS.SECONDARY}
//                   onPress={() => navigation.navigate("Home")}
//                   textStyle={{ color: argonTheme.COLORS.BLACK }}
//                 >
//                   Get Started
//                 </Button>
//               </Block>
//           </Block>
//         </Block>
//       </Block>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: theme.COLORS.BLACK
//   },
//   padded: {
//     paddingHorizontal: theme.SIZES.BASE * 2,
//     position: "relative",
//     bottom: theme.SIZES.BASE,
//     zIndex: 2,
//   },
//   button: {
//     width: width - theme.SIZES.BASE * 4,
//     height: theme.SIZES.BASE * 3,
//     shadowRadius: 0,
//     shadowOpacity: 0
//   },
//   logo: {
//     width: 200,
//     height: 60,
//     zIndex: 2,
//     position: 'relative',
//     marginTop: '-50%'
//   },
//   title: {
//     marginTop:'-5%'
//   },
//   subTitle: {
//     marginTop: 20
//   }
// });

// export default Onboarding;


import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Picker
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";

import { Button, Icon, Input } from "./components";
import { Images, argonTheme } from "./constants";
const { width, height } = Dimensions.get("screen");

class Onboarding extends React.Component {
  constructor(props){
    super(props);
    this.state={loginas:"Customer"}
  }
  // Institution - 
  // <Block width={width * 0.8} style={{ marginBottom: 15 }}>
  //   <Input
  //     borderless
  //     placeholder="Institution"
  //     iconContent={
  //       <Icon
  //         size={16}
  //         color={argonTheme.COLORS.ICON}
  //         name="hat-3"
  //         family="ArgonExtra"
  //         style={styles.inputIcons}
  //       />
  //     }
  //   />
  // </Block>
  nav(obj){
    obj.props.navigation.navigate(obj.state.loginas);
  }
  render() {
    // const { navigation } = this.props;
    return (
      <Block flex middle>
        <StatusBar hidden />
        <ImageBackground
          source={Images.RegisterBackground}
          style={{ width, height, zIndex: 1 }}
        >
          <Block flex middle>
            <Block style={styles.registerContainer}>
              
              <Block flex>
                <Block flex={0.17} middle>
                  <Text color="#8898AA" size={20}>
                    Sign In
                  </Text>
                </Block>
                <Block flex center>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >
                    
                    <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                      <Input
                        borderless
                        placeholder="Email"
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="ic_mail_24px"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>
                    <Block width={width * 0.8}>
                      <Input
                        password
                        borderless
                        placeholder="Password"
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="padlock-unlocked"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>
                    <Block width={width * 0.8} marginTop={20}>
                      <Text bold size={14} >Login As : </Text>
                      <Picker
                        selectedValue={this.state.loginas}
                        style={{height: 50, width: 200}}
                        onValueChange={(itemValue, itemIndex) =>
                          this.setState({loginas: itemValue})
                        }
                        marginLeft={10}>
                        <Picker.Item label="Institution" value="Institution"/>
                        <Picker.Item label="Customer" value="Customer" />
                        <Picker.Item label="Vendor" value="Vendor" />
                        <Picker.Item label="Caterer" value="Caterer" />
                      </Picker>
                    </Block>
                    <Block middle>
                      <Button color="primary" style={styles.createButton}
                        onPress={() => this.nav(this)}>
                        <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                          SIGN IN
                        </Text>
                      </Button>
                    </Block>
                  </KeyboardAvoidingView>
                </Block>
              </Block>
            </Block>
          </Block>
        </ImageBackground>
      </Block>
    );
  }
}
//onPress={() => navigation.navigate("Customer")}>
 
const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.78,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden"
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25
  }
});

export default Onboarding;
