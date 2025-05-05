import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const SignOut = () => {
  const handleSignOut = async () => {
    try {
      await auth().signOut();
      // Sau khi đăng xuất thành công, auth().onAuthStateChanged sẽ trả về null và App sẽ tự chuyển về StackNavigation
    } catch (error) {
      Alert.alert('Lỗi', 'Đăng xuất thất bại');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bạn có chắc chắn muốn đăng xuất?</Text>
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignOut;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});