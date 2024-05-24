import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import Avatar from './Avatar';

function Navigation() {
  return (
    <View style={styles.container}>
      <View style={styles.menuItem}>
        <Image
          source={require("../../../assets/igfeed/home-icon.png")}
          style={styles.menuItemIcon}
        />
      </View>
      <View style={styles.menuItem}>
        <Image
          source={require("../../../assets/igfeed/search-icon.png")}
          style={styles.menuItemIcon}
        />
      </View>
      <View style={styles.menuItem}>
        <Image
          source={require("../../../assets/igfeed/add-post-icon.png")}
          style={styles.menuItemIcon}
        />
      </View>
      <View style={styles.menuItem}>
        <Image
          source={require("../../../assets/igfeed/reels-icon.png")}
          style={styles.menuItemIcon}
        />
      </View>
      <View style={styles.menuItem}>
        <Avatar
          imgSource={require("../../../assets/igfeed/avatar-1.png")}
          size={35}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderTopColor: '#eee',
    borderTopWidth: 1,
    alignItems: 'center'
  },
  menuItem: {
    marginTop: -18
  },
  menuItemIcon: {
    height: 26,
    width: 26,
    resizeMode: 'contain',
  }
})

export default Navigation;