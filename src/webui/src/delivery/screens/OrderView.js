import React from "react";
import { ScrollView, StyleSheet, Dimensions, TouchableOpacity, View } from "react-native";
// Galio components
import { Block, Text, Button as GaButton, theme } from "galio-framework";
// Argon themed components
import { argonTheme, tabs } from "../../constants/";
import { Button, Select, Icon, Input, Header, Switch } from "../../components/";

import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Linking } from 'expo';

const { width } = Dimensions.get("screen");
const sampleDest = { lat: 28.771707, lon: 77.4053769 };
const GOOGLE_MAPS_APIKEY = "AIzaSyDp-y5B5CWDY4kgI43jDMQAfcMu7kvkT9Y";

class OrderView extends React.Component {
    /* render each article that has been
     * rendered by the UI component
     */

    static navigationOptions = {
        title: 'OrderView',
        headerStyle: {
            backgroundColor: '#f4511e',
        },
        //headerTintColor: '#0ff',  
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };

    renderMap(src, dest) {
        console.warn(src);
        console.warn(dest);
        return (
            <View key={'123'}>
                <MapView style={styles.map}>
                    <MapViewDirections
                        origin={origin}
                        destination={destination}
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={3}
                        strokeColor="hotpink"
                    />
                </MapView>
            </View>
        );
    }
    
    /* function to call end point
     * for retrieving list of all previous orders made
     * by a particular delivery guy
     */
    viewAvailableOrders() {
        var order_list = [];
        var name = "hrishi";
        var obj = this;
        if (withflask) {
            const url = server_ip + '/api/v1/' + name + '/available_deliveries';

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
                },
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
        //this.viewAvailableOrders();
    }

    startNavigation(latitude, longitude) {
        console.warn("Opening Google Maps");
        var url = "https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=" + latitude + "," + longitude;
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }

    /* This will be handling the UI component rendering
     */
    render() {
        const order_id = this.props.navigation.state.params.item.order_id;
        const src = this.props.navigation.state.params.item.src;
        const dest = this.props.navigation.state.params.item.dest;
        const item_price = this.props.navigation.state.params.item.item_price;
        const order_status = 1;
        return (
            <Block flex center style={styles.home}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                    <View>
                        <Text style={styles.normalText}>
                            Order ID : {order_id}
                        </Text>
                        <Text style={styles.normalText}>
                            Source : {src}
                        </Text>
                        <Text style={styles.normalText}>
                            Destination : {dest}
                        </Text>
                        <Text style={styles.normalText}>
                            Item Price : {item_price}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.optionsButton} onPress={() => console.warn("order assigned") }>
                        <Text>
                            Accept Order
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionsButton} onPress={() => this.startNavigation(sampleDest.lat, sampleDest.lon)}>
                        <Text>
                            Go to Source
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionsButton} onPress={() => this.startNavigation(sampleDest.lat, sampleDest.lon)}>
                        <Text>
                            Go to Destination
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionsButton} onPress={() => console.warn("order delivered") }>
                        <Text>
                            Order delivery confirmed
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </Block>
        );
    }
}

const styles = StyleSheet.create({
    home: {
        width: width,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    articles: {
        width: width - theme.SIZES.BASE * 2,
        paddingVertical: theme.SIZES.BASE,
    },
    normalText: {
        padding: 20,
        color: 'green',
        fontWeight: 'bold',
        fontSize: 30,
    },
    blockAttr: {
        margin: 20,
        width: 400,
        padding: 20,
        color: 'green',
        backgroundColor: '#808080',
        fontWeight: 'bold',
        fontSize: 30,
        borderRadius: 10,
        borderColor: 'black',
    },
    subTitle: {
        color: 'black',
        backgroundColor: 'green',
        fontWeight: 'bold',
        padding: 5,
        fontSize: 50,
        borderColor: 'orange',
    },
    title: {
        paddingBottom: theme.SIZES.BASE,
        paddingHorizontal: theme.SIZES.BASE * 2,
        marginTop: 44,
        color: argonTheme.COLORS.HEADER
    },
    group: {
        paddingTop: theme.SIZES.BASE * 2
    },
    shadow: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 0.2,
        elevation: 2
    },
    button: {
        marginBottom: theme.SIZES.BASE,
        width: width - theme.SIZES.BASE * 2
    },
    optionsButton: {
        width: 400,
        height: "auto",
        paddingHorizontal: theme.SIZES.BASE,
        paddingVertical: 10,
        margin: 10
    },
    input: {
        borderBottomWidth: 1
    },
    inputDefault: {
        borderBottomColor: argonTheme.COLORS.PLACEHOLDER
    },
    inputTheme: {
        borderBottomColor: argonTheme.COLORS.PRIMARY
    },
    inputTheme: {
        borderBottomColor: argonTheme.COLORS.PRIMARY
    },
    inputInfo: {
        borderBottomColor: argonTheme.COLORS.INFO
    },
    inputSuccess: {
        borderBottomColor: argonTheme.COLORS.SUCCESS
    },
    inputWarning: {
        borderBottomColor: argonTheme.COLORS.WARNING
    },
    inputDanger: {
        borderBottomColor: argonTheme.COLORS.ERROR
    },
    social: {
        width: theme.SIZES.BASE * 3.5,
        height: theme.SIZES.BASE * 3.5,
        borderRadius: theme.SIZES.BASE * 1.75,
        justifyContent: "center"
    },
});

export default OrderView;