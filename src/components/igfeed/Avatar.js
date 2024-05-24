import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';

function Avatar({imgSource, isHasStory = false, size = 65}) {
  return (
    <View style={{ ...styles.container, width: size, height: size }}>
      {isHasStory && (
        <Image
          source={require("../../../assets/igfeed/story-background.png")}
          style={styles.storyBackground}
        />
      )}
      <View style={styles.avatarContainer}>
        <Image source={imgSource} style={styles.avatarImage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 65,
    height: 65,
    borderRadius: 100,
    overflow: 'hidden'
  },
  storyBackground: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  avatarContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    padding: 5,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 100
  }
})

export default Avatar;