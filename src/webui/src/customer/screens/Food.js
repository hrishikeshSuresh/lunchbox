import React from "react";
import { ScrollView, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
// Galio components
import { Block, Text, Button as GaButton, theme } from "galio-framework";
// Argon themed components
import { articles,argonTheme, tabs } from "../../constants/";
import { Button, Select, Icon, Input, Header, Switch } from "../../components/";
import { FoodCard,ReviewCard } from '../extras';
import {AsyncStorage} from 'react-native';
const { width } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;
const cardWidth = width - theme.SIZES.BASE * 2;
class Food extends React.Component {
  constructor(props){
    super(props);
    this.state=
      {
        textValue:0,it:this.props.navigation.state.params.itempara
      }
    this.init()
  }
  init=async()=>{
    try{
        var cart = await AsyncStorage.getItem('cart');
        
        if (cart === null) {
          await AsyncStorage.setItem('cart', JSON.stringify([]));
        }
        cart = JSON.parse(cart)
        if(this.state.it.id in cart){
          console.warn("proper")
          this.setState({textValue:cart[this.state.it.id].qty});
        }

      }
      catch(e){
        console.warn(e)
      }
  }
  decrement= async () => {
    if(this.state.textValue!=0){
      let x=this.state.textValue-1;
      this.setState({
        textValue: x
      })
      try{
        var cart = await AsyncStorage.getItem('cart');
        item=this.state.it
        if (cart === null) {
          await AsyncStorage.setItem('cart', JSON.stringify([]));
        }
        cart = JSON.parse(cart)
        var sav=item
        sav["qty"]=this.state.textValue
        cart[item.id]=sav
        console.warn(cart)
        await AsyncStorage.setItem('cart', JSON.stringify(cart));

      }
      catch(e){
        console.warn(e)
      }
    }
  }
  increment= async () => {
      let x=this.state.textValue+1;
      this.setState({
        textValue: x
      })
      try{
        var cart = await AsyncStorage.getItem('cart');
        item=this.state.it
        if (cart === null) {
          await AsyncStorage.setItem('cart', JSON.stringify([]));
        }
        cart = JSON.parse(cart)
        var sav=item
        sav["qty"]=this.state.textValue
        cart[item.id]=sav
        console.warn(cart)
        await AsyncStorage.setItem('cart', JSON.stringify(cart));

      }
      catch(e){
        console.warn(e)
      }
    // console.warn(this.state.textValue);

  }
  render() {
    // console.warn("width ",width);
    // console.warn("theme.SIZES.BASE",theme.SIZES.BASE);
    // console.warn("cardWidth",cardWidth);
    // console.warn(this.props.navigation.state.params.itempara)

    // const it=articles[0]
    const rev=[{
      rating:5,
      user:"Adam",
      review: "This was great"
    },
    {
      rating:3.5,
      user:"Eve",
      review: "Too many Onions"
    },
    {
      rating:1,
      user:"Someone",
      review: "Not stomach Filling :("
    }];
    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <Block flex>
          <FoodCard item={this.state.it} full/>
        </Block>
        
        <Block row style={{flexDirection:'row',justifyContent:'flex-end',marginRight:30}}>
          <Text bold size={16} style={styles.title}>
            Add to Cart : 
          </Text>
          <Block row style={styles.bor}>
            <Button color="default" style={styles.optionsButton} onPress={this.decrement}>&#x2014; </Button>
            <Text style={styles.number}>{this.state.textValue}</Text>
            <Button color="default" style={styles.optionsButton} onPress={this.increment}>+</Button>
          </Block>
        </Block>
        <Text bold size={16} style={styles.title}>
         3 Reviews 
        </Text>
        <ReviewCard data={rev[0]}></ReviewCard>
        <ReviewCard data={rev[1]}></ReviewCard>
        <ReviewCard data={rev[2]}></ReviewCard>
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
  title: {
    paddingBottom: theme.SIZES.BASE,
    paddingLeft: theme.SIZES.BASE * 2,
    paddingRight: 10,
    marginTop: 25,
    color: argonTheme.COLORS.HEADER
  },
  group: {
    paddingTop: theme.SIZES.BASE
  },
  albumThumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  },
  category: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE / 2,
    borderWidth: 0
  },
  categoryTitle: {
    height: "100%",
    paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  imageBlock: {
    overflow: "hidden",
    borderRadius: 4
  },
  productItem: {
    width: cardWidth - theme.SIZES.BASE * 2,
    marginHorizontal: theme.SIZES.BASE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 10,
    shadowOpacity: 0.2
  },
  productImage: {
    width: cardWidth - theme.SIZES.BASE,
    height: cardWidth - theme.SIZES.BASE,
    borderRadius: 3
  },
  productPrice: {
    paddingTop: theme.SIZES.BASE,
    paddingBottom: theme.SIZES.BASE / 2
  },
  productDescription: {
    paddingTop: theme.SIZES.BASE
    // paddingBottom: theme.SIZES.BASE * 2,
  },
  optionsButton: {
    width: "auto",
    height: 34,
    // paddingHorizontal: theme.SIZES.BASE,
    marginTop: 22,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontWeight:'bold'
  },
  number:{
    marginTop: 22,
    paddingHorizontal: 10,
    paddingTop: 5,
    marginBottom: 7,
    fontWeight:'bold',
    borderWidth:1,
    borderColor:'black',
    borderRadius:1
  },
  bor:{

  }
});
export default Food;