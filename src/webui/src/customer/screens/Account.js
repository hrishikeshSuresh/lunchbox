import React from "react";
import { ScrollView, StyleSheet, Dimensions,View, TouchableOpacity } from "react-native";
// Galio components
import { Block, Text, Button as GaButton, theme } from "galio-framework";
// Argon themed components

import { argonTheme, tabs } from "../../constants/";
import { Button, Select, Icon, Input, Header, Switch } from "../../components/";
import Modal from "react-native-modal";
import md5 from 'md5';

const { width } = Dimensions.get("screen");
import {AsyncStorage} from 'react-native';

class Account extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isModalVisible: false,
      isModalVisible2: false,
      p1:"",
      p2:"",
      p3:" ",
      error:'',
      user:""
    };
    AsyncStorage.getItem("user").then((value) => {
      this.setState({"user": value});
  })
  }
  change_password(obj){
    // console.warn(obj.state);
      const url = server_ip+'/api/v1/change_password';
      const data = { username:obj.state.user,
        password:md5(obj.state.p1),
        new_password:md5(obj.state.p2),
        confirm_password:md5(obj.state.p3) };
        console.warn(data)
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
          if(response.status==201){
            this.setState({error : "Password Successfully Changed"})
          }
          else{
            this.setState({error : "Oops! Something isn't right"})
          }

        })
      } catch (error) {
        console.warn('Error:', error);
      }
      obj.toggleModal()
  }

  change(text,field){
    if(field=='p1')
    this.setState({p1 : text,})
    if(field=='p2')
    this.setState({p2 : text,})
    if(field=='p3')
    this.setState({p3 : text,})
    // console.warn(this.state);
  }
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };  
  toggleModal2 = () => {
    this.setState({ isModalVisible2: !this.state.isModalVisible2 });
  }; 
  logout(obj){
    // navigate to onboarding
    obj.toggleModal2();
    console.log("above")
    try{
    obj.props.navigation.navigate('Onboard');
    }
    catch(e){console.log(e)}
    console.log("below")

    // console.warn(result)
  }
  render() {
    const { style } = this.props;
    return (
      <Block flex center>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
          
          <Block style={styles.start}>
            <Text style={styles.pad}>
              <Text bold size={18} style={styles.title}>
                Name : &nbsp;
              </Text>
              <Text
                  p
                  style={{ marginBottom: theme.SIZES.BASE / 2 }}
                  color={argonTheme.COLORS.DEFAULT}
                >
                  {this.state.user}
              </Text>
            </Text>
            <Text style={styles.pad}>
              <Text bold size={18} style={styles.title}>
                E-mail :  &nbsp;
              </Text>
              <Text
                  p
                  style={{ marginBottom: theme.SIZES.BASE / 2 }}
                  color={argonTheme.COLORS.DEFAULT}
                >
                  {this.state.user}@gmail.com
              </Text>
            </Text>
            <Text style={styles.pad}>
              <Text bold size={18} style={styles.title}>
                Account Balance :  &nbsp;
              </Text>
              <Text
                  p
                  style={{ marginBottom: theme.SIZES.BASE / 2 }}
                  color={argonTheme.COLORS.DEFAULT}
                >
                  0
              </Text>
            </Text>
            <Block center>
              <Button
                  color="secondary"
                  textStyle={{ color: "black", fontSize: 12, fontWeight: "700" }}
                  style={styles.button}
                  onPress={this.toggleModal}
                >
                  Change My Password
              </Button>
            </Block>
            {/* <Block center>
            <Button color="default" style={styles.button}>
              Link Payment Wallet
            </Button>
          </Block> */}
            <Block center>
              <Button color="warning" style={styles.button}  onPress={() => this.toggleModal2()} >
                Log Out
              </Button>
            </Block>
            <Modal isVisible={this.state.isModalVisible} animationType="fade">
              <Block center>
              <Input
                        password
                        borderless
                        placeholder="Current Password"
                        onChangeText={(text)=>this.change(text,'p1')} 

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
                      <Input
                        password
                        borderless
                        placeholder="New Password"
                        onChangeText={(text)=>this.change(text,'p2')} 

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
                      <Input
                        password
                        borderless
                        placeholder="Confirm Password"
                        onChangeText={(text)=>this.change(text,'p3')} 

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
                <Button title="Hide modal" onPress={() => this.change_password(this)} color="success" style={styles.changepass}>Change Password</Button>
                <Button title="Hide modal2" onPress={this.toggleModal} color="default">Close</Button>
              </Block>
            </Modal>
            <Modal isVisible={this.state.isModalVisible2} animationType="fade">
              <Block middle>
              <Button title="Hide modal3" onPress={() => this.logout(this)} color="success" style={styles.changepass}>Confirm Log Out</Button>
              <Button title="Hide modal4" onPress={this.toggleModal2} color="default">Close</Button>
                
              </Block>
            </Modal>
            <Block middle>
                <Text size={12}>{this.state.error}</Text>
            </Block>
          </Block>
        </ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  start: {
    marginTop: 40
  },
  pad:{
    marginBottom:5
  },
  title: {
    paddingBottom: theme.SIZES.BASE,
    paddingHorizontal: theme.SIZES.BASE * 2,
    marginTop: 44,
    color: argonTheme.COLORS.HEADER
  },
  group: {
    paddingTop: theme.SIZES.BASE * 2
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    elevation: 2
  },
  button: {
    marginTop: theme.SIZES.BASE/2,
    marginBottom: theme.SIZES.BASE/2,
    width: width - theme.SIZES.BASE * 6
  },
  optionsButton: {
    width: "auto",
    height: 34,
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: 10
  },
  input: {
    borderBottomWidth: 1
  },
  inputDefault: {
    borderBottomColor: argonTheme.COLORS.PLACEHOLDER
  },
  inputTheme: {
    borderBottomColor: argonTheme.COLORS.PRIMARY
  },
  inputTheme: {
    borderBottomColor: argonTheme.COLORS.PRIMARY
  },
  inputInfo: {
    borderBottomColor: argonTheme.COLORS.INFO
  },
  inputSuccess: {
    borderBottomColor: argonTheme.COLORS.SUCCESS
  },
  inputWarning: {
    borderBottomColor: argonTheme.COLORS.WARNING
  },
  inputDanger: {
    borderBottomColor: argonTheme.COLORS.ERROR
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: "center"
  },
  changepass:{
    marginBottom:15,
    marginTop:5
  }
});

export default Account;