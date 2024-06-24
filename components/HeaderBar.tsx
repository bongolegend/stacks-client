// HeaderBar.tsx
import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HeaderBar: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatarPlaceholder}></TouchableOpacity>
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