import React from "react";
import { ScrollView, StyleSheet, Dimensions, TouchableOpacity, View } from "react-native";
// Galio components
import { Block, Text, Button as GaButton, theme } from "galio-framework";
// Argon themed components
import { argonTheme, tabs } from "../../constants/";
import { Button, Select, Icon, Input, Header, Switch } from "../../components/";

const { width } = Dimensions.get("screen");
/*
class Elements extends React.Component {
    state = {
        "switch-1": true,
        "switch-2": false
    };

    toggleSwitch = switchId =>
        this.setState({ [switchId]: !this.state[switchId] });

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
                }
            ],
            search: "Filter By"
        };
        //this.viewAvailableOrders();
    }

    renderButtons = () => {
        return (
        <Block flex>
            <Text bold size={16} style={styles.title}>
                Buttons
            </Text>
            <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
            <Block center>
                <Button color="default" style={styles.button}>
                    DEFAULT
                </Button>
            </Block>
            <Block center>
                <Button
                    color="secondary"
                    textStyle={{ color: "black", fontSize: 12, fontWeight: "700" }}
                    style={styles.button}
                >
                    <Text> ORDER ID: {this.state.order_list[0].order_id} </Text>
                    <Text> SOURCE: {this.state.order_list[0].src} </Text>
                    <Text> DESTINATION: {this.state.order_list[0].dest} </Text>
                    <Text> ITEM PRICE: {this.state.order_list[0].item_price} </Text>
                </Button>
            </Block>
            <Block center>
                <Button style={styles.button}>PRIMARY</Button>
            </Block>
            <Block center>
                <Button color="info" style={styles.button}>
                    INFO
                </Button>
            </Block>
            <Block center>
                <Button color="success" style={styles.button}>
                    SUCCESS
                </Button>
            </Block>
            <Block center>
                <Button color="warning" style={styles.button}>
                    WARNING
                </Button>
            </Block>
            <Block center>
                <Button color="error" style={styles.button}>
                    ERROR
                </Button>
            </Block>
            <Block row space="evenly">
                <Block flex left>
                    <Select
                        defaultIndex={1}
                        options={["01", "02", "03", "04", "05"]}
                    />
                </Block>
                <Block flex center>
                    <Button small center color="default" style={styles.optionsButton}>
                        DELETE
                    </Button>
                </Block>
                    <Block flex={1.25} right>
                        <Button center color="default" style={styles.optionsButton}>
                            SAVE FOR LATER
                        </Button>
                    </Block>
                </Block>
            </Block>
        </Block>
        );
    };

    renderText = () => {
    return (
        <Block flex style={styles.group}>
        <Text bold size={16} style={styles.title}>
            Typography
        </Text>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
            <Text
            h1
            style={{ marginBottom: theme.SIZES.BASE / 2 }}
            color={argonTheme.COLORS.DEFAULT}
            >
            Heading 1
            </Text>
            <Text
            h2
            style={{ marginBottom: theme.SIZES.BASE / 2 }}
            color={argonTheme.COLORS.DEFAULT}
            >
            Heading 2
            </Text>
            <Text
            h3
            style={{ marginBottom: theme.SIZES.BASE / 2 }}
            color={argonTheme.COLORS.DEFAULT}
            >
            Heading 3
            </Text>
            <Text
            h4
            style={{ marginBottom: theme.SIZES.BASE / 2 }}
            color={argonTheme.COLORS.DEFAULT}
            >
            Heading 4
            </Text>
            <Text
            h5
            style={{ marginBottom: theme.SIZES.BASE / 2 }}
            color={argonTheme.COLORS.DEFAULT}
            >
            Heading 5
            </Text>
            <Text
            p
            style={{ marginBottom: theme.SIZES.BASE / 2 }}
            color={argonTheme.COLORS.DEFAULT}
            >
            Paragraph
            </Text>
            <Text muted>This is a muted paragraph.</Text>
        </Block>
        </Block>
    );
    };

  renderInputs = () => {
    return (
      <Block flex style={styles.group}>
        <Text bold size={16} style={styles.title}>
          Inputs
        </Text>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Input right placeholder="Regular" iconContent={<Block />} />
        </Block>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Input
            right
            placeholder="Regular Custom"
            style={{
              borderColor: argonTheme.COLORS.INFO,
              borderRadius: 4,
              backgroundColor: "#fff"
            }}
            iconContent={<Block />}
          />
        </Block>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Input
            placeholder="Icon left"
            iconContent={
              <Icon
                size={11}
                style={{ marginRight: 10 }}
                color={argonTheme.COLORS.ICON}
                name="search-zoom-in"
                family="ArgonExtra"
              />
            }
          />
        </Block>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Input
            right
            placeholder="Icon Right"
            iconContent={
              <Icon
                size={11}
                color={argonTheme.COLORS.ICON}
                name="search-zoom-in"
                family="ArgonExtra"
              />
            }
          />
        </Block>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Input
            success
            right
            placeholder="Success"
            iconContent={
              <Block
                middle
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: argonTheme.COLORS.INPUT_SUCCESS
                }}
              >
                <Icon
                  size={11}
                  color={argonTheme.COLORS.ICON}
                  name="g-check"
                  family="ArgonExtra"
                />
              </Block>
            }
          />
        </Block>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Input
            error
            right
            placeholder="Error Input"
            iconContent={
              <Block
                middle
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: argonTheme.COLORS.INPUT_ERROR
                }}
              >
                <Icon
                  size={11}
                  color={argonTheme.COLORS.ICON}
                  name="support"
                  family="ArgonExtra"
                />
              </Block>
            }
          />
        </Block>
      </Block>
    );
  };

    renderSwitches = () => {
    return (
        <Block flex style={styles.group}>
        <Text bold size={16} style={styles.title}>
            Switches
        </Text>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
            <Block
            row
            middle
            space="between"
            style={{ marginBottom: theme.SIZES.BASE }}
            >
            <Text size={14}>Switch is ON</Text>
            <Switch
                value={this.state["switch-1"]}
                onValueChange={() => this.toggleSwitch("switch-1")}
            />
            </Block>
            <Block row middle space="between">
            <Text size={14}>Switch is OFF</Text>
            <Switch
                value={this.state["switch-2"]}
                onValueChange={() => this.toggleSwitch("switch-2")}
            />
            </Block>
        </Block>
        </Block>
    );
    };

  renderTableCell = () => {
    const { navigation } = this.props;
    return (
      <Block flex style={styles.group}>
        <Text bold size={16} style={styles.title}>
          Table Cell
        </Text>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Block style={styles.rows}>
            <TouchableOpacity onPress={() => navigation.navigate("Pro")}>
              <Block row middle space="between" style={{ paddingTop: 7 }}>
                <Text size={14}>Manage Options</Text>
                <Icon
                  name="chevron-right"
                  family="entypo"
                  style={{ paddingRight: 5 }}
                />
              </Block>
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
    );
  };

  renderSocial = () => {
    return (
      <Block flex style={styles.group}>
        <Text bold size={16} style={styles.title}>
          Social
        </Text>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Block row center space="between">
            <Block flex middle right>
              <GaButton
                round
                onlyIcon
                shadowless
                icon="facebook"
                iconFamily="Font-Awesome"
                iconColor={theme.COLORS.WHITE}
                iconSize={theme.SIZES.BASE * 1.625}
                color={theme.COLORS.FACEBOOK}
                style={[styles.social, styles.shadow]}
              />
            </Block>
            <Block flex middle center>
              <GaButton
                round
                onlyIcon
                shadowless
                icon="twitter"
                iconFamily="Font-Awesome"
                iconColor={theme.COLORS.WHITE}
                iconSize={theme.SIZES.BASE * 1.625}
                color={theme.COLORS.TWITTER}
                style={[styles.social, styles.shadow]}
              />
            </Block>
            <Block flex middle left>
              <GaButton
                round
                onlyIcon
                shadowless
                icon="dribbble"
                iconFamily="Font-Awesome"
                iconColor={theme.COLORS.WHITE}
                iconSize={theme.SIZES.BASE * 1.625}
                color={theme.COLORS.DRIBBBLE}
                style={[styles.social, styles.shadow]}
              />
            </Block>
          </Block>
        </Block>
      </Block>
    );
  };

  renderNavigation = () => {
    return (
      <Block flex style={styles.group}>
        <Text bold size={16} style={styles.title}>
          Navigation
        </Text>
        <Block>
          <Block style={{ marginBottom: theme.SIZES.BASE }}>
            <Header back title="Title" navigation={this.props.navigation} />
          </Block>

          <Block style={{ marginBottom: theme.SIZES.BASE }}>
            <Header white back title="Title" navigation={this.props.navigation} bgColor={argonTheme.COLORS.ACTIVE} titleColor="white" iconColor="white" />
          </Block>

          <Block style={{ marginBottom: theme.SIZES.BASE }}>
            <Header search title="Title" navigation={this.props.navigation} />
          </Block>

          <Block style={{ marginBottom: theme.SIZES.BASE }}>
            <Header tabs={tabs.categories} search title="Title" navigation={this.props.navigation} />
          </Block>

          <Block style={{ marginBottom: theme.SIZES.BASE }}>
            <Header
              options
              search
              title="Title"
              optionLeft="Option 1"
              optionRight="Option 2"
              navigation={this.props.navigation}
            />
          </Block>
        </Block>
      </Block>
    );
  };

  render() {
    return (
      <Block flex center>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
          {this.renderButtons()}
          {this.renderText()}
          {this.renderInputs()}
          {this.renderSocial()}
          {this.renderSwitches()}
          {this.renderNavigation()}
          {this.renderTableCell()}
        </ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
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
    width: "auto",
    height: 34,
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: 10
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

export default Elements;
*/
class Elements extends React.Component {
    /* render each article that has been
     * rendered by the UI component
     */

