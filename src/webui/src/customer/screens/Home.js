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
  helper(){
    var itemlist=[]
    var obj=this
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

                itemlist.push({
                  from: myObject[i]["establishment_name"],
                  title:myObject[i]["item_name"],
                  cta:myObject[i]["currency"]+" "+myObject[i]["item_price"],
                  image:"data:image/jpg;base64,"+myObject[i]["img"],
                  rating:4,
                  id:i
                })
              // console.warn(String(myObject[i]["_id"]))

              }
              obj.setState({itemlist:itemlist})
              return itemlist

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
    }
    return itemlist
  }
  search_helper(){
    var itemlist=[]
    var obj=this
    if(withflask){
    const url = server_ip+'/api/v1/'+obj.state.search+'/search_food';

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

                itemlist.push({
                  from: myObject[i]["establishment_name"],
                  title:myObject[i]["item_name"],
                  cta:myObject[i]["currency"]+" "+myObject[i]["item_price"],
                  image:"data:image/jpg;base64,"+myObject[i]["img"],
                  rating:4,
                  id:i
                })
              // console.warn(String(myObject[i]["_id"]))

              }
              obj.setState({itemlist:itemlist})
              // console.warn(this.state.itemlist)
              return itemlist

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
    }
    return itemlist
  }
  filter_helper(filter){
    var itemlist=[]
    var obj=this
    // console.warn("in filter");
    if(filter!="No Filter"){
    if(withflask){
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
              for (let i=0;i <myObject.length;i++){

                itemlist.push({
                  from: myObject[i]["establishment_name"],
                  title:myObject[i]["item_name"],
                  cta:myObject[i]["currency"]+" "+myObject[i]["item_price"],
                  image:"data:image/jpg;base64,"+myObject[i]["img"],
                  rating:4,
                  id:i
                })
              // console.warn(String(myObject[i]["_id"]))

              }
              obj.setState({itemlist:itemlist})
              // console.warn(this.state.itemlist)
              return itemlist

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
    this.state={itemlist:[],search:"",filter:"No Filter"}
    this.helper()
  }
  
  renderhelper=()=>{
    var blockfin= []
    let i=0
    while(i<this.state.itemlist.length){
      var block=[]
      block.push(
        <FoodCard item={this.state.itemlist[i]} key={i} style={{ marginRight: theme.SIZES.BASE }} />
        )
      i++
      if(i<this.state.itemlist.length){
        block.push(
        <FoodCard item={this.state.itemlist[i]}  key={i}/>
        )
      }
      blockfin.push(
        <Block  flex row>
          {block}
        </Block>
      )
      i++
    }
    // console.warn("helper",block)
    return blockfin
  }
  renderpicker=()=>{
    var final=[]
    let i=0
    var block=[]
    block.push(<Picker.Item label="No Filter" value="No Filter"/>)
    while(i<tabs.categories.length){
      block.push(<Picker.Item label={tabs.categories[i].title} value={tabs.categories[i].id} />)
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
                
              }>
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
    width: width - 200,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: argonTheme.COLORS.BORDER
  },
});

export default Home;
