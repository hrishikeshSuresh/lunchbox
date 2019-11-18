import React from "react";
import { ScrollView, StyleSheet, Dimensions, TouchableOpacity ,View} from "react-native";
// Galio components
import { Block, Text, Button as GaButton, theme } from "galio-framework";
// Argon themed components
import { articles,argonTheme, tabs } from "../../constants/";
import { Button, Select, Icon, Input, Header, Switch } from "../../components/";
import { FoodCard,ReviewCard } from '../extras';
import Modal from "react-native-modal";
import {AsyncStorage} from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { TextInput } from "react-native-gesture-handler";
import StepIndicator from 'react-native-step-indicator';
const { width } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;
const cardWidth = width - theme.SIZES.BASE * 2;
const labels_vendor = ["Yet to confirm","Confirmed","Prepared","Picked Up"];
const labels_caterer = ["Yet to confirm","Confirmed","Prepared","Picked Up","Order delivered"];
// const labels_caterer=["blah"]
// const labels_vendor=["blah"]
const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize:30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#fe7013',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#fe7013',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#fe7013',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#fe7013',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#fe7013',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#fe7013'
}
class Food extends React.Component {
  constructor(props){
    super(props);
    this.state=
      {
        item:this.props.navigation.state.params.itempara,
        final_item_list:{},
        id:this.props.navigation.state.params.id,
        status:this.props.navigation.state.params.itempara.status,
          error:"",
          user:"",
          itemlist:[]
      }
      AsyncStorage.getItem("user").then((value) => {
        this.setState({"user": value});
    })
    this.helper(this.state.item.items)
  }
  helper(items){
    var obj=this
    var item_list=[]
    for (i in items){
      item_list.push(i)
    }
    const url = server_ip+'/api/v1/items_list';
      const data = { "items":item_list };
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
            response.json().then((res)=>{
              var myObject = eval('(' + res + ')');
                obj.setState({final_item_list:myObject})
            });
          }

        })
      } catch (error) {
        // console.warn('Error:', error);
      }

  }
  componentDidMount() {
    this._interval = setInterval(() => {
      const url = server_ip+'/api/v1/order/status';
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
                this.setState({status:myObject["status"]})
              })
            }
            else{
              // this.setState({error : "Oops! Something isn't right"})
            }

          })
        } catch (error) {
          // console.warn('Error:', error);
        }
    }, 5000);
  }
  
  componentWillUnmount() {
    clearInterval(this._interval);
  }
  render_items(){
    var list=[]
    items=this.state.final_item_list
    qt_list=this.state.item.items
    for (i in items){
      list.push(
        <FoodCard item={ items[i]} qty={qt_list[i]} key={i} cardtype="prev" style={{ marginRight: theme.SIZES.BASE }} />
        )
    }
    return list
  }

  get_item(item_id){
    return {
        "item_id": "Item ID",
        "item_name":"<Item Name>",
        "eid":"<Establishment ID>",
        "e_name":"<Establishment Name>",
        "e_type":"Canteen",
        "item_price":10,
        "currency":"INR",
        "img":"img",
        "rating":5
        }
    const url2 = server_ip+'/api/v1/item/'+item_id;
    var item={}
    try{
      response2=fetch(url2, {
          method: 'GET', 
          credentials: 'include',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response2) => {
          if(response2.status==200){
            response2.json().then((res2)=>{
              item = eval('(' + res2 + ')');
              return item
            });
          }
          else{
            this.setState({error : "Oops! Something isn't right"})
          }
          })
          

        }
        catch (error) {
          // console.warn('Error:', error);
        }
    return item
  }
  render() {
    // { "Order ID1": 
    //     {
    //        "uid": "<User ID>", 
    //        "eid": "<Establishment ID>",
    //        "e_name":"<Establishment name>",
    //        "e_type": "Canteen",
    //        "items": {"1":1,"2":2}, 
    //        "amount": 5000,
    //        "currency" : "INR",
    //        "payment_option": "Wallet",
    //        "location":["<latitude>","<longitude>"],
    //        "status":1,
    //        "date":"date",
    //        "review":"blah",
    //        "rating":5,
    //      }
    //    }
    const trackable = !((this.state.item.e_type=='Canteen' && this.state.status==4) || (this.state.item.e_type=='Caterer' && this.state.status==5))
    const type=(this.state.item.e_type=="Canteen")
    // console.warn(trackable,type)
    return (
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <Block flex style={styles.cardDescription} >
            <Block flex >
            <Text size={18} style={styles.cardTitle}>Order Id            : {this.state.id}</Text>
            <Text size={18}>From                 : {this.state.item.e_name}</Text>
            <Text size={18}>On                     : {this.state.item.timestamp}</Text>
            <Text size={18}>Payment Mode : {this.state.item.payment_option}</Text>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',paddingTop:10}}>
            <Text size={18}   color={argonTheme.COLORS.ACTIVE} bold style={{}}>Amount Paid    : {this.state.item.currency}&nbsp;{this.state.item.amount}</Text>
            
            </View>
            </Block>
            {trackable?<>
              <Text bold size={16} style={styles.title}>
          Order Status : 
          </Text>
        {type?
          <><StepIndicator
          customStyles={customStyles}
          currentPosition={this.state.status-1}
          labels={labels_vendor}
          stepCount={4}
          />
          
          <Text bold size={14} style={styles.title}>
          Token Number : {this.state.item.token}
          </Text>
          </>
          :
          <StepIndicator
              customStyles={customStyles}
              currentPosition={this.state.status-1}
              labels={labels_caterer}
              stepCount={5}
          />
        }
        </>
        :
        <><Text size={18}>
          Order Status      : Completed
        </Text></>
        }
        <Text bold size={14} style={styles.title}>
          Items Ordered : 
          </Text>
            {this.render_items()}
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
  bor:{

  },
  button: {
    marginTop: theme.SIZES.BASE/2,
    marginBottom: theme.SIZES.BASE/2,
    width: 150
  },
  changepass:{
    marginHorizontal:10,
    marginVertical:10,
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: 10,
    width: 200,
  },
  cardTitle: {
    flex: 1,
    flexWrap: 'wrap',
    paddingBottom: 0
  },
  cardDescription: {
    padding: theme.SIZES.BASE / 2
  },
});
export default Food;