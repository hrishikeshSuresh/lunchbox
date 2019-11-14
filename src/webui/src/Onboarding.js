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
import md5 from 'md5';
import { Button, Icon, Input } from "./components";
import { Images, argonTheme } from "./constants";
const { width, height } = Dimensions.get("screen");
import {AsyncStorage} from 'react-native';

class Onboarding extends React.Component {
  
  constructor(props){
    super(props);
    this.state={
      loginas:"Customer",
      user:'',
      password:'',
      error:''
    }
  }
  change(text,field){
    if(field=='user')
    this.setState({user : text,})
    if(field=='password')
    this.setState({password : text,})
    // console.warn(this.state);
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
    // console.warn(obj.state);
      const url = server_ip+'/api/v1/login';
      const data = { username:obj.state.user,
        password:md5(obj.state.password),
        user_type:obj.state.loginas };

      try{
      response=fetch(url, {
          method: 'POST', 
          credentials: 'include',
          body: JSON.stringify(data), 
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          if(response.status==200){
            if(withflask){
              AsyncStorage.setItem('user', obj.state.user);
            obj.props.navigation.navigate(obj.state.loginas);
          }
            // response.json().then((res)=>console.warn(res));
          }
          else{
            this.setState({error : "Oops! Something isn't right"})
          }
          if(!withflask){obj.props.navigation.navigate(obj.state.loginas);}

        })
      } catch (error) {
        console.warn('Error:', error);
      }


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
                        placeholder="Username"
                        onChangeText={(text)=>this.change(text,'user')} 
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
                        onChangeText={(text)=>this.change(text,'password')} 

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
                        <Picker.Item label="Delivery" value="Delivery" />
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
                    <Block middle>
                        <Text size={12}>{this.state.error}</Text>
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
