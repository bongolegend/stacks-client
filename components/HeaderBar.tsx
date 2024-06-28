import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

const HeaderBar: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatarIcon}>
        <FontAwesome5 name="user-circle" size={30} color="darkgrey" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Timeline')}>
        <Image source={require('../assets/stackabrick.png')} style={styles.logo} />
      </TouchableOpacity>
    </View>
  );
};

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
  avatarIcon: {
    position: 'absolute',
    left: 16,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
});

export default HeaderBar;