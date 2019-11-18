import React from 'react';
import { StyleSheet, Dimensions, ScrollView,Text,View, Alert, Button, Image } from 'react-native';
import { Block, theme } from 'galio-framework';
import { Rating } from 'react-native-ratings';

import { Card } from '../../components';
import articles from '../../constants/articles';
const { width } = Dimensions.get('screen');

class Home extends React.Component {
helper_orders(){
    var obj=this
    var itemlist=[]
    if(withflask){
    const url = server_ip+'/api/v1/caterer1/pending_orders';

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

  helper_menu(){
      var obj=this
      var available=[]
      if(withflask){
      const url = server_ip+'/api/v1/caterer1/all_items';

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
                    available.push(obj.get_item(myObject[i]))

                  }
                  obj.setState({available:available})
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
renderhelper=()=>{
    console.log("pending orders",this.state.itemlist)
    var block= []
    let i=0
    while(i<this.state.itemlist.length){
      block.push(
        <Block flex key={i}>
          <CartCard item={this.state.itemlist[i]} horizontal />
        </Block>
        )
      i++
    }
    // console.warn("helper",block)
    return block
  }

  render() {
    return (

    <View>

        <Button style={styles.button}
            title = 'View Orders'
             onPress={() => this.helper()}//=> Alert.alert('Take me to my orders')}
        />
        <Button style={styles.button}
                    title = 'View menu '
                     onPress={() => Alert.alert('Open menu')}
                />

        <Button style={{width:250 }}
                    title = 'Analytics'
                     onPress={() => Alert.alert('Take me to analytics')}
                />
        /* <Image
                  style={{width: 50, height: 50}}
                  source={{uri: 'https://www.mathworks.com/help/examples/graphics/win64/OverlayBarGraphsExample_01.png'}}
        /> */
     </View>
    )
  }
};


const styles = StyleSheet.create({
button: {
    padding: 1000,
    width: 250
},
});
export default Home;
