// import { Rating } from 'react-native-ratings';
import React from 'react';
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback,View } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import { argonTheme, tabs } from "../../constants/";
import Star from 'react-native-star-view';

class ReviewCard extends React.Component {
     
    render(){
        const {data}=this.props;
        // console.warn(data);
        return(
            <Block style={styles.blo}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                    p
                    style={{ padding:10,paddingLeft:15}}
                    color={argonTheme.COLORS.DEFAULT}
                >
                    {data.user}
                </Text>
                <Block right>
                <Star score={data.rating} style={styles.starStyle} />
                </Block>
                </View>
                <Text size={14} style={{paddingBottom:10,paddingLeft:20}}>{data.review}</Text>

            </Block>
        );
    }
}

const styles = StyleSheet.create({
    starStyle : {
        width: 80,
        height: 16,
        marginBottom: 10,
        marginRight: 20,
        marginTop: 10,
        textAlign: 'right',
      },
    blo: {
        shadowColor: theme.COLORS.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 0.1,
        elevation: 2,
        margin:10,
        backgroundColor: theme.COLORS.WHITE,
      }

});
export default ReviewCard;