import {Pressable, StyleSheet, Text} from 'react-native';
import React from 'react';

const Button = () => {

  return (
    <Pressable
      style={styles.button}
      onPress={() => {
        console.log('Activate the card');
      }}>
      <Text style={styles.text}>Activate the card</Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    marginHorizontal: 30,
    marginVertical: 20,
    padding: 18,
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: '#111111',
  },
});