    renderMap(src, dest) {
        console.warn(src);
        console.warn(dest);
        return (
            <View>
                <MapView style={styles.map}>
                    <MapViewDirections
                        origin={origin}
                        destination={destination}
                        apikey={GOOGLE_MAPS_APIKEY}
                    />
                </MapView>
            </View>
        );
    }

    static navigationOptions = {
        title: 'AvailableOrders',
        headerStyle: {
            backgroundColor: '#f4511e',
        },
        //headerTintColor: '#0ff',  
        headerTitleStyle: {
            fontWeight: 'bold',
        },  
    };

    /*
     * render a set of blocks
     * of current orders
     */
    renderhelper = () => {
        var blockfin = [];
        let i = 0;
        const { navigate } = this.props.navigation;
        while (i < this.state.order_list.length) {
            blockfin.push(
                <TouchableOpacity style={styles.optionsButton}
                    onPress={() => 
                        navigate('OrderView', {
                            order_id: this.state.order_list[i].order_id,
                            src: this.state.order_list[i].src,
                            dest: this.state.order_list[i].dest,
                            item_price: this.state.order_list[i].item_price,
                            order_status: 1
                        })
                    }
                    title='Submit'
                    key={i}
                >
                    <Text style={styles.normalText}>
                        Order ID : {this.state.order_list[i].order_id}
                    </Text>
                    <Text style={styles.normalText}>
                        Source : {this.state.order_list[i].src}
                    </Text>
                    <Text style={styles.normalText}>
                        Destination : {this.state.order_list[i].dest}
                    </Text>
                    <Text style={styles.normalText}>
                        Item Price : {this.state.order_list[i].item_price}
                    </Text>
                </TouchableOpacity>
            );
            i++;
        }
        console.warn("helper", blockfin);
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
                <Text style={styles.subTitle}>
                    Select order from list
                </Text>
                {this.renderhelper()}
            </Block>
        )
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
        this.renderMaps = this.renderMap.bind(this);
    }

    /* This will be handling the UI component rendering
     */
    render() {
        const { navigate } = this.props.navigation;
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

export default Elements;