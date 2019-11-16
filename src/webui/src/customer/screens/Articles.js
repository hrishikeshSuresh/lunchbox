import React from 'react';
import { StyleSheet, Dimensions, ScrollView ,TouchableOpacity} from 'react-native';
import { Block, theme } from 'galio-framework';

import { FoodCard } from '../extras';

const { width } = Dimensions.get('screen');
// var itemlist=[]
class Articles extends React.Component {
  helper(){
    var itemlist=[]
    var obj=this
    if(withflask){
    // const url = server_ip+'/recommendations';
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

                var rate=myObject[i]["rating"]
                if(myObject[i]["rating"]==-1) 
                {
                  rate=0
                }
                
                itemlist.push({
                  from: myObject[i]["establishment_name"],
                  title:myObject[i]["item_name"],
                  cta:myObject[i]["currency"]+" "+myObject[i]["item_price"],
                  image:"data:image/jpg;base64,"+myObject[i]["img"],
                  rating:rate,
                  id:i+'r'
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
