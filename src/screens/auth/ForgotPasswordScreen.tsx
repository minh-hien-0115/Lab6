import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleResetPassword = async () => {
    try {
      await auth().sendPasswordResetEmail(email);
      setMsg('Đã gửi email khôi phục!');
    } catch (error: any) {
      setMsg(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên mật khẩu</Text>
      <TextInput
        placeholder="Nhập email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleResetPassword}>
        <Text style={styles.button}>Gửi</Text>
      </TouchableOpacity>
      <Text style={styles.msg}>{msg}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.link}>Quay lại đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderBottomWidth: 1, marginVertical: 12, padding: 8 },
  button: { marginTop: 20, fontSize: 18, color: 'blue' },
  link: { marginTop: 20, color: 'gray' },
  msg: { marginTop: 12, color: 'green' },
});

export default ForgotPasswordScreen;
