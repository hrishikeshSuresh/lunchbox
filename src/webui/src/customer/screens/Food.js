import React from "react";
import { ScrollView, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
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
const { width } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;
const cardWidth = width - theme.SIZES.BASE * 2;
class Food extends React.Component {
  constructor(props){
    super(props);
    this.state=
      {
        textValue:0,it:this.props.navigation.state.params.itempara,
          isModalVisible: false,
          rating:0,
          review:"",
          error:"",
          user:"",
          reviewlist:[],
      }
      AsyncStorage.getItem("user").then((value) => {
        this.setState({"user": value});
    })
    this.init()
    this.helper(this.props.navigation.state.params.itempara)
  }
  helper(item){
    console.log(item)
    var reviewlist=[]
    var obj=this
    if(withflask){
    const url = server_ip+'/api/v1/item/view_reviews?item='+item.item_id;
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
            // // console.warn(JSON.parse(response))
            response.json().then((res)=>{
              var myObject = eval('(' + res + ')');
              console.log(myObject)
              for (let i=0;i <myObject.length;i++){

                reviewlist.push({
                  rating: myObject[i]["rating"],
                  user:myObject[i]["username"],
                  review:myObject[i]["review"]
                })
              // // console.warn(String(myObject[i]["_id"]))

              }
              obj.setState({reviewlist:reviewlist})
              return reviewlist

            });
            // // console.warn(response)
          }
          else{
            this.setState({error : "Oops! Something isn't right"})
          }

        })
      } catch (error) {
        // // console.warn('Error:', error);
      }
    }
    return reviewlist
  }
  submit_review(obj){
    console.log("submit review")
    // // console.warn(obj.state);
   const url = server_ip+'/api/v1/item/add_review/'+obj.state.it.item_id;

    const data = {
      rating:obj.state.rating,
      review:obj.state.review};

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
          // var rl=obj.state.reviewlist
          // rl.push({
          //   rating:obj.state.rating,
          //   user:obj.state.user,
          //   review:obj.state.review
          // })
          // obj.setState({reviewlist:rl});
            obj.helper(obj.state.it)
            console.log("it was a success")
          // response.json().then((res)=>// console.warn(res));
        }
        else{
          this.setState({error : "Oops! Something isn't right"})
        }

      })
    } catch (error) {
      // console.warn('Error:', error);
    }
    obj.toggleModal()
  }
  init=async()=>{
    try{
        var cart = await AsyncStorage.getItem('cart');
        
        if (cart === null) {
          await AsyncStorage.setItem('cart', JSON.stringify({}));
          var cart = await AsyncStorage.getItem('cart');
        }
        cart = JSON.parse(cart)
        if(this.state.it.item_id in cart){
          console.log("proper")
          this.setState({textValue:cart[this.state.it.item_id].qty});
        }

      }
      catch(e){
        // console.warn(e)
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
        console.log("decrement",item)
        if (cart === null) {
          await AsyncStorage.setItem('cart', JSON.stringify({}));
          var cart = await AsyncStorage.getItem('cart');
        }
        var cart_cart = JSON.parse(cart)
        // flag=-1
        // for (i in cart_cart){
        //   if(i==item_id){
        //     cart_cart[i]["qty"]=this.state.textValue
        //     flag=1
        //   }
        // }
        var sav=item
        sav["qty"]=this.state.textValue
        // console.log("cart[item.item_id]=sav",item.item_id,"=",sav)
        cart_cart[item.item_id]=sav
        await AsyncStorage.setItem('cart', JSON.stringify(cart_cart));

      }
      catch(e){
        // console.warn(e)
      }
    }
  }
  increment= async () => {
    // await AsyncStorage.setItem('cart', JSON.stringify({}));
    // // console.warn(await AsyncStorage.getItem('cart'));

      let x=this.state.textValue+1;
      this.setState({
        textValue: x
      })
      try{
        var cart = await AsyncStorage.getItem('cart');
        console.log("step 1",cart)
        var item=this.state.it
        console.log("item",item)
        if (cart === null) {
          await AsyncStorage.setItem('cart', JSON.stringify({}));
          var cart = await AsyncStorage.getItem('cart');
        }
        var cart_cart = JSON.parse(cart)
        // flag=-1
        // for (i in cart_cart){
        //   if(i==item_id){
        //     cart_cart[i]["qty"]=this.state.textValue
        //     flag=1
        //   }
        // }
        var sav=item
        sav["qty"]=this.state.textValue
        // console.log("cart[item.item_id]=sav",item.item_id,"=",sav)
        console.log("cart_cart before",cart_cart)
        cart_cart[item.item_id]=sav
        console.log("cart_cart after",cart_cart)

        await AsyncStorage.setItem('cart', JSON.stringify(cart_cart));
        // console.warn("cart in increment:",JSON.parse(await AsyncStorage.getItem('cart')));
      }
      catch(e){
        // console.warn(e)
      }
    // // console.warn(this.state.textValue);

  }
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };  
  ratingCompleted(obj,rating) {
    // console.log("Rating is: " + rating)
    obj.change(rating,'rating')
  }
  change(text,field){
    if(field=='rating')
    this.setState({rating : text,})
    if(field=='review')
    this.setState({review : text,})

  }
  render_reviews(){
    var list=[]
    var a=this.state.reviewlist
    console.log(a)
    for( i in a){
      list.push(<ReviewCard data={a[i]} key={i}></ReviewCard>)
    }
    return list
  }
  render() {
    // // console.warn("width ",width);
    // // console.warn("theme.SIZES.BASE",theme.SIZES.BASE);
    // // console.warn("cardWidth",cardWidth);
    // // console.warn(this.props.navigation.state.params.itempara)

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
          <FoodCard item={this.state.it} cardtype="food" qty={0} full/>
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
        <Block row style={{flexDirection:'row',justifyContent:'space-around'}}>
          <Text bold size={16} style={styles.title}>
          {this.state.reviewlist.length} Reviews 
          </Text>
          <Button
          color="secondary"
          textStyle={{ color: "black", fontSize: 12, fontWeight: "700" }}
          style={styles.button}
          onPress={this.toggleModal}>
            Add Review
          </Button>
        </Block>
        <Modal isVisible={this.state.isModalVisible} animationType="fade" >
              <Block middle style={{backgroundColor:'white',paddingHorizontal:10,paddingVertical:10,borderRadius:2}}>
              <Rating
                  type='custom'
                  minValue={1}
                  defaultRating={5}
                  onFinishRating={(rating)=>this.ratingCompleted(this,rating)} 
                  style={{ paddingVertical: 10 }}
                />
                <TextInput
                        multiline
                        numberOfLines={5}
                        placeholder="Add Your Review"
                        style={{borderColor:"black",borderRadius:1}}
                        onChangeText={(text)=>this.change(text,'review')} 
                      />
              <Button title="Hide modal3" onPress={() => this.submit_review(this)} color="success" style={styles.changepass}>Submit Review</Button>
              <Button title="Hide modal4" onPress={this.toggleModal} color="default"  style={styles.changepass}>Close</Button>
                
              </Block>
        </Modal>
        {/* <ReviewCard data={rev[0]}></ReviewCard> */}
        {this.render_reviews()}
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
  }
});
export default Food;