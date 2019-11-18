import React from "react";
import {ScrollView, StyleSheet, Image, TouchableWithoutFeedback, ImageBackground, Dimensions, Text, View } from "react-native";
//galio
import { Block, Text, theme } from "galio-framework";
//argon
import { articles, Images, argonTheme } from "../../constants/";
import { Card } from "../../components/";
import { Accordion, Block } from 'galio-framework';


class Orders extends React.Component {
    state = {
        myState: 'This view is for all the orders' }
   render() {
      return (
         <View>
            <Text> {this.state.myState}</Text>
         </View>

      );
   }
}
export default Orders;
