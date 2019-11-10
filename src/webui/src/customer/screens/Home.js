import React from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Block, theme } from 'galio-framework';

import { FoodCard } from '../extras';
import articles from '../../constants/articles';
const { width } = Dimensions.get('screen');
class Home extends React.Component {
  constructor(props){
    super(props)
    this.itemlist=[]
  }
  componentWillMount(){
    console.warn("component")
    if(!withflask){
      console.warn("he")
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
            console.warn("success")
            // console.warn(JSON.parse(response))
            response.json().then((res)=>{
              var myObject = eval('(' + res + ')');
              for (let i=0;i <myObject.length;i++){
    //             from: 'vendor',
		// title: 'Gobi Manchuri',
    // image: 'https://i.ytimg.com/vi/juJExyqr5W4/maxresdefault.jpg',
    // cta: 'Rs 40', 
    // horizontal: true,
    // rating: 4.5
                this.itemlist.push({
                  from: myObject[i]["establishment_name"],
                  title:myObject[i]["item_name"],
                  cta:myObject[i]["currency"]+" "+myObject[i]["price"],
                  image:"uri: 'data:image/gif;base64,"+myObject[i]["img"]+"'",
                  rating:4
                })

              }
              console.warn(this.itemlist[0])

            });
            // console.warn(response)
          }
          else{
            // this.setState({error : "Oops! Something isn't right"})
          }

        })
      } catch (error) {
        console.warn('Error:', error);
      }
    }
  }
  renderhelper=()=>{
    var block= []
    let i=0
    while(i<this.itemlist.length){
      block = block.push(<FoodCard item={itemlist[i]} style={{ marginRight: theme.SIZES.BASE }} />)
      i++
      if(i<this.itemlist.length){
        block = block.push(<FoodCard item={itemlist[i]}  />)
      }
      i++
    }
  }
  renderArticles = () => {
    if(!withflask){
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}>
        <Block flex>
          <Block flex row>
            <FoodCard item={articles[0]} style={{ marginRight: theme.SIZES.BASE }} />
            <FoodCard item={articles[1]} />
          </Block>
          <Block flex row>
            <FoodCard item={articles[2]} style={{ marginRight: theme.SIZES.BASE }} />
            <FoodCard item={articles[3]} />
          </Block>
          <Block flex row>
            <FoodCard item={articles[4]} style={{ marginRight: theme.SIZES.BASE }} />
            <FoodCard item={articles[5]} />
          </Block>
        </Block>
      </ScrollView>
    )
    }
    else{
      return (
        <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}>
        
        {this.renderhelper()}
      </ScrollView>
      )
    }
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

export default Home;
