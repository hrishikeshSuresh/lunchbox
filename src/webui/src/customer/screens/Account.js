import React from "react";
import { ScrollView, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
// Galio components
import { Block, Text, Button as GaButton, theme } from "galio-framework";
// Argon themed components
import { argonTheme, tabs } from "../../constants/";
import { Button, Select, Icon, Input, Header, Switch } from "../../components/";

const { width } = Dimensions.get("screen");

class Account extends React.Component {
  render() {
    const { style } = this.props;
    return (
      <Block flex center>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
          {/* {this.renderButtons()}
          {this.renderText()}
          {this.renderInputs()}
          {this.renderSocial()}
          {this.renderSwitches()}
          {this.renderNavigation()}
          {this.renderTableCell()} */}
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
                  Abc Xyz
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
                  abcxyz@gmail.com
              </Text>
            </Text>
            <Block center>
              <Button
                  color="secondary"
                  textStyle={{ color: "black", fontSize: 12, fontWeight: "700" }}
                  style={styles.button}
                >
                  Change My Password
              </Button>
            </Block>
            <Block center>
            <Button color="default" style={styles.button}>
              Link Payment Wallet
            </Button>
          </Block>
            <Block center>
              <Button color="warning" style={styles.button}>
                Log Out
              </Button>
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
});

export default Account;