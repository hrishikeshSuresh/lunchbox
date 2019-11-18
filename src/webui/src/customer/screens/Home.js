import React from 'react';
import { StyleSheet, Dimensions, ScrollView ,Picker,TouchableOpacity,BackHandler} from 'react-native';
import { Block, theme } from 'galio-framework';

import { FoodCard } from '../extras';
import articles from '../../constants/articles';
import tabs from '../../constants/tabs';
import Input from '../../components/Input';
import Icon from '../../components/Icon';
import argonTheme from '../../constants/Theme';

const { width } = Dimensions.get('screen');
// var itemlist=[]
class Home extends React.Component {
  helper= async ()=>{
    await this.componentDidMount(); 
    var obj=this
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
              // for (let i=0;i <myObject.length;i++){
              //     // console.log(obj.get_item(myObject[i]))
              //     obj.get_item(obj,myObject[i])
              //     // itemlist.push(obj.state.item)
              //     console.warn("outer",obj.state.item)
              //     // itemlist.push(obj.get_item(obj,myObject[i]))

              //   }
              var m=[{
                "item_id": "Item ID",
                "item_name":"<Item Name>1",
                "eid":"<Establishment ID>",
                "e_name":"<Establishment Name>",
                "e_type":"Canteen",
                "item_price":10,
                "currency":"INR",
                "img":"img",
                "rating":5,
                "status":1
                },{
                  "item_id": "Item ID2",
                  "item_name":"<Item Name>2",
                  "eid":"<Establishment ID>",
                  "e_name":"<Establishment Name>",
                  "e_type":"Canteen",
                  "item_price":10,
                  "currency":"INR",
                  "img":"img",
                  "rating":5,
                  "status":1
                  },
                  {
                    "item_id": "Item ID3",
                    "item_name":"<Item Name>3",
                    "eid":"<Establishment ID>2",
                    "e_name":"<Establishment Name>",
                    "e_type":"Canteen",
                    "item_price":10,
                    "currency":"INR",
                    "img":"img",
                    "rating":5,
                    "status":1
                    },{
                      "item_id": "Item ID4",
                      "item_name":"<Item Name>4",
                      "eid":"<Establishment ID>2",
                      "e_name":"<Establishment Name>",
                      "e_type":"Canteen",
                      "item_price":10,
                      "currency":"INR",
                      "img":"img",
                      "rating":5,
                      "status":1
                      }]
                obj.setState({itemlist:m})
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
  // get_item(obj,item_ids){
  //   var itemlist=[]
  //   for (i in item_ids){
  //     obj.setState({item:null})
  //   const url2 = server_ip+'/api/v1/item/'+item_ids[i];
  //   try{
  //     response2=fetch(url2, {
  //         method: 'GET', 
  //         credentials: 'include',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //       })
  //       .then((response2) => {
  //         if(response2.status==200){
  //           response2.json().then((res2)=>{
  //             item = eval('(' + res2 + ')');
  //             obj.setState({item:item})
  //           });
  //           var it=obj.state.item
  //           console.log(it)
  //           if(it!=null){
  //             itemlist.push(it)
  //             console.warn(itemlist.length)
  //           }
  //         }
  //         else{
  //           this.setState({error : "Oops! Something isn't right"})
  //         }
  //         })
  //         obj.setState({itemlist:itemlist})
  //         console.warn(obj.state.itemlist)
  //       }
  //       catch (error) {
  //         console.warn('Error:', error);
  //       }
  //     }
  //     // console.log("this ",obj.state.itemlist)
  //     // for (i in obj.state.itemlist){
  //     //   print(obj.state.itemlist[i])
  //     // }
      
  //   return itemlist
  // }
  search_helper(){
    var itemlist=[]
    var obj=this
    const url = server_ip+'/api/v1/search_food?item_name='+obj.state.search;
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
              var m=[{
                "item_id": "Item ID",
                "item_name":"<Item Name>",
                "eid":"<Establishment ID>",
                "e_name":"<Establishment Name>",
                "e_type":"Canteen",
                "item_price":10,
                "currency":"INR",
                "img":"img",
                "rating":5,
                "status":1
                }]
                obj.setState({itemlist:m})
                console.warn("list",obj.state.itemlist)
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

  filter_helper(filter){
    var itemlist=[]
    var obj=this
    // console.warn("in filter");
    if(filter!="No Filter"){
      const url = server_ip+'/api/v1/search_tag/'+filter;

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
                var m=[{
                  "item_id": "Item ID",
                  "item_name":"<Item Name>",
                  "eid":"<Establishment ID>",
                  "e_name":"<Establishment Name>",
                  "e_type":"Canteen",
                  "item_price":10,
                  "currency":"INR",
                  "img":"img",
                  "rating":5,
                  "status":1
                  }]
                  obj.setState({itemlist:m})
                  console.warn("list",obj.state.itemlist)
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
    else{
      this.helper()
    }
    return itemlist
  }
  // componentDidMount() {
  //   this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
  //     this.helper(); // works best when the goBack is async
  //     return true;
  //   });
  // }

  // componentWillUnmount() {
  //   this.backHandler.remove();
  // }
  constructor(props){
    super(props);
    this.state={itemlist:[],search:"",filter:"No Filter",item:null}
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
  renderpicker=()=>{
    var final=[]
    let i=0
    var block=[]
    block.push(<Picker.Item label="No Filter" value="No Filter" key="No Filter"/>)
    while(i<tabs.categories.length){
      block.push(<Picker.Item label={tabs.categories[i].title} value={tabs.categories[i].id} key={tabs.categories[i].id} />)
      i++;
    }
              // 
              // 
        final.push(
      <Picker style={{flexDirection:'row',justifyContent:'flex-end' }}
              selectedValue={this.state.filter}
              style={{height: 50, width: 150}}
              onValueChange={(itemValue, itemIndex) =>
                {this.setState({ filter: itemValue });this.filter_helper(itemValue);}
               
              }
              key="nothing">
        {block}
        </Picker>
    )
    return final
  }
  change(text,field){
    if(field=='search')
    this.setState({search : text,})
    // console.warn(this.state);
  }
  renderArticles = () => {
      return (
        <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}>
          <Block flex row>
            <Input
              right
              color="black"
              style={styles.search}
              placeholder="What are you looking for?"
              placeholderTextColor={'#8898AA'}
              onChangeText={(text)=>this.change(text,'search')}
              value={this.state.search}
              iconContent={<TouchableOpacity onPress={() => this.search_helper()}><Icon size={16} color={theme.COLORS.MUTED} name="search-zoom-in" family="ArgonExtra" /></TouchableOpacity>}
            />
            <TouchableOpacity>
    <Icon name="md-close" />
  </TouchableOpacity>
            {this.renderpicker()}
        </Block>
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

  search: {
    height: 48,
    width: width - 150,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: argonTheme.COLORS.BORDER
  },
});

export default Home;
