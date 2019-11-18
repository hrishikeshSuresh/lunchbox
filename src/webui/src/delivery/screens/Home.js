import React from 'react';
import { StyleSheet, Dimensions, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Block, theme } from 'galio-framework';

import { Card } from '../../components';
import articles from '../../constants/articles';
const { width } = Dimensions.get('screen');

class Home extends React.Component {
    /* render each article that has been
     * rendered by the UI component
     */

    /*
     * render a set of blocks
     * of previous orders
     */
    renderhelper = () => {
        var blockfin = [];
        let i = 0;
        while (i < this.state.order_list.length) {
            blockfin.push(
                <TouchableOpacity style={styles.blockAttr} key={i}>
                    <Text style={styles.normalText}>
                        #{i+1}
                    </Text>
                    <Text style={styles.boldText}>
                        Order ID: {this.state.order_list[i].order_id}
                    </Text>
                    <Text style={styles.boldText}>
                        Source: {this.state.order_list[i].src}
                    </Text>
                    <Text style={styles.boldText}>
                        Destination: {this.state.order_list[i].dest}
                    </Text>
                    <Text style={styles.boldText}>
                        Item Price: {this.state.order_list[i].item_price}
                    </Text>
                </TouchableOpacity>
            );
            i++;
        }
        return blockfin;
    }

    renderArticles = () => {
    // <Card item={articles[0]} horizontal  />
    // <Card item={articles[4]} full />
    /*<Rating
        showRating
        onFinishRating={this.ratingCompleted}
        style={{ paddingVertical: 10 }}
      />*/
        return (
            <Block>
                <Text style={styles.subTitle}> Previous Orders </Text>
                {this.renderhelper()}
            </Block>
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
            const url = server_ip + '/api/v1/establishment/complete_orders';

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
                        response.json().then((res) => {
                            var myObject = eval('(' + res + ')');
                            console.log(myObject);
                            for (let i = 0; i < myObject.length; i++) {
                                order_list.push({
                                    name: myObject[i]["name"],
                                    order_id: myObject[i]["order_number"],
                                    src: myObject[i]["source"],
                                    dest: myObject[i]["destination"],
                                    item_price: myObject[i]["item_price"]
                                });
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
                console.log('Error:' + error.message);
            }
        }
        return order_list;
    }

    constructor(props) {
        super(props);
        this.state = {
            order_list: [],
            search: "Filter By"
        };
        
        this.viewPreviousOrders();
    }

    /* This will be handling the UI component rendering
     */
    render() {
        return (
            <Block flex center style={styles.home}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                    {this.renderArticles()}
                </ScrollView>
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
    boldText: {
        padding: 20,
        color: '#143D59',
        fontWeight: 'bold',
        fontSize: 30,
    },
    normalText: {
        color: '#143D59',
        fontSize: 10,
    },
    blockAttr: {
        margin: 20,
        width: 350,
        padding: 20,
        color: 'white',
        backgroundColor: '#E8E8E8',
        fontWeight: 'bold',
        fontSize: 20,
        borderRadius: 5,
        borderColor: 'black',
    },
    subTitle: {
        color: 'orange',
        backgroundColor: 'black',
        fontWeight: 'bold',
        padding: 5,
        fontSize: 50,
        borderColor: 'orange',
    }
});

export default Home;
