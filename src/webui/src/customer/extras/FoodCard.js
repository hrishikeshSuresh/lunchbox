import React from 'react';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback,View } from 'react-native';
import { Block, Text, theme } from 'galio-framework';

import { Images,argonTheme } from '../../constants';

const star = require("../../assets/imgs/star.png");

class FoodCard extends React.Component {
  
  render() {
    const { navigation, item,cardtype,qty, horizontal, full, style, ctaColor, imageStyle } = this.props;
    
    const imageStyles = [
      full ? styles.fullImage : styles.horizontalImage,
      imageStyle
    ];
    const cardContainer = [styles.card, styles.shadow, style];
    const imgContainer = [styles.imageContainer,
      horizontal ? styles.horizontalStyles : styles.verticalStyles,
      styles.shadow
    ];
      // {
  //   “item_id”: “<Item ID>”,
  //   “item_name”:”<Item Name>”,
  //   “eid”:”<Establishment ID>”,
  //   “e_name”:”<Establishment Name>”,
  //   “e_type”:”Canteen” OR “Caterer”,
  //   “item_price”:<item price>,
  //   “currency”:”INR”,
  //   “img”:”<img base64>”,
    // "rating":5
  //   }
    const food_card=(cardtype=="food");
    // console.log("foodcard",item,qty,item["item_id"])
    return (
      
      <Block row={horizontal} card flex style={cardContainer} key={item.item_id}>
        {/* <Text>Coming from blah</Text> */}
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Food',{itempara:item})}>
          <Block flex style={imgContainer}>
            <Image source={{uri: 'data:image/gif;base64,'+item.img}} style={imageStyles} />
          </Block>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Food',{itempara:item})}>
          <Block flex space="between" style={styles.cardDescription}>
            <Text size={14} style={styles.cardTitle}>{item.item_name}</Text>
            <Text size={12}>{item.e_name}</Text>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
            {food_card?
            (<>
              <Text size={12} muted={!ctaColor} color={ctaColor || argonTheme.COLORS.ACTIVE} bold style={{}}>{item.currency} {item.item_price}</Text>
            
            <Text size={12} muted={!ctaColor} color="grey" bold ><Image
                  source={Images.star}
                  style={{ height: 10,width: 10}} /> {item.avg_rating}</Text></>
            )
            :
            (
                    <><Text size={12} muted={!ctaColor} color={ctaColor || argonTheme.COLORS.ACTIVE} bold style={{}}>{item.currency} {item.item_price}</Text>
                    <Text size={12} muted={!ctaColor} color="grey" bold > Qty: {qty}</Text></>
            
            )}
            </View></Block>
        </TouchableWithoutFeedback>
      </Block>
    );
  }
}

FoodCard.propTypes = {
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

export default withNavigation(FoodCard);