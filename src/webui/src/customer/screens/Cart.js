import React from "react";
import { ScrollView, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
// Galio components
import { Block, Text, Button as GaButton, theme } from "galio-framework";
// Argon themed components
import { articles,argonTheme, tabs } from "../../constants/";
import { Button, Select, Icon, Input, Header, Switch } from "../../components/";
import {CartCard } from '../extras';
import {AsyncStorage} from 'react-native';

const { width } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;
const cardWidth = width - theme.SIZES.BASE * 2;
class Cart extends React.Component {
  constructor(props){
    super(props);
    this.state={textValue:0,total:0,items:[]}
    this.get_values()
  }
  get_values= async () => {
      try{
        var cart = await AsyncStorage.getItem('cart');
        // console.warn("here")
        if (cart === null) {
          await AsyncStorage.setItem('cart', JSON.stringify([]));
        }
        cart = JSON.parse(cart)
        // console.log("cart : ",cart)
        var arr=[]
        var total=0
        for (i in cart){
          if(cart[i]!==null)
          {
            if(cart[i]["qty"]!=0)
            {
              // console.warn(cart[i])
              
                arr.push(cart[i])
                // console.warn(cart[i]['cta'],cart[i].cta)
                total=total+(cart[i]["cta"].split(' ')[1])*cart[i]["qty"]
            }
          }
        }
        this.setState({items:arr,total:total})
        // console.warn(this.state)
      }
      catch(e){
        console.warn("blah",e)
      }
  }
  renderhelper=()=>{
    var block= []
    let i=0
    while(i<this.state.items.length){
      block.push(
        <Block flex>
          <CartCard item={this.state.items[i]} horizontal />
        </Block>
        )
      i++
    }
    // console.warn("helper",block)
    return block
  }
  render() {
    // this.get_values()
    // const navigation=this.props
    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {this.renderhelper()}
        <Block style={{flexDirection:'row',justifyContent:'flex-end',marginHorizontal:20 }}>
        <Text
            p
            style={{ marginBottom: theme.SIZES.BASE / 2}}
            color={argonTheme.COLORS.DEFAULT}
          >
            Total : Rs. {this.state.total}
          </Text>
          </Block>
          <Block center>
            <Button color="success" style={styles.button} onPress={async() => {alert("Order Placed");this.setState({items:[],total:0});await AsyncStorage.setItem('cart', JSON.stringify([]));
}}>
              PLACE ORDER
            </Button>
          </Block>
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
  button: {
    marginBottom: theme.SIZES.BASE,
    width: width - theme.SIZES.BASE * 2
  },
  bor:{

  }
});
export default Cart;