import React from "react";
import { ScrollView, StyleSheet, Dimensions, TouchableOpacity,PermissionsAndroid, Alert, Platform } from "react-native";
// Galio components
import { Block, Text, Button as GaButton, theme } from "galio-framework";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Modal from "react-native-modal";

// Argon themed components
import { articles,argonTheme, tabs } from "../../constants/";
import { Button, Select, Icon, Input, Header, Switch } from "../../components/";
import {CartCard } from '../extras';
import {AsyncStorage} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
export async function request_device_location_runtime_permission() {
 
  const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
  if (status === 'granted') {
    return Location.getCurrentPositionAsync({ enableHighAccuracy: true });
  } else {
    throw new Error('Location permission not granted');
  }
}
const { width } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;
const cardWidth = width - theme.SIZES.BASE * 2;
class Cart extends React.Component {
  constructor(props){
    super(props);
    this.state={
      textValue:0,
      total:0,
      items:[],
      pay_mode:'cash',
      latitude : 0,
      longitude : 0,
      error:null,
      isModalVisible:false,
      account:{}
    }
    this.get_values()
    
  }
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }; 
  get_values= async () => {
      try{
        var cart = await AsyncStorage.getItem('cart');
        // // console.warn("here")
        // console.warn("cart : ",cart)
        if (cart === null) {
          await AsyncStorage.setItem('cart', JSON.stringify({}));
          var cart = await AsyncStorage.getItem('cart');
        }
        cart = JSON.parse(cart)
        // // console.log("cart : ",cart)
        var arr=[]
        var total=0
        for (i in cart){
          if(cart[i]!==null)
          {
            if(cart[i]["qty"]!=0)
            {
              // // console.warn(cart[i])
              
                arr.push(cart[i])
                // // console.warn(cart[i]['cta'],cart[i].cta)
                total=total+(cart[i]["item_price"])*cart[i]["qty"]
            }
          }
        }
        this.setState({items:arr,total:total})
        // // console.warn(this.state)
      }
      catch(e){
        // console.log("blah",e)
      }
      try{
        var url= server_ip+'/api/v1/account_details';
        response=fetch(url, {
          method: 'GET', 
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          if(response.status==200){
            // // console.warn(JSON.parse(response))
            response.json().then((res)=>{
              var myObject = eval('(' + res + ')');
              // for (let i=0;i <myObject.length;i++){
              //     // // console.log(obj.get_item(myObject[i]))
              //     obj.get_item(obj,myObject[i])
              //     // itemlist.push(obj.state.item)
              //     // console.warn("outer",obj.state.item)
              //     // itemlist.push(obj.get_item(obj,myObject[i]))

              //   }
              // var m={
              //     "username":"blah",
              //     "name":"blah",
              //     "wallet":200
              //   }
                this.setState({account:myObject})
                // console.warn("account",this.state.account)
            });
        }
        else{

        }
      })
    }
    
      catch(e){
        // console.log("blah",e)
      }
  }
  renderhelper=()=>{
    // console.log("cartcard",this.state.items)
    var block= []
    let i=0
    while(i<this.state.items.length){
      block.push(
        <Block flex key={i}>
          <CartCard item={this.state.items[i]} horizontal />
        </Block>
        )
      i++
    }
    // // console.warn("helper",block)
    return block
  }
  place_order= async (obj)=>{
    // alert("Order Placed");
    if(Platform.OS === 'android')
    {
      await request_device_location_runtime_permission();
    }
 
    obj.getLongLat = navigator.geolocation.watchPosition(
      (position) => {
        // // console.warn("state:",obj.state)
        obj.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
        // console.warn("state after:",obj.state)
        // // console.log("state",obj.state)
        var request_data={}
        request_data["location"]=[obj.state.latitude,obj.state.longitude]
        request_data["payment_option"]=obj.state.pay_mode
        request_data["currency"]="INR"
        request_data["items"]={}
        request_data["amount"]=obj.state.total
        var temp={}
        var actual=obj.state.items
        // console.log("cart:",actual)
        for(it in actual){
          // console.log("in")
          if(actual[it].eid in temp){
            // console.log("present")
          }
          else{
            // console.log("not there")
            temp[actual[it].eid]={}
          }
          var element=actual[it].item_id
          temp[actual[it].eid][element]=actual[it].qty
        }
        request_data["items"]=temp
        // console.warn("request ",JSON.stringify(request_data))

        const url = server_ip+'/api/v1/place_order';
      try{
      response=fetch(url, {
          method: 'POST', 
          credentials: 'include',
          body: JSON.stringify(request_data), 
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          if(response.status==201){
            //if 200
            // obj.setState({items:[],total:0});
            // await AsyncStorage.setItem('cart', JSON.stringify({})); //IMPORTANT
            // navigate to ??
            obj.setState({items:[],total:0});
            AsyncStorage.setItem('cart', JSON.stringify({})); //IMPORTANT
            obj.toggleModal()
            obj.props.navigation.navigate('Statistics')
            // response.json().then((res)=>console.warn(res));
          }
          else if(response.status==402){
            obj.toggleModal()
            obj.setState({error : "Insufficient Balance"})
          }
          else{
            obj.toggleModal()
            // console.warn("error")
            // obj.setState({items:[],total:0});
            // AsyncStorage.setItem('cart', JSON.stringify({}));
            obj.setState({error : "Oops! Something isn't right"})
          }
          
        })
      } catch (error) {
        console.warn('Error:', error);
      }

        // console.log("temp:",temp)
      },
      (error) => obj.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 2000, maximumAge: 100, distanceFilter: 10 },
    );
    
    
  }
  componentWillUnmount() {
 
    navigator.geolocation.clearWatch(this.getLongLat);
 
  }
  get_details(){
    return 100;
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
          <RadioForm
              radio_props={[
                {label: 'Cash     ', value: 'cash' },
                {label: 'Wallet ', value: 'wallet' }
              ]}

              formHorizontal={true}
              initial={this.state.pay_mode}
              
              animation={false}
              onPress={(value) => {this.setState({pay_mode:value})}}
              style={{marginBottom:10}}
            />
            <Text size={14} style={{paddingBottom:20}}>(Current Balance in your Wallet : {this.state.account.wallet})</Text>
            <Button color="success" style={styles.button} onPress={this.toggleModal}>
              PLACE ORDER
            </Button>
          </Block>
          <Block center>
 
        <Text style={styles.text}> {this.state.error}</Text>
 
      </Block>
      <Modal isVisible={this.state.isModalVisible} animationType="fade">
                <Button title="Hide modal" onPress={() => this.place_order(this)} color="success" style={styles.changepass}>Confirm Order</Button>
                <Button title="Hide modal2" onPress={this.toggleModal} color="default">Go Back</Button>
              
      </Modal>
      </ScrollView>
    );
  }
}

// 7ed4a2
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

  },
  changepass:{
    marginBottom:15,
    marginTop:5
  }
});
export default Cart;