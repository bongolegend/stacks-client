// HeaderBar.tsx
import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Drawer from './Drawer';

const HeaderBar: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => setDrawerVisible(true)} style={styles.avatarPlaceholder}></TouchableOpacity>
        <Image source={require('../assets/stackabrick.png')} style={styles.logo} />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={drawerVisible}
        onRequestClose={() => setDrawerVisible(false)}
      >
        <Drawer closeDrawer={() => setDrawerVisible(false)} />
      </Modal>
    </>
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