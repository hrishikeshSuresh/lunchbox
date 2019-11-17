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
    if(withflask){
    const url = server_ip+'/api/v1/menu';

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
              for (let i=0;i <myObject.length;i++){
                  console.log(obj.get_item(myObject[i]))
                  itemlist.push(obj.get_item(myObject[i]))

                }
                obj.setState({itemlist:itemlist})
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
  constructor(props){
    super(props);
    this.state={itemlist:[]}
    this.helper()
  }
  
  renderhelper=()=>{
    var blockfin= []
    let i=0
    while(i<this.state.itemlist.length){
      var block=[]
      block.push(
        <FoodCard item={this.state.itemlist[i]} cardtype="food" qty={0}  key={1} style={{ marginRight: theme.SIZES.BASE }} />
        )
      i++
      if(i<this.state.itemlist.length){
        block.push(
        <FoodCard item={this.state.itemlist[i]}  cardtype="food" qty={0}  key={2}/>
        )
      }
      blockfin.push(
        <Block  flex row key={i}>
          {block}
        </Block>
      )
      i++
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
