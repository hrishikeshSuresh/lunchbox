import React from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Block, theme } from 'galio-framework';

import { FoodCard } from '../extras';
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
      // console.warn(server_ip);
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}>
        <Block flex>
          <Block flex row>
            <FoodCard item={articles[0]} style={{ marginRight: theme.SIZES.BASE }} />
            <FoodCard item={articles[1]} />
          </Block>
          <Block flex row>
            <FoodCard item={articles[2]} style={{ marginRight: theme.SIZES.BASE }} />
            <FoodCard item={articles[3]} />
          </Block>
          <Block flex row>
            <FoodCard item={articles[4]} style={{ marginRight: theme.SIZES.BASE }} />
            <FoodCard item={articles[5]} />
          </Block>
        </Block>
      </ScrollView>
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
