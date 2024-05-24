import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import Avatar from './Avatar';

function StoryItem({item}) {
  return (
    <View style={styles.container}>
      <View>
        <Avatar imgSource={item.imgSource} isHasStory={item.isHasStory} />
        {item.isOwn && (
          <View style={styles.addPostContainer}>
            <Image
              source={require("../../../assets/igfeed/plus-icon.png")}
              style={styles.plusIcon}
            />
          </View>
        )}
      </View>
      <Text
        style={{ ...styles.username, color: item.isOwn ? "#606060" : "#000" }}
      >
        {item?.isOwn ? "Your story" : item.username}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    alignItems: 'center'
  },
  addPostContainer: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: 'white',
    bottom: 0,
    right: 0,
    borderRadius: 100,
    padding: 2
  },
  plusIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  username: {
    marginTop: 7
  }
})

export default StoryItem;