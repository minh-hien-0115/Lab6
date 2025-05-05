import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Ionicons';

const SignupScreen = ({navigation}: any) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (values: {email: string; password: string}) => {
    try {
      await auth().createUserWithEmailAndPassword(
        values.email,
        values.password,
      );
      navigation.navigate('LoginScreen');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Email đã được sử dụng. Vui lòng chọn email khác.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('Email không hợp lệ.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('Mật khẩu quá yếu (tối thiểu 6 ký tự).');
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  const signupSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ').required('Email bắt buộc'),
    password: Yup.string()
      .min(6, 'Tối thiểu 6 ký tự')
      .required('Mật khẩu bắt buộc'),
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>
      <Formik
        initialValues={{email: '', password: ''}}
        onSubmit={handleSignup}
        validationSchema={signupSchema}>
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
                <Icon
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="gray"
                />
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

            {errorMessage !== '' && (
              <Text style={styles.error}>{errorMessage}</Text>
            )}

            <TouchableOpacity onPress={() => handleSubmit()}>
              <Text style={styles.button}>Đăng ký</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, justifyContent: 'center'},
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
  button: {marginTop: 20, fontSize: 18, color: 'blue'},
  link: {marginTop: 10, color: 'gray'},
  error: {color: 'red', marginTop: 4},
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
  },
});

export default SignupScreen;