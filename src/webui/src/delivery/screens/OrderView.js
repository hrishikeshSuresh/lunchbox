import React from "react";
import { ScrollView, StyleSheet, Dimensions, TouchableOpacity, View, Alert } from "react-native";
// Galio components
import { Block, Text, Button as GaButton, theme } from "galio-framework";
// Argon themed components
import { argonTheme, tabs } from "../../constants/";
import { Button, Select, Icon, Input, Header, Switch } from "../../components/";

import { Linking } from 'expo';

const { width } = Dimensions.get("screen");
const sampleDest = { lat: 28.771707, lon: 77.4053769 };
const GOOGLE_MAPS_APIKEY = "XXXXX";

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

    constructor(props) {
        super(props);
        this.state = {
            order_list: [],
            search: "Filter By"
        };
        /* API will called here
         */
        //this.viewAvailableOrders();
    }

    startNavigation(latitude, longitude) {
        console.log("Opening Google Maps");
        var url = "https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=" + latitude + "," + longitude;
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }

    /*
     * API integration to check if order has been accepted on
     * user side.
     */
    canAcceptOrder = (orderId) => {
        const url = server_ip + '/api/v1/delivery/select_order';
        const data = {
            order_id: orderId
        }
        try {
            response = fetch(url, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                	console.log("STATUS : ", response.status);
                    if (response.status == 200) {
                        Alert.alert(
                            'Alert Title',
                            'ORDER HAS BEEN ASSIGNED TO YOU',
                            [
                                { text: 'OK', onPress: () => console.log('OK Pressed') },
                            ]
                        );                     }
                    else {
                        Alert.alert(
                            'Alert Title',
                            'SOMEONE ELSE HAS TAKEN THE ORDER. Please try another order.',
                            [
                                { text: 'OK', onPress: () => console.log('OK Pressed') },
                            ]
                        );  
                    }
                });
        }
        catch (error) {
            console.warn('Error:', error);
        }
    }

    /*
     * API integration to confirm order
     */
    orderConfirmed = (orderId) => {
        const url = server_ip + '/api/v1/order/status';
        const data = {
            order_id: orderId,
            status: 5
        }
        try {
            response = fetch(url, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                	console.log("STATUS : ", response.status);
                    if (response.status == 201) {
                        Alert.alert(
                            'Alert Title',
                            'ORDER HAS MARKED AS DELIVERED',
                            [
                                { text: 'OK', onPress: () => console.log('OK Pressed') },
                            ]
                        );
                    }
                    else {
                        Alert.alert(
                            'Alert Title',
                            'SOME ERROR HAS OCCURED ON THE BACK-END. Please try again',
                            [
                                { text: 'OK', onPress: () => console.log('OK Pressed') },
                            ]
                        );
                    }
                });
        }
        catch (error) {
            console.warn('Error:', error);
        }
    }

    /* This will be handling the UI component rendering
     */
    render() {
        const order_id = this.props.navigation.state.params.item.order_id;
        const src = this.props.navigation.state.params.item.src;
        const dest = this.props.navigation.state.params.item.dest;
        const amount = this.props.navigation.state.params.item.amount;
        return (
            <Block flex center style={styles.home}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                    <View style={styles.blockAttr}>
                        <Text style={styles.boldText}>
                            Order ID : {order_id}
                        </Text>
                        <Text style={styles.boldText}>
                            Source : {src}
                        </Text>
                        <Text style={styles.boldText}>
                            Destination : {dest}
                        </Text>
                        <Text style={styles.boldText}>
                            Item Price : {amount}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.optionsButton} onPress={() => this.canAcceptOrder(order_id) }>
                        <Text style={styles.normalText}>
                            ACCEPT ORDER
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionsButton} onPress={() => this.startNavigation(src[0], src[1])}>
                        <Text style={styles.normalText}>
                            GO TO SOURCE
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionsButton} onPress={() => this.startNavigation(dest[0], dest[1])}>
                        <Text style={styles.normalText}>
                            GO TO DESTINATION
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionsButton} onPress={() => this.orderConfirmed(order_id) }>
                        <Text style={styles.normalText}>
                            CONFIRM ORDER DELIVERY
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
        padding: 20,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
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
        color: '#761137',
        fontWeight: 'bold',
        fontSize: 20,
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
        backgroundColor: "#7BDEB2",
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
