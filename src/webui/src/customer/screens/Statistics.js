import React from "react";
import { ScrollView, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
// Galio components
import { Block, Text, Button as GaButton, theme } from "galio-framework";
// Argon themed components
import { articles,argonTheme, tabs } from "../../constants/";
import { Button, Select, Icon, Input, Header, Switch } from "../../components/";
import {PreCard } from '../extras';
import {AsyncStorage} from 'react-native';

const { width } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;
const cardWidth = width - theme.SIZES.BASE * 2;
class Statistics extends React.Component {
  constructor(props){
    super(props);
    this.state={orderlist:[]}
    this.get_values()
  }
  get_values= async () => {
    await this.componentDidMount(); 
     //GET API
     var orderlist=[]
    var obj=this
    const url = server_ip+'/api/v1/customer/previous_orders';
    // obj.setState({orderlist:
    //    { "Order ID1": 
    //     {
    //        "uid": "<User ID>", 
    //        "eid": "<Establishment ID>",
    //        "e_name":"<Establishment name>",
    //        "e_type": "Canteen",
    //        "items": ["1","2"], 
    //        "amount": 5000,
    //        "currency" : "INR",
    //        "payment_option": "Wallet",
    //        "location":["<latitude>","<longitude>"],
    //        "status":1,
    //        "date":"date",
    //        "review":"blah",
    //        "rating":5,
    //        "token":100
    //      }
    //    }
    //     })
     
      try{
      response=fetch(url, {
          method: 'GET', 
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          if(response.status==200){
            response.json().then((res)=>{
              var myObject = eval('(' + res + ')');
              obj.setState({orderlist:myObject})
              return orderlist

            });
            // console.warn(response)
          }
          else{
            // this.setState({error : "Oops! Something isn't right"})
          }

        })
      } catch (error) {
        // console.warn('Error:', error);
      }
    return orderlist
  }
  renderhelper=()=>{
    var block= []
    for(i in this.state.orderlist){
      // console.warn(this.state.orderlist[i],i)
      block.push(
        <Block flex key={i}>
          <PreCard item={this.state.orderlist[i]} id={i} horizontal />
        </Block>
        )
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
export default Statistics;