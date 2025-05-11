import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Ionicons';

const SignupScreen = ({ navigation }: any) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (values: { email: string; password: string }) => {
    try {
      await auth().createUserWithEmailAndPassword(values.email, values.password);
      Alert.alert('Thành công', 'Đăng ký thành công!', [
        { text: 'OK', onPress: () => navigation.navigate('LoginScreen') },
      ]);
    } catch (error: any) {
      let message = 'Có lỗi xảy ra. Vui lòng thử lại.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'Email đã được sử dụng. Vui lòng chọn email khác.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Email không hợp lệ.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Mật khẩu quá yếu (tối thiểu 6 ký tự).';
      }
      Alert.alert('Lỗi', message);
    }
  };

  const signupSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ').required('Email bắt buộc'),
    password: Yup.string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .required('Mật khẩu bắt buộc'),
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>

      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={handleSignup}
        validationSchema={signupSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <>
            {/* Email input */}
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Nhập email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                style={styles.input}
                keyboardType="email-address"
              />
              {values.email.length > 0 && (
                <TouchableOpacity onPress={() => setFieldValue('email', '')}>
                  <Icon name="close-circle" size={20} color="#888" />
                </TouchableOpacity>
              )}
            </View>
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

            {/* Password input */}
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Nhập mật khẩu"
                secureTextEntry={!showPassword}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="gray" />
              </TouchableOpacity>
              {values.password.length > 0 && (
                <TouchableOpacity onPress={() => setFieldValue('password', '')}>
                  <Icon name="close-circle" size={20} color="gray" />
                </TouchableOpacity>
              )}
            </View>
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            {/* Submit button */}
            <TouchableOpacity onPress={() => handleSubmit()}>
              <Text style={styles.button}>Đăng ký</Text>
            </TouchableOpacity>

            {/* Navigation to Login */}
            <TouchableOpacity
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  button: { marginTop: 20, fontSize: 18, color: 'white', backgroundColor: '#28a745', paddingVertical: 12, borderRadius: 8, textAlign: 'center' },
  link: { marginTop: 10, color: '#007bff', textAlign: 'center' },
  error: { color: 'red', marginTop: 4, textAlign: 'center' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
});

export default SignupScreen;