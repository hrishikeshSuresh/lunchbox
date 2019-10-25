import React from 'react';
import { StyleSheet, Dimensions, ScrollView,Text } from 'react-native';
import { Block, theme } from 'galio-framework';
import { Rating } from 'react-native-ratings';

import { Card } from '../../components';
import articles from '../../constants/articles';
const { width } = Dimensions.get('screen');

class Home extends React.Component {
  renderArticles = () => {
    // <Card item={articles[0]} horizontal  />
    // <Card item={articles[4]} full />
    /*<Rating
        showRating
        onFinishRating={this.ratingCompleted}
        style={{ paddingVertical: 10 }}
      />*/
    return (
      <Text>Institution View</Text>
    )
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
