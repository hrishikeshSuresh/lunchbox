import React from 'react';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback,View } from 'react-native';
import { Block, Text, theme } from 'galio-framework';

import { Images,argonTheme } from '../../constants';

const star = require("../../assets/imgs/star.png");

class PreCard extends React.Component {
  render() {
    const { navigation, item,id, horizontal, full, style, ctaColor, imageStyle } = this.props;
    
    const imageStyles = [
      full ? styles.fullImage : styles.horizontalImage,
      imageStyle
    ];
    const cardContainer = [styles.card, styles.shadow, style];
    const imgContainer = [styles.imageContainer,
      horizontal ? styles.horizontalStyles : styles.verticalStyles,
      styles.shadow
    ];
 // [
    //   “Order ID1”: 
    //   {
    //      “uid”: <User ID>, 
    //      "eid": <Establishment ID>,
    //      “e_name”:”<Establishment name>”,
    //      “e_type”: “Canteen” OR “Caterer”
    //      “items”: [<Item ID1>,<Item ID2>,...], 
    //      "amount": 5000,
    //      "currency" : "INR",
    //      "payment_option": "Cash" OR “Wallet”,
    //      “location”:[<latitude>,<longitude>]
    //      “status”:<1-5>
    //    },
    //  ] 
    const status = (item.e_type=='Canteen' && item.status==4) || (item.e_type=='Caterer' && item.status==5)
    return (
      
      <Block row={horizontal} card flex style={cardContainer}>
        {/* <Text>Coming from blah</Text> */}
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Order',{itempara:item,id:id})}>
          <Block flex space="between" style={styles.cardDescription}>
            <Text size={14} style={styles.cardTitle}>Order Id : {id}</Text>
            <Text size={12}>From : {item.e_name}</Text>
            <Text size={12}>On : {item.date}</Text>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',paddingTop:10}}>
            <Text size={12} muted={!ctaColor} color={ctaColor || argonTheme.COLORS.ACTIVE} bold style={{}}> Amount Paid : {item.currency}&nbsp;{item.amount}</Text>
            
            {status?(<Text size={12} muted={!ctaColor} color="green" bold > Order Status : Completed</Text>):
          (<Text size={12} muted={!ctaColor} color="orange" bold > Order Status : Processing</Text>)}
            </View></Block>
        </TouchableWithoutFeedback>
      </Block>
    );
  }
}

PreCard.propTypes = {
  item: PropTypes.object,
  horizontal: PropTypes.bool,
  full: PropTypes.bool,
  ctaColor: PropTypes.string,
  imageStyle: PropTypes.any,
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
    marginBottom: 16
  },
  cardTitle: {
    flex: 1,
    flexWrap: 'wrap',
    paddingBottom: 0
  },
  cardDescription: {
    padding: theme.SIZES.BASE / 2
  },
  imageContainer: {
    borderRadius: 3,
    elevation: 1,
    overflow: 'hidden',
  },
  image: {
    // borderRadius: 3,
  },
  horizontalImage: {
    height: 122,
    width: 'auto',
  },
  horizontalStyles: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  verticalStyles: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0
  },
  fullImage: {
    height: 215
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});

export default withNavigation(PreCard);