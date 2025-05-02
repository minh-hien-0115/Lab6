import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Ionicons'; // Hoặc dùng iconsax-react-native

const LoginScreen = ({navigation}: any) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ').required('Email bắt buộc'),
    password: Yup.string()
      .min(6, 'Tối thiểu 6 ký tự')
      .required('Mật khẩu bắt buộc'),
  });

  const handleLogin = async (values: {email: string; password: string}) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      await auth().signInWithEmailAndPassword(values.email, values.password);
      navigation.navigate('HomeScreen');
    } catch (error: any) {
      if (error && error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            setErrorMessage('Tài khoản không tồn tại.');
            break;
          case 'auth/wrong-password':
            setErrorMessage('Mật khẩu không đúng.');
            break;
          case 'auth/invalid-email':
            setErrorMessage('Email không hợp lệ.');
            break;
          case 'auth/user-disabled':
            setErrorMessage('Tài khoản đã bị vô hiệu hóa.');
            break;
          case 'auth/too-many-requests':
            setErrorMessage('Quá nhiều yêu cầu, vui lòng thử lại sau.');
            break;
          default:
            setErrorMessage('Đăng nhập thất bại. Vui lòng thử lại.');
            break;
        }
      } else {
        setErrorMessage('Lỗi không xác định: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={loginSchema}
        onSubmit={handleLogin}>
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
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Nhập email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                style={styles.input}
              />
              {values.email.length > 0 && (
                <TouchableOpacity onPress={() => setFieldValue('email', '')}>
                  <Icon name="close-circle" size={20} color="gray" />
                </TouchableOpacity>
              )}
            </View>
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

            {/* Password input */}
            <View style={styles.inputContainer}>
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

            <TouchableOpacity
              onPress={() => handleSubmit()}
              disabled={isLoading}>
              <Text style={styles.button}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#0000ff" />
                ) : (
                  'Đăng nhập'
                )}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('SignupScreen')}>
              <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPasswordScreen')}>
              <Text style={styles.link}>Quên mật khẩu?</Text>
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
  button: {marginTop: 20, fontSize: 18, color: 'blue', textAlign: 'center'},
  link: {marginTop: 10, color: 'gray', textAlign: 'center'},
  error: {color: 'red', marginTop: 4},
  inputContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  input: {
    flex: 1,
    padding: 8,
  },
});

export default LoginScreen;
