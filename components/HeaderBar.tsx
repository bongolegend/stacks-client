// HeaderBar.tsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const HeaderBar: React.FC = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.avatarPlaceholder}></View>
      <Image source={require('../assets/stackabrick.png')} style={styles.logo} />
    </View>
  );
};

export default HeaderBar;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 16,
  },
  avatarPlaceholder: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'gray',
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
});