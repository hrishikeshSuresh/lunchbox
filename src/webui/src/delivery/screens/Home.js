import React from 'react';
import { StyleSheet, Dimensions, ScrollView, Text, View } from 'react-native';
import { Block, theme } from 'galio-framework';

import { Card } from '../../components';
import articles from '../../constants/articles';
const { width } = Dimensions.get('screen');

class Home extends React.Component {
  /* render each article that has been
   * rendered by the UI component
   */
  renderArticles = () => {
    // <Card item={articles[0]} horizontal  />
    // <Card item={articles[4]} full />
    /*<Rating
        showRating
        onFinishRating={this.ratingCompleted}
        style={{ paddingVertical: 10 }}
      />*/
    return (
     <Text>Delivery View</Text>
    )
  }
    /* function to call end point
     * for retrieving list of all previous orders made
     * by a particular delivery guy
     */
    viewPreviousOrders() {
        var order_list = [];
        var name = "hrishi";
        var obj = this;
        if (withflask) {
            const url = server_ip + '/api/v1/' + name + '/previous_deliveries';

            try {
                response = fetch(url, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((response) => {
                    if (response.status == 200) {
                        console.warn(JSON.parse(response));
                        response.json().then((res) => {
                            var myObject = eval('(' + res + ')');
                            for (let i = 0; i < myObject.length; i++) {
                                order_list.push({
                                    name: myObject[i]["name"],
                                    order_id: myObject[i]["order_number"],
                                    src: myObject[i]["source"],
                                    dest: myObject[i]["destination"],
                                    item_price: myObject[i]["item_price"]
                                });
                                console.warn(String(myObject[i]["_id"]));
                            }
                        })
                        obj.setState({ order_list: order_list });
                        return order_list;
                    }
                    else {
                        this.setState({ error: "Oops! Something isn't right" });
                    }
                });
            }
            catch (error) {
                console.warn('Error:', error);
            }
        }
    return itemlist
    }

    constructor(props) {
        super(props);
        this.state = {
            order_list: [
                {
                    name: "abc",
                    order_id: "4524",
                    src: "PES U",
                    dest: "MG ROAD",
                    item_price: "5424"
                }
            ],
            search: "Filter By"
        };
        /* API will called here
         */
        //this.viewPreviousOrders();
    }

  /* This will be handling the UI component rendering
   */
  render() {
    return (
        <Block flex center style={styles.home}>
            <View style={styles.container}>
                <View style={styles.button} />
                <View style={styles.button} />
            </View>
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
