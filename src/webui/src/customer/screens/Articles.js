import React from 'react';
import { StyleSheet, Dimensions, ScrollView ,TouchableOpacity} from 'react-native';
import { Block, theme } from 'galio-framework';

import { FoodCard } from '../extras';

const { width } = Dimensions.get('screen');
// var itemlist=[]
class Articles extends React.Component {
  helper(){
    var obj=this
    var itemlist=[]
    const url = server_ip+'/api/v1/recommendation';

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
            // console.warn(JSON.parse(response))
            response.json().then((res)=>{
              var myObject = eval('(' + res + ')');
              // for (let i=0;i <myObject.length;i++){
              //     // console.log(obj.get_item(myObject[i]))
              //     obj.get_item(obj,myObject[i])
              //     // itemlist.push(obj.state.item)
              //     console.warn("outer",obj.state.item)
              //     // itemlist.push(obj.get_item(obj,myObject[i]))

              //   }
              // var m=[{
              //   "item_id": "Item ID",
              //   "item_name":"<Item Name>1",
              //   "eid":"<Establishment ID>",
              //   "e_name":"<Establishment Name>",
              //   "e_type":"Canteen",
              //   "item_price":10,
              //   "currency":"INR",
              //   "img":"img",
              //   "rating":5,
              //   "status":1
              //   },{
              //     "item_id": "Item ID2",
              //     "item_name":"<Item Name>2",
              //     "eid":"<Establishment ID>",
              //     "e_name":"<Establishment Name>",
              //     "e_type":"Canteen",
              //     "item_price":10,
              //     "currency":"INR",
              //     "img":"img",
              //     "rating":5,
              //     "status":1
              //     },
              //     {
              //       "item_id": "Item ID3",
              //       "item_name":"<Item Name>3",
              //       "eid":"<Establishment ID>2",
              //       "e_name":"<Establishment Name>",
              //       "e_type":"Canteen",
              //       "item_price":10,
              //       "currency":"INR",
              //       "img":"img",
              //       "rating":5,
              //       "status":1
              //       },{
              //         "item_id": "Item ID4",
              //         "item_name":"<Item Name>4",
              //         "eid":"<Establishment ID>2",
              //         "e_name":"<Establishment Name>",
              //         "e_type":"Canteen",
              //         "item_price":10,
              //         "currency":"INR",
              //         "img":"img",
              //         "rating":5,
              //         "status":1
              //         }]
              // obj.setState({itemlist:m})
              // console.log(myObject)
              obj.setState({itemlist:myObject})

                // console.warn("list",obj.state.itemlist)
            });
          }
          else{
            // this.setState({error : "Oops! Something isn't right"})
          }

        })
      } catch (error) {
        // console.warn('Error:', error);
      }
    
  }
 
  constructor(props){
    super(props);
    this.state={itemlist:[],item:{}}
    this.helper()
  }
  
  renderhelper=()=>{
    var blockfin= []
    let i=0
    while(i<this.state.itemlist.length){

      var block=[]
      while(i<this.state.itemlist.length && !(this.state.itemlist[i].status)){i++;}
      if(i<this.state.itemlist.length){
      block.push(
        <FoodCard item={this.state.itemlist[i]} qty={0} key={1} cardtype="food" style={{ marginRight: theme.SIZES.BASE }} />
        )
        i++;
      }
      while(i<this.state.itemlist.length && !(this.state.itemlist[i].status)){i++;}
      if(i<this.state.itemlist.length){
        block.push(
        <FoodCard item={this.state.itemlist[i]} qty={0} key={2} cardtype="food"/>
        )
        i++
      }
      blockfin.push(
        <Block  flex row key={i}>
          {block}
        </Block>
      )
      while(i<this.state.itemlist.length && !(this.state.itemlist[i].status)){i++;}
    }
    // console.warn("helper",block)
    return blockfin
  }
  
  renderArticles = () => {
      return (
        <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}>
        <Block flex>
        {this.renderhelper()}
        </Block>
      </ScrollView>
      )

  }

  render() {
    return (
      <Block flex center style={styles.home}>

        
        {this.renderArticles()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,    
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },

 
});

export default Articles;